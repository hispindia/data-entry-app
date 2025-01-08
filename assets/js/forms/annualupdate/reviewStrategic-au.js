const maxWords = 200;

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
        data = {organisationUnits: [{...JSON.parse(masterOU)}]};
      }
      if(!data) {
        data = await response.json();

        const userConfig = userGroupConfig(data)
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
        assignValues();
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  function assignValues() {


    tei.program = program.reportFeedback;
    tei.programStage = programStage.auROTRTFeedback;
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
        (enroll) => enroll.program == tei.program 
      );

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

    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if (dataValues[radio.name] && radio.value === dataValues[radio.name]) {
        radio.checked = true;  // Set it as checked
      }
    })
    selectedRatings()
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
      var addressed = 0;
      var notAddressedJustified = 0;
      var notAddressed = 0;

    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      if(radio.checked)
        if(radio.value=="Addressed") addressed++;
        else if(radio.value=="Not Addressed") notAddressed++;
        else if(radio.value=="Not Addressed but Justified") notAddressedJustified++;
        
    });

    $(`#addressed`).val(addressed);
    $(`#not-addressed`).val(notAddressed);
    $(`#not-addressed-justified`).val(notAddressedJustified);
    }
