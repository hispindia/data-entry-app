const maxWords = 200;
var sendBackToMA = false;
var eventSummaryAId = '';
var eventSummaryBId = '';

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

    tei.program = program.roTRTFeedback;
    tei.programStage = programStage.trtFeedback;

    fetchEvents();    
  }

  async function fetchEvents() {

    tei.year.value = document.getElementById('year-update').value;
    
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program
        );

      dataValuesSummaryA = getProgramStageEvents(filteredPrograms, programStage.trtSummaryA, tei.program,{id: tei.year.id, value: tei.year.value}) //data vlaues year wise
      if(dataValuesSummaryA[dataElements.period.value]) {
        eventSummaryAId = dataValuesSummaryA[dataElements.period.value]['event'];
        if(dataValuesSummaryA[dataElements.period.value]['RI5UuEEpxun'] && dataValuesSummaryA[dataElements.period.value]['RI5UuEEpxun']=="Send Back to MA for Revisions") sendBackToMA = true
      } 
      dataValuesSummaryB = getProgramStageEvents(filteredPrograms, programStage.trtSummaryB, tei.program,{id: tei.year.id, value: tei.year.value}) //data vlaues year wise
      if(dataValuesSummaryB[dataElements.period.value]) {
        eventSummaryBId = dataValuesSummaryB[dataElements.period.value]['event'];
      }

      dataValuesMA = getProgramStageEvents(filteredPrograms, programStage.roTRTFeedback, tei.program,{id: tei.year.id, value: tei.year.value}) //data vlaues year wise
      tei.dataValues = getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,{id: tei.year.id, value: tei.year.value}) //data vlaues year wise
      if (!tei.dataValues[dataElements.period.value]) {
        tei.dataValues[dataElements.period.value] = {}
        let data = [{
          dataElement: tei.year.id,
          value: tei.year.value
        }];
        tei.event = await createEvent(data);
        data.forEach(element => {
          tei.dataValues[dataElements.period.value][element.dataElement] = element.value;
        })
      }
      else {
        tei.event = tei.dataValues[dataElements.period.value]['event'];
      }

      if(!eventSummaryAId) {
        let data = [{
          dataElement: tei.year.id,
          value: dataElements.period.value
        }];
        eventSummaryAId = await createEventOther({
          orgUnit: tei.orgUnit,
          program: tei.program,
          programStage: programStage.trtSummaryA,
          teiId: tei.id,
          dataElements: data
        })
      }

      if(!eventSummaryBId) {
        let data = [{
          dataElement: tei.year.id,
          value: dataElements.period.value
        }];
        eventSummaryBId = await createEventOther({
          orgUnit: tei.orgUnit,
          program: tei.program,
          programStage: programStage.trtSummaryB,
          teiId: tei.id,
          dataElements: data
        })
      }

      populateProgramEvents(tei.dataValues[dataElements.period.value], (dataValuesMA[dataElements.period.value] ? dataValuesMA[dataElements.period.value]: {}));
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValuesRO, dataValuesMA) {
    const dataValues = {
      ...dataValuesRO,
      ...dataValuesMA
    }
    //disable feilds
    if (tei.disabled) {
      $('.textValue').prop('disabled', true);
    }

    document.querySelectorAll('.textValue').forEach((textVal, index) => {
      if (dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
        $(`#counter${index + 1}`).text(`${(maxWords - (textVal.value ? textVal.value.trim().split(/\s+/).length : 0))}`)
      }
      else {
        textVal.value = '';
        $(`#counter${index + 1}`).text(`${maxWords}`)
      }
    })
    document.querySelectorAll('.textOption').forEach((textVal, index) => {
      if (dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
      }
      else {
        textVal.value = '';
      }
    })
    calculateCriteria();
  }

});
function submitNarrative() {
  alert("Event Saved SuccessFully")
}

async function calculateCriteria(){
  var countSatisfactory = 0;
  var countSomeGaps = 0;
  var countSignificantGaps= 0;
  var countNotApplicable = 0;

  document.querySelectorAll('.textOption').forEach((textVal, index) => {
      if(textVal.value == "Satisfactory" ) countSatisfactory++;
      if(textVal.value == "Some Gaps" ) countSomeGaps++;
      if(textVal.value == "Significant Gaps" ) countSignificantGaps++;
      if(textVal.value == "Not Applicable" ) countNotApplicable++;    
  })

  if($('.satisfactory').val()!=countSatisfactory) {
    $('.satisfactory').val(countSatisfactory);
    pushDataElement($('.satisfactory').attr('id') , countSatisfactory);
    if(sendBackToMA) await pushDataElementOther($('.satisfactory').attr('id'),countSatisfactory, tei.program, programStage.trtSummaryB, eventSummaryBId);
    else await pushDataElementOther($('.satisfactory').attr('id'),countSatisfactory, tei.program, programStage.trtSummaryA, eventSummaryAId);
  }
  if($('.some-gaps').val()!=countSomeGaps) {
    $('.some-gaps').val(countSomeGaps);
    pushDataElement($('.some-gaps').attr('id') , countSomeGaps)
    if(sendBackToMA) await pushDataElementOther($('.some-gaps').attr('id'),countSomeGaps, tei.program, programStage.trtSummaryB, eventSummaryBId);
    else await pushDataElementOther($('.some-gaps').attr('id'),countSomeGaps, tei.program, programStage.trtSummaryA, eventSummaryAId);
  }
  if($('.significant-gaps').val()!=countSignificantGaps) {
    $('.significant-gaps').val(countSignificantGaps);
    pushDataElement($('.significant-gaps').attr('id') , countSignificantGaps)
    if(sendBackToMA) await pushDataElementOther($('.significant-gaps').attr('id'),countSignificantGaps, tei.program, programStage.trtSummaryB, eventSummaryBId);
    else await pushDataElementOther($('.significant-gaps').attr('id'),countSignificantGaps, tei.program, programStage.trtSummaryA, eventSummaryAId);
  }
  if($('.not-applicable').val()!=countNotApplicable) {
    $('.not-applicable').val(countNotApplicable);
    pushDataElement($('.not-applicable').attr('id') , countNotApplicable)
    if(sendBackToMA) await pushDataElementOther($('.not-applicable').attr('id'),countNotApplicable, tei.program, programStage.trtSummaryB, eventSummaryBId);
    else await pushDataElementOther($('.not-applicable').attr('id'),countNotApplicable, tei.program, programStage.trtSummaryA, eventSummaryAId);
  }
}
