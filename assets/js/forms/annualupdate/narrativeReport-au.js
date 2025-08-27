import { createEvent, getEvents, getProgramStageEvents, getTEI, pushDataElement } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { disableAll, enableAll, getYears } from "../func.js";

const maxWords = {
  counter1: 500,
  counter2: 800,
  counter3: 500,
  counter4: 250,
  counter5: 50,
  counter6: 50,
  counter7: 50,
  counter8: 50,
  counter9: 50,
  counter10: 250,
  counter11: 200,
  counter12: 200,
  counter13: 200,
  counter14: 200,
  counter15: 200,
  counter16: 200,
  counter17: 200,
  counter18: 200,
  counter19: 200,
  counter20: 200,
  counter21: 200,
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
    if(user.hideReporting.includes('aoc') || user.hideReporting.includes('trt')) {
      $(`.aoc-users`).show();
    } else $(`.aoc-users`).hide();
    
    if(user.hideReporting.includes('core')) {
      $('.core-users').show();
    }

    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.auOrganisationDetails;
    tei.programStage = programStage.auNarrativePlan;

    fetchEvents();    
  }

  async function fetchEvents() {
    tei.year.value = document.getElementById("year-update").value;

    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program==program.auProjectDescription 
      );

      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, {id:tei.year.id, value: tei.year.value});
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

      tei.dataValues = getProgramStageEvents(filteredPrograms, tei.programStage, tei.program, {id:tei.year.id, value: tei.year.value}) //data vlaues year wise
      if(!tei.dataValues[tei.year.value]) {
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
      populateProgramEvents(tei.dataValues[tei.year.value]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    //disable feilds
    if(tei.disabled)  disableAll();
    else enableAll();

    document.querySelectorAll('.textValue').forEach((textVal,index) => {
      if(dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
        $(`#counter${index+1}`).text(`${(maxWords[`counter${index+1}`]- (textVal.value ? textVal.value.trim().split(/\s+/).length: 0))}`)
      }
      else {
        textVal.value = '';
        $(`#counter${index+1}`).text(`${maxWords[`counter${index+1}`]}`)
      }
    })
  }

  document
  .getElementById("year-update")
  .addEventListener("change", function (ev) {
    window.localStorage.setItem("annualYear", ev.target.value);
    fetchEvents();
  });
  
  document.querySelectorAll('.textValue').forEach((input)=> {
    input.addEventListener("input", (ev) => {
      const { id, value } = ev.target;
      pushDataElement(id,value);
    })
  });
});

    //textarea word limit
    document.addEventListener('DOMContentLoaded', function () {
      const textareas = document.querySelectorAll('.textlimit');
      textareas.forEach((textarea, index) => {
        const counter = document.getElementById(`counter${index+1}`);
        const updateCounter = () => {

        const words = textarea.value.trim().split(/\s+/).filter(Boolean);
        const maxCount = maxWords[`counter${index + 1}`];

        if (words.length >= maxCount) {
          textarea.value = words.slice(0, maxCount).join(' ');
        }


        if (textarea.value) {
          counter.innerHTML = `${maxCount - words.length}`;
        } else {
          counter.innerHTML = `${maxCount}`;
        }
      };
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // initialize counter on page load
      });
    });