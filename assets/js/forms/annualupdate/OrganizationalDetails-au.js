const programStageEvent = {
  keyDetails: ''
}

document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to each list item
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default action
      var targetPage = event.currentTarget.getAttribute("data-target");
      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });

//add Event listener to post all file resources
document.querySelectorAll('.show-for-sr').forEach(fileUpload => {
  fileUpload.addEventListener("change", function (ev) {
    const formData = new FormData();
    formData.append('file', ev.target.files[0]);
  fetch('../../fileResources', {
    method: 'POST',
    body: formData
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      linkFileResourceToEvent(ev.target.id, data.response.fileResource);
  })
  .catch(error => {
      console.error('Error uploading file:', error);
  })
})
});


  document
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchEvents();
    });

  document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents(ev.target.value) 
    });


    async function fetchOrganizationUnitUid() {
      try {
        const response = await fetch(
          `../../me.json?fields=id,username,userGroups[id,name],organisationUnits[id,name,path,code,level,parent[id,name]]`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        var data; 
        const masterOU =  window.localStorage.getItem("masterOU");
        if(masterOU) {
          data = {organisationUnits: [{...JSON.parse(masterOU)}]} ;
          tei.disabled = window.localStorage.getItem("userDisabled");
        }
        if(!data) {
          data = await response.json();

          const userConfig = userGroupConfig(data)
          tei.disabled = userConfig.disabled;
          window.localStorage.setItem('hideReporting', userConfig.disabledValues);
        }
  
        if(window.localStorage.getItem("hideReporting").includes('aoc')) {
          $('.aoc-reporting').hide();
        }
        if(window.localStorage.getItem("hideReporting").includes('trt')) {
          $('.trt-review').hide();
        }
        if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
          $('.aoc-reporting').show();
        }
        if(window.localStorage.getItem("hideReporting").includes('core')) {
          $('.core-users').show();
        }
  
      if (data.organisationUnits && data.organisationUnits.length > 0) {
        tei.orgUnit = data.organisationUnits[0].id;
        document.getElementById("headerOrgId").value = data.organisationUnits[0].parent ? data.organisationUnits[0].parent.name : '';

        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;
        document.getElementById("headerOrgCode").value =
          data.organisationUnits[0].code;

        const fpaIndiaButton = document.querySelector('.fa-building-o').closest('a');
        if (fpaIndiaButton) {
          const fpaIndiaDiv = fpaIndiaButton.querySelector('div');
          if (fpaIndiaDiv) {
            fpaIndiaDiv.textContent = data.organisationUnits[0].name;;
          }
        }
        assignValues();
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  function assignValues() {

    dataElements.period.value = document.getElementById("headerPeriod").value;
    tei.program = program.auOrganisationDetails;
    tei.programStage = programStage.auMembershipDetails;

    tei.year = {
      ...tei.year,
      start: dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    var yearOptions = '';
    var annualYear = window.localStorage.getItem("annualYear");
    for(let year=tei.year.start; year <=tei.year.end; year++) {
      if(tei.hideYears.includes(year)) continue;
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById('year-update').innerHTML = yearOptions;
    document.getElementById('year-update').options[0].selected = true;
    if(annualYear) document.getElementById('year-update').value = annualYear;
  }

  async function fetchEvents() {
    const year = document.getElementById("year-update").value;

    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program|| enroll.program==program.auProjectDescription 
          );
    
          const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  dataElements.year.id);
          if(dataValuesPD[year] && dataValuesPD[year][dataElements.submitAnnualUpdate])  tei.disabled = true;
    
      var attributes = {};
      if (data.trackedEntityInstances.length && data.trackedEntityInstances[0].attributes) {
        data.trackedEntityInstances[0].attributes.forEach(attr => attributes[attr.attribute] = attr.value);
      }

      const dataValuesMD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, tei.program, dataElements.year.id);
      const dataValuesKD = getProgramStageEvents(filteredPrograms, programStage.auKeyDetails, tei.program, dataElements.year.id);
       if (!dataValuesMD[year]) {
          tei.dataValues[year] = {}
          let data = [{
            dataElement: dataElements.period.id,
            value: dataElements.period.value
          }, {
            dataElement: dataElements.year.id,
            value: year
          }];
          tei.event = await createEvent(data);
          data.forEach(element => {
            tei.dataValues[year][element.dataElement] = element.value;
          })
        } else  {
          tei.event = dataValuesMD[year]['event'];
          tei.dataValues[year] = {
            ...tei.dataValues[year],
            ...dataValuesMD[year]
          }
        }


        if (!dataValuesKD[year]) {
          programStageEvent['keyDetails'] = await createEventOther({
            orgUnit: tei.orgUnit,
            program: program.auOrganisationDetails,
            programStage: programStage.auKeyDetails,
            teiId: tei.id,
            dataElements: [{
              dataElement: dataElements.period.id,
              value: dataElements.period.value
            },{
              dataElement: dataElements.year.id,
              value: year
            }]
          })
        }
        else {
          programStageEvent['keyDetails'] = dataValuesKD[year]["event"];
          tei.dataValues[year] = {
            ...tei.dataValues[year],
            ...dataValuesKD[year]
          }
        }
      

      populateProgramEvents(attributes, tei.dataValues[year], dataValuesKD[year] ? dataValuesKD[year]: {});

    } else {
      console.log("No data found for the organisation unit.");
    }
  }
  // Function to populate program events data
  function populateProgramEvents(attributes, dataValues, dataValuesKD) {

    //disable feilds
    if (tei.disabled) {
      $('.textValue').prop('disabled', true);

      // Disable all select 
      $('.select-option').prop('disabled', true);

      // Disable all checkbox elements
      $('input[type="checkbox"]').prop('disabled', true);

      // Disable all radio button elements
      $('input[type="radio"]').prop('disabled', true);

      // Disable all file input elements
      $('input[type="file"]').prop('disabled', true);
      
    }

    document.querySelectorAll('.textValue').forEach((textVal) => {
      if (attributes[textVal.id]) {
        textVal.value = attributes[textVal.id];
      }
      else if (dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
        //for yes no type and based on that enable rows attaached with it.
        if (textVal.id == 'ttOZ4zaMXji') {
          textVal.checked = (textVal.value == "true" ? true : false);
          enableRow(textVal.id, textVal.checked, 'dQgZIHO74q5', false)
        }
        else if (textVal.id == 'UaETNe6k15k') {
          textVal.checked = (textVal.value == "true" ? true : false);
          enableRow(textVal.id, textVal.checked, 'OvbPe9nCJOd', false)
        }
        else if (textVal.id == 'kovn3d3f6S3' || textVal.id == 'CblclJFFlfV' || textVal.id == 'KfenFbGtZsj' || textVal.id == 'zdWqftJFqGA' || textVal.id == 'TKYN8eltlPO') {
          setRadioValue(textVal.id, dataValues[textVal.id])
        }

      } else {
        textVal.value = '';
      }
    })
    document.querySelectorAll('.show-for-sr').forEach((textVal) => {
      if (dataValuesKD[textVal.id]) {
        getFileUpload(textVal.id,dataValuesKD[textVal.id]);
      }
    })
  }
  fetchOrganizationUnitUid();
});

function enableRow(id, checked, idRow, upload) {
  if (checked) {
    if (upload) pushDataElement(id, 'true');
    $(`#${idRow}`).removeAttr('disabled');
  }
  else {
    if (upload) {
      pushDataElement(id, 'false');
      pushDataElement(idRow, '');
    }
    $(`#${idRow}`).attr('disabled', 'disabled');
  }
}

function pushRadioValue(id, event, optionsName) {
  const { name, value } = event.target;
  if (name === optionsName) {
    pushDataElement(id, value)
  }
}

function setRadioValue(id, value) {
  const radio = document.querySelector(`#${id} input[type="radio"][value="${value}"]`);
  if (radio) {
    radio.checked = true;
    const event = new Event('change', { bubbles: true });
    radio.dispatchEvent(event);
  }
}
async function getFileUpload(elementId,deValue) {
  try{
    const fileData = await fetchFileResource(deValue);
   
    if (fileData) {
        fileData['url'] = `../../events/files?eventUid=${programStageEvent['keyDetails']}&dataElementUid=${elementId}`;
        updateFileLabel(elementId, fileData.displayName, fileData.url);
    }
  }
  catch(error) {
    console.log('file upload error')
  }

}

function updateFileLabel(elementId, fileName, fileUrl) {
  const downloadLink = document.getElementById(`${elementId}-download`);
  downloadLink.href = fileUrl;
  downloadLink.textContent = fileName;
  downloadLink.setAttribute('download', fileName); 
  document.getElementById(`${elementId}-download`).style.display = 'block';
}

async function fetchFileResource(resourceId) {
  const apiUrl = `../../fileResources/${resourceId}`;
  try {
      const response = await fetch(apiUrl, {
          method: 'GET',
      });

      if (!response.ok) {
          alert("error")
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }

}


async function linkFileResourceToEvent(id, fileResource) {
  await pushDataElementOther(id,fileResource.id,program.organisationDetails, programStage.keyDetails, programStageEvent['keyDetails']);
  fileResource['url'] = `../../events/files?eventUid=${programStageEvent['keyDetails']}&dataElementUid=${id}`;
  updateFileLabel(id, fileResource.displayName, fileResource.url);
}