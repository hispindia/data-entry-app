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
          tei.disabled = window.localStorage.getItem("userDisabled");
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
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchEvents() {

    tei.program = program.roTRTFeedback;
    tei.programStage = programStage.roTRTFeedback;
    dataElements.period.value = document.getElementById("headerPeriod").value;

    tei.year = {
      ...tei.year,
      start:dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program 
      );

      tei.dataValues  =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,dataElements.period.id) //data vlaues year wise
      
      populateProgramEvents(tei.dataValues[dataElements.period.value]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    //disable feilds
    if(tei.disabled) {
      $('.textValue').prop('disabled', true);
      $('.textValue-prev').prop('disabled', true);
       // Disable all radio button elements
       $('input[type="radio"]').prop('disabled', true);

       //Disable all button
       $('button').prop('disabled', true);
    }

    document.querySelectorAll('.textValue').forEach((textVal,index) => {
      if(dataValues[textVal.id]) {
        if(textVal.id=="Lltsm7QaRXf" || textVal.id== "EcmhrXnurQb" || textVal.id== "kK927QgR8nD") {
          $('.row-new').show();
        }
        textVal.value = dataValues[textVal.id];
        $(`#counter${index+1}`).text(`${(maxWords- (textVal.value ? textVal.value.trim().split(/\s+/).length: 0))} words remaining`)
      }
      else {
        textVal.value = '';
        $(`#counter${index+1}`).text(`${maxWords} words remaining`)
      }
    })
    getRisk(dataValues);
  }

  fetchOrganizationUnitUid();
});

async function getRisk(dataValues) {
  var riskValues = 0;
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    if(dataValues) {
      if (dataValues[radio.name] && radio.value === dataValues[radio.name]) {
        radio.checked = true;  // Set it as checked
        if(radio.value == "true")riskValues++;
      }
    }
    else if(radio.checked==true && radio.value=="true") riskValues++;
    
  })
  $('.risk-identified').val(riskValues);
}