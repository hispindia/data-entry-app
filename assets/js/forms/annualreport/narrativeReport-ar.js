import { createEvent, getProgramStagePeriodicity, getTEI, pushDataElement } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { disableAll, getYears } from '../func.js';

const maxWords = 300;

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
    
    if(user.annualReporting) document.getElementById('reporting-periodicity').value = user.annualReporting;

    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}"  ${tei.year.selectReporting==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYearAR) document.getElementById('year-update').value = user.annualYearAR;

    tei.program = program.arOrganisationDetails;
    tei.programStage = programStage.arNarrativePlan;

    fetchEvents();    
  }

  async function fetchEvents() {
    tei.projects = [];
    tei.year.value = document.getElementById("year-update").value;
    tei.periodicity.value = document.getElementById("reporting-periodicity").value;
    
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program  ||  enroll.program == program.arTotalIncome 
      );

      const dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value }); //data vlaues period wise
      if(dataValuesAI && dataValuesAI[dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

      const dataValues = getProgramStagePeriodicity(filteredPrograms, tei.program, tei.programStage, {id:tei.year.id, value: tei.year.value}, {id:tei.periodicity.id, value:tei.periodicity.value}); //data vlaues period wise
      
        if(!dataValues) {
        if(tei.year.value && tei.periodicity.value) {
          let data = [{ 
            dataElement: tei.year.id,
            value: tei.year.value
                      },{
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
    
      populateProgramEvents(tei.dataValues);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValues) {
   //disable feilds
    if(tei.disabled) disableAll();

    document.querySelectorAll('.textValue').forEach((textVal,index) => {
      if(dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
        $(`#counter${index+1}`).text(`${(maxWords- (textVal.value ? textVal.value.trim().split(/\s+/).length: 0))}`)
      }
      else {
        textVal.value = '';
        $(`#counter${index+1}`).text(`${maxWords}`)
      }
    })
  }
  configurePage();
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

  document.querySelectorAll('.textValue').forEach((input)=> {
    input.addEventListener("input", (ev) => {
      const { id, value } = ev.target;
      pushDataElement(id,value);
    })
  });

document.addEventListener('DOMContentLoaded', function () {
  const textareas = document.querySelectorAll('.textlimit');
  textareas.forEach((textarea, index) => {
      const counter = document.getElementById('counter' + (index + 1));
      const updateCounter = () => {

          const words = textarea.value.trim().split(/\s+/)

          if (words.length >= maxWords) {
          textarea.value = words.slice(0, maxWords).join(' ');
          return
          }

          if (textarea.value) {
          counter.textContent = `${(maxWords - words.length)}`;
          } else counter.textContent = `${maxWords}`;
      };
      textarea.addEventListener('input', updateCounter);
      updateCounter(); // initialize counter on page load
  });
});
