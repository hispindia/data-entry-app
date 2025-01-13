const maxWords = 200;
var sendBackToMA = false;
var eventSummaryAId = '';
var eventSummaryBId = '';

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
    tei.programStage = programStage.trtFeedback;
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

      dataValuesSummaryA = getProgramStageEvents(filteredPrograms, programStage.trtSummaryA, tei.program, dataElements.period.id) //data vlaues year wise
      if(dataValuesSummaryA[dataElements.period.value]) {
        eventSummaryAId = dataValuesSummaryA[dataElements.period.value]['event'];
        if(dataValuesSummaryA[dataElements.period.value]['RI5UuEEpxun'] && dataValuesSummaryA[dataElements.period.value]['RI5UuEEpxun']=="Send Back to MA for Revisions") sendBackToMA = true
      } 
      
      dataValuesSummaryB = getProgramStageEvents(filteredPrograms, programStage.trtSummaryB, tei.program, dataElements.period.id) //data vlaues year wise
      if(dataValuesSummaryB[dataElements.period.value]) {
        eventSummaryBId = dataValuesSummaryB[dataElements.period.value]['event'];
      }

      dataValuesMA = getProgramStageEvents(filteredPrograms, programStage.roTRTFeedback, tei.program, dataElements.period.id) //data vlaues year wise
      tei.dataValues  =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,dataElements.period.id) //data vlaues year wise
        if(!tei.dataValues[dataElements.period.value]) {
          tei.dataValues[dataElements.period.value] = {}
          let data = [{
            dataElement: dataElements.period.id,
            value: dataElements.period.value
          }];
        tei.event = await createEvent(data);
        data.forEach(element => {
          tei.dataValues[dataElements.period.value][element.dataElement] = element.value;
        })
        }
       else {
        tei.event = tei.dataValues[dataElements.period.value]['event'];
      }
    
      if(!eventSummaryAId) {
        let data = [{
          dataElement: dataElements.period.id,
          value: dataElements.period.value
        }];
        eventSummaryAId = await createEventOther({
          orgUnit: tei.orgUnit,
          program: tei.program,
          programStage: programStage.trtSummaryA,
          teiId: tei.id,
          dataElements: data
        })
      }

      if(!eventSummaryBId) {
        let data = [{
          dataElement: dataElements.period.id,
          value: dataElements.period.value
        }];
        eventSummaryBId = await createEventOther({
          orgUnit: tei.orgUnit,
          program: tei.program,
          programStage: programStage.trtSummaryB,
          teiId: tei.id,
          dataElements: data
        })
      }
      
      populateProgramEvents(tei.dataValues[dataElements.period.value], (dataValuesMA[dataElements.period.value] ? dataValuesMA[dataElements.period.value]: {}));
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValues, dataValuesMA) {
    //disable feilds
    if(tei.disabled) {
      $('.textValue').prop('disabled', true);
      $('.textValue-prev').prop('disabled', true);
       // Disable all radio button elements
       $('input[type="radio"]').prop('disabled', true);

       //Disable all button
       $('button').prop('disabled', true);
    }
   
    document.querySelectorAll('.textValue-prev').forEach((textVal,index) => {
      if(dataValuesMA[textVal.id]) {
        if(textVal.id=="Lltsm7QaRXf" || textVal.id== "EcmhrXnurQb" || textVal.id== "kK927QgR8nD") {
          $('.row-new').show();
        }
        textVal.value = dataValuesMA[textVal.id];
        $(`#counter${index+1}`).text(`${(maxWords- (textVal.value ? textVal.value.trim().split(/\s+/).length: 0))} words remaining`)
      }
      else {
        textVal.value = '';
        $(`#counter${index+1}`).text(`${maxWords} words remaining`)
      }
    })
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

document.addEventListener('DOMContentLoaded', function () {
  const allRadios = document.querySelectorAll('input[type="radio"]');
  // Add an onchange event listener to each radio button
  allRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
          pushDataElement(event.target.name, event.target.value);
         getRisk()
        }
    });
  }); 
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
  pushDataElement($('.risk-identified').attr('id') , riskValues)  
  if(sendBackToMA) await pushDataElementOther($('.risk-identified').attr('id'),riskValues, tei.program, programStage.trtSummaryB, eventSummaryBId);
  else await pushDataElementOther($('.risk-identified').attr('id'),riskValues, tei.program, programStage.trtSummaryA, eventSummaryAId);

}

function submitNarrative() {
  alert("Event Saved SuccessFully")
}