import { createEvent, createEventOther, getEvents, getProgramStageEvents, getTEI, pushDataElement, pushDataElementOther } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { disableAll, enableAll, formatNumberInput, getYears } from "../func.js";

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

  configurePage();

  async function configurePage() {
    const user = await getUserConfig();
    tei.userDisabled = user.disabled;

    if (user.organisationUnits?.length) {
      tei.orgUnit = user.organisationUnits[0].id;
      if (user.organisationUnits[0].parent) {
        document.getElementById("headerOrgId").value = user.organisationUnits[0].parent.name;
      }
      document.getElementById("facility").innerHTML = user.organisationUnits[0].name;
      document.getElementById("headerOrgName").value = user.organisationUnits[0].name;
      document.getElementById("headerOrgCode").value = user.organisationUnits[0].code;
    }
    ['aoc-reporting', 'trt-review'].forEach(page => {
      if(user.hideReporting.includes(page.split('-')[0])) $(`.${page}`).hide();
    })
    if(!user.hideReporting.includes('aoc')) {
      $('.aoc-users').show();
    }
    if(user.hideReporting.includes('core')) {
      $('.core-users').show();
    }

    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.auOrganisationDetails;
    tei.programStage = programStage.auMembershipDetails;

    fetchEvents();    
  }
  
  async function fetchEvents() {
    tei.year.value = document.getElementById("year-update").value;

    const data = await getTEI(tei.orgUnit);
    
    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program || enroll.program == program.auProjectDescription 
        );
    
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  {id: tei.year.id, value: tei.year.value});
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;
    
      var attributes = {};
      if (data.trackedEntityInstances.length && data.trackedEntityInstances[0].attributes) {
        data.trackedEntityInstances[0].attributes.forEach(attr => attributes[attr.attribute] = attr.value);
      }

      const dataValuesMD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, tei.program, {id:tei.year.id,value:tei.year.value});
      const dataValuesKD = getProgramStageEvents(filteredPrograms, programStage.auKeyDetails, tei.program, {id:tei.year.id,value:tei.year.value});
       if (!dataValuesMD[tei.year.value]) {
          tei.dataValues[tei.year.value] = {}
          let data = [{
            dataElement: tei.year.id,
            value: tei.year.value
          }];
          tei.event = await createEvent(data);
          data.forEach(element => {
            tei.dataValues[tei.year.value][element.dataElement] = element.value;
          })
        } else  {
          tei.event = dataValuesMD[tei.year.value]['event'];
          tei.dataValues[tei.year.value] = {
            ...tei.dataValues[tei.year.value],
            ...dataValuesMD[tei.year.value]
          }
        }
        
        if (!dataValuesKD[tei.year.value]) {
          programStageEvent['keyDetails'] = await createEventOther({
            orgUnit: tei.orgUnit,
            program: program.auOrganisationDetails,
            programStage: programStage.auKeyDetails,
            teiId: tei.id,
            dataElements: [{
              dataElement: tei.year.id,
              value: tei.year.value
            }]
          })
        }
        else {
          programStageEvent['keyDetails'] = dataValuesKD[tei.year.value]["event"];
          tei.dataValues[tei.year.value] = {
            ...tei.dataValues[tei.year.value],
            ...dataValuesKD[tei.year.value]
          }
        }
      

      populateProgramEvents(attributes, tei.dataValues[tei.year.value], dataValuesKD[tei.year.value] ? dataValuesKD[tei.year.value]: {});

    } else {
      console.log("No data found for the organisation unit.");
    }
  }
  // Function to populate program events data
  function populateProgramEvents(attributes, dataValues, dataValuesKD) {

    //disable feilds
    if (tei.disabled) disableAll();
    else enableAll();

    document.querySelectorAll('.textValue').forEach((textVal) => {
      if (attributes[textVal.id]) {
        textVal.value = attributes[textVal.id];
      }
      else if (dataValues[textVal.id]) {
        if(textVal.type=="checkbox") textVal.checked = true;
        else textVal.value = dataValues[textVal.id];   
      } else {
        textVal.value = '';
      }
    })

    const radioGroup = [...document.querySelectorAll('.radioValue')]
                      .map(div => div.querySelector('input[type="radio"]')?.name)
                      .filter(Boolean);

    radioGroup.forEach(name => {
      const radio = document.querySelector(`input[type="radio"][name="${name}"][value="${dataValues[name]}"]`);
      if(radio) {
        if (name == 'ttOZ4zaMXji') {
            radio.checked = true;
            if (radio.value=="true")  $('#dQgZIHO74q5').removeAttr('disabled');
            else $('#dQgZIHO74q5').attr('disabled', 'disabled');
          }
        else if (name == 'UaETNe6k15k') {
            radio.checked = true;
            if (radio.value=="true")  $('#OvbPe9nCJOd').removeAttr('disabled');
            else $('#OvbPe9nCJOd').attr('disabled', 'disabled');
        }
        else if (name == 'kovn3d3f6S3' || name == 'CblclJFFlfV' || name == 'KfenFbGtZsj' || name == 'zdWqftJFqGA' || name == 'TKYN8eltlPO') {
            radio.checked = true;
        }
      }
    })

    document.querySelectorAll('.show-for-sr').forEach((textVal) => {
      if (dataValuesKD[textVal.id]) {
        getFileUpload(textVal.id,dataValuesKD[textVal.id]);
      }
    })
  }

  document.querySelectorAll('.textValue').forEach((input)=> {
    input.addEventListener("input", (ev) => {
      const { id,value, type, checked } = ev.target;
      if(type=="checkbox") {
        if(checked) pushDataElement(id, true);
        else pushDataElement(id, '');
      } else pushDataElement(id,value);
    })
  });

  document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents();
    });

  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const { name, value } = e.target;
      pushDataElement(name, value)
      if (name == 'ttOZ4zaMXji') {
        if (value=="true")  $('#dQgZIHO74q5').removeAttr('disabled');
        else $('#dQgZIHO74q5').attr('disabled', 'disabled');
      }
      else if (name == 'UaETNe6k15k') {
        if (value=="true")  $('#OvbPe9nCJOd').removeAttr('disabled');
        else $('#OvbPe9nCJOd').attr('disabled', 'disabled');
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

});

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
  await pushDataElementOther(id,fileResource.id,program.auOrganisationDetails, programStage.auKeyDetails, programStageEvent['keyDetails']);
  fileResource['url'] = `../../events/files?eventUid=${programStageEvent['keyDetails']}&dataElementUid=${id}`;
  updateFileLabel(id, fileResource.displayName, fileResource.url);
}
