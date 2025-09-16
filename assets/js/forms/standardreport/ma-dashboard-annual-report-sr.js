import { eventApi } from '../../api/DataApi.js';
import { getOrganisationUnits, getProgramStageEvents, getProgramStagePeriodicity } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { formatNumberInput, getYears } from '../func.js';

var regionMA = {};
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
    .getElementById("reporting-periodicity")
    .addEventListener("change", function () {
      $('.loader-container').addClass('d-flex').removeClass('d-none');
      $('.myContainer').hide();
      fetchEvents();
    });

  document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      $('.loader-container').addClass('d-flex').removeClass('d-none');
      $('.myContainer').hide();
      fetchEvents()
    });

  async function fetchOrganizationUnitUid() {
    try {
     const user = await getUserConfig();
      tei.disabled = user.disabled;
          
      if (user.organisationUnits?.length) {
        tei.orgUnit = user.organisationUnits[0].id;
      }
      ['aoc-users', 'trt-users'].forEach(page => {
        if(user.hideReporting.includes(page.split('-')[0])) $(`.${page}`).hide();
      })
      if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
        $('.aoc-users').show();
      }
      if(window.localStorage.getItem("hideReporting").includes('core')) {
        $('.core-users').show();
      }
      if(window.localStorage.getItem("hideReporting").includes('ma')) {
        $('.ma-users').show();
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
    $("#project-export").hide();
    $("#loader").html('<div class="h2 text-center">Loading api...</div>');

    tei.year.value = document.getElementById("year-update").value;
    tei.periodicity.value = document.getElementById("reporting-periodicity").value;

    var dataValuesOU = [];
    for (let headOU of level2OU) {
      regionMA[headOU] = {
        totalBudget: 0
      }
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      for (let ou of headOU.children) {
        $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);

        const event = await eventApi.get(ou.id);

        var attributes = {};
        if (event.trackedEntityInstances.length && event.trackedEntityInstances[0].attributes) {
          event.trackedEntityInstances[0].attributes.forEach(attr => attributes[attr.attribute] = attr.value);
        }

        if (event.trackedEntityInstances.length) {
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) =>
            enroll.program == program.arOrganisationDetails
            || enroll.program == program.auProjectDescription
            || enroll.program == program.arProjectFocusArea
            || enroll.program == program.arProjectExpenseCategory
            || enroll.program == program.arTotalIncome
          );
          let dataValuesOD = getProgramStagePeriodicity(filteredPrograms, program.arOrganisationDetails, programStage.arMembershipDetails, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value });//data values year wise
          let dataValuesPD = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, { id: tei.year.id, value: tei.year.value }) //data values year wise
          let dataValuesFA = getProgramStagePeriodicity(filteredPrograms, program.arProjectFocusArea, programStage.arProjectFocusArea, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value });//data values year wise
          let dataValuesEC = getProgramStagePeriodicity(filteredPrograms, program.arProjectExpenseCategory, programStage.arProjectExpenseCategory, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value }); //data values year wise
          let dataValuesTI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value });//data values year wise
          
          dataValuesOU.push({
            orgUnit: ou.name,
            ouId: ou.id,
            attributes,
            dataValuesOD,
            dataValuesPD,
            dataValuesFA,
            dataValuesEC,
            dataValuesTI,
          })
        }
      }
    }

    populateProgramEvents(level2OU, dataValuesOU);

  }

  // Function to populate program events data
  function populateProgramEvents(level2OU, dataValuesOU) {
    // const list = getPillarBudgetFA(dataValuesOU, level2OU);

    const listMembership = getMembershipDetails(dataValuesOU, level2OU);
    document.getElementById('th-project-membership').innerHTML = listMembership.tableHead;
    document.getElementById('tb-project-membership').innerHTML = listMembership.tableRow;

    const listInstitutional = getInstituationalData(dataValuesOU, level2OU);
    document.getElementById('th-project-institutional').innerHTML = listInstitutional.tableHead;
    document.getElementById('tb-project-institutional').innerHTML = listInstitutional.tableRow;

    const listFA = getFocusArea(dataValuesOU, level2OU);
    document.getElementById('th-project-focusarea').innerHTML = listFA.tableHead;
    document.getElementById('tb-project-focusarea').innerHTML = listFA.tableRow;

    const listEB = getExpenseBudget(dataValuesOU, level2OU);
    document.getElementById('th-project-expBudget').innerHTML = listEB.tableHead;
    document.getElementById('tb-project-expBudget').innerHTML = listEB.tableRow;

    const listTI = getTotalIncome(dataValuesOU, level2OU);
    document.getElementById('th-project-totalIncome').innerHTML = listTI.tableHead;
    document.getElementById('tb-project-totalIncome').innerHTML = listTI.tableRow;

    $("#loader").empty();
    $("#project-export").show();

    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();
    // Localize content
    $('body').localize();
  }

  function getMembershipDetails(dataValuesOU, level2OU) {

    var tableRow = "";
    const deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
        style: ''
      },
      {
        id: 'Lv8wUjXV8fl',
        name: 'Entity Code',
        style: ''
      },
      {
        id: 'year',
        name: 'Year'
      },
      {
        id: 'H7u3oJh2ifa',
        name: 'Organisation Name (English)',
        style: ''
      },
      {
        id: 'RUJcqfBvOSh',
        name: 'Organisation name',
        style: ''
      },
      {
        id: 'rTDJjf4crQ8',
        name: 'Primary point of contact for follow-up on business plan',
        style: ''
      },
      {
        id: 'I27jsFBwUnt',
        name: 'Contact Email',
        style: ''
      },
      {
        id: 'fkHkH5jcJV0',
        name: 'Formula-generated proposed grant amount (Year 1) (USD)'
      },
      {
        id: 'dhaMzFTSGrd',
        name: 'PROVISIONAL formula- generated grant amount (Year 2) (USD)'
      },
      {
        id: 'gQQoxkZsZnn',
        name: 'PROVISIONAL formula- generated grant amount (Year 3) (USD)'
      },
    ]
    var tableHead = '<tr><td style="font-weight:bold">Region</td><td style="font-weight:bold">Affiliate Name</td>';
    deList.forEach(de => tableHead += `<td style="font-weight:bold">${de.name}</td>`)
    tableHead += '</tr>';

    const year = document.getElementById("year-update").value;

    dataValuesOU.forEach(item => {
      item.dataValuesOD = {
        year,
        ...item.dataValuesOD,
        ...item.attributes,
      }
      var region = '';
      level2OU.forEach(parent => parent.children.forEach(ou => {
        if (ou.name == item.orgUnit) region = parent.name
      }))
      tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;
      deList.forEach((de, index) => {
        if (index > 6) tableRow += `<td>${ item.dataValuesOD[de.id] ? formatNumberInput(item.dataValuesOD[de.id]) : ''}</td>`;
        else tableRow += `<td>${ item.dataValuesOD[de.id] ? item.dataValuesOD[de.id] : ''}</td>`;
      })
      tableRow += '</tr>';
      })
    return {
      tableHead,
      tableRow
    }

  }

  function getInstituationalData(dataValuesOU, level2OU) {

    var tableRow = "";
    const deList = [
      {
        designation: 'Executive Director / CEO (or equivalent)',
        name: 'Ctp6kmhwq86',
        email:'yGutLB1Spaa',
        contact: 'woWgpD819lF'
      },
      {
        designation: 'Board chair / President',
        name: 'IuyGw22tqYj',
        email:'YTtJK3jqsnq',
        contact: 'CFF42nxFPgB'
      },
      {
        designation: 'Officer of the board #1 (e.g., vice president, secretary, treasurer)',
        name: 'BycCbaxB1Pu',
        email:'tt9p7BLGhT0',
        contact: 'Mzn08vVVZVt'
      },
      {
        designation: 'Officer of the board #2 (e.g., vice president, secretary, treasurer)',
        name: 'MeCYmsrREyS',
        email:'qShxfRboswE',
        contact: 'XmDKyaE5SbW'
      },
      {
        designation: 'Officer of the board #3 (e.g., vice president, secretary, treasurer)',
        name: 'QgqjdnD1a24',
        email:'QoFEoEFiPZd',
        contact: 'H2t9gnU6JKb'
      },
      {
        designation: 'Youth board member',
        name: 'aA5UkYBNvbl',
        email:'k86jH9sSXSq',
        contact: 'oYpc136YNgW'
      },
      {
        designation: 'Programmatic lead(s)',
        name: 'HFyJ2WGQEda',
        email:'qColDnIqDjT',
        contact: 'vFhnYZHTxfr'
      },
      {
        designation: 'Programmatic lead(s)',
        name: 't9LCankavyt',
        email:'sJpc63Pkpip',
        contact: 'SDC9mqvdjhQ'
      },
      {
        designation: 'Finance lead',
        name: 'ptHCVnzUXQl',
        email:'lea8lybuFI9',
        contact: 'PZswZ4XFTku'
      },
    ]
    var tableHead = '<tr><td style="font-weight:bold">Entity Code</td><td style="font-weight:bold">Year</td><td style="font-weight:bold">Role</td><td style="font-weight:bold">Name</td><td style="font-weight:bold">Contact Email</td><td style="font-weight:bold">Contact Phone</td>';
    tableHead += '</tr>';

    const year = document.getElementById("year-update").value;

    dataValuesOU.forEach(item => {
      deList.forEach((de) => {
        tableRow += `<tr>
        <td>${item.attributes['Lv8wUjXV8fl'] ? item.attributes['Lv8wUjXV8fl']: ''}</td>
        <td>${year}</td>
        <td>${de.designation}</td>
        <td>${ item.dataValuesOD[de.name] ? item.dataValuesOD[de.name] : ''}</td>
        <td>${ item.dataValuesOD[de.email] ? item.dataValuesOD[de.email] : ''}</td>
        <td>${ item.dataValuesOD[de.contact] ? item.dataValuesOD[de.contact] : ''}</td>
        </tr>`;
      })
      })
    return {
      tableHead,
      tableRow
    }

  }

  function getFocusArea(dataValuesOU, level2OU) {

    var tableRow = "";
    const deList = [
      {
        id: '',
        name: 'Project Name'
      },
      {
        id: '',
        name: 'Project Focus Areas'
      },
      {
        id: '',
        name: 'Associated Strategic Pillar'
      },
      {
        id: '',
        name: 'Budget by "Project Focus Area"'
      },
      {
        id: '',
        name: 'Actual Expense by "Project Focus Area"'
      },
    ]
    var tableHead = '<tr><td style="font-weight:bold">Entity Code</td><td style="font-weight:bold">Year</td>';
    deList.forEach(de => tableHead += `<td style="font-weight:bold">${de.name}</td>`)
    tableHead += '</tr>';

    const year = document.getElementById("year-update").value;

    dataValuesOU.forEach(item => {
      var rows = `<tr><td>${item.attributes['Lv8wUjXV8fl'] ? item.attributes['Lv8wUjXV8fl']: ''}</td><td>${year}</td>`;
      
        dataElements.projectFocusAreaNew.forEach((pfa, index) => {
        if(item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
          pfa.focusAreas.forEach(fa => {
            const projectName = item.dataValuesPD[year][dataElements.projectDescription[index]['name']];
            if (item.dataValuesFA[fa]) {
              const val = JSON.parse(item.dataValuesFA[fa]);
              tableRow += `${rows}
              <td>${projectName}</td>
              <td>${val.area}</td>
              <td>${val.pillar}</td>
              <td>${val.assignedBudget ? formatNumberInput(displayValue(val.assignedBudget)) : ''}</td>
              <td>${val.expense ? formatNumberInput(displayValue(val.expense)) : ''}</td>
              </tr>`;
            }
          })
        }
        })
      })
    return {
      tableHead,
      tableRow
    }

  }

  function getExpenseBudget(dataValuesOU, level2OU) {

    const year = document.getElementById("year-update").value;
    const deList = [
      {
        id: '',
        name: 'Project Name'
      },
      {
        id: '',
        name: 'Expense Category'
      },
      {
        id: '',
        name: 'Budget by "Expense Category"'
      },
      {
        id: '',
        name: 'Actual by "Expense Category"'
      },
    ]
    var tableHead = `<tr><td style="font-weight:bold">Entity Code</td><td style="font-weight:bold">Year</td>`;
    deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
    tableHead += '</tr>';

    var tableRow = "";
    dataValuesOU.forEach(item => {
    
      var rows = `<td>${item.attributes['Lv8wUjXV8fl'] ? item.attributes['Lv8wUjXV8fl']: ''}</td><td>${year}</td>`;

      dataElements.arProjectExpenseCategory.forEach((pec, index) => {
        if(item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
          tableRow += `
          <tr>
          ${rows}
          <td>${item.dataValuesPD[year][dataElements.projectDescription[index]['name']]}</td>
          <td>Personnel</td>
          <td>${(item.dataValuesEC[pec.budgetExpense.personnel]) ? formatNumberInput(displayValue(item.dataValuesEC[pec.budgetExpense.personnel])): ''}</td>
          <td>${(item.dataValuesEC[pec.actualExpense.personnel]) ? formatNumberInput(displayValue(item.dataValuesEC[pec.actualExpense.personnel])): ''}</td>
          </tr>
          
          <tr>
          ${rows}
          <td>${item.dataValuesPD[year][dataElements.projectDescription[index]['name']]}</td>
          <td>Direct project activities</td>
          <td>${(item.dataValuesEC[pec.budgetExpense.activities]) ? formatNumberInput(displayValue(item.dataValuesEC[pec.budgetExpense.activities])): ''}</td>
          <td>${(item.dataValuesEC[pec.actualExpense.activities]) ? formatNumberInput(displayValue(item.dataValuesEC[pec.actualExpense.activities])): ''}</td>
          </tr>
          
          <tr>
          ${rows}
          <td>${item.dataValuesPD[year][dataElements.projectDescription[index]['name']]}</td>
          <td>Commodities</td>
          <td>${(item.dataValuesEC[pec.budgetExpense.commodities]) ? formatNumberInput(displayValue(item.dataValuesEC[pec.budgetExpense.commodities])): ''}</td>
          <td>${(item.dataValuesEC[pec.actualExpense.commodities]) ? formatNumberInput(displayValue(item.dataValuesEC[pec.actualExpense.commodities])): ''}</td>
          </tr>

          <tr>
          ${rows}
          <td>${item.dataValuesPD[year][dataElements.projectDescription[index]['name']]}</td>
          <td>Indirect/Suppost costs</td>
          <td>${(item.dataValuesEC[pec.budgetExpense.cost]) ? formatNumberInput(displayValue(item.dataValuesEC[pec.budgetExpense.cost])): ''}</td>
          <td>${(item.dataValuesEC[pec.actualExpense.cost]) ? formatNumberInput(displayValue(item.dataValuesEC[pec.actualExpense.cost])): ''}</td>
          </tr>`;
        }      
      })
    })

    return {
      tableHead,
      tableRow
    }
  }

  function getTotalIncome(dataValuesOU){
    const year = document.getElementById("year-update").value;
    const deList = [
      {
        id: '',
        name: 'IPPF Income'
      },
      {
        id: '',
        name: 'International Income (Non-IPPF)'
      },
      {
        id: '',
        name: 'Locally generated income'
      },
    ]

  var tableHead = `<tr><td style="font-weight:bold">Entity Code</td><td style="font-weight:bold">Year</td>`;
  deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
  tableHead += '</tr>';

  
  var tableRow = ''
  dataValuesOU.forEach(item => {
    tableRow += `<tr>
    <td>${item.attributes['Lv8wUjXV8fl'] ? item.attributes['Lv8wUjXV8fl']: ''}</td>
    <td>${year}</td>
    <td>${item.dataValuesTI['Pv0OAEwAKEZ'] ? formatNumberInput(displayValue(item.dataValuesTI['Pv0OAEwAKEZ'])) : ''}</td>
    <td>${item.dataValuesTI['S7GzQ3bTbcR'] ? formatNumberInput(displayValue(item.dataValuesTI['S7GzQ3bTbcR'])) : ''}</td>
    <td>${item.dataValuesTI['ryuoJGQuONu'] ? formatNumberInput(displayValue(item.dataValuesTI['ryuoJGQuONu'])) : ''}</td>
    </tr>`;

    // <td>${item.dataValuesTI['P68FHRMdG9d'] ? formatNumberInput(displayValue(item.dataValuesTI['P68FHRMdG9d'])) : ''}</td>
    // <td>${item.dataValuesTI['WaFqR9c9Y3j'] ? formatNumberInput(displayValue(item.dataValuesTI['WaFqR9c9Y3j'])) : ''}</td>
    // <td>${item.dataValuesTI['W6BMVucXM9b'] ? formatNumberInput(displayValue(item.dataValuesTI['W6BMVucXM9b'])) : ''}</td>
    // <td>${item.dataValuesTI['CFferc5TITH'] ? formatNumberInput(displayValue(item.dataValuesTI['CFferc5TITH'])) : ''}</td>
    // <td>${item.dataValuesTI['LZZotPegSSS'] ? formatNumberInput(displayValue(item.dataValuesTI['LZZotPegSSS'])) : ''}</td>
    // <td>${item.dataValuesTI['WqPkBREXZF4'] ? formatNumberInput(displayValue(item.dataValuesTI['WqPkBREXZF4'])) : ''}</td>
    
    
  })
  return {
    tableHead,
    tableRow
  }
  }
  
  fetchOrganizationUnitUid();
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
    console.log(num)
    return num.toString();
  } else {
    return num.toFixed(2);
  }
}

function colorCode(num) {
  if (Number(num) == 0) return ''
  else return 'red'
}



    //textarea word limit
    function checkWords(event, id) {
      const counter = document.getElementById('counter-' + (id));
      const { value } = event;
      const words = value.trim().split(/\s+/)

      if (words.length >= maxWords) {
        event.value = words.slice(0, maxWords).join(' ');
        return
      }
      if (value) counter.textContent = `${(maxWords - words.length)} words remaining`;
      else counter.textContent = `${maxWords} words remaining`;
    }