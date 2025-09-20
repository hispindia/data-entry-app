import { eventApi } from '../../api/DataApi.js';
import { getMeData, getOrganisationUnits, getProgramStageEvents, getProgramStagePeriodicity } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
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



  async function configurePage() {
    try {
     const user = await getUserConfig();
      tei.disabled = user.disabled;
          
      if (user.organisationUnits?.length) {
        tei.orgUnit = user.organisationUnits[0].id;
      }
          
      if(user.hideReporting.includes('aoc')) {
        $(`.aoc-users`).show();
      } else $(`.aoc-users`).hide();

      if(user.hideReporting.includes('trt')) {
        $(`.trt-users`).show();
      } else $(`.trt-users`).hide();
            
      if(user.hideReporting.includes('core')) {
        $('.core-users').show();
      }
          
      if(user.hideReporting.includes('ma')) {
        $('.ma-users').show();
      }
      // if(user.annualReporting) document.getElementById('reporting-periodicity').value = user.annualReporting;
          
      const years = getYears(tei.year.start, tei.year.end);
      document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${"2025"==year? 'selected': ''}>${year}</option>`).join('');
      // if(user.annualYear) document.getElementById('year-update').value = user.annualYear;
                  

    const data = await getMeData();
    const resOUGroup = await getOrganisationUnits("mwQWyy8TGZv");
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
               
    fetchEvents();
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchEvents() {
    $("#project-export").hide();
    $("#loader").html('<div class="h2 text-center">Loading api...</div>');

    tei.year.value = $('#year-update').val();

    var dataElementOUValues = {};
    for (let headOU of level2OU) {
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      for (let ou of headOU.children) {
        $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);

        const event = await eventApi.get(ou.id);
        if (event.trackedEntityInstances.length) {
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) =>
            // enroll.program == program.auProjectExpenseCategory
            enroll.program == program.arProjectExpenseCategory
            || enroll.program == program.arProjectFocusArea
            || enroll.program == program.auIncomeDetails
            || enroll.program == program.arTotalIncome
          );
          dataElementOUValues[ou.id] = {
            auti: {}, //total income,
            // auec: {}, //project budget
            arec: {}, //expense category
            arfa: {}, //focus area
            arac: {} //actual income
          }

          // const dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, tei.year.id) //data values year wise
          // if (dataValuesEC && dataValuesEC[year]) dataElementOUValues[ou.id]['auec'] = dataValuesEC[year]

          const dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value}) //data values year wise
          if (dataValuesTI && dataValuesTI[tei.year.value]) dataElementOUValues[ou.id]['auti'] = dataValuesTI[tei.year.value]

          const dataValuesAREC = getProgramStagePeriodicity(filteredPrograms, program.arProjectExpenseCategory, programStage.arProjectExpenseCategory, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: "Semi-Annual Reporting" }); //data vlaues period wise
          if(dataValuesAREC) dataElementOUValues[ou.id]['arec'] = dataValuesAREC;

          const dataValuesARFA = getProgramStagePeriodicity(filteredPrograms, program.arProjectFocusArea, programStage.arProjectFocusArea, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: "Semi-Annual Reporting" }); //data vlaues period wise
          if(dataValuesARFA) dataElementOUValues[ou.id]['arfa'] = dataValuesARFA;

          const dataValuesARAC = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: "Semi-Annual Reporting" }); //data vlaues period wise
          if(dataValuesARAC) dataElementOUValues[ou.id]['arac'] = dataValuesARAC;
    
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
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Total Expense Budget</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Total Actual Expense</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Variance (in USD)</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Budgeted vs Actual Expense (%)</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Total Actual by Focus Area</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Control: Total Actual Expense & Total Actual by Focus Area</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Budgeted Income</th>
   
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Actual Income</th>
    <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Variance (Actual Income minus Budgeted Income)</th>
     <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Deficit/Surplus (Actual Income minus Actual Expenditure)</th>
     <th style="background:#276696;color:white;text-align:center;border:1px solid black;">Actual Spend (%)</th>
    </tr>`

    $('#table-head').html(tableHead);

    var tableBody = '';
    level2OU.forEach(headOU => {
      tableBody += `<tr><td colspan="12" style="background:#50C878;color:white;text-align:center;">${headOU.name}</td></tr>`
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      headOU.children.forEach(ou => {
        const totalBudget = dataValues[ou.id] && dataValues[ou.id]['arec']['zGn5c7EZLr0'] ? (dataValues[ou.id]['arec']['zGn5c7EZLr0']) : '';
        const totalECActual = dataValues[ou.id] && dataValues[ou.id]['arec']['IUb9LMIYIyL'] ? (dataValues[ou.id]['arec']['IUb9LMIYIyL']) : '';
        var varianceEC = 0;
        if(totalBudget) varianceEC += Number(totalBudget);
        if(totalECActual) varianceEC -= Number(totalECActual);
        var variancePercent = (totalBudget && totalECActual/totalBudget!="Infinity" && totalECActual/totalBudget) ? (totalECActual/totalBudget*100): 0;
        const totalFAActual = dataValues[ou.id] && dataValues[ou.id]['arfa']['IUb9LMIYIyL'] ? (dataValues[ou.id]['arfa']['IUb9LMIYIyL']) : '';
        var varianceFA = 0;
        if(totalECActual) varianceFA += Number(totalECActual);
        if(totalFAActual) varianceFA -= Number(totalFAActual);
        var totalIncome = 0;
        var totalIncomeAR = 0;

        dataElements.projectTotalIncome.forEach(pti => {
          if (dataValues[ou.id]['arac'][pti.restricted]) {
            totalIncomeAR += Number(dataValues[ou.id]['arac'][pti.restricted]);
          }
          if (dataValues[ou.id]['arac'][pti.unrestricted]) {
            totalIncomeAR += Number(dataValues[ou.id]['arac'][pti.unrestricted]);
          }
        })

        var varianceECTIPercent = (totalECActual && totalECActual/totalIncomeAR!="Infinity" && totalECActual/totalIncomeAR) ? (totalECActual/totalIncomeAR*100): 0;

        dataElements.projectTotalIncome.forEach(pti => {
          if (dataValues[ou.id]['auti'][pti.category] && dataValues[ou.id]['auti'][pti.restricted]) {
            totalIncome += Number(dataValues[ou.id]['auti'][pti.restricted]);
          }
          if (dataValues[ou.id]['auti'][pti.category] && dataValues[ou.id]['auti'][pti.unrestricted]) {
            totalIncome += Number(dataValues[ou.id]['auti'][pti.unrestricted]);
          }
        })

        tableBody += `<tr>
        <td>${ou.name}</td>
        <td style="text-align:center;">${formatNumberInput(totalBudget)}</td>
        <td style="text-align:center;">${formatNumberInput(totalECActual)} </td>
        <td style="background:${colorCodeGrey(checkNumber(varianceEC))};text-align:center;">${formatNumberInput(checkNumber(varianceEC))} </td>
        <td style="background:${colorCodeGrey(variancePercent)};text-align:center;">${formatNumberInput(variancePercent)} </td>
        <td style="text-align:center;">${formatNumberInput(totalFAActual)} </td>
        <td style="background:${colorCodeGreen(checkNumber(varianceFA))};text-align:center;">${formatNumberInput(checkNumber(varianceFA))} </td>
        <td style="text-align:center;">${formatNumberInput(totalIncome)} </td>
        <td style="text-align:center;">${formatNumberInput(totalIncomeAR)} </td>
        <td style="background:${colorCodeGrey((totalIncomeAR - totalIncome))};text-align:center;">${formatNumberInput(totalIncomeAR - totalIncome)} </td>
        <td style="background:${colorCodeGrey((totalIncomeAR - totalECActual))};text-align:center;">${formatNumberInput(totalIncomeAR - totalECActual)} </td>
        <td style="background:${colorCodeRed((varianceECTIPercent))};text-align:center;">${formatNumberInput(varianceECTIPercent)} </td>
        </tr>`
      })
    })

    return tableBody;
  }


  configurePage();
});

function checkNumber(num) {

  if(num.toString().includes('e')) return 0;
  return num;

}
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

function colorCodeGrey(num) {
  if (Number(num) >= 0) return '#bbbbbb'
  else return 'red'
}

function colorCodeGreen(num) {
  if (Number(num) >= -10 && Number(num)  <= 10) return '#00ab41'
  else return 'red'
}

function colorCodeRed(num) {
  if (Number(num) > 100) return  'red'
  else return '#bbbbbb'
}
