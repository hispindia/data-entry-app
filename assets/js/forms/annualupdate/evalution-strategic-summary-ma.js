import { dataSet } from "../../api/dataSet.js";
import { createEvent, getProgramStageEvents, getTEI, pushDataElement, pushDataElementOther } from "../../api/func.js";
import { dataElements, dataSetFunds, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears, unformatNumber } from "../func.js";

const maxWords = 200;
var eventSummaryB = '';
var secondReviewer = false;

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

  const allRadios = document.querySelectorAll('input[type="radio"]');
  // Add an onchange event listener to each radio button
  allRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
        if(radio.name == "AxNvkIEgUGf") {
          pushDataElement(event.target.name, event.target.value);
        }
        if(radio.name=="bknBZSSErqr") {
          pushDataElementFormB(event.target.name, event.target.value)
          $('#review-type-second').text(event.target.value);
          if(event.target.value == "Approved at Lesser Allocation Amount") openFundAllocation();
          else closeFundAllocation();
        }

        if(tei.dataValues[tei.year.value]["RI5UuEEpxun"] == " Send Back to MA for Revisions" && event.target.name == "AxNvkIEgUGf" && event.target.value == "true") {
          $('#submit-button').show();
        } else  $('#submit-button').hide();

        if(tei.dataValues[tei.year.value]["RI5UuEEpxun"] == "Approved with full allocation" && event.target.name == "AxNvkIEgUGf" &&  event.target.value == "true") {
          $('#submit-allocation').show();
        } else  $('#submit-allocation').hide();
        
        if(event.target.name=="RI5UuEEpxun") {
          pushDataElement(event.target.name, event.target.value);
          if(secondReviewer) {
            if(event.target.value == "Approved with full allocation" && tei.dataValues["AxNvkIEgUGf"] == "true") closeDiv();
          } else {
            if(event.target.value== "Approved with full allocation") closeDiv();
            else if(event.target.value== " Send Back to MA for Revisions") openDiv();
          }
        }
        }
    });
  }); 

  document
    .getElementById("submit-button")
    .addEventListener("click", function (ev) {
      pushDataElement(dataElements.submitTRTReport, true);
      openDiv();
      alert('Data Saved Successfully!')
    });

  document
    .getElementById("submit-fund-allocation")
    .addEventListener("click", async function () {
      const allocatedValue = $('input[name="bknBZSSErqr"]:checked').val();
      const grantedValues = $("#grant-year").text().trim();
      const proposedValues = $("#proposed-year").text().trim();
      if(allocatedValue=="Approved at Lesser Allocation Amount" && grantedValues) {
        await dataSet.post({dataSetId:dataSetFunds, co:"HllvX50cXC0", orgUnit:tei.orgUnit, period: tei.year.value, dataElement: dataElements.fullAllocation, value:unformatNumber(grantedValues)});
      } else if(allocatedValue=="Approved with full allocation") {
        await dataSet.post({dataSetId:dataSetFunds, co:"HllvX50cXC0", orgUnit:tei.orgUnit, period: tei.year.value, dataElement: dataElements.fullAllocation, value:unformatNumber(proposedValues)});
      }
      alert('Data Pushed Successfully!')
    });
    
          
    const content = document.getElementById('section-content')
    content.addEventListener('change', (ev) => {
      if(ev.target.matches('.proposed-percent')) {
        const {id, value} = ev.target;
        pushDataElementFormB(id,value)
        updateValue(value);
      }
    })

  document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      $('.loader-container').addClass('d-flex').removeClass('d-none');
      $('.myContainer').hide();
      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents();
    });

  document.querySelectorAll('.textlimit').forEach((input)=> {
    input.addEventListener("input", (ev) => {
      const { id, value } = ev.target;
      if(id.includes('summarya')) {
        pushDataElement(id.split('-')[0],value)
      }
      else if(id.includes('summaryb')) {
        pushDataElementFormB(id.split('-')[0],value)
      }
    })
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
    if(user.hideReporting.includes('aoc')) {
      $('.trt-values').prop('disabled', true);
      $(`.aoc-users`).show();
    } else $(`.aoc-users`).hide();
    
    if(user.hideReporting.includes('trt')) {
      $('.aoc-values').prop('disabled', true);
      $(`.trt-users`).show();
    } else if(!user.hideReporting.includes('trt') && !user.hideReporting.includes('aoc')) $(`.trt-users`).hide();
    
    if(user.hideReporting.includes('core')) {
      $('.core-users').show();
    }
    
    if(user.hideReporting.includes('ma')) {
      $('.ma-users').show();
    }

    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.roTRTFeedback;
    tei.programStage = programStage.trtFeedback;

    fetchEvents();    
  }

  async function fetchDataSet(year) {
    const values = {};
    const dataValueSet = await dataSet.getValues(dataSetFunds, tei.orgUnit, year);
    dataValueSet.dataValues.forEach(dv => values[dv.dataElement] = dv.value);

    return {
      values
    }
  }

  async function fetchEvents() {
    
    tei.program = program.roTRTFeedback;
    tei.programStage = programStage.trtSummaryA;
    tei.year.value = document.getElementById('year-update').value;
    $(`#selected-year`).text(tei.year.value);

    const dataSet = await fetchDataSet(tei.year.value);
    const formulaGenerated = dataSet.values[dataElements.formulaGenerated] ? dataSet.values[dataElements.formulaGenerated] : 0
    if(formulaGenerated) $(`#proposed-year`).text(formatNumberInput(dataSet.values[dataElements.formulaGenerated]));
    if(formulaGenerated<=350000) {
      $('.second-review').hide();
      secondReviewer = false;

    } else {
      secondReviewer = true;
    }
    if(dataSet.values[dataElements.fullAllocation]) $(`#grant-year`).text(formatNumberInput(dataSet.values[dataElements.fullAllocation]));

    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program ||
          enroll.program == program.roTRTFeedback
        );

      const roTRTFeedback = getProgramStageEvents(filteredPrograms, programStage.trtFeedback, program.roTRTFeedback, {id: tei.year.id, value: tei.year.value}) //data vlaues year wise
      tei.dataValues = getProgramStageEvents(filteredPrograms, tei.programStage, tei.program, {id: tei.year.id, value: tei.year.value}) //data vlaues year wise
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
      if(formulaGenerated<=350000) { 
        if(tei.dataValues[tei.year.value]["RI5UuEEpxun"] == "Approved with full allocation") {
          $('#submit-button').show();
        } else  $('#submit-button').hide();
      }
      else {
        if(tei.dataValues[tei.year.value]["RI5UuEEpxun"] == " Send Back to MA for Revisions" && tei.dataValues[tei.year.value]["AxNvkIEgUGf"] == "true") {
          $('#submit-button').show();
        } else  $('#submit-button').hide();
      }

      var dataValuesB = getProgramStageEvents(filteredPrograms, programStage.trtSummaryB, tei.program, {id: tei.year.id, value: tei.year.value}) //data vlaues year wise
      if (!dataValuesB[tei.year.value]) {
        dataValuesB[tei.year.value] = {}
        let data = [{
          dataElement: tei.year.id,
          value: tei.year.value
        }];
        eventSummaryB = await createEvent(data);
        data.forEach(element => {
          dataValuesB[tei.year.value][element.dataElement] = element.value;
        })
      }
      else {
        eventSummaryB = dataValuesB[tei.year.value]['event'];
      }

      populateProgramEvents(tei.dataValues[tei.year.value], (dataValuesB[tei.year.value] ? dataValuesB[tei.year.value]: ''), (roTRTFeedback[tei.year.value] ? roTRTFeedback[tei.year.value]: ''));
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValuesA, dataValuesB, roTRTFeedback) {
    //disable feilds
    if (dataValuesA.disabled) {
      $('.textValue-summaryA').prop('disabled', true);
    }
    if (dataValuesB.disabled) {
      $('.textValue-summaryB').prop('disabled', true);
    }

    var someGapsA = 0;
    var significantGapsA = 0;
    var notAddressedA = 0;
    var someGapsB = 0;
    var significantGapsB = 0;
    var notAddressedB = 0;
    document.querySelectorAll('.text-summaryB').forEach(item => {
      if (dataValuesB[item.id.split('-')[0]]) $(`#${item.id}`).text(dataValuesB[item.id.split('-')[0]]);
    })
    document.querySelectorAll('.textValue-summaryB').forEach((textVal, index) => {
      if (dataValuesB[textVal.id.split('-')[0]]) {
        if(textVal.id.split('-')[0] == "SHyd6eUE2Xj") someGapsB = dataValuesB[textVal.id.split('-')[0]];
        if(textVal.id.split('-')[0] == "Xco5HDgJyHd") significantGapsB = dataValuesB[textVal.id.split('-')[0]];
        if(textVal.id.split('-')[0] == "E1MmmTUtrZh") notAddressedB = dataValuesB[textVal.id.split('-')[0]];
        
        textVal.value = dataValuesB[textVal.id.split('-')[0]];
        $(`#counter${index + 1}`).text(`${(maxWords - (textVal.value ? textVal.value.trim().split(/\s+/).length : 0))}`)
      }
      else {
        textVal.value = '';
        $(`#counter${index + 1}`).text(`${maxWords}`)
      }
    })


    document.querySelectorAll('.text-summaryA').forEach(item => {
      if (dataValuesA[item.id.split('-')[0]]) $(`#${item.id}`).text(dataValuesA[item.id.split('-')[0]]);
    })
    document.querySelectorAll('.textValue-summaryA').forEach((textVal, index) => {
      if (dataValuesA[textVal.id.split('-')[0]]) {
        if(textVal.id.split('-')[0] == "SHyd6eUE2Xj") someGapsA = dataValuesA[textVal.id.split('-')[0]];
        if(textVal.id.split('-')[0] == "Xco5HDgJyHd") significantGapsA = dataValuesA[textVal.id.split('-')[0]];
        if(textVal.id.split('-')[0] == "E1MmmTUtrZh") notAddressedA = dataValuesA[textVal.id.split('-')[0]];
        
        textVal.value = dataValuesA[textVal.id.split('-')[0]];
        $(`#counter${index + 1}`).text(`${(maxWords - (textVal.value ? textVal.value.trim().split(/\s+/).length : 0))} `)
      }
      else {
        textVal.value = '';
        $(`#counter${index + 1}`).text(`${maxWords}`)
      }
    })
    if(roTRTFeedback[dataElements.submitTRTQuality]== "true" && roTRTFeedback[dataElements.submitTRTStrategic]== "true" ) {
      if(significantGapsA>=1 || someGapsA>=4 || notAddressedA>=4 ) {
        if(significantGapsA>=1 || someGapsA>=4)  {
          $('#quality-color-a').addClass('bg-red');
          $('#quality-color-a').removeClass('bg-green');
        }
        else {
          $('#quality-color-a').addClass('bg-green');
          $('#quality-color-a').addClass('bg-red');
        }
        if(notAddressedA>=4) {
          $('#strategic-color-a').addClass('bg-red');
          $('#strategic-color-a').removeClass('bg-green');
        }
        else {
          $('#strategic-color-a').addClass('bg-green');
          $('#strategic-color-a').removeClass('bg-red');
        }
        pushDataElement('RI5UuEEpxun', ' Send Back to MA for Revisions')
        dataValuesA['RI5UuEEpxun'] = ' Send Back to MA for Revisions';
      } else {
        pushDataElement('RI5UuEEpxun', 'Approved with full allocation')
        dataValuesA['RI5UuEEpxun'] = 'Approved with full allocation';
      }
    }
    if(significantGapsB>=1 || someGapsB>=4 || notAddressedB>=4 ) {
      if(significantGapsB>=1 || someGapsB>=4) {
        $('#quality-color-b').addClass('bg-red');
        $('#quality-color-b').removeClass('bg-green');
      }
      else {
        $('#quality-color-b').addClass('bg-green');
        $('#quality-color-b').addClass('bg-red');
      }
      if(notAddressedB>=4) {
        $('#strategic-color-b').addClass('bg-red');
        $('#strategic-color-b').removeClass('bg-green');
      }
      else {
        $('#strategic-color-b').addClass('bg-green');
        $('#strategic-color-b').removeClass('bg-red');
      }
    } 

    if(!dataValuesA["RI5UuEEpxun"]) closeDiv();
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if ((dataValuesA[radio.name.split('-')[0]] && radio.value === dataValuesA[radio.name.split('-')[0]]) || (dataValuesB[radio.name.split('-')[0]] && radio.value === dataValuesB[radio.name.split('-')[0]])) {
        radio.checked = true;  // Set it as checked
        if(radio.name=="bknBZSSErqr") {
          closeFundAllocation();
          $('#review-type-second').text(radio.value);
          if(radio.value == "Approved at Lesser Allocation Amount") openFundAllocation();
        }
        if(radio.name=="RI5UuEEpxun") {
          $('#review-type-first').text(radio.value);
          if(secondReviewer) {
            closeDiv();
            if(radio.value == " Send Back to MA for Revisions" && dataValuesA["AxNvkIEgUGf"] == "true" && dataValuesA[dataElements.submitTRTReport] == "true") openDiv();
            else if(radio.value == "Approved with full allocation" && dataValuesA["AxNvkIEgUGf"] == "true") $('#submit-allocation').show();

          } else {
            if(radio.value== " Send Back to MA for Revisions") openDiv();
            else closeDiv();
          }
        }
      }
    })

    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();

  }

  function closeDiv() {
    $('.trt-phase-2').addClass('d-none');
  }
  function openDiv() {
    $('.trt-phase-2').removeClass('d-none');
  }

  function closeFundAllocation() {
    $('.fund-reallocate').addClass('d-none');
  }
  function openFundAllocation() {
    $('.fund-reallocate').removeClass('d-none');
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

async function updateValue(value) {
  const proposedGrant = unformatNumber($(`#proposed-year`).text());
  var grantCut = 0;
  var finalGrant = 0;
  if(proposedGrant) {
    grantCut = (proposedGrant && value && (proposedGrant/value)) ? (proposedGrant/value) : 0;
    finalGrant = proposedGrant - grantCut;
  }
  $(`#grant-year`).text(formatNumberInput(finalGrant));
  
}

function pushDataElementFormB(id, value) {
 pushDataElementOther(id,value, tei.program, programStage.trtSummaryB, eventSummaryB);
}

function displayValue(input) {
  if (input === null || input === undefined || input === '') {
    return "";
  }
  
  let num = typeof input === "string" ? parseFloat(input) : input;
 
  if (isNaN(num)) {
      return "";
  }
 
  if (num % 1 === 0) {
     return num.toString();
  } else {
     return num.toFixed(2);
  }
 }
 