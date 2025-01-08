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
      const masterOU = window.localStorage.getItem("masterOU");
      if (masterOU) {
        data = { organisationUnits: [{ ...JSON.parse(masterOU) }] };
        tei.disabled = window.localStorage.getItem("userDisabled");
      }
      if (!data) {
        data = await response.json();

        const userConfig = userConfig()
        tei.disabled = userConfig.disabled;
        window.localStorage.setItem('hideReporting', userConfig.disabledValues);
      }

      if (window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-reporting').hide();
      }
      if (window.localStorage.getItem("hideReporting").includes('trt')) {
        $('.trt-review').hide();
      }

      if (data.organisationUnits && data.organisationUnits.length > 0) {
        tei.orgUnit = data.organisationUnits[0].id;
        document.getElementById("headerOrgId").value = data.organisationUnits[0].parent ? data.organisationUnits[0].parent.name : '';

        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;
        document.getElementById("headerOrgCode").value =
          data.organisationUnits[0].code;

        const fpaIndiaButton = document.querySelector('.fa-building-o').closest('a');
        if (fpaIndiaButton) {
          const fpaIndiaDiv = fpaIndiaButton.querySelector('div');
          if (fpaIndiaDiv) {
            fpaIndiaDiv.textContent = data.organisationUnits[0].name;;
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
      start: dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program
        );

      tei.dataValues = getProgramStageEvents(filteredPrograms, tei.programStage, tei.program, dataElements.period.id) //data vlaues year wise
      if (!tei.dataValues[dataElements.period.value]) {
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

      populateProgramEvents(tei.dataValues[dataElements.period.value]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    //disable feilds
    if (tei.disabled) {
      $('.textValue').prop('disabled', true);
    }

    document.querySelectorAll('.textValue').forEach((textVal, index) => {
      if (dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
        $(`#counter${index + 1}`).text(`${(maxWords - (textVal.value ? textVal.value.trim().split(/\s+/).length : 0))} words remaining`)
      }
      else {
        textVal.value = '';
        $(`#counter${index + 1}`).text(`${maxWords} words remaining`)
      }
    })
    document.querySelectorAll('.textOption').forEach((textVal, index) => {
      if (dataValues[textVal.id]) {
        textVal.value = dataValues[textVal.id];
      }
      else {
        textVal.value = '';
      }
    })
    calculateCriteria();
  }

  fetchOrganizationUnitUid();
});
function submitNarrative() {
  alert("Event Saved SuccessFully")
}

function calculateCriteria(){
  var countSatisfactory = 0;
  var coumtSomeGaps = 0;
  var coumtSignificantGaps= 0;
  var coumtNotApplicable = 0;

document.querySelectorAll('.textOption').forEach((textVal, index) => {
     if(textVal.value == "Satisfactory" ) countSatisfactory++;
     if(textVal.value == "Some Gaps" ) coumtSomeGaps++;
     if(textVal.value == "Significant Gaps" ) coumtSignificantGaps++;
     if(textVal.value == "Not Applicable" ) coumtNotApplicable++;    
    })
    $('.satisfactory').val(countSatisfactory);
    $('.some-gaps').val(coumtSomeGaps);
    $('.significant-gaps').val(coumtSignificantGaps);
    $('.not-applicable').val(coumtNotApplicable);
    pushDataElement($('.satisfactory').attr('id') , countSatisfactory)
    pushDataElement($('.some-gaps').attr('id') , coumtSomeGaps)
    pushDataElement($('.significant-gaps').attr('id') , coumtSignificantGaps)
    pushDataElement($('.not-applicable').attr('id') , coumtNotApplicable)
}