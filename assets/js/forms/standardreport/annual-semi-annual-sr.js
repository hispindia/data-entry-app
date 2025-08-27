import { getEvents, getProgramStagePeriodicity, getTEI } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { formatNumberInput, getYears } from '../func.js';

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
      fetchEvents();
    });

    
  document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      fetchEvents(ev.target.value)
    });
    
        async function configurePage() {
          const user = await getUserConfig();
          tei.disabled = user.disabled;
      
          if (user.organisationUnits?.length) {
            tei.orgUnit = user.organisationUnits[0].id;
            if (user.organisationUnits[0].parent) {
              document.getElementById("headerOrgId").value = user.organisationUnits[0].parent.name;
            }
            document.getElementById("facility").innerHTML = user.organisationUnits[0].name;
            document.getElementById("headerOrgName").value = user.organisationUnits[0].name;
            document.getElementById("headerOrgCode").value = user.organisationUnits[0].code;
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
          document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${tei.year.selectReporting==year? 'selected': ''}>${year}</option>`).join('');
          if(user.annualYear) document.getElementById('year-update').value = user.annualYear;
      
          tei.program = program.arOrganisationDetails;
          tei.programStage = programStage.arMembershipDetails;
      
          fetchEvents();    
        }
    

  async function fetchEvents() {

    tei.year.value = document.getElementById("year-update").value;
    tei.periodicity.value = document.getElementById("reporting-periodicity").value;

    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == program.auProjectDescription
            || enroll.program == program.arOrganisationDetails
            || enroll.program == program.arProjectFocusArea
            || enroll.program == program.arProjectExpenseCategory
            || enroll.program == program.arTotalIncome
        );

      var attributes = {};
      if (data.trackedEntityInstances.length && data.trackedEntityInstances[0].attributes) {
        data.trackedEntityInstances[0].attributes.forEach(attr => attributes[attr.attribute] = attr.value);
      }

      var dataValuesPFA = {}, dataValuesEC = {}, dataValuesNP = {}, dataValuesOD = {}, dataValuesPD = {}, dataValuesAI = {};
      dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, { id: tei.year.id, value: tei.year.value },);
      dataValuesOD = getProgramStagePeriodicity(filteredPrograms, program.arOrganisationDetails, programStage.arMembershipDetails, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value });
      dataValuesNP = getProgramStagePeriodicity(filteredPrograms, program.arOrganisationDetails, programStage.arNarrativePlan, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value });
      dataValuesPFA = getProgramStagePeriodicity(filteredPrograms, program.arProjectFocusArea, programStage.arProjectFocusArea, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value });
      dataValuesEC = getProgramStagePeriodicity(filteredPrograms, program.arProjectExpenseCategory, programStage.arProjectExpenseCategory, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value });
      dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value });

      populateProgramEvents({
        attributes: attributes,
        organisationDetails: dataValuesOD,
        narrativePlan: dataValuesNP,
        projectDescription: dataValuesPD[tei.year.value] ? dataValuesPD[tei.year.value] : [],
        projectFocusAreas: dataValuesPFA,
        projectExpenseCategory: dataValuesEC,
        projectTotalIncome: dataValuesAI

      });
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dv) {

    const projectNames = checkProjects(dataElements.projectDescription, dv.projectDescription);

    var tableHead = '';
    tableHead = `<tr><th colspan="4" style="font-weight:bold;text-align:center;background:#eef0ff">1. Organization Details</th></tr>`;
    document.getElementById('th-project-organisationDetails').innerHTML = tableHead;

    tableHead = '';
    tableHead = `<tr><th colspan="2" style="font-weight:bold;text-align:center;background:#eef0ff">2. Narrative Report</th></tr><tr></tr><th>Narrative Plan</th><th>Description</th></tr>`;
    document.getElementById('th-project-narrativePlan').innerHTML = tableHead;


    tableHead = '';
    tableHead = `<tr><th colspan="3" style="font-weight:bold;text-align:center;background:#eef0ff">5. Actual Income</th></tr>`;
    document.getElementById('th-project-totalIncome').innerHTML = tableHead;

    var tableRows = '';
    tableRows = getOrganisationDetails(dv.attributes, dv.organisationDetails);
    document.getElementById('tb-project-organisationDetails').innerHTML = tableRows;

    tableRows = getNarrativeReport(dv.narrativePlan);
    document.getElementById('tb-project-narrativePlan').innerHTML = tableRows;

    tableRows = getTotalIncome(dv.projectTotalIncome, dataElements.projectTotalIncome);
    document.getElementById('tb-project-totalIncome').innerHTML = tableRows;

    if (!projectNames.length) {
      alert('No Project Exist!');
    } else {
      tableHead = `<tr><th colspan="7" style="font-weight:bold;text-align:center;background:#eef0ff">3. Budget vs Actuals by Focus Area</th></tr><tr><th>Project Name</th><th>Focus Areas</th><th>Pillar</th><th>Budget</th><th>Expenses</th><th>Variances</th><th>Remarks</th></tr>`
      document.getElementById('th-project-focusArea').innerHTML = tableHead;

      tableHead = `<tr><th colspan="6" style="font-weight:bold;text-align:center;background:#eef0ff">4. Budget vs Actuals by Expense Category</th></tr><tr><th>Project Name</th><th>Expense Category</th><th>Budgeted Expenses</th><th>Actual Expenses</th><th>Variance</th><th>Remarks</th></tr>`
      document.getElementById('th-project-expenseCategory').innerHTML = tableHead;


      tableRows = getProjectFocusAreas(projectNames, dv.projectFocusAreas, dataElements.projectFocusAreaNew);
      document.getElementById('project-focusArea').innerHTML = tableRows;

      tableRows = getProjectExpenseCategory(projectNames, dv.projectExpenseCategory, dataElements.arProjectExpenseCategory);
      document.getElementById('project-expenseCategory').innerHTML = tableRows;
    }

    // Localize content
    $('body').localize();

  }
  configurePage();
});

function getOrganisationDetails(attr, dv) {
  var dataValues = {};
  if (attr) dataValues = { ...attr };
  if (dv) dataValues = { ...dataValues, ...dv }
  return `
  <tr><td colspan="4" style="font-weight:bold;text-align:center">Membership Details</td></tr>
  <tr><td>Country of Operation</td><td colspan="3">${dataValues['OgPuoRimaat'] ? dataValues['OgPuoRimaat'] : ''}</td></tr>
  <tr><td>Organisation Code</td><td colspan="3">${dataValues['Lv8wUjXV8fl'] ? dataValues['Lv8wUjXV8fl'] : ''}</td></tr>
  <tr><td>IPPF Region</td><td colspan="3">${dataValues['Nu5FHDVne91'] ? dataValues['Nu5FHDVne91'] : ''}</td></tr>
  <tr><td>Organisation Name(English)</td><td colspan="3">${dataValues['H7u3oJh2ifa'] ? dataValues['H7u3oJh2ifa'] : ''}</td></tr>
  <tr><td>Organisation name (original language)</td><td colspan="3">${dataValues['RUJcqfBvOSh'] ? dataValues['RUJcqfBvOSh'] : ''}</td></tr>
  <tr><td>Primary point of contact for follow-up on business plan</td><td colspan="3">${dataValues['rTDJjf4crQ8'] ? dataValues['rTDJjf4crQ8'] : ''}</td></tr>
  <tr><td>Contact Email</td><td colspan="3">${dataValues['I27jsFBwUnt'] ? dataValues['I27jsFBwUnt'] : ''}</td></tr>
  <tr><td colspan="4" style="font-weight:bold;text-align:center">Institutional Data</td></tr>
  <tr><td>Address</td><td colspan="3">${dataValues['eS8HHmy5krN'] ? dataValues['eS8HHmy5krN'] : ''}</td></tr>
  <tr><td colspan="4" style="font-weight:bold;text-align:center">Key Contacts</td></tr>
  <tr><td>Role</td><td>Name</td><td>Contact Email</td><td>Contact Phone</td></tr>
  <tr><td>Executive Director / CEO (or equivalent)</td><td>${dataValues['Ctp6kmhwq86'] ? dataValues['Ctp6kmhwq86'] : ''}</td><td>${dataValues['yGutLB1Spaa'] ? dataValues['yGutLB1Spaa'] : ''}</td><td>${dataValues['woWgpD819lF'] ? dataValues['woWgpD819lF'] : ''}</td></tr>
  <tr><td>Board chair / President</td><td>${dataValues['IuyGw22tqYj'] ? dataValues['IuyGw22tqYj'] : ''}</td><td>${dataValues['YTtJK3jqsnq'] ? dataValues['YTtJK3jqsnq'] : ''}</td><td>${dataValues['CFF42nxFPgB'] ? dataValues['CFF42nxFPgB'] : ''}</td></tr>
  <tr><td>Officer of the board #1 (e.g., vice president, secretary, treasurer)</td><td>${dataValues['BycCbaxB1Pu'] ? dataValues['BycCbaxB1Pu'] : ''}</td><td>${dataValues['tt9p7BLGhT0'] ? dataValues['tt9p7BLGhT0'] : ''}</td><td>${dataValues['Mzn08vVVZVt'] ? dataValues['Mzn08vVVZVt'] : ''}</td></tr>
  <tr><td>Officer of the board #2 (e.g., vice president, secretary, treasurer)</td><td>${dataValues['MeCYmsrREyS'] ? dataValues['MeCYmsrREyS'] : ''}</td><td>${dataValues['qShxfRboswE'] ? dataValues['qShxfRboswE'] : ''}</td><td>${dataValues['XmDKyaE5SbW'] ? dataValues['XmDKyaE5SbW'] : ''}</td></tr>
  <tr><td>Officer of the board #3 (e.g., vice president, secretary, treasurer)</td><td>${dataValues['QgqjdnD1a24'] ? dataValues['QgqjdnD1a24'] : ''}</td><td>${dataValues['QoFEoEFiPZd'] ? dataValues['QoFEoEFiPZd'] : ''}</td><td>${dataValues['H2t9gnU6JKb'] ? dataValues['H2t9gnU6JKb'] : ''}</td></tr>
  <tr><td>Youth board member</td><td>${dataValues['aA5UkYBNvbl'] ? dataValues['aA5UkYBNvbl'] : ''}</td><td>${dataValues['k86jH9sSXSq'] ? dataValues['k86jH9sSXSq'] : ''}</td><td>${dataValues['oYpc136YNgW'] ? dataValues['oYpc136YNgW'] : ''}</td></tr>
  <tr><td>Programmatic lead(s)</td><td>${dataValues['HFyJ2WGQEda'] ? dataValues['HFyJ2WGQEda'] : ''}</td><td>${dataValues['qColDnIqDjT'] ? dataValues['qColDnIqDjT'] : ''}</td><td>${dataValues['vFhnYZHTxfr'] ? dataValues['vFhnYZHTxfr'] : ''}</td></tr>
  <tr><td>Programmatic lead(s)</td><td>${dataValues['t9LCankavyt'] ? dataValues['t9LCankavyt'] : ''}</td><td>${dataValues['sJpc63Pkpip'] ? dataValues['sJpc63Pkpip'] : ''}</td><td>${dataValues['SDC9mqvdjhQ'] ? dataValues['SDC9mqvdjhQ'] : ''}</td></tr>
  <tr><td>Finance lead</td><td>${dataValues['ptHCVnzUXQl'] ? dataValues['ptHCVnzUXQl'] : ''}</td><td>${dataValues['lea8lybuFI9'] ? dataValues['lea8lybuFI9'] : ''}</td><td>${dataValues['PZswZ4XFTku'] ? dataValues['PZswZ4XFTku'] : ''}</td></tr>
  <tr><td>Current board term: Start year</td><td colspan="3">${dataValues['nME0H9rEBz4'] ? dataValues['nME0H9rEBz4'] : ''}</td></tr>
  <tr><td>Current board term: End year</td><td colspan="3">${dataValues['leqtpPX6o97'] ? dataValues['leqtpPX6o97'] : ''}</td></tr>`
}

function getNarrativeReport(dv) {
  const dataElements = [{
    id: "PwmY3gSO3eU",
    name: `1. Context Events
    Please describe any major events that shaped your context. Please consider SRHR and political context/legal changes, oppostion in your country.`
  },
  {
    id: "",
    list: [{
      id: 'ARmoeFIxgJU',
      name: 'Center Care on People:',
    }, {
      id: 'Tax5dmOdgPG',
      name: 'Move the Sexuality Agenda'
    }, {
      id: 'LVqj1FFpyKk',
      name: "Solidarity for Change"
    }, {
      id: 'ffBVoh6JZgc',
      name: "Nurture our Federation:"
    }],
    name: `2. Results & Achievements
    Please describe your main achievements/results (by strategic pillar) in the reporting period. Please indicate whether and how these are different to your expectations/assumptions. Pleae emphasise your work with youth and marginalised populations.`
  }, {
    id: "W0mTxYf8Bmz",
    name: `3. Challenges
    Please describe the main challenges you faced in the reporting period. `
  }, {
    id: "tK2jLF0CJOY",
    name: `4. Most effective strategies / approaches
    Please describe the strategies or approaches that helped you achieve your biggest successes. Do you have examples of good practice or important learnings that you would like to share?`
  }, {
    id: "dCgCuUsIJUi",
    name: `5. Organisational update
    Briefly highlight any major changes related to your organization: structure,  governance (board) , staff or internal procedures and policies such as Safeguarding, gender equality.`
  }, {
    id: "GEgUf6cksOr",
    name: `6. Learning
    Please share your main learnings in the reporting period`
  }];

  var tableRows = '';
  dataElements.forEach(de => {
    if (!de.id) {
      tableRows += `<tr><td>${de.name}</td><td>`
      de.list.forEach(list => {
        tableRows += `<span style="font-weight:bold">${list.name}:</span> ${dv[list.id] ? dv[list.id] : ''}<br/>`;
      })
      tableRows += '</td></tr>'
    } else tableRows += `<tr><td>${de.name}</td><td>${dv[de.id] ? dv[de.id] : ''}</td></tr>`
  })
  return tableRows;

}

function getProjectFocusAreas(names, dv, deIds) {
  var tableRows = '';
  var values = [];
  names.forEach((name, index) => {
    deIds[index].focusAreas.forEach(fa => {
      if (dv[fa]) {
        const focusArea = JSON.parse(dv[fa]);
        if (focusArea) {
          values.push({
            name: name,
            area: focusArea.area ? focusArea.area : '',
            pillar: focusArea.pillar ? focusArea.pillar : '',
            budget: focusArea.assignedBudget ? focusArea.assignedBudget : '',
            expense: focusArea.expense ? focusArea.expense : '',
            variation: focusArea.variation ? focusArea.variation : '',
            remarks: dv[deIds[index].comment] ? dv[deIds[index].comment] : ''
          })
        }
      }
    })
  })

  values.forEach(value => {
    tableRows += `<tr><td>${value.name}</td><td>${value.area}</td><td>${value.pillar}</td><td>${formatNumberInput(displayValue(value.budget))}</td><td>${formatNumberInput(displayValue(value.expense))}</td><td>${formatNumberInput(displayValue(value.variation))}</td><td>${value.remarks}</td></tr>`
  })

  return tableRows;
}

function getProjectExpenseCategory(names, dv, deIds) {
  var tableRows = ''
  var values = [];

  names.forEach((name, index) => {
    values.push({
      name: name,
      type: 'Personnel',
      budget: dv[deIds[index]['budgetExpense']['personnel']] ? dv[deIds[index]['budgetExpense']['personnel']] : '',
      expense: dv[deIds[index]['actualExpense']['personnel']] ? dv[deIds[index]['actualExpense']['personnel']] : '',
      variation: dv[deIds[index]['variation']['personnel']] ? dv[deIds[index]['variation']['personnel']] : '',
      comment: dv[deIds[index]['comment']] ? dv[deIds[index]['comment']] : '',
    })
    values.push({
      name: name,
      type: 'Direct Project Activities',
      budget: dv[deIds[index]['budgetExpense']['activities']] ? dv[deIds[index]['budgetExpense']['activities']] : '',
      expense: dv[deIds[index]['actualExpense']['activities']] ? dv[deIds[index]['actualExpense']['activities']] : '',
      variation: dv[deIds[index]['variation']['activities']] ? dv[deIds[index]['variation']['activities']] : '',
      comment: dv[deIds[index]['comment']] ? dv[deIds[index]['comment']] : '',
    })
    values.push({
      name: name,
      type: 'Commodities',
      budget: dv[deIds[index]['budgetExpense']['commodities']] ? dv[deIds[index]['budgetExpense']['commodities']] : '',
      expense: dv[deIds[index]['actualExpense']['commodities']] ? dv[deIds[index]['actualExpense']['commodities']] : '',
      variation: dv[deIds[index]['variation']['commodities']] ? dv[deIds[index]['variation']['commodities']] : '',
      comment: dv[deIds[index]['comment']] ? dv[deIds[index]['comment']] : '',
    })
    values.push({
      name: name,
      type: 'Indirect/ support costs',
      budget: dv[deIds[index]['budgetExpense']['cost']] ? dv[deIds[index]['budgetExpense']['cost']] : '',
      expense: dv[deIds[index]['actualExpense']['cost']] ? dv[deIds[index]['actualExpense']['cost']] : '',
      variation: dv[deIds[index]['variation']['cost']] ? dv[deIds[index]['variation']['cost']] : '',
      comment: dv[deIds[index]['comment']] ? dv[deIds[index]['comment']] : '',
    })
  })

  values.forEach(value => {
    tableRows += `<tr><td>${value.name}</td><td>${value.type}</td><td>${formatNumberInput(displayValue(value.budget))}</td><td>${formatNumberInput(displayValue(value.expense))}</td><td>${formatNumberInput(displayValue(value.variation))}</td><td>${value.comment}</td></tr>`
  })
  return tableRows;
}

function getTotalIncome(dv, deIds) {
  const categoryIncome = [
    {
      name: "Locally generated income",
      code: "Locally generated income",
      id: "AwylsBWgOEK",
      format: 'locally-generated',
      options: [
        {
          "name": "Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)",
          "code": "Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)",
          "id": "jcpKbxwFq6D",
          format: "commodity-sales"
        },
        {
          "name": "Client/Patient fees",
          "code": "Client/Patient fees",
          "id": "lGsKx2RbUSW",
          format: "client-fees"
        },
        {
          "name": "Training, education, professional services and rentals",
          "code": "Training, education, professional services and rentals",
          "id": "KqYleOvKzJ2",
          format: "services-rental"
        },
        {
          "name": "Local/national: government",
          "code": "Local/national: government",
          "id": "RGp6uJXqNOk",
          format: "local-government"
        },
        {
          "name": "Local/national: non-government",
          "code": "Local/national: non-government",
          "id": "aE0fJm2QDgh",
          format: "local-nongovernment"
        },
        {
          "name": "Membership fees",
          "code": "Membership fees",
          "id": "QhSUed8nt0j",
          format: "membership-fees"
        },
        {
          "name": "Non-operational income",
          "code": "Non-operational income",
          "id": "iHRoyMrZtsF",
          format: "nonoperational-income"
        },
        {
          "name": "Other national income",
          "code": "Other national income",
          "id": "gGAAt4veTgw",
          format: "other-income"
        },
      ],
    },
    {
      name: "International income (Non - IPPF)",
      code: "International income (Non - IPPF)",
      id: "EbbYrTYLZNZ",
      format: 'international-income',
      options: [
        {
          "name": "Multilateral Agencies and Organizations",
          "code": "Multilateral Agencies and Organizations",
          "id": "BHUbX12N9ob",
          format: "multinational-agencies"
        },
        {
          "name": "Foreign Governments",
          "code": "Foreign Governments",
          "id": "Vz4kD0k9cgj",
          format: "foriegn-governments"
        },
        {
          "name": "International Trusts and Foundations / NGOs",
          "code": "International Trusts and Foundations / NGOs",
          "id": "QPijCkeuCIf",
          format: "interational-trusts"
        },
        {
          "name": "Corporate / Business Sector",
          "code": "Corporate / Business Sector",
          "id": "WvYNbgB1Rgh",
          format: "corporate-sector"
        },
        {
          "name": "Other International Income",
          "code": "Other International Income",
          "id": "aT0dYEvFiLO",
          format: "other-international-income"
        },
      ],
    },
    {
      name: "IPPF income",
      code: "IPPF income",
      id: "iKycH3397wP",
      format: 'ippf-income',
      options: [
        {
          "name": "IPPF Core Grant",
          "code": "IPPF Core Grant",
          "id": "D0YD3aNWqGp",
          format: "ippf-unrestricted"
        },
        {
          "name": "Other IPPF Grant",
          "code": "Other IPPF Grant",
          "id": "fOsunx90DGG",
          format: "ippf-restricted"
        }
      ],
    },
  ];
  var tableBody = ''
  var restrictedGlobalTotal = 0;
  var unrestrictedGlobalTotal = 0;
  var optionIndex = 0;
  categoryIncome.forEach((categ, index) => {
    tableBody += `<tr><td style="font-weight:bold">${index + 1}. ${categ.name}</td><td style="font-weight:bold">Restricted</td><td style="font-weight:bold">Unrestricted</td></tr>`;
    categ.options.forEach((option) => {
      tableBody += `<tr><td>${option.name}</td>`;
      var restrictedTotal = (dv[deIds[optionIndex]["restricted"]] ? Number(dv[deIds[optionIndex]["restricted"]]) : 0);
      var unrestrictedTotal = (dv[deIds[optionIndex]["unrestricted"]] ? Number(dv[deIds[optionIndex]["unrestricted"]]) : 0);

      tableBody += `<td>${formatNumberInput(displayValue(restrictedTotal))}</td><td>${formatNumberInput(displayValue(unrestrictedTotal))}</td></tr>`
      restrictedGlobalTotal += restrictedTotal;
      unrestrictedGlobalTotal += unrestrictedTotal;
      optionIndex++;
    })
  })

  tableBody += `<tr><td style="font-weight:bold">Totals</td><td style="font-weight:bold">${formatNumberInput(displayValue(restrictedGlobalTotal))}</td><td style="font-weight:bold">${formatNumberInput(displayValue(unrestrictedGlobalTotal))}</td></tr><tr><td style="font-weight:bold">Global Total</td><td colspan="2"  style="font-weight:bold">${formatNumberInput(displayValue(restrictedGlobalTotal + unrestrictedGlobalTotal))}</td></tr><tr><td>Which organisation (government, trust, foundation, IPPF or other donor) was the largest contributor</td><td colspan="2">How much income did they provide?</td></tr>`;
  tableBody += `<tr><td>${ dv[dataElements.organisation] ? dv[dataElements.organisation]: ''}</td><td colspan="2">${ dv[dataElements.incomeProvided] ? formatNumberInput(dv[dataElements.incomeProvided]): ''}</td></tr>`;

  return tableBody;

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


function checkProjects(projects, values) {
  var prevEmptyNames = [];
  var names = [];
  if (values) {
    projects.forEach(project => {
      if (values[project.name]) {
        names = [...names, ...prevEmptyNames, values[project.name]];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      }
    })
  }
  return names;
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