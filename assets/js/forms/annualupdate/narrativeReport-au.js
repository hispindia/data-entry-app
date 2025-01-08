const maxWords = {
  counter1: 500,
  counter2: 800,
  counter3: 500,
  counter4: 250,
  counter5: 250,
  counter6: 250,
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
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchOrganizationUnitUid()
    });


  document
  .getElementById("year-update")
  .addEventListener("change", function (ev) {
    window.localStorage.setItem("annualYear", ev.target.value);
    fetchEvents(ev.target.value);
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
        tei.disabled = window.localStorage.getItem("userDisabled");
      }
      if(!data) {
        data = await response.json();

        const userConfig = userConfig()
        tei.disabled = userConfig.disabled;
        window.localStorage.setItem('hideReporting', userConfig.disabledValues);
      }

      if(window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-reporting').hide();
      }
      if(window.localStorage.getItem("hideReporting").includes('trt')) {
        $('.trt-review').hide();
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
        assignValues();
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  function assignValues() {


    tei.program = program.auOrganisationDetails;
    tei.programStage = programStage.auNarrativePlan;
    dataElements.period.value = document.getElementById("headerPeriod").value;

    tei.year = {
      ...tei.year,
      start:dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    var yearOptions = '';
    var annualYear = window.localStorage.getItem("annualYear");
    for(let year=tei.year.start; year <=tei.year.end; year++) {
      if(tei.hideYears.includes(year)) continue;
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById('year-update').innerHTML = yearOptions;
    document.getElementById('year-update').options[0].selected = true;
    if(annualYear) document.getElementById('year-update').value = annualYear;
  }

  async function fetchEvents(year) {
    
    var annualYear = window.localStorage.getItem("annualYear");
    if (annualYear) year = annualYear;
    else  year = document.getElementById("year-update").value;
    
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program==program.auProjectDescription 
      );

      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  dataElements.year.id);
      if(dataValuesPD[year] && dataValuesPD[year][dataElements.submitAnnualUpdate])  tei.disabled = true;


      tei.dataValues  =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,dataElements.year.id) //data vlaues year wise
      if(!tei.dataValues[year]) {
          tei.dataValues[year] = {}
          let data = [{
            dataElement: dataElements.period.id,
            value: dataElements.period.value
          },{
            dataElement: dataElements.year.id,
            value: year
          }];
        tei.event = await createEvent(data);
        data.forEach(element => {
          tei.dataValues[year][element.dataElement] = element.value;
        })
        }
       else {
        tei.event = tei.dataValues[year]['event'];
      }
      populateProgramEvents(tei.dataValues[year]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    //disable feilds
    if(tei.disabled) {
      $('.textValue').prop('disabled', true);
    }

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

  fetchOrganizationUnitUid();
});
