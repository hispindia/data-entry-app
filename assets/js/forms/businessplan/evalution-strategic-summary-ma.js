const maxWords = 200;
var eventSummaryB = '';

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

  document
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchOrganizationUnitUid()
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
      const masterOU = window.localStorage.getItem("masterOU");
      if (masterOU) {
        data = { organisationUnits: [{ ...JSON.parse(masterOU) }] };
        tei.disabled = window.localStorage.getItem("userDisabled");
      }
      if (!data) {
        data = await response.json();

        const userConfig = userGroupConfig(data)
        tei.disabled = userConfig.disabled;
        window.localStorage.setItem('hideReporting', userConfig.disabledValues);
      }

      if (window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-reporting').hide();
      }
      if (window.localStorage.getItem("hideReporting").includes('trt')) {
        $('.trt-review').hide();
      }
      if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-users').show();
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

        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }
  async function fetchDataSet(selectedYear) {

    const values = {};
    for(let year = selectedYear.start; year<=selectedYear.end; year++) {
      values[year] = {}
      const dataValueSet = await dataSet.getValues(dataSetFunds, tei.orgUnit,year);
      dataValueSet.dataValues.forEach(dv => values[year][dv.dataElement] = dv.value);
    }
    return {
      values
    }
  }

  async function fetchEvents() {
    
    tei.program = program.roTRTFeedback;
    tei.programStage = programStage.trtSummaryA;
    dataElements.period.value = document.getElementById("headerPeriod").value;

    tei.year = {
      ...tei.year,
      start: dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }

    const dataSet = await fetchDataSet(tei.year);
    var yearIndex = 0;
    for(let year = tei.year.start; year <=tei.year.end;year++) {
      yearIndex++;
      if(dataSet.values[year]['QQngZ31YwUi'])$(`#proposed-year${yearIndex}`).val(dataSet.values[year]['QQngZ31YwUi'])
    }
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program
        );

      tei.dataValues = getProgramStageEvents(filteredPrograms, tei.programStage, tei.program, dataElements.period.id) //data vlaues year wise
      if (!tei.dataValues[dataElements.period.value]) {
        tei.dataValues[dataElements.period.value] = {}
        let data = [{
          dataElement: dataElements.period.id,
          value: dataElements.period.value
        }];
        tei.event = await createEvent(data);
        data.forEach(element => {
          tei.dataValues[dataElements.period.value][element.dataElement] = element.value;
        })
      }
      else {
        tei.event = tei.dataValues[dataElements.period.value]['event'];
      }

      var dataValuesB = getProgramStageEvents(filteredPrograms, programStage.trtSummaryB, tei.program, dataElements.period.id) //data vlaues year wise
      if (!dataValuesB[dataElements.period.value]) {
        dataValuesB[dataElements.period.value] = {}
        let data = [{
          dataElement: dataElements.period.id,
          value: dataElements.period.value
        }];
        eventSummaryB = await createEvent(data);
        data.forEach(element => {
          dataValuesB[dataElements.period.value][element.dataElement] = element.value;
        })
      }
      else {
        eventSummaryB = dataValuesB[dataElements.period.value]['event'];
      }

      populateProgramEvents(tei.dataValues[dataElements.period.value], (dataValuesB[[dataElements.period.value]]? dataValuesB[dataElements.period.value]: ''));
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValuesA, dataValuesB) {
    //disable feilds
    if (dataValuesA.disabled) {
      $('.textValue-summaryA').prop('disabled', true);
    }
    if (dataValuesB.disabled) {
      $('.textValue-summaryB').prop('disabled', true);
    }

    document.querySelectorAll('.textValue-summaryB').forEach((textVal, index) => {
      if (dataValuesB[textVal.id.split('-')[0]]) {
        textVal.value = dataValuesB[textVal.id.split('-')[0]];
        $(`#counter${index + 1}`).text(`${(maxWords - (textVal.value ? textVal.value.trim().split(/\s+/).length : 0))} words remaining`)
      }
      else {
        textVal.value = '';
        $(`#counter${index + 1}`).text(`${maxWords} words remaining`)
      }
    })

    document.querySelectorAll('.textValue-summaryA').forEach((textVal, index) => {
      if (dataValuesA[textVal.id.split('-')[0]]) {
        textVal.value = dataValuesA[textVal.id.split('-')[0]];
        $(`#counter${index + 1}`).text(`${(maxWords - (textVal.value ? textVal.value.trim().split(/\s+/).length : 0))} words remaining`)
      }
      else {
        textVal.value = '';
        $(`#counter${index + 1}`).text(`${maxWords} words remaining`)
      }
    })
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if (dataValuesA[radio.name.split('-')[0]] && radio.value === dataValuesA[radio.name.split('-')[0]]) {
        radio.checked = true;  // Set it as checked
      }
    })
    document.querySelectorAll('.textOption').forEach((textVal, index) => {
      if (dataValuesA[textVal.id.split('-')[0]]) {
        textVal.value = dataValuesA[textVal.id.split('-')[0]];
      }
      else {
        textVal.value = '';
      }
    })
   
  }


  fetchOrganizationUnitUid();
});
document.addEventListener('DOMContentLoaded', function () {
  const allRadios = document.querySelectorAll('input[type="radio"]');
  // Add an onchange event listener to each radio button
  allRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
          pushDataElement(event.target.name, event.target.value);
        }
    });
  }); 
  
});
function submitNarrative() {
  alert("Event Saved SuccessFully")
}

function pushDataElementFormB(id, value) {
 pushDataElementOther(id,value, tei.program, programStage.trtSummaryB, eventSummaryB);
}