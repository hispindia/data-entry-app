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
        document.getElementById('year-update').innerHTML = '<option value="2024">2024 </option>';

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
          enroll.program == program.auIncomeDetails
          );
          const dataValues = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, dataElements.year.id) //data vlaues year wise

          dataElementOUValues[ou.id] = dataValues
          

// var countId = 0;
// const dataValuesTIAR = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, 
//   {id: dataElements.year.id, value: '2024' }, 
//   {id: dataElements.periodicity.id, value: 'Annual Reporting'}
// ); //data vlaues period wise
// if (dataValuesTIAR['event']) {
//   const eventTI = dataValuesTIAR['event'];

// await pushDataElementOther(dataElements.submitAnnualUpdate,'', program.arTotalIncome, programStage.arTotalIncome, eventTI);
//  console.log(++countId, tei.orgUnit)
// }

        }
      }
    }
    
    populateProgramEvents(level2OU,dataElementOUValues);
    
  }

  // Function to populate program events data
  function populateProgramEvents(level2OU,dataValues) {


    // let projectRows = displayBudgetTotals(level2OU, dataValues);
    let projectRows = displayTI(level2OU, dataValues);
    $("#table-body").html(projectRows);

    $("#loader").empty();

          
    // Localize content
    $('body').localize();
  }

  function displayTI(level2OU, dataValues) {

    var tableBody = '';
    level2OU.forEach(headOU => {
      tableBody += `<tr><td colspan="7" style="background:#50C878;color:white;text-align:center;">${headOU.name}</td></tr>`
      tableBody += `<tr>
        <th style="background:#276696;color:white;text-align:center;">Member / collaborative Partner</th>`
      for(let i=tei.year.start; i<=tei.year.end; i++) {
        tableBody += `
        <th style="background:#276696;color:white;text-align:center;">Largest Contributor ${i}</th>
        <th style="background:#276696;color:white;text-align:center;">Income Provided ${i}</th>`
      }
      tableBody += `</tr>`
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      headOU.children.forEach(ou => {
      tableBody += `<tr><td>${ou.name}</td>`
      for(let i=tei.year.start; i<=tei.year.end; i++) {
        tableBody += `<td>${dataValues[ou.id][i] && dataValues[ou.id][i]['isOgz4tNDbM'] ? dataValues[ou.id][i]['isOgz4tNDbM']: ''}</td>`
        tableBody += `<td>${dataValues[ou.id][i] && dataValues[ou.id][i]['mXSWPVPMkSt'] ? dataValues[ou.id][i]['mXSWPVPMkSt']: ''}</td>`
      }
      tableBody += `</tr>`

      })
    })
    
    return tableBody;
  }
  
  function displayFA(level2OU, dataValues) {

    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">S.No.</th>
    <th style="background:#276696;color:white;text-align:center;">Member / collaborative Partner</th>
    <th style="background:#276696;color:white;text-align:center;">Area</th>
    <th style="background:#276696;color:white;text-align:center;">assigned budget</th>
    <th style="background:#276696;color:white;text-align:center;">expense</th>
    </tr>`
    
    $('#table-head').html(tableHead);

    var tableBody = '';
    level2OU.forEach(headOU => {
      tableBody += `<tr><td colspan="9" style="background:#50C878;color:white;text-align:center;">${headOU.name}</td></tr>`
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      headOU.children.forEach(ou => {

        tableBody += `
        <tr>
        <td style="background:yellow">${ou.name}</td>
        <tr>
        <th style="background:#276696;color:white;text-align:center;">S.No.</th>
        <th style="background:#276696;color:white;text-align:center;">Member / collaborative Partner</th>
        <th style="background:#276696;color:white;text-align:center;">Area</th>
        <th style="background:#276696;color:white;text-align:center;">assigned budget</th>
        <th style="background:#276696;color:white;text-align:center;">expense</th>
        </tr>
        </tr>
        `

      dataElements.projectFocusAreaNew.forEach((fa,indexFA)=> {fa.focusAreas.forEach(
        (focusAreaId) => {  
          if (dataValues[ou.id] && dataValues[ou.id]['fa'][focusAreaId]) {
            const focusAreaVal = JSON.parse(dataValues[ou.id]['fa'][focusAreaId]);
            tableBody += `<tr><td>${indexFA+1}</td><td>${ dataValues[ou.id]['fa'][fa.name]}</td><td>${focusAreaVal.area}</td>`;
            tableBody += `<td>${focusAreaVal.assignedBudget}</td>`;
            tableBody += `<td>${focusAreaVal.expense}</td></tr>`;
          }
        })
      })

    })
    })
    
    return tableBody;
  }

  function displayBudgetTotals(level2OU, dataValues) {

    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Member / collaborative Partner</th>
    <th style="background:#276696;color:white;text-align:center;">2024 projects</th>
    <th style="background:#276696;color:white;text-align:center;">2025 projects</th>
    </tr>`
    
    $('#table-head').html(tableHead);

    var tableBody = '';
    level2OU.forEach(headOU => {
      tableBody += `<tr><td colspan="9" style="background:#50C878;color:white;text-align:center;">${headOU.name}</td></tr>`
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      headOU.children.forEach(ou => {
        tableBody += `<tr>
        <td>${ou.name}</td>
        <td style="text-align:center;">${dataValues[ou.id]['projects2024'].length}</td>
        <td style="text-align:center;">${dataValues[ou.id]['projects2025'].length}</td>
        </tr>`
      })
    })
    
    return tableBody;
  }


  fetchOrganizationUnitUid();
});

function checkProjects(projects, values) {
  var prevEmptyNames = [];
  var names= [];
  if(values) {
    projects.forEach(project => {
      if(values[project.name]) {
        names = [...names, ...prevEmptyNames, values[project.name]];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      }
    })
  }
  return names;
}


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
