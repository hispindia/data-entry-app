import { eventApi } from '../../api/DataApi.js';
import { getOrganisationUnits, getProgramStageEvents, getTEI } from '../../api/func.js';
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
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
    $('.loader-container').addClass('d-flex').removeClass('d-none');
    $('.myContainer').hide();
    fetchEvents()
  });

  configurePage();
  async function configurePage() {
    try {
     const user = await getUserConfig();
          
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
    $('#project-export').hide();
    $("#loader").html('<div class="h2 text-center">Loading api...</div>');

    tei.year.value = document.getElementById("year-update").value;
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
       enroll.program == program.auProjectFocusArea
            || enroll.program == program.auProjectExpenseCategory
            || enroll.program == program.auProjectBudget
            || enroll.program == program.auProjectDescription
            || enroll.program == program.auOrganisationDetails
            || enroll.program == program.reportFeedback
            || enroll.program == program.auIncomeDetails
            || enroll.program == program.auCommodities
          );
          
          let dataValuesPB = getProgramStageEvents(filteredPrograms, programStage.auProjectBudget, program.auProjectBudget,{id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesFA = getProgramStageEvents(filteredPrograms, programStage.auProjectFocusArea, program.auProjectFocusArea, {id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesRO = getProgramStageEvents(filteredPrograms, programStage.auROTRTFeedback, program.reportFeedback, {id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesOD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, {id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesPD = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, {id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, {id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesVC = getProgramStageEvents(filteredPrograms, programStage.auValueAddCoreFunding, program.auIncomeDetails, {id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesOC = getProgramStageEvents(filteredPrograms, programStage.auCommoditiesOrder, program.auCommodities, {id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesCS = getProgramStageEvents(filteredPrograms, programStage.auCommoditiesSource, program.auCommodities, {id: tei.year.id, value: tei.year.value}) //data values year wise
          

          dataValuesOU.push({
            orgUnit: ou.name,
            ouId: ou.id,
            attributes,
            dataValuesOD,
            dataValuesPD,
            dataValuesPB,
            dataValuesFA,
            dataValuesEC,
            dataValuesRO,
            dataValuesTI,
            dataValuesVC,
            dataValuesOC,
            dataValuesCS,
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
        id: 'HrHPzD3Talq',
        name: 'Primary point of contact for follow-up on business plan',
        style: ''
      },
      {
        id: 'MgoVYQLP3yT',
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
      item.dataValuesOD[year] = {
        year,
        ...item.dataValuesOD[year],
        ...item.attributes,
      }
      var region = '';
      level2OU.forEach(parent => parent.children.forEach(ou => {
        if (ou.name == item.orgUnit) region = parent.name
      }))
      tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;
      deList.forEach((de, index) => {
        if (index > 6) tableRow += `<td>${item.dataValuesOD[year] && item.dataValuesOD[year][de.id] ? formatNumberInput(item.dataValuesOD[year][de.id]) : ''}</td>`;
        else tableRow += `<td>${item.dataValuesOD[year] && item.dataValuesOD[year][de.id] ? item.dataValuesOD[year][de.id] : ''}</td>`;
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
        designation: 'Programmatic lead(s)',
        name: 'SmJKIYmyAVC',
        email:'GZAulWuoial',
        contact: 'dUnjPtPImoY'
      },
      {
        designation: 'Programmatic lead(s)',
        name: 'uYz5iheRYPO',
        email:'X82L6C9yiZB',
        contact: 'VXCYfrSNS8J'
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
        <td>${item.dataValuesOD[year] && item.dataValuesOD[year][de.name] ? item.dataValuesOD[year][de.name] : ''}</td>
        <td>${item.dataValuesOD[year] && item.dataValuesOD[year][de.email] ? item.dataValuesOD[year][de.email] : ''}</td>
        <td>${item.dataValuesOD[year] && item.dataValuesOD[year][de.contact] ? item.dataValuesOD[year][de.contact] : ''}</td>
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
        name: 'Budget by "Project Focus Area" (Year 1)'
      },
      {
        id: '',
        name: 'Budget by "Project Focus Area" (Year 2)'
      },
      {
        id: '',
        name: 'Budget by "Project Focus Area" (Year 3)'
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
            var values = {
      name: item.dataValuesPD[year][dataElements.projectDescription[index]['name']],
      area: '',
      pillar: '',
            };
      // for(let year = tei.year.start; year<=tei.year.end; year++) {
        if (item.dataValuesFA[year] && item.dataValuesFA[year][fa]) {
          const val = JSON.parse(item.dataValuesFA[year][fa]);
          if(!values.area) values.area = val.area;
          if(!values.pillar) values.pillar = val.pillar;
          values[year] = displayValue(val.budget);
        } else values[year] = '';
      // }
            if(values.area) {
      tableRow += `${rows}<td>${values.name}</td><td>${values.area}</td><td>${values.pillar}</td>`;
      // for(let year = tei.year.start; year<=tei.year.end; year++){
        tableRow += `<td></td><td></td><td>${formatNumberInput(values[year])}</td>`;
      // } 
      tableRow += '</tr>';
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
        name: 'Budget by "Expense Category" (Year 1)'
      },
      {
        id: '',
        name: 'Budget by "Expense Category" (Year 2)'
      },
      {
        id: '',
        name: 'Budget by "Expense Category" (Year 3)'
      },
    ]
    var tableHead = `<tr><td style="font-weight:bold">Entity Code</td><td style="font-weight:bold">Year</td>`;
    deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
    tableHead += '</tr>';

    var tableRow = "";
    dataValuesOU.forEach(item => {
    
      var rows = `<tr><td>${item.attributes['Lv8wUjXV8fl'] ? item.attributes['Lv8wUjXV8fl']: ''}</td><td>${year}</td>`;

      dataElements.projectExpenseCategory.forEach((pec, index) => {
        if(item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
          let personnel = `<td>${item.dataValuesPD[year][dataElements.projectDescription[index]['name']]}</td><td>Personnel</td><td></td><td></td>`;
          let activities = `<td>${item.dataValuesPD[year][dataElements.projectDescription[index]['name']]}</td><td>Direct project activities</td><td></td><td></td>`;
          let commodities = `<td>${item.dataValuesPD[year][dataElements.projectDescription[index]['name']]}</td><td>Commodities</td><td></td><td></td>`;
          let cost = `<td>${item.dataValuesPD[year][dataElements.projectDescription[index]['name']]}</td><td>Indirect/Suppost costs</td><td></td><td></td>`;

          // for(let year = tei.year.start; year <= tei.year.end; year++) {
            personnel += `<td>${(item.dataValuesEC[year] && item.dataValuesEC[year][pec.personnel]) ? formatNumberInput(displayValue(item.dataValuesEC[year][pec.personnel])): ''}</td>`;
            activities += `<td>${(item.dataValuesEC[year] && item.dataValuesEC[year][pec.activities]) ? formatNumberInput(displayValue(item.dataValuesEC[year][pec.activities])): ''}</td>`;
            commodities += `<td>${(item.dataValuesEC[year] && item.dataValuesEC[year][pec.commodities]) ? formatNumberInput(displayValue(item.dataValuesEC[year][pec.commodities])): ''}</td>`;
            cost += `<td>${(item.dataValuesEC[year] && item.dataValuesEC[year][pec.cost]) ? formatNumberInput(displayValue(item.dataValuesEC[year][pec.cost])): ''}</td>`
          // }
          tableRow += `${rows}${personnel}</tr>`
          tableRow += `${rows}${activities}</tr>`
          tableRow += `${rows}${commodities}</tr>`
          tableRow += `${rows}${cost}</tr>`
        }      
      })
    })

    return {
      tableHead,
      tableRow
    }
  }

  function getTotalIncome(dataValuesOU, level2OU){
    const year = document.getElementById("year-update").value;
    const deList = [
      {
        id: '',
        name: 'Income Category'
      },
      {
        id: '',
        name: 'Income (Year 1)'
      },
      {
        id: '',
        name: 'Income (Year 2)'
      },
      {
        id: '',
        name: 'Income (Year 3)'
      }
    ]

  var tableHead = `<tr><td style="font-weight:bold">Entity Code</td><td style="font-weight:bold">Year</td>`;
  deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
  tableHead += '</tr>';

  
  var tableRow = ''
  dataValuesOU.forEach(item => {
    var rows = `<tr><td>${item.attributes['Lv8wUjXV8fl'] ? item.attributes['Lv8wUjXV8fl']: ''}</td><td>${year}</td>`;
    var values = {};
    dataElements.projectTotalIncome.forEach(pti => {
        if(item.dataValuesTI[year] && item.dataValuesTI[year][pti.category]) {
          if(!values[item.dataValuesTI[year][pti.category]]) values[item.dataValuesTI[year][pti.category]] = 0;
          if(item.dataValuesTI[year][pti.restricted]) values[item.dataValuesTI[year][pti.category]] += Number(item.dataValuesTI[year][pti.restricted]);
          if(item.dataValuesTI[year][pti.unrestricted]) values[item.dataValuesTI[year][pti.category]] += Number(item.dataValuesTI[year][pti.unrestricted]);
        }
    })

    tableRow += `${rows}<td>IPPF Income</td><td></td><td></td><td>${values['IPPF income']? formatNumberInput(displayValue(values['IPPF income'])): ''}</td></tr>`;
    tableRow += `${rows}<td>International Income (Non-IPPF)</td><td></td><td></td><td>${values['International income (Non - IPPF)']? formatNumberInput(displayValue(values['International income (Non - IPPF)'])): ''}</td></tr>`;
    tableRow += `${rows}<td>Locally generated income</td><td></td><td></td><td>${values['Locally generated income']? formatNumberInput(displayValue(values['Locally generated income'])): ''}</td></tr>`;
    })
  return {
    tableHead,
    tableRow
  }
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