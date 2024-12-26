var eventSource = {};
var rowIndex = 0;
var combinedCost = 0;
var totalCost = 0;
var level2OU = [];
var totalProductRequest = [];

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
      fetchOrganizationUnitUid();
    });

    document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      fetchEvents();
    });



    async function fetchOrganizationUnitUid() {
      try {
        const response = await fetch(
          `../../me.json?fields=id,username,organisationUnits[id,name,level,children[id,name],parent[id,name]],userGroups[id,name]`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const apiOUGroup = await fetch(
          `../../organisationUnitGroups/mwQWyy8TGZv.json?fields=id,name,organisationUnits[id,name,path,code,level,parent[id,name]]`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
      );
        const data = await response.json();
        const resOUGroup = await apiOUGroup.json();

      if (data.organisationUnits && data.organisationUnits.length > 0) {
        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;

        const fpaIndiaButton = document
          .querySelector(".fa-building-o")
          .closest("a");
        if (fpaIndiaButton) {
          const fpaIndiaDiv = fpaIndiaButton.querySelector("div");
          if (fpaIndiaDiv) {
            fpaIndiaDiv.textContent = data.organisationUnits[0].name;
          }
        }
        

        const orgUnitGroup = resOUGroup.organisationUnits;

        data.organisationUnits.forEach(orgUnits => {
          if(orgUnits.level == 1) { 
            level2OU = orgUnits.children;
          } else if(orgUnits.level == 2) { 
            level2OU.push(orgUnits);
          } else if(orgUnits.parent) {
            level2OU.push(orgUnits.parent);
          }
        });
        level2OU.sort((a, b) => a.name.localeCompare(b.name));
        level2OU.forEach(headOU => {
          headOU['children'] = [];
          orgUnitGroup.forEach(ou => {
            if (ou.path.includes(headOU.id)) headOU['children'].push(ou)
          })
        })
    
        $('.aoc-reporting').hide();
        $('.trt-review').hide()

        dataElements.period.value = document.getElementById("headerPeriod").value;
        tei.year = {
          ...tei.year,
          start: dataElements.period.value.split(" - ")[0],
          end: dataElements.period.value.split(" - ")[1],
        };

        // var yearOptions = '';
        // for(let year=tei.year.start; year <=tei.year.end; year++) {
        //   yearOptions += `<option value="${year}">${year}</option>`;
        // }
        // document.getElementById('year-update').innerHTML = yearOptions;
        document.getElementById('year-update').innerHTML = '<option value="2025">2025 </option>';

        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchEvents() {
    const year = $('#year-update').val();
    $("#table-head").empty();
    $("#table-body").empty();
    $("#loader").html('<div class="h2 text-center">Loading api...</div>');


    var dataElementOUValues = {};
    for(let headOU of level2OU) {
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      for(let ou of headOU.children) {
      $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);
       
        const event = await events.get(ou.id);
        if(event.trackedEntityInstances.length) {
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) =>
          enroll.program == program.auProjectDescription
          || enroll.program == program.arTotalIncome
          );
          dataElementOUValues[ou.id] = {
            annualUpdate: '',
            annualReporting: '',
          }
          const dataValuesPD =  getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription,dataElements.year.id) //data values year wise
          if(dataValuesPD && dataValuesPD[year]) dataElementOUValues[ou.id]['annualUpdate']= dataValuesPD[year];
         
          const dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, {id:dataElements.year.id, value: 2024}, {id:dataElements.periodicity.id, value:"Semi-Annual Reporting"}); //data vlaues period wise
          if(dataValuesAI) dataElementOUValues[ou.id]['annualReporting']= dataValuesAI;
        }
      }
    }
    
    populateProgramEvents(level2OU,dataElementOUValues);
    
  }

  // Function to populate program events data
  function populateProgramEvents(level2OU,dataValues) {


    let projectRows = displayBudgetTotals(level2OU, dataValues);
    $("#table-body").html(projectRows);

    $("#loader").empty();

          
    // Localize content
    $('body').localize();
  }

  function displayBudgetTotals(level2OU, dataValues) {

    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Member / collaborative Partner</th>
    <th style="background:#276696;color:white;text-align:center;">Annual Update</th>
    <th style="background:#276696;color:white;text-align:center;">Annual Reporting</th>
    </tr>`
    
    $('#table-head').html(tableHead);

    var tableBody = '';
    level2OU.forEach(headOU => {
      tableBody += `<tr><td colspan="9" style="background:#50C878;color:white;text-align:center;">${headOU.name}</td></tr>`
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      headOU.children.forEach(ou => {
        const annualUpdate = dataValues[ou.id] && dataValues[ou.id]['annualUpdate']['GbGunhHaiDt']?dataValues[ou.id]['annualUpdate']['GbGunhHaiDt']: '';
        const annualReporting = dataValues[ou.id] && dataValues[ou.id]['annualReporting']['GbGunhHaiDt']?dataValues[ou.id]['annualReporting']['GbGunhHaiDt']: '';
        
        tableBody += `<tr>
        <td>${ou.name}</td>
        <td style="text-align:center;">${annualUpdate}</td>
        <td style="text-align:center;">${annualReporting} </td>
        </tr>`
      })
    })
    
    return tableBody;
  }


  fetchOrganizationUnitUid();
});


function displayValue(input) {
 let num = typeof input === "string" ? parseFloat(input) : input;

 if (isNaN(num)) {
     return "";
 }

 if (num % 1 === 0) {
    return num.toString();
 } else {
    return num.toFixed(2);
 }
}

function colorCode(num) {
  if(Number(num) == 0) return ''
  else return 'red'
}
