import { createEvent, createEventOther, getProgramStageEvents, getTEI } from "../../api/func.js";
import { program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { getYears } from "../func.js";

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
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents();
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
    if(!user.hideReporting.includes('!aoc')) {
      $('.aoc-users').show();
    }
    if(user.hideReporting.includes('core')) {
      $('.core-users').show();
    }
    if(user.hideReporting.includes('aoc')) {
      $('.trt-users').prop('disabled', true);
      $('.textOption').prop('disabled', true);
    }
    if(user.hideReporting.includes('trt')) {
      $('.aoc-users').prop('disabled', true);
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

      const dataValuesSummaryA = getProgramStageEvents(filteredPrograms, programStage.trtSummaryA, tei.program, tei.year.id) //data vlaues year wise
      if(dataValuesSummaryA[tei.year.value]) {
        eventSummaryAId = dataValuesSummaryA[tei.year.value]['event'];
        if(dataValuesSummaryA[tei.year.value]['RI5UuEEpxun'] && dataValuesSummaryA[tei.year.value]['RI5UuEEpxun']=="Send Back to MA for Revisions") sendBackToMA = true
      } 
      
      const dataValuesSummaryB = getProgramStageEvents(filteredPrograms, programStage.trtSummaryB, tei.program, tei.year.id) //data vlaues year wise
      if(dataValuesSummaryB[tei.year.value]) {
        eventSummaryBId = dataValuesSummaryB[tei.year.value]['event'];
      }

      const dataValuesMA = getProgramStageEvents(filteredPrograms, programStage.roTRTFeedback, tei.program, tei.year.id) //data vlaues year wise
      tei.dataValues = getProgramStageEvents(filteredPrograms, tei.programStage, tei.program, tei.year.id) //data vlaues year wise
      if (!tei.dataValues[tei.year.value]) {
        tei.dataValues[tei.year.value] = {}
        let data = [{
          dataElement: tei.year.id,
          value: tei.year.value
        }];
        tei.event = await createEvent(data);
        data.forEach(element => {
          tei.dataValues[tei.year.value][element.dataElement] = element.value;
        })
      }
      else {
        tei.event = tei.dataValues[tei.year.value]['event'];
      }

      if(!eventSummaryAId) {
        let data = [{
          dataElement: tei.year.id,
          value: tei.year.value
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
          value: tei.year.value
        }];
        eventSummaryBId = await createEventOther({
          orgUnit: tei.orgUnit,
          program: tei.program,
          programStage: programStage.trtSummaryB,
          teiId: tei.id,
          dataElements: data
        })
      }
      
      populateProgramEvents(tei.dataValues[tei.year.value], (dataValuesMA[tei.year.value] ? dataValuesMA[tei.year.value]: {}));
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

  document.addEventListener('DOMContentLoaded', function () {
    const textareas = document.querySelectorAll('.textValue');
    textareas.forEach((textarea, index) => {
      const counter = document.getElementById(`counter${index + 1}`);
      const updateCounter = () => {
    
        const words = textarea.value.trim().split(/\s+/)
    
        if (words.length >= maxWords) {
          textarea.value = words.slice(0, maxWords[`#counter${index + 1}`]).join(' ');
          return
        }
    
        if (textarea.value) {
          counter.textContent = `${(maxWords - words.length)}`;
        } else counter.textContent = `${maxWords} `;
      };
      textarea.addEventListener('input', updateCounter);
      updateCounter(); // initialize counter on page load
    });
  });
});
function submitNarrative() {
  alert("Event Saved SuccessFully")
}

async function calculateCriteria(){
  var countAddressed = 0;
  var countAddressedJustified = 0;
  var countNotAddressed= 0;
 
  document.querySelectorAll('.textOption').forEach((textVal, index) => {
     if(textVal.value == "Addressed" ) countAddressed++;
     if(textVal.value == "Not Addressed" ) countNotAddressed++;
     if(textVal.value == "Not Addressed but Justified" ) countAddressedJustified++;
  })

  if($('.addressed').val()!=countAddressed) {
    $('.addressed').val(countAddressed);
    pushDataElement($('.addressed').attr('id') , countAddressed)
    if(sendBackToMA) await pushDataElementOther($('.addressed').attr('id'),countAddressed, tei.program, programStage.trtSummaryB, eventSummaryBId);
    else await pushDataElementOther($('.addressed').attr('id'),countAddressed, tei.program, programStage.trtSummaryA, eventSummaryAId);
  
  }
  if($('.Not-Addressed-But-Justified').val()!=countAddressedJustified) {
    $('.Not-Addressed-But-Justified').val(countAddressedJustified);
    pushDataElement($('.Not-Addressed-But-Justified').attr('id') , countAddressedJustified)
    if(sendBackToMA) await pushDataElementOther($('.Not-Addressed-But-Justified').attr('id'),countAddressedJustified, tei.program, programStage.trtSummaryB, eventSummaryBId);
    else await pushDataElementOther($('.Not-Addressed-But-Justified').attr('id'),countAddressedJustified, tei.program, programStage.trtSummaryA, eventSummaryAId);
  
  }
  if($('.Not-Addressed').val()!=countNotAddressed) {
    $('.Not-Addressed').val(countNotAddressed);
    pushDataElement($('.Not-Addressed').attr('id') , countNotAddressed)  
    if(sendBackToMA) await pushDataElementOther($('.Not-Addressed').attr('id'),countNotAddressed, tei.program, programStage.trtSummaryB, eventSummaryBId);
    else await pushDataElementOther($('.Not-Addressed').attr('id'),countNotAddressed, tei.program, programStage.trtSummaryA, eventSummaryAId);
  
  }

   
}
