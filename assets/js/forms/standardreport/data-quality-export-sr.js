import { eventApi } from '../../api/DataApi.js';
import { getOrganisationUnits, getProgramStageEvents } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { formatNumberInput, getYears } from '../func.js';

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
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      fetchEvents();
    });



  async function configurePage() {
    try {
     const user = await getUserConfig();
      tei.disabled = user.disabled;
          
      if (user.organisationUnits?.length) {
        tei.orgUnit = user.organisationUnits[0].id;
        document.getElementById("headerOrgName").value = user.organisationUnits[0].name;
      }
      ['aoc-reporting', 'trt-review'].forEach(page => {
        if(user.hideReporting.includes(page.split('-')[0])) $(`.${page}`).hide();
      })
      if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-users').show();
      }
      if(window.localStorage.getItem("hideReporting").includes('core')) {
        $('.core-users').show();
      }
      
      if(user.annualReporting) document.getElementById('reporting-periodicity').value = user.annualReporting;
          
      const years = getYears(tei.year.start, tei.year.end);
      document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}">${year}</option>`).join('');
      if(user.annualYear) document.getElementById('year-update').value = user.annualYear;
            
      const resOUGroup = await getOrganisationUnits("mwQWyy8TGZv");
     const orgUnitGroup = resOUGroup.organisationUnits;
     
     user.organisationUnits.forEach(orgUnits => {
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
         
    fetchEvents();
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

        const event = await eventApi.get(ou.id);
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
            ti: {}, //total income,
            id: {} //Income by donor
          }
          const dataValuesOD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, tei.year.id) //data values year wise
          if (dataValuesOD && dataValuesOD[year]) dataElementOUValues[ou.id]['od'] = dataValuesOD[year]

          const dataValuesPB = getProgramStageEvents(filteredPrograms, programStage.auProjectBudget, program.auProjectBudget, tei.year.id) //data values year wise
          if (dataValuesPB && dataValuesPB[year]) dataElementOUValues[ou.id]['pb'] = dataValuesPB[year]

          const dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, tei.year.id) //data values year wise
          if (dataValuesEC && dataValuesEC[year]) dataElementOUValues[ou.id]['ec'] = dataValuesEC[year]

          const dataValuesFA = getProgramStageEvents(filteredPrograms, programStage.auProjectFocusArea, program.auProjectFocusArea, tei.year.id) //data values year wise
          if (dataValuesFA && dataValuesFA[year]) dataElementOUValues[ou.id]['fa'] = dataValuesFA[year]

          const dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, tei.year.id) //data values year wise
          if (dataValuesTI && dataValuesTI[year]) dataElementOUValues[ou.id]['ti'] = dataValuesTI[year]

          const dataValuesID = getProgramStageEvents(filteredPrograms, programStage.auIncomeByDonor, program.auIncomeDetails, tei.year.id) //data values year wise
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


    // Localize content
    $('body').localize();
  }

  function displayBudgetTotals(level2OU, dataValues) {

    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Member / collaborative Partner</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Total Expense Budget</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">PPF Core Grant</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Budgeted PPF Core Grant</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">IPPF Core Gant Control</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Total Budget by Focus Area</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Focus Area Control</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Total Budget by Expense Category</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Expense Category Control</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Total Income</th>
   
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Total Income by Donor</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Total Income Control</th>
     <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Financial Position (Income minus Expenses)</th>
    </tr>`

    $('#table-head').html(tableHead);

    var tableBody = '';
    level2OU.forEach(headOU => {
      tableBody += `<tr><td colspan="13" style="background:#50C878;color:white;text-align:center;">${headOU.name}</td></tr>`
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
        var incomeByDonor = 0;

        dataElements.projectTotalIncome.forEach(pti => {
          if (dataValues[ou.id]['ti'][pti.category] && dataValues[ou.id]['ti'][pti.restricted]) {
            totalIncome += Number(dataValues[ou.id]['ti'][pti.restricted]);
          }
          if (dataValues[ou.id]['ti'][pti.category] && dataValues[ou.id]['ti'][pti.unrestricted]) {
            totalIncome += Number(dataValues[ou.id]['ti'][pti.unrestricted]);
          }
        })

        const year = $('#year-update').val();
        dataElements.incomeByDonor.forEach(id => {
          if(dataValues[ou.id]['id'][tei.year.start] && dataValues[ou.id]['id'][tei.year.start][id.name] && dataValues[ou.id]['id'][year] && dataValues[ou.id]['id'][year][id.income]) {
            incomeByDonor += Number(dataValues[ou.id]['id'][year][id.income]);
          }
        })
        tableBody += `<tr>
        <td>${ou.name}</td>
        <td style="text-align:center;">${formatNumberInput(totalBudget)}</td>
        <td style="text-align:center;">${formatNumberInput(fund)} </td>
        <td style="text-align:center;">${formatNumberInput(coreFunding)} </td>
        <td style="background:${colorCode(totalBudgetVariance)};text-align:center;">${formatNumberInput(totalBudgetVariance)} </td>
        <td style="text-align:center;">${formatNumberInput(focusAreaBudget)} </td>
        <td style="background:${colorCode(focusAreaVariance)};text-align:center;">${formatNumberInput(focusAreaVariance)} </td>
        <td style="text-align:center;">${formatNumberInput(expenseCategory)} </td>
        <td style="background:${colorCode(expenseCategoryVariance)};text-align:center;">${formatNumberInput(expenseCategoryVariance)} </td>
        <td style="text-align:center;">${formatNumberInput(displayValue(totalIncome))}</td>
        <td style="text-align:center;">${formatNumberInput(displayValue(incomeByDonor))}</td>
        <td  style="background:${colorCode(displayValue(totalIncome-incomeByDonor))};text-align:center;">${formatNumberInput(displayValue(totalIncome-incomeByDonor))}</td>
         <td style="background:${displayValue(totalIncome - expenseCategory)<0 ? 'red':''};text-align:center;">${formatNumberInput(displayValue(totalIncome - expenseCategory))} </td>
        </tr>`
      })
    })

    return tableBody;
  }


  configurePage();
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
