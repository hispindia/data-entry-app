import { createEvent, getProgramStagePeriodicity, getTEI, pushDataElement } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { disableAll, getYears } from '../func.js';

const maxWords = 200;
var riskCount = 0;

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
        
      if(user.annualReporting) document.getElementById('reporting-periodicity').value = user.annualReporting;
  
      const years = getYears(tei.year.start, tei.year.end);
      document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}"  ${tei.year.selectReporting==year? 'selected': ''}>${year}</option>`).join('');
      if(user.annualYearAR) document.getElementById('year-update').value = user.annualYearAR;
  
    tei.program = program.reportFeedback;
    tei.programStage = programStage.arROFeedback;
  
      fetchEvents();    
    }

  async function fetchEvents() {
    tei.projects = [];
    riskCount = 0;
    
    tei.year.value = document.getElementById("year-update").value;
    tei.periodicity.value = document.getElementById("reporting-periodicity").value;
    
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;
    
      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program 
      );

      const dataValues = getProgramStagePeriodicity(filteredPrograms, tei.program, tei.programStage, {id:tei.year.id, value: tei.year.value}, {id:tei.periodicity.id, value:tei.periodicity.value}); //data vlaues period wise
      
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
    
      populateProgramEvents(tei.dataValues);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    if(tei.periodicity.value=="Semi-Annual Reporting") $('.annual-reporting-display').hide();

    //disable feilds
    if (tei.disabled) disableAll();

    document.querySelectorAll('.textValue').forEach((textVal) => {
    if(dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
      } else {
        textVal.value = '';
      }
    })
    var projectRows = '';
    dataElements.seriousRisk.forEach(risk => {
      if(dataValues[risk.name]) {
       projectRows += addRowSeriousRisk(risk, dataValues);
      }
    })
    if(!projectRows) projectRows += addRowSeriousRisk(dataElements.seriousRisk[0], {});
    $(".btn-wrap").prevAll().remove();
    $(projectRows).insertBefore(".btn-wrap");

    const content = document.getElementById('risk-comment');
    content.addEventListener('input', (ev) => {
      if (ev.target.matches('.textContent')) {
        const { id, value } = ev.target;
        pushDataElement(id,value);
        selectedRatings();
      } else if (ev.target.matches('.textlimit')) {
        const { id, value, dataset } = ev.target;
        pushDataElement(id,value);
        selectedRatings();
        checkWords(ev.target, dataset.count);
      }
      });

    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if (dataValues[radio.name] && radio.value === dataValues[radio.name]) {
        radio.checked = true;  // Set it as checked
      }
    })
    selectedRatings()
    if(tei.periodicity.value == "Semi-Annual Reporting") {
     $("input[name='HOuFie6msc6']").prop("disabled", true);
     $("input[name='vacCAltV8Pp']").prop("disabled", true);
     $('#KGx5UkIS59t').val("Not relevant for HYR");
     $('#RIltL5QmDEP').val("Not relevant for HYR");

     $('#KGx5UkIS59t').attr('disabled',  true );
     $('#RIltL5QmDEP').attr('disabled', true);
    } else  {
      $("input[name='HOuFie6msc6']").prop("disabled", false);
      $("input[name='vacCAltV8Pp']").prop("disabled", false);
     $('#KGx5UkIS59t').attr('disabled',  false);
     $('#RIltL5QmDEP').attr('disabled', false);
    }
  }
  configurePage();
});



    //textarea word limit
    document.addEventListener('DOMContentLoaded', function () {
      const allRadios = document.querySelectorAll('input[type="radio"]');
      // Add an onchange event listener to each radio button
      allRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.checked) {
              pushDataElement(event.target.name, event.target.value);
              selectedRatings();
            }
        });
      }); 
      
    });
    
    function selectedRatings() {
      const generalRatings = {
        yesCount: 0,
        noCount: 0
      };
      const criticalRatings = {
        yesCount: 0,
        noCount: 0
      };
      var seriousRisk =false;
      const generalRequirements = ['Tok83eP5gqa', 'bddU8SI1wLz', 'ua6hoN645RR', 'P7a9Jl3z8Xa', 'NaiRFWqjv9q', 'c4TpY3CTEQv'];
      
      var criticalRequirements = [];
      
      if(tei.periodicity.value == "Semi-Annual Reporting") {
        criticalRequirements = ['aXjINT5ttfR'];
      } else criticalRequirements = ['HOuFie6msc6', 'vacCAltV8Pp', 'aXjINT5ttfR'];
      

      document.querySelectorAll('.serious-risk').forEach((risk) => {
        if(risk.value && risk.value.trim()) seriousRisk = true;
      })
      if(seriousRisk) {
        $('#rating-target').addClass('bg-red')
        $('#rating-target').removeClass('bg-green')
        return;
      }

      generalRequirements.forEach(requirement => {
        $(`input[name="${requirement}"]:checked`).each(function() {
          if($(this).val()=="true") generalRatings['yesCount']++;
          else if($(this).val()=="false") generalRatings['noCount']++;
        });
      })
      criticalRequirements.forEach(requirement => {
        $(`input[name="${requirement}"]:checked`).each(function() {
          if($(this).val()=="true") criticalRatings['yesCount']++;
          else if($(this).val()=="false") criticalRatings['noCount']++;
        });
      })

      if(generalRatings['yesCount'] >= 4 && criticalRatings['yesCount']==criticalRequirements.length) {
        $('#rating-target').addClass('bg-green');
        $('#rating-target').removeClass('bg-red');
      } else {
        $('#rating-target').addClass('bg-red')
        $('#rating-target').removeClass('bg-green')
      }
      return;
    }

    function addRowSeriousRisk(risk, dataValues) {
      const name = dataValues[risk.name] ? dataValues[risk.name] : ''
      const comment = dataValues[risk.comment] ? dataValues[risk.comment] : ''
      const projectRow = `<div  class="serious-risk-list">
      <div class="form-row">
        <div class="form-group col-md-12 textbox-wrap mb-2">
          <label for="${risk.name}" >Identified Risk ${riskCount+1}</label>
          <input type="text" class="form-control serious-risk textContent" ${tei.disabled ? 'disabled' : ''} value="${name}" id="${risk.name}">                              
          <div class="invalid-feedback"> Error here</div>
         </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-12 textbox-wrap mb-0">
          <label for="${risk.comment}">Comment ${riskCount+1}</label>
          <textarea class="form-control-resize textlimit" ${tei.disabled?'disabled': ''}  id="${risk.comment}" data-count="${riskCount+1}">${comment}</textarea>
          <div class="char-counter form-text text-muted" id="counter-serious-risk${riskCount+1}">${maxWords - (comment ? comment.trim().split(/\s+/).length : 0)}  words remaining</div>
          <div class="invalid-feedback"> Error here</div>
        </div>
      </div>
    </div><hr>`;
                      
      riskCount++;
      return projectRow;
    }

    
$(".plus").click(function (e) {
  e.preventDefault();
  if(riskCount < dataElements.seriousRisk.length) {
    const rows = addRowSeriousRisk(dataElements.seriousRisk[riskCount], {}); 
    riskCount++;
    $(rows).insertBefore(".btn-wrap");
  }
  // Localize content
  $('body').localize();
});

      $(".minus").click(function (e) {
        e.preventDefault();
        if (riskCount > 1) {
          riskCount--;
          pushDataElement(dataElements.seriousRisk[riskCount]['name'],'');
          pushDataElement(dataElements.seriousRisk[riskCount]['comment'],'');
          $(".serious-risk-list").last().remove();
          $("hr").last().remove(); // Remove the last <hr> element
        }
      });
      
    //textarea word limit
    document.addEventListener('DOMContentLoaded', function () {
      const textareas = document.querySelectorAll('.textlimit');
      textareas.forEach((textarea, index) => {
        const counter = document.getElementById(`counter${index + 1}`);
        const updateCounter = () => {

          const words = textarea.value.trim().split(/\s+/)

          if (words.length >= maxWords) {
            textarea.value = words.slice(0, maxWords).join(' ');
            return
          }

          if (textarea.value) {
            counter.textContent = `${(maxWords - words.length)} words remaining`;
          } else counter.textContent = `${maxWords} words remaining`;
        };
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // initialize counter on page load
      });
    });
     //textarea word limit
     function checkWords(event, count) {
      const counter = document.getElementById('counter-serious-risk' + (count));
      const { value } = event;
      const words = value.trim().split(/\s+/)
      
        if (words.length >= maxWords) {
          event.value = words.slice(0, maxWords).join(' ');
          return
        }
        if(value) counter.textContent = `${(maxWords - words.length)} words remaining`;
        else counter.textContent = `${maxWords} words remaining`;
    }