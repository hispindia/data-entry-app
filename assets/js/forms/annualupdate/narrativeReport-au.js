import { createEvent, getEvents, getProgramStageEvents, getTEI } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { disableAll, getYears } from "../func.js";

const maxWords = {
  counter1: 500,
  counter2: 800,
  counter3: 500,
  counter4: 250,
  counter5: 250,
  counter6: 200,
  counter7: 200,
  counter8: 200,
  counter9: 200,
  counter10: 200,
  counter11: 200,
  counter12: 200,
  counter13: 200,
  counter14: 200,
  counter15: 200,
  counter16: 250,
  counter17: 250,
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

  document
  .getElementById("year-update")
  .addEventListener("change", function (ev) {
    window.localStorage.setItem("annualYear", ev.target.value);
    // fetchEvents(ev.target.value);
  });

 async function configurePage() {
    const user = await getUserConfig();
    tei.disabled = user.disabled;

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
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}">${year}</option>`).join('');
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

      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  tei.year.id);
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;

      tei.dataValues  =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,tei.year.id) //data vlaues year wise
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

    document.querySelectorAll('.textValue').forEach((textVal,index) => {
      if(dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
        $(`#counter${index+1}`).text(`${(maxWords[`counter${index+1}`]- (textVal.value ? textVal.value.trim().split(/\s+/).length: 0))} words remaining`)
      }
      else {
        textVal.value = '';
        $(`#counter${index+1}`).text(`${maxWords[`counter${index+1}`]} words remaining`)
      }
    })
  }

  configurePage();
});


    //Panel toggle
    function changePanel(id) {
      $(`#${id}`).collapse('toggle');
    }

  function submitProjects() {
      alert("Data Saved Successfully!")
  }

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
        counter.innerHTML = `${maxCount - words.length} <span class="hidden" data-i18n="intro.words_remaining">words remaining</span>`;
      } else {
        counter.innerHTML = `${maxCount} <span class="hidden" data-i18n="intro.words_remaining">words remaining</span>`;
      }
    };
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // initialize counter on page load
      });
    });