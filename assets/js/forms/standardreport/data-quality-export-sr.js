import { eventApi } from '../../api/DataApi.js';
import { dataSet } from '../../api/dataSet.js';
import { getMeData, getOrganisationUnits, getProgramStageEvents } from '../../api/func.js';
import { tei, dataElements, program, programStage, dataSetFunds } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { formatNumberInput, getYears } from '../func.js';

var level2OU = [];

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
      fetchEvents();
    });

  async function fetchDataSet(orgUnit, year) {
    const values = {};
        
    const dataValuesQuantity = await dataSet.getValues(dataSetFunds, orgUnit, year);
      dataValuesQuantity.dataValues.forEach(dv => {
      values[dv.dataElement] = dv.value
    })
        
    return values;
    }

  configurePage();
  async function configurePage() {
    try {
     const user = await getUserConfig();
      tei.userDisabled = user.disabled;
          
      if (user.organisationUnits?.length) {
        tei.orgUnit = user.organisationUnits[0].id;
      }
          
      if(user.hideReporting.includes('aoc')) {
        $(`.aoc-users`).show();
      } else $(`.aoc-users`).hide();

      if(user.hideReporting.includes('trt')) {
        $(`.trt-users`).show();
      } else if(!user.hideReporting.includes('trt') && !user.hideReporting.includes('aoc')) $(`.trt-users`).hide();
            
      if(user.hideReporting.includes('core')) {
        $('.core-users').show();
      }
          
      if(user.hideReporting.includes('ma')) {
        $('.ma-users').show();
      }
      
      const years = getYears(tei.year.start, tei.year.end);
      document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}"  ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
      if(user.annualYear) document.getElementById('year-update').value = user.annualYear;
            
      const data = await getMeData();
      const resOUGroup = await getOrganisationUnits("mwQWyy8TGZv");
     const orgUnitGroup = resOUGroup.organisationUnits;
     
     data.organisationUnits.forEach(orgUnits => {
      if(orgUnits.level == 1) { 
         level2OU = orgUnits.children;
      } else if(orgUnits.level == 2) { 
         level2OU.push(orgUnits);
      } else {
        if(!level2OU.some(ou => ou.id == orgUnits.parent.id)) level2OU.push({...orgUnits.parent, assigned: true, children: []});
        const parentIndex = level2OU.findIndex(ou => ou.id == orgUnits.parent.id);
        level2OU[parentIndex].children.push(orgUnits);
      }
     });
     level2OU.sort((a, b) => a.name.localeCompare(b.name));
     level2OU.forEach(headOU => {
      if(headOU.assigned) {
        headOU.children = headOU.children.filter(child =>
          orgUnitGroup.some(orgUnit => orgUnit.id === child.id)
        );
      }
      else {
        headOU['children'] = [];
        orgUnitGroup.forEach(ou => {
          if (ou.path.includes(headOU.id)) headOU['children'].push(ou)
        })
      }
     })
        
    fetchEvents();
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchEvents() {
    $("#project-export").hide();
    $("#loader").html('<div class="h2 text-center">Loading api...</div>');

    tei.year.value = $('#year-update').val();
    const user = await getUserConfig();

    var dataElementOUValues = {};
    for (let headOU of level2OU) {
      headOU?.children.sort((a, b) => a.name.localeCompare(b.name));
      for (let ou of headOU.children) {
        $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);

        const event = await eventApi.get(ou.id);
        const dataSet = await fetchDataSet(ou.id, tei.year.value);
        if (event.trackedEntityInstances.length) {
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) => enroll.program == program.auProjectDescription
            || enroll.program == program.auProjectBudget
            || enroll.program == program.auProjectExpenseCategory
            || enroll.program == program.auProjectFocusArea
            || enroll.program == program.auIncomeDetails
          );
          dataElementOUValues[ou.id] = {
            funds: {}, //DataSet
            pd: {},
            pb: {}, //project budget
            ec: {}, //expense category
            fa: {}, //focus area
            ti: {}, //total income,
            id: {} //Income by donor
          }
          if(dataSet) dataElementOUValues[ou.id]['funds'] = dataSet;
          
          const dataValuesPD = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, {id: tei.year.id, value: tei.year.value}) //data values year wise
          if (dataValuesPD && dataValuesPD[tei.year.value]) dataElementOUValues[ou.id]['pd'] = dataValuesPD[tei.year.value]

          const dataValuesPB = getProgramStageEvents(filteredPrograms, programStage.auProjectBudget, program.auProjectBudget, {id: tei.year.id, value: tei.year.value}) //data values year wise
          if (dataValuesPB && dataValuesPB[tei.year.value]) dataElementOUValues[ou.id]['pb'] = dataValuesPB[tei.year.value]

          const dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, {id: tei.year.id, value: tei.year.value}) //data values year wise
          if (dataValuesEC && dataValuesEC[tei.year.value]) dataElementOUValues[ou.id]['ec'] = dataValuesEC[tei.year.value]

          const dataValuesFA = getProgramStageEvents(filteredPrograms, programStage.auProjectFocusArea, program.auProjectFocusArea, {id: tei.year.id, value: tei.year.value}) //data values year wise
          if (dataValuesFA && dataValuesFA[tei.year.value]) dataElementOUValues[ou.id]['fa'] = dataValuesFA[tei.year.value]

          const dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value}) //data values year wise
          if (dataValuesTI && dataValuesTI[tei.year.value]) dataElementOUValues[ou.id]['ti'] = {
            ...dataValuesTI[tei.year.value],
            tGS8X8B4BtK: dataSet[dataElements.fullAllocation] ? dataSet[dataElements.fullAllocation] : 0
          }

          const dataValuesID = getProgramStageEvents(filteredPrograms, programStage.auIncomeByDonor, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value}) //data values year wise
          if (dataValuesID) dataElementOUValues[ou.id]['id'] = dataValuesID
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
    $("#project-export").show();


    // Localize content
    $('body').localize();
  }

  function displayBudgetTotals(level2OU, dataValues) {

    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Member / collaborative Partner</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">IPPF Core Grant</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Budgeted Core</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">2.2. Expense by Project</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">2.3. Expense by Focus Area</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">2.4. Expense by Category </th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">3.1. Total Income</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">2.1. Project Income</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">3.2. Income by donor</th>
   
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Financial Position (Income minus Expenses)</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">5.3. TRT Review Status (flag)</th>
    </tr>`

    $('#table-head').html(tableHead);

    var tableBody = '';
    level2OU.forEach(headOU => {
      tableBody += `<tr><td colspan="13" style="background:#50C878;color:white;text-align:center;">${headOU.name}</td></tr>`
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      headOU.children.forEach(ou => {
        const fund = dataValues[ou.id] && dataValues[ou.id]['funds'][dataElements.formulaGenerated] ? displayValue(dataValues[ou.id]['funds'][dataElements.formulaGenerated]) : '';
        const coreFunding = dataValues[ou.id] && dataValues[ou.id]['pb']['x4ER7X2zTOm'] ? displayValue(dataValues[ou.id]['pb']['x4ER7X2zTOm']) : '';
        const totalBudget = dataValues[ou.id] && dataValues[ou.id]['pb']['zGn5c7EZLr0'] ? displayValue(dataValues[ou.id]['pb']['zGn5c7EZLr0']) : '';
        const totalBudgetVariance = displayValue(fund - coreFunding);
        const focusAreaBudget = dataValues[ou.id] && dataValues[ou.id]['fa']['zGn5c7EZLr0'] ? displayValue(dataValues[ou.id]['fa']['zGn5c7EZLr0']) : '';
        const focusAreaVariance = displayValue(totalBudget - focusAreaBudget);
        const expenseCategory = dataValues[ou.id] && dataValues[ou.id]['ec']['zGn5c7EZLr0'] ? displayValue(dataValues[ou.id]['ec']['zGn5c7EZLr0']) : '';
        const expenseCategoryVariance = displayValue(totalBudget - expenseCategory);
        var totalIncome = 0;
        var incomeByDonor = 0;
        var projectIncome = 0;

        dataElements.projectDescription.forEach(pd => {
          if(dataValues[ou.id]['pd'][pd.income]) projectIncome += Number(dataValues[ou.id]['pd'][pd.income]);
        })

        dataElements.projectTotalIncome.forEach(pti => {
          if (dataValues[ou.id]['ti'][pti.restricted]) {
            totalIncome += Number(dataValues[ou.id]['ti'][pti.restricted]);
          }
          if (dataValues[ou.id]['ti'][pti.unrestricted]) {
            totalIncome += Number(dataValues[ou.id]['ti'][pti.unrestricted]);
          }
        })

        dataElements.incomeByDonor.forEach(id => {
          if(dataValues[ou.id]['id'][tei.year.value] && dataValues[ou.id]['id'][tei.year.value][id.name] && dataValues[ou.id]['id'][tei.year.value] && dataValues[ou.id]['id'][tei.year.value][id.income]) {
            incomeByDonor += Number(dataValues[ou.id]['id'][tei.year.value][id.income]);
          }
        })

        const projectIncomeVariance = displayValue(totalIncome - projectIncome);
        const incomeDonorVariance = displayValue(totalIncome - incomeByDonor);
        const financialPosition = displayValue(totalIncome - expenseCategory)
        tableBody += `<tr>
        <td>${ou.name}</td>
        <td style="text-align:center;">${formatNumberInput(fund)} </td>
        <td style="background:${colorCode(totalBudgetVariance)};text-align:center;">${formatNumberInput(totalBudgetVariance)} </td>
        <td style="text-align:center;">${formatNumberInput(totalBudget)} </td>
        <td style="background:${colorCode(focusAreaVariance)};text-align:center;">${formatNumberInput(focusAreaVariance)} </td>
        <td style="background:${colorCode(expenseCategoryVariance)};text-align:center;">${formatNumberInput(expenseCategoryVariance)} </td>
        <td style="text-align:center;">${formatNumberInput(displayValue(totalIncome))}</td>
        <td style="background:${colorCode(projectIncomeVariance)};text-align:center;">${formatNumberInput(projectIncomeVariance)} </td>
        <td style="background:${colorCode(incomeDonorVariance)};text-align:center;">${formatNumberInput(incomeDonorVariance)} </td>
        <td style="background:${colorCode(financialPosition)};text-align:center;">${formatNumberInput(financialPosition)} </td>
        <td></td>
        </tr>`
      })
    })

    return tableBody;
  }

});

function displayValue(input) {
  if (input === null || input === undefined || input === '') {
    return "";
  }
  
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
  if (Number(num) == 0) return '#50C878'
  else return 'red'
}
