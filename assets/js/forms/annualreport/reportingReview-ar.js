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
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchOrganizationUnitUid()
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
      const masterOU =  window.localStorage.getItem("masterOU");
      if(masterOU) {
        data = {organisationUnits: [{...JSON.parse(masterOU)}]} ;
      }
      if(!data) {
        data = await response.json();
        
        const userConfig = userGroupConfig(data);
        tei.disabled = userConfig.disabled;
        window.localStorage.setItem('hideReporting', userConfig.disabledValues);
      }

      if(window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-reporting').hide();
      }
      if(window.localStorage.getItem("hideReporting").includes('trt')) {
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
        document.getElementById("headerOrgId").value =  data.organisationUnits[0].parent ? data.organisationUnits[0].parent.name: '';

        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;
        document.getElementById("headerOrgCode").value =
          data.organisationUnits[0].code;

          const fpaIndiaButton = document.querySelector('.fa-building-o').closest('a');
          if (fpaIndiaButton) {
              const fpaIndiaDiv = fpaIndiaButton.querySelector('div');
              if (fpaIndiaDiv) {
                  fpaIndiaDiv.textContent =  data.organisationUnits[0].name;;
              }
          }

        assignValues()
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  function assignValues() {
    var annualReporting = window.localStorage.getItem("annualReporting");
    if(annualReporting) document.getElementById('reporting-periodicity').value = annualReporting;
    
    tei.program = program.reportFeedback;
    tei.programStage = programStage.arROFeedback;
    dataElements.period.value = document.getElementById("headerPeriod").value;
    dataElements.periodicity.value = document.getElementById("reporting-periodicity").value;

    tei.year = {
      ...tei.year,
      start:dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    
    var yearOptions = '';
    for(let year=tei.year.start; year <=tei.year.end; year++) {
      if(tei.hideReportingYears.includes(year)) continue;
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById('year-update').innerHTML = yearOptions;
    document.getElementById('year-update').options[0].selected = true;
    var annualYear = window.localStorage.getItem("annualYearAR");
    if(annualYear) document.getElementById('year-update').value = annualYear;

  }
  async function fetchEvents(year) {
    tei.projects = [];
    
    if(!year) year = document.getElementById("year-update").value;
    dataElements.periodicity.value = document.getElementById("reporting-periodicity").value;
    
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;
    
      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program 
      );

      const dataValues = getProgramStagePeriodicity(filteredPrograms, tei.program, tei.programStage, {id:dataElements.year.id, value: year}, {id:dataElements.periodicity.id, value:dataElements.periodicity.value}); //data vlaues period wise
      
        if(!dataValues) {
          if(year && dataElements.period.value && dataElements.periodicity.value) {
            let data = [{ 
              dataElement: dataElements.year.id,
              value: year
            },{
              dataElement: dataElements.period.id,
              value: dataElements.period.value
            }, {
              dataElement: dataElements.periodicity.id,
              value: dataElements.periodicity.value
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

    
    if(dataElements.periodicity.value=="Semi-Annual Reporting") $('.annual-reporting-display').hide();

    //disable feilds
    if (tei.disabled) {
      $('.textValue').prop('disabled', true);

      // Disable all radio button elements
      $('input[type="radio"]').prop('disabled', true);

      //Disable all button
      $('button').prop('disabled', true);
    }

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
       projectRows += addRowSeriosRisk(risk, dataValues);
      }
    })
    if(!projectRows) projectRows += addRowSeriosRisk(dataElements.seriousRisk[0], {});
    $(projectRows).insertBefore(".btn-wrap");

    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if (dataValues[radio.name] && radio.value === dataValues[radio.name]) {
        radio.checked = true;  // Set it as checked
      }
    })
    selectedRatings()
    if(dataElements.periodicity.value == "Semi-Annual Reporting") {
     $('#KGx5UkIS59t').val("Not relevant for HYR");
     $('#RIltL5QmDEP').val("Not relevant for HYR");

     $('#KGx5UkIS59t').attr('disabled',  true );
     $('#RIltL5QmDEP').attr('disabled', true);
    }
  }
  fetchOrganizationUnitUid();
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
      
      if(dataElements.periodicity.value == "Semi-Annual Reporting") {
        criticalRequirements = ['aXjINT5ttfR'];
      } else criticalRequirements = ['HOuFie6msc6', 'vacCAltV8Pp', 'aXjINT5ttfR'];
      

      document.querySelectorAll('.serious-risk').forEach((risk) => {
        if(risk.value) seriousRisk = true;
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

    function addRowSeriosRisk(risk, dataValues) {
      const name = dataValues[risk.name] ? dataValues[risk.name] : ''
      const comment = dataValues[risk.comment] ? dataValues[risk.comment] : ''
      const projectRow = `<div  class="serious-risk-list">
      <div class="form-row">
        <div class="form-group col-md-12 textbox-wrap mb-2">
          <label for="${risk.name}" >Identified Risk ${riskCount+1}</label>
          <input type="text" class="form-control serious-risk" ${tei.disabled?'disabled': ''} value="${name}" oninput="pushDataElement(this.id,this.value);selectedRatings();" id="${risk.name}">                                      
          <div class="invalid-feedback"> Error here</div>
         </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-12 textbox-wrap mb-0">
          <label for="${risk.comment}">Comment ${riskCount+1}</label>
          <textarea class="form-control-resize textlimit textValue" ${tei.disabled?'disabled': ''}  id="${risk.comment}" onchange="pushDataElement(this.id,this.value);checkWords(this, '${riskCount+1}');selectedRatings();">${comment}</textarea>
          <div class="char-counter form-text text-muted" id="counter-serious-risk${riskCount+1}">${maxWords - (comment ? comment.trim().split(/\s+/).length : 0)}  words remaining</div>
          <div class="invalid-feedback"> Error here</div>
        </div>
      </div>
    </div><hr>`;
                          
      riskCount++;
      return projectRow;
    }