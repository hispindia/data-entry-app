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

      const userConfig = userGroupConfig(data)
      tei.disabled = userConfig.disabled;
      window.localStorage.setItem('hideReporting', userConfig.disabledValues);

      if (window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-reporting').hide();
      }
      if (window.localStorage.getItem("hideReporting").includes('trt')) {
        $('.trt-review').hide();
      }
      if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-users').show();
      }
      if(window.localStorage.getItem("hideReporting").includes('core')) {
        $('.core-users').show();
      }

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
          if (orgUnits.level == 1) {
            level2OU = orgUnits.children;
          } else if (orgUnits.level == 2) {
            level2OU.push(orgUnits);
          } else if (orgUnits.parent) {
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
    for (let headOU of level2OU) {
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      for (let ou of headOU.children) {
        $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);

        const event = await events.get(ou.id);
        if (event.trackedEntityInstances.length) {
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) => enroll.program == tei.program
            || enroll.program == program.auOrganisationDetails
            || enroll.program == program.auProjectBudget
            || enroll.program == program.auProjectExpenseCategory
            || enroll.program == program.auProjectFocusArea
            || enroll.program == program.auIncomeDetails
          );
          dataElementOUValues[ou.id] = {
            od: {}, //organization details
            pb: {}, //project budget
            ec: {}, //expense category
            fa: {}, //focus area
            ti: {} //total income
          }
          const dataValuesOD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, dataElements.year.id) //data values year wise
          if (dataValuesOD && dataValuesOD[year]) dataElementOUValues[ou.id]['od'] = dataValuesOD[year]

          const dataValuesPB = getProgramStageEvents(filteredPrograms, programStage.auProjectBudget, program.auProjectBudget, dataElements.year.id) //data values year wise
          if (dataValuesPB && dataValuesPB[year]) dataElementOUValues[ou.id]['pb'] = dataValuesPB[year]

          const dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, dataElements.year.id) //data values year wise
          if (dataValuesEC && dataValuesEC[year]) dataElementOUValues[ou.id]['ec'] = dataValuesEC[year]

          const dataValuesFA = getProgramStageEvents(filteredPrograms, programStage.auProjectFocusArea, program.auProjectFocusArea, dataElements.year.id) //data values year wise
          if (dataValuesFA && dataValuesFA[year]) dataElementOUValues[ou.id]['fa'] = dataValuesFA[year]

          const dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, dataElements.year.id) //data values year wise
          if (dataValuesTI && dataValuesTI[year]) dataElementOUValues[ou.id]['ti'] = dataValuesTI[year]
        }
      }
    }

    populateProgramEvents(level2OU, dataElementOUValues);

  }

  // Function to populate program events data
  function populateProgramEvents(level2OU, dataValues) {


    let projectRows = displayBudgetTotals(level2OU, dataValues);
    $("#table-body").html(projectRows);

    $("#loader").empty();


    // Localize content
    $('body').localize();
  }

  function displayBudgetTotals(level2OU, dataValues) {

    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Member / collaborative Partner</th>
    <th style="background:#276696;color:white;text-align:center;">Total Budget</th>
    <th style="background:#276696;color:white;text-align:center;">Core Grant</th>
    <th style="background:#276696;color:white;text-align:center;">Budgeted Core Grant</th>
    <th style="background:#276696;color:white;text-align:center;">Variance</th>
    <th style="background:#276696;color:white;text-align:center;">Total Budget by Focus Area</th>
    <th style="background:#276696;color:white;text-align:center;">Variance Focus Area</th>
    <th style="background:#276696;color:white;text-align:center;">Total Budget by Expense Category</th>
    <th style="background:#276696;color:white;text-align:center;">Variance Expense Category</th>
    <th style="background:#276696;color:white;text-align:center;">Total Income</th>
    <th style="background:#276696;color:white;text-align:center;">financial Position</th>
    </tr>`

    $('#table-head').html(tableHead);

    var tableBody = '';
    level2OU.forEach(headOU => {
      tableBody += `<tr><td colspan="11" style="background:#50C878;color:white;text-align:center;">${headOU.name}</td></tr>`
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      headOU.children.forEach(ou => {
        const totalBudget = dataValues[ou.id] && dataValues[ou.id]['pb']['zGn5c7EZLr0'] ? displayValue(dataValues[ou.id]['pb']['zGn5c7EZLr0']) : '';
        const fund = dataValues[ou.id] && dataValues[ou.id]['od']['gQQoxkZsZnn'] ? displayValue(dataValues[ou.id]['od']['gQQoxkZsZnn']) : '';
        const coreFunding = dataValues[ou.id] && dataValues[ou.id]['pb']['x4ER7X2zTOm'] ? displayValue(dataValues[ou.id]['pb']['x4ER7X2zTOm']) : '';
        const totalBudgetVariance = displayValue(fund - coreFunding);
        const focusAreaBudget = dataValues[ou.id] && dataValues[ou.id]['fa']['zGn5c7EZLr0'] ? displayValue(dataValues[ou.id]['fa']['zGn5c7EZLr0']) : '';
        const focusAreaVariance = displayValue(totalBudget - focusAreaBudget);
        const expenseCategory = dataValues[ou.id] && dataValues[ou.id]['ec']['zGn5c7EZLr0'] ? displayValue(dataValues[ou.id]['ec']['zGn5c7EZLr0']) : '';
        const expenseCategoryVariance = displayValue(totalBudget - expenseCategory);
        var totalIncome = 0;

        dataElements.projectTotalIncome.forEach(pti => {
          if (dataValues[ou.id]['ti'][pti.category] && dataValues[ou.id]['ti'][pti.restricted]) {
            totalIncome += Number(dataValues[ou.id]['ti'][pti.restricted]);
          }
          if (dataValues[ou.id]['ti'][pti.category] && dataValues[ou.id]['ti'][pti.unrestricted]) {
            totalIncome += Number(dataValues[ou.id]['ti'][pti.unrestricted]);
          }
        })

        tableBody += `<tr>
        <td>${ou.name}</td>
        <td style="text-align:center;">${totalBudget}</td>
        <td style="text-align:center;">${fund} </td>
        <td style="text-align:center;">${coreFunding} </td>
        <td style="background:${colorCode(totalBudgetVariance)};text-align:center;">${totalBudgetVariance} </td>
        <td style="text-align:center;">${focusAreaBudget} </td>
        <td style="background:${colorCode(focusAreaVariance)};text-align:center;">${focusAreaVariance} </td>
        <td style="text-align:center;">${expenseCategory} </td>
        <td style="background:${colorCode(expenseCategoryVariance)};text-align:center;">${expenseCategoryVariance} </td>
        <td style="text-align:center;">${displayValue(totalIncome)} </td>
        <td style="text-align:center;">${displayValue(totalIncome - expenseCategory)} </td>
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
  if (Number(num) == 0) return ''
  else return 'red'
}
