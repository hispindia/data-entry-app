import { createEvent, createEventOther, getProgramStagePeriodicity, getTEI } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { disableAll, getYears } from '../func.js';

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
  .getElementById("year-update")
  .addEventListener("change", function (ev) {
    window.localStorage.setItem("annualYearAR", ev.target.value);
    fetchEvents();
  });

  document
  .getElementById("reporting-periodicity")
  .addEventListener("change", function (ev) {
    window.localStorage.setItem("annualReporting", ev.target.value);
    fetchEvents();
  });


  async function configurePage() {
    const user = await getUserConfig();
    tei.disabled = user.disabled;

    if (user.organisationUnits?.length) {
      tei.orgUnit = user.organisationUnits[0].id;
      if (user.organisationUnits[0].parent) {
        document.getElementById("headerOrgId").value = user.organisationUnits[0].parent.name;
      }
      document.getElementById("headerOrgName").value = user.organisationUnits[0].name;
      document.getElementById("headerOrgCode").value = user.organisationUnits[0].code;
    }
    ['aoc-reporting', 'trt-review'].forEach(page => {
      if(user.hideReporting.includes(page.split('-')[0])) $(`.${page}`).hide();
    })
    if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
      $('.aoc-users').show();
    }
    if(window.localStorage.getItem("hideReporting").includes('core')) {
      $('.core-users').show();
    }
    
    
    if(user.annualReporting) document.getElementById('reporting-periodicity').value = user.annualReporting;

    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}">${year}</option>`).join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.arOrganisationDetails;
    tei.programStage = programStage.arMembershipDetails;

    fetchEvents();    
  }

  async function fetchEvents() {
    tei.projects = [];
    tei.year.value = document.getElementById("year-update").value;
    tei.periodicity.value = document.getElementById("reporting-periodicity").value;
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;
      var attributes = {};
      if(data.trackedEntityInstances.length && data.trackedEntityInstances[0].attributes) {
        data.trackedEntityInstances[0].attributes.forEach(attr => attributes[attr.attribute] = attr.value);
      }
      
      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program ||  enroll.program == program.arTotalIncome 
      );

      const dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value }); //data vlaues period wise
      if(dataValuesAI && dataValuesAI[dataElements.submitAnnualUpdate])  tei.disabled = true;

      const dataValues = getProgramStagePeriodicity(filteredPrograms, tei.program, tei.programStage, { id:tei.year.id, value: tei.year.value }, { id:tei.periodicity.id, value:tei.periodicity.value }); //data vlaues period wise
      const dataValuesKD = getProgramStagePeriodicity(filteredPrograms, tei.program, programStage.arKeyDetails,{ id:tei.year.id, value: tei.year.value }, { id:tei.periodicity.id, value:tei.periodicity.value });
      
        if(!dataValues) {
          if(tei.year.value && tei.periodicity.value) {
          let data = [{ 
            dataElement: tei.year.id,
            value: tei.year.value
          }, {
            dataElement: tei.periodicity.id,
            value: tei.periodicity.value
          }];
        tei.event = await createEvent(data);
        }
      }
       else {
        tei.event = dataValues['event'];
        tei.dataValues = dataValues;
      }

      if (!dataValuesKD) {
        if(tei.year.value && tei.periodicity.value) {
        programStageEvent['keyDetails'] = await createEventOther({
          orgUnit: tei.orgUnit,
          program: program.arOrganisationDetails,
          programStage: programStage.arKeyDetails,
          teiId: tei.id,
          dataElements: [{ 
            dataElement: tei.year.id,
            value: tei.year.value
          }, {
            dataElement: tei.periodicity.id,
            value: tei.periodicity.value
          }]
        })
      }
      }
      else {
        programStageEvent['keyDetails'] = dataValuesKD["event"];
        tei.dataValues = {
          ...tei.dataValues,
          ...dataValuesKD
        }
      }
    
      populateProgramEvents(tei.dataValues, attributes, dataValuesKD ? dataValuesKD : {});
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValues, attributes, dataValuesKD) {

    //disable feilds
    if (tei.disabled) disableAll();

    document.querySelectorAll('.textValue').forEach((textVal) => {

      if(attributes[textVal.id]) {
        textVal.value = attributes[textVal.id];
      }
      else if(dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
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

  configurePage();
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
  await pushDataElementOther(id,fileResource.id,program.arOrganisationDetails, programStage.arKeyDetails, programStageEvent['keyDetails']);
  fileResource['url'] = `../../events/files?eventUid=${programStageEvent['keyDetails']}&dataElementUid=${id}`;
  updateFileLabel(id, fileResource.displayName, fileResource.url);
}