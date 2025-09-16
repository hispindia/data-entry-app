import { dataSet } from "../../api/dataSet.js";
import { createEvent, getProgramStageEvents, getTEI, pushDataElement, pushDataElementOther } from "../../api/func.js";
import { dataSetFunds, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { getYears } from "../func.js";

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

  const allRadios = document.querySelectorAll('input[type="radio"]');
  // Add an onchange event listener to each radio button
  allRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
          pushDataElement(event.target.name, event.target.value);

          if(radio.name=="bknBZSSErqr") $('#review-type-second').text(event.target.value);
        if(event.target.name=="RI5UuEEpxun" && event.target.value== "Approved with full allocation") closeDiv();
        if(event.target.name=="RI5UuEEpxun" && event.target.value== "Send Back to MA for Revisions") openDiv();
        }
    });
  }); 

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
    if(user.hideReporting.includes('aoc') || user.hideReporting.includes('trt')) {
      $(`.aoc-users`).show();
    } else $(`.aoc-users`).hide();
    
    if(user.hideReporting.includes('core')) {
      $('.core-users').show();
    }
    
    if(user.hideReporting.includes('ma')) {
      $('.ma-users').show();
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

    const dataSet = await fetchDataSet(tei.year.value);
    if(dataSet.values['QQngZ31YwUi']) $(`#proposed-year`).text(dataSet.values['QQngZ31YwUi']);
    if(dataSet.values['zb45IJuA9HQ']) $(`#grant-year`).text(dataSet.values['zb45IJuA9HQ']);

    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program
        );

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

      populateProgramEvents(tei.dataValues[tei.year.value], (dataValuesB[[tei.year.value]] ? dataValuesB[tei.year.value]: ''));
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
      pushDataElement('RI5UuEEpxun', 'Send Back to MA for Revisions')
      dataValuesA['RI5UuEEpxun'] = 'Send Back to MA for Revisions';
    } else {
      pushDataElement('RI5UuEEpxun', 'Approved with full allocation')
      dataValuesA['RI5UuEEpxun'] = 'Approved with full allocation';
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

    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if (dataValuesA[radio.name.split('-')[0]] && radio.value === dataValuesA[radio.name.split('-')[0]]) {
        radio.checked = true;  // Set it as checked
        if(radio.name=="bknBZSSErqr") $('#review-type-second').text(radio.value);
        if(radio.name=="RI5UuEEpxun") {
          $('#review-type-first').text(radio.value);
          if(radio.value== "Approved with full allocation") closeDiv();
          if(radio.value== "Send Back to MA for Revisions") openDiv();
        }
      }
    })

    document.querySelectorAll('.textOption').forEach((textVal, index) => {
      if (dataValuesB[textVal.id]) {
        textVal.value = dataValuesB[textVal.id];
      }
      else {
        textVal.value = '';
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

async function updateValue(value,index) {
  const dataElement = 'zb45IJuA9HQ'
  const co = "HllvX50cXC0"
  const orgUnit = tei.orgUnit;
  const proposedGrant = $(`#proposed-year-${index}`).text();
  var grantCut = 0;
  var finalGrant = 0;
  if(proposedGrant) {
    grantCut = (proposedGrant && value && (proposedGrant/value)) ? (proposedGrant/value) : 0;
    finalGrant = proposedGrant - grantCut;
  }
  $(`#grant-year`).text(displayValue(finalGrant));
  var grantTotal = 0;
  var indexCount = 0
  for(let year = tei.year.start; year<=tei.year.end; year++) {
    grantTotal += Number($(`#grant-year-${++indexCount}`).text());
    if(indexCount==index) {
      selectedYear= year;
    }
  }
  $(`#grant-total`).text(grantTotal)
// await dataSet.post({dataSetId:dataSetFunds, co, orgUnit, period: selectedYear, dataElement, value:displayValue(finalGrant)})
  
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
 