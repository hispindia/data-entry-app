import { meApi, organisationUnitGroup } from "../../api/DataApi.js";
import { getProgramStageEvents, getTEI } from "../../api/func.js";
import { program, programStage, tei } from "../../constant.js";

var regionMA = {};
var level2OU = '';

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


  async function fetchOrganizationUnitUid() {
    try {

      const data = await meApi.get();
      const resOUGroup = await organisationUnitGroup.get('mwQWyy8TGZv')
      tei.year.value = document.getElementById('year-update').value;

      if (data.organisationUnits && data.organisationUnits.length > 0) {
        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;

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

        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchEvents() {
    $("#table-head").empty();
    $("#table-body").empty();
    $("#loader").html('<div class="h2 text-center">Loading api...</div>');
    

    var dataValuesOU = [];
    for (let headOU of level2OU) {
      regionMA[headOU] = {
        totalBudget: 0
      }
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      for (let ou of headOU.children) {
        $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);

        const event = await getTEI(ou.id);

        var attributes = {};
        if (event.trackedEntityInstances.length && event.trackedEntityInstances[0].attributes) {
          event.trackedEntityInstances[0].attributes.forEach(attr => attributes[attr.attribute] = attr.value);
        }

        if (event.trackedEntityInstances.length) {
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) =>
            enroll.program == program.auProjectDescription
            || enroll.program == program.auProjectBudget
          );
          
          let dataValuesPD = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, {id: tei.year.id, value: tei.year.value}) //data values year wise
          let dataValuesPB = getProgramStageEvents(filteredPrograms, programStage.auProjectBudget, program.auProjectBudget, {id: tei.year.id, value: tei.year.value}) //data values year wise

          dataValuesOU.push({
            orgUnit: ou.name,
            ouId: ou.id,
            attributes,
            dataValuesPD,
            dataValuesPB,
          })
        }
      }
    }

    populateProgramEvents(level2OU, dataValuesOU);

  }

  // Function to populate program events data
  function populateProgramEvents(level2OU, dataValuesOU) {
    // const list = getPillarBudgetFA(dataValuesOU, level2OU);

    // const listOD = getOrganisationDetails(dataValuesOU, level2OU);
    // document.getElementById('th-project-organisationDetails').innerHTML = listOD.tableHead;
    // document.getElementById('tb-project-organisationDetails').innerHTML = listOD.tableRow;

    const listEB = getExpenseBudget(dataValuesOU, level2OU);
    document.getElementById('th-project-expBudget').innerHTML = listEB.tableHead;
    document.getElementById('tb-project-expBudget').innerHTML = listEB.tableRow;

    // const listTI = getTotalIncome(dataValuesOU, level2OU);
    // document.getElementById('th-project-totalIncome').innerHTML = listTI.tableHead;
    // document.getElementById('tb-project-totalIncome').innerHTML = listTI.tableRow;

    // const listAOC = getAOCReport(dataValuesOU, level2OU);
    // document.getElementById('th-project-aocReport').innerHTML = listAOC.tableHead;
    // document.getElementById('tb-project-aocReport').innerHTML = listAOC.tableRow;
    $("#loader").empty();


    // Localize content
    $('body').localize();
  }

  function getExpenseBudget(dataValuesOU, level2OU) {

    console.log(dataValuesOU, level2OU)

    tableHead += `<tr><td>project Description</td><td>Comments</td><td>Budget</td></tr>`
    return {
      tableHead,
      tableRow
    }
  }
  function getTotalIncome(dataValuesOU, level2OU){
    const year = document.getElementById("year-update").value;
    var deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
        style: ''
      },
    {
      id: 'Lv8wUjXV8fl',
      name: 'Affiliate Code',
      style: ''
    },
    {
      id: 'budgetedIncome',
      name: `Budgeted income ${year}`,
      style: 'background:#e97132;'
    },
    {
      id: 'totalIncome',
      name: `Total ${year} Income`,
      style: 'background:#e97132;'
    },
    {
      id: 'totalUnrestricted',
      name: 'Total IPPF Unrestricted income',
      style: 'background:#e97132;'
    },
    {
      id: 'ippfPercentage',
      name: 'IPPF Unrestricted as percentage of total ',
      style: 'background:#e97132;'
    },
    {
      id: 'ippfCore',
      name: `Total ${year} Unrestricted including IPPF`,
      style: 'background:#e97132;'
    },
    {
      id: 'ippfCorePer',
      name: `Total ${year} Unrestricted as percentage of total income`,
      style: 'background:#e97132;'
    },
    {
      id: 'nonIppfCore',
      name: `Total non-IPPF Unrestricted`,
      style: 'background:#e97132;'
    },
    {
      id: 'financialPosition',
      name: `Financial position`,
      style: 'background:#e97132;'
    },
    {
      id: 'qrdiDKqQotg',
      code: 'Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)',
      name: 'COMMODITY SALES',
      style: 'background:#0f9ed5;'
    },{
      id: 'L89RPS2xzNl',
      code: 'Client/Patient fees',
      name: 'CLIENT/ PATIENT FEES',
      style: 'background:#0f9ed5;'
    },{
      id: 'mHacTCqp5St',
      code: 'Training, education, professional services and rentals',
      name: 'TRAINING, EDUCATION, PROFESSIONAL SERVICES AND RENTALS',
      style: 'background:#0f9ed5;'
    },{
      id: 'tK20oVQDvjE',
      code: 'Local/national: government',
      name: 'LOCAL / NATIONAL : GOVERNMENT',
      style: 'background:#0f9ed5;'
    },{
      id: 'VJC9jDYrilT',
      code: 'Local/national: non-government',
      name: 'LOCAL / NATIONAL : NON-GOVERNMENT',
      style: 'background:#0f9ed5;'
    },{
      id: 'IOf1cgEwUVt',
      code: 'Membership fees',
      name: 'MEMBERSHIP FEES',
      style: 'background:#0f9ed5;'
    },{
      id: 'eF1Du2rscoA',
      code: 'Non-operational income',
      name: 'NON-OPERATIONAL INCOME',
      style: 'background:#0f9ed5;'
    },{
      id: 'Yn7LiC5Zinj',
      code: 'Other national income',
      name: 'OTHER NATIONAL INCOME',
      style: 'background:#0f9ed5;'
    },{
      id: 'totalLocallyGenerated',
      code: '',
      name: 'Total Locally Generated',
      style: 'background:#0f9ed5;'
    },{
      id: 'percentLocallyGenerated',
      code: '',
      name: 'As percentage of total income',
      style: 'background:#0f9ed5;'
    },{
      id: 'gcErTbOLAjF',
      code: 'Multilateral Agencies and Organizations',
      name: 'MULTILATERAL AGENCIES AND ORGANIZATIONS',
      style: 'background:#4ea72e;'
    },{
      id: 'n3IO1nKmHYf',
      code: 'Foreign Governments',
      name: 'FOREIGN GOVERNMENTS',
      style: 'background:#4ea72e;'
    },{
      id: 'QGWY8yLtmhk',
      code: 'International Trusts and Foundations / NGOs',
      name: 'INTERNATIONAL TRUSTS AND FOUNDATIONS / NGOS',
      style: 'background:#4ea72e;'
    },{
      id: 'uBN3PJRnDRJ',
      code: 'Corporate / Business Sector',
      name: 'CORPORATE / BUSINESS SECTOR',
      style: 'background:#4ea72e;'
    },{
      id: 'zxRotHuBZ1U',
      code: 'Other International Income',
      name: 'OTHER INTERNATIONAL INCOME',
      style: 'background:#4ea72e;'
    },{
      id: 'totalInternational',
      code: '',
      name: 'Total International (non-IPPF)',
      style: 'background:#4ea72e;'
    },{
      id: 'percentInternational',
      code: '',
      name: 'As percentage of total income',
      style: 'background:#4ea72e;'
    },{
      id: 'HrH4reost9F',
      code: 'IPPF Unrestricted Grant',
      name: 'IPPF UNRESTRICTED GRANT',
      style: 'background:#c00000;'
    },{
      id: 'T8nVKg8gGUf',
      code: 'IPPF Restricted Grant',
      name: 'IPPF RESTRICTED GRANT',
      style: 'background:#c00000;'
    },{
      id: 'totalIppf',
      code: '',
      name: 'Total IPPF-sourced',
      style: 'background:#c00000;'
    },{
      id: 'percentIppf',
      code: '',
      name: 'As percentage of total income',
      style: 'background:#c00000;'
    },{
      id: 'totalIncomeControl',
      code: '',
      name: 'Total Income(Control)',
      style: 'background:#2596be;'
    },{
      id: 'totalIncomePer',
      code: '',
      name: 'Total Income as percentage (Control)',
      style: 'background:#2596be;'
    },{
      id: 'totalIncomeRestricted',
      code: '',
      name: 'Total Restricted Income',
      style: 'background:#2596be;'
    },{
      id: 'totalIncomeUnrestricted',
      code: '',
      name: 'Total Unrestricted Income',
      style: 'background:#2596be;'
    },
    {
      id: 'totalIncomeRestricted2024',
      code: '',
      name: 'Total Restricted Income 2024',
      style: 'background:#2596be;'
    },{
      id: 'totalIncomeUnrestricted2024',
      code: '',
      name: 'Total Unrestricted Income 2024',
      style: 'background:#2596be;'
    },
  ]

  var tableHead = `<tr><td style="font-weight:bold">Region</td><td style="font-weight:bold">Affiliate Name</td>`;
  deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
  tableHead += '</tr>';

  
  var tableRow = ''
  dataValuesOU.forEach(item => {

    var values = {}
    deList.forEach(de => {
      values[de.id] = 0;
    })
    values = {
      ...values,
      ...item.attributes,
      totalIncome: 0,
      expBudget: 0,
    }

    var region = '';
    level2OU.forEach(parent => parent.children.forEach(ou => {
      if (ou.name == item.orgUnit) region = parent.name
    }))

    tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;

    dataElements.projectTotalIncome.forEach(pti => {
      
        if(item.dataValuesTI && item.dataValuesTI[pti.restricted]) {
          values[pti.category] += Number(item.dataValuesTI[pti.restricted]);
          values['totalIncome'] += Number(item.dataValuesTI[pti.restricted]);
          values['totalIncomeRestricted'] += Number(item.dataValuesTI[pti.restricted]);
        }
        if(item.dataValuesTI && item.dataValuesTI[pti.unrestricted]) {
          values[pti.category] += Number(item.dataValuesTI[pti.unrestricted]);
          values['totalIncome'] += Number(item.dataValuesTI[pti.unrestricted]);
          values['ippfCore'] += Number(item.dataValuesTI[pti.unrestricted]);
          values['totalIncomeUnrestricted'] += Number(item.dataValuesTI[pti.unrestricted]);
        }

        if(item.dataValuesID[year] && item.dataValuesID[year][pti.restricted]) {
          values['budgetedIncome'] += Number(item.dataValuesID[year][pti.restricted]);
          values['totalIncomeRestricted2024'] += Number(item.dataValuesID[year][pti.restricted]);
        }
        if(item.dataValuesID[year] && item.dataValuesID[year][pti.unrestricted]) {
          values['budgetedIncome'] += Number(item.dataValuesID[year][pti.unrestricted]);
          values['totalIncomeUnrestricted2024'] += Number(item.dataValuesID[year][pti.unrestricted]);
        }
      
    })

    values['ippfCorePer'] = values['ippfCore'] && values['totalIncome'] && (values['ippfCore']/values['totalIncome']) ? ((values['ippfCore']/values['totalIncome'])*100).toFixed(2)  : '';
    
    deList.forEach((de,index) => {
      if(index>=9 && index<=16) {
        values['totalLocallyGenerated'] += values[de.id];
        values['totalIncomeControl'] += values[de.id];
      }
      if(index>=19 && index<=23) {
        values['totalInternational'] += values[de.id];
        values['totalIncomeControl'] += values[de.id];
      }
      if(index==26 || index==27) {
        values['totalIppf'] += values[de.id];
        values['totalIncomeControl'] += values[de.id];
      }
    })

    values['percentLocallyGenerated'] = values['totalLocallyGenerated'] && values['totalIncome'] && (values['totalLocallyGenerated']/values['totalIncome']) ? ((values['totalLocallyGenerated']/values['totalIncome'])*100).toFixed(2) : '';
    values['percentInternational'] = values['totalInternational'] && values['totalIncome'] && (values['totalInternational']/values['totalIncome']) ? ((values['totalLocallyGenerated']/values['totalIncome'])*100).toFixed(2)  : '';
    values['percentIppf'] = values['totalIppf'] && values['totalIncome'] && (values['totalIppf']/values['totalIncome']) ? ((values['totalIppf']/values['totalIncome'])*100).toFixed(2)  : '';
    values['totalIncomePer'] = values['totalIncome'] && values['totalIncomeControl'] && (values['totalIncomeControl']/values['totalIncome']) ? ((values['totalIncomeControl']/values['totalIncome'])*100).toFixed(2)  : '';
    
    values['totalCommodities'] = Number(values['internationalDonors']) + Number(values['localIncome']) + Number(values['inkindDonations']) + Number(values['otherincome']);
    if(values['totalCommodities'] && values['totalIncome']) values['percentTotalCommodities'] = (values['totalCommodities'] && values['totalIncome'] && values['totalCommodities']/values['totalIncome']) ? (( values['totalCommodities']/values['totalIncome'])*100).toFixed(2): '';
    var yearIndex = -1;
    for(let i = tei.year.start; i<=tei.year.end; i++) {
      yearIndex++;
      if(year==i) break;
    }
    if(item.dataValuesOD && item.dataValuesOD[dataElements.yearlyAmount[yearIndex]]) {
      values['totalUnrestricted'] = Number(item.dataValuesOD[dataElements.yearlyAmount[yearIndex]]);
      values['ippfPercentage'] = values['totalIncome'] && (item.dataValuesOD[dataElements.yearlyAmount[yearIndex]]/values['totalIncome']) ? ((item.dataValuesOD[dataElements.yearlyAmount[yearIndex]]/values['totalIncome'])*100).toFixed(2): ''
    }

    if(values['ippfCore']) values['nonIppfCore'] = values['ippfCore'];
    if(values['totalUnrestricted']) values['nonIppfCore'] -= values['totalUnrestricted'];
    
    dataElements.arProjectExpenseCategory.forEach((pec, index) => {
      if(item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
        if( item.dataValuesEC[pec.actualExpense.personnel]) values['expBudget']  +=  Number(item.dataValuesEC[pec.actualExpense.personnel]);
        if( item.dataValuesEC[pec.actualExpense.activities]) values['expBudget'] +=  Number(item.dataValuesEC[pec.actualExpense.activities]);
        if( item.dataValuesEC[pec.actualExpense.commodities]) values['expBudget']  +=  Number(item.dataValuesEC[pec.actualExpense.commodities]);
        if( item.dataValuesEC[pec.actualExpense.cost]) values['expBudget']  +=  Number(item.dataValuesEC[pec.actualExpense.cost]);
      }      
    })
    
    // values['expBudget'] =  item.dataValuesEC['zGn5c7EZLr0']?displayValue(item.dataValuesEC['zGn5c7EZLr0']): '';

    if(values['totalIncome']) values['financialPosition'] = values['totalIncome'];
    if(values['expBudget']) values['financialPosition'] -= values['expBudget'];
    

    deList.forEach((de,index) => {
      if(index<2) tableRow += `<td style="${de.style}">${values[de.id] ? values[de.id]: ''}</td>`
      else  tableRow += `<td style="${de.style}">${values[de.id] ? formatNumberInput(displayValue(values[de.id])): ''}</td>`
    })
    tableRow += '</tr>'
    })


  return {
    tableHead,
    tableRow
  }
  }
  function getOrganisationDetails(dataValuesOU, level2OU) {

    var tableRow = "";
    const deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
         style: 'background:#276696;'
      },
      {
        id: 'Lv8wUjXV8fl',
        name: 'Affiliate Code',
         style: 'background:#276696;'
      },
      {
        id: 'rTDJjf4crQ8',
        name: 'Primary Contact person',
         style: 'background:#276696;'
      },
      {
        id: 'I27jsFBwUnt',
        name: 'Contact person email',
         style: 'background:#276696;'
      },
      {
        id: 'eS8HHmy5krN',
        name: 'Address',
         style: 'background:#276696;'
      },
      {
        id: 'Ctp6kmhwq86',
        name: 'ED Name',
         style: 'background:#276696;'
      },
      {
        id: 'yGutLB1Spaa',
        name: 'ED Email',
         style: 'background:#276696;'
      },
      {
        id: 'woWgpD819lF',
        name: 'ED Contact Phone',
        style: 'background:#276696;'
      },
      {
        id: 'IuyGw22tqYj',
        name: 'President Name',
         style: 'background:#276696;'
      },
      {
        id: 'YTtJK3jqsnq',
        name: 'President Email',
         style: 'background:#276696;'
      },
      {
        id: 'CFF42nxFPgB',
        name: 'President Contact Phone',
         style: 'background:#276696;'
      },
      {
        id: 'BycCbaxB1Pu',
        name: 'Officer of the board Name 1',
         style: 'background:#276696;'
      },
      {
        id: 'tt9p7BLGhT0',
        name: 'Officer of the board Email 1',
         style: 'background:#276696;'
      },
      {
        id: 'Mzn08vVVZVt',
        name: 'Officer of the board Contact Phone 1',
         style: 'background:#276696;'
      },
      {
        id: 'MeCYmsrREyS',
        name: 'Officer of the board Name 2',
         style: 'background:#276696;'
      },
      {
        id: 'qShxfRboswE',
        name: 'Officer of the board Email 2',
         style: 'background:#276696;'
      },
      {
        id: 'XmDKyaE5SbW',
        name: 'Officer of the board Contact Phone 2',
         style: 'background:#276696;'
      },
      {
        id: 'QgqjdnD1a24',
        name: 'Officer of the board Name 3',
         style: 'background:#276696;'
      },
      {
        id: 'QoFEoEFiPZd',
        name: 'Officer of the board Email 3',
         style: 'background:#276696;'
      },
      {
        id: 'H2t9gnU6JKb',
        name: 'Officer of the board Contact Phone 3',
         style: 'background:#276696;'
      },
      {
        id: 'aA5UkYBNvbl',
        name: 'Youth board member Name',
         style: 'background:#276696;'
      },
      {
        id: 'k86jH9sSXSq',
        name: 'Youth board member Email',
         style: 'background:#276696;'
      },
      {
        id: 'oYpc136YNgW',
        name: 'Youth board member Contact Phone',
         style: 'background:#276696;'
      },
      {
        id: 'HFyJ2WGQEda',
        name: 'Programmatic lead(s) Name 1',
         style: 'background:#276696;'
      },
      {
        id: 'qColDnIqDjT',
        name: 'Programmatic lead(s) Email 1',
         style: 'background:#276696;'
      },
      {
        id: 'vFhnYZHTxfr',
        name: 'Programmatic lead(s) Contact Phone 1',
         style: 'background:#276696;'
      },
      {
        id: 't9LCankavyt',
        name: 'Programmatic lead(s) Name 2',
         style: 'background:#276696;'
      },
      {
        id: 'sJpc63Pkpip',
        name: 'Programmatic lead(s) Email 2',
         style: 'background:#276696;'
      },
      {
        id: 'SDC9mqvdjhQ',
        name: 'Programmatic lead(s) Contact Phone 2',
         style: 'background:#276696;'
      },
      {
        id: 'ptHCVnzUXQl',
        name: 'Finance lead Name',
         style: 'background:#276696;'
      },
      {
        id: 'lea8lybuFI9',
        name: 'Finance lead Email',
         style: 'background:#276696;'
      },
      {
        id: 'PZswZ4XFTku',
        name: 'Finance lead Contact Phone',
         style: 'background:#276696;'
      },
      {
        id: 'nME0H9rEBz4',
        name: 'Board Term start',
         style: 'background:#276696;'
      },
      {
        id: 'leqtpPX6o97',
        name: 'Board Term End',
         style: 'background:#276696;'
      },
      {
        id: 'projectTotal',
        name: 'Total number of projects',
         style: 'background:#276696;'
      }
    ]
    var tableHead = '<tr><td style="background:#276696;color:white;text-align:center;border:1px solid black;">Region</td><td style="background:#276696;color:white;text-align:center;border:1px solid black;">Affiliate Name</td>';
    deList.forEach(de => tableHead += `<td  style="${de.style};color:white;text-align:center;border:1px solid black;">${de.name}</td>`)
    tableHead += '</tr>';

    const year = document.getElementById("year-update").value;

    dataValuesOU.forEach(item => {
      item.dataValuesOD = {
        ...item.dataValuesOD,
        ...item.attributes
      }
      var region = '';
      level2OU.forEach(parent => parent.children.forEach(ou => {
        if (ou.name == item.orgUnit) region = parent.name
      }))
      tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;
      deList.forEach((de, index) => {
        if (index < (deList.length - 1)) tableRow += `<td>${item.dataValuesOD[de.id] ? item.dataValuesOD[de.id] : ''}</td>`;
      })
        var pdcount = 0;
        dataElements.projectDescription.forEach(pd => {
          if (item.dataValuesPD[year] && item.dataValuesPD[year][pd['name']]) {
            pdcount++;
          }
        })
        tableRow += `<td>${pdcount}</td>`;
      })
    return {
      tableHead,
      tableRow
    }

  }
  
  function getAOCReport(dataValuesOU, level2OU) {

    var tableRow = "";
    const deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
        style:""
      },
      {
        id: 'Lv8wUjXV8fl',
        name: 'Affiliate Code',
        style:""
      },
      {
        id: 'flagRating',
        name: 'Flag rating (red or green)',
        style:""
      },
      {
        id: 'Tok83eP5gqa',
        name: '1. Process: was the report was submitted on time?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'UUlKQuQW1Xy',
        name: '1. Process: was the report was submitted on time? (Comments)',
        style: 'background:#0f9ed5;'
      }, 
      {
        id: 'bddU8SI1wLz',
        name: '2. Process: has the MA consulted with you, the AOC, during the development of the AR?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'hyBXZOHUy1k',
        name: '2. Process: has the MA consulted with you, the AOC, during the development of the AR? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'ua6hoN645RR',
        name: '3. Quality: is the report done to the required standard: e.g. all answers and budget fields are completed and are understandable?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'PdxpqvhsBtM',
        name: '3. Quality: is the report done to the required standard: e.g. all answers and budget fields are completed and are understandable? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'P7a9Jl3z8Xa',
        name: '4. Narrative Report: in Section 2, question 2, has the MA/CP reported tangible results in at least two of the four IPPF strategic pillars',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'K0oIfdP0JeR',
        name: '4. Narrative Report: in Section 2, question 2, has the MA/CP reported tangible results in at least two of the four IPPF strategic pillars (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'NaiRFWqjv9q',
        name: "5.  Narrative Report: in Section 2, question 3 to 6, has the MA/CP meaningfully reflected on challenges and learnings in the reporting period?",
        style: 'background:#0f9ed5;'
      },
      {
        id: 'hgpQDSZm9lK',
        name: "5.  Narrative Report: in Section 2, question 3 to 6, has the MA/CP meaningfully reflected on challenges and learnings in the reporting period?",
        style: 'background:#0f9ed5;'
      },
      {
        id: 'c4TpY3CTEQv',
        name: '6. Financial: is the total expense reported under Section 4 the same as the total reported in Section 5?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'xVfb0b8UtIq',
        name: '6. Financial: is the total expense reported under Section 4 the same as the total reported in Section 5? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'HOuFie6msc6',
        name: '7. Financial: What is the status of the audit report for the financial year?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'KGx5UkIS59t',
        name: '7. Financial: What is the status of the audit report for the financial year? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'vacCAltV8Pp',
        name: '8. Financial: in Section 6 “Actual Income”, is the overall financial status indicating a surplus or balanced budget (income minus expenses). In other words, it is showing green?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'RIltL5QmDEP',
        name: '8. Financial: in Section 6 “Actual Income”, is the overall financial status indicating a surplus or balanced budget (income minus expenses). In other words, it is showing green? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'aXjINT5ttfR',
        name: '9. In Section 5 “Budget vs Actuals by expense category”, are negative variances (in red) sufficiently explained for all of the individual projects? ',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'rrYJ6v2uI7X',
        name: '9. In Section 5 “Budget vs Actuals by expense category”, are negative variances (in red) sufficiently explained for all of the individual projects? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'RjUbLBU2k8l',
        name: 'Any Other Major Risk Identified 1',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'gisGa5OLedD',
        name: 'Other Comments 1',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'S2ZTyifVF3P',
        name: 'Any Other Major Risk Identified 2',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'LitWNOXmHZc',
        name: 'Other Comments 2',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'e04OAehV9dD',
        name: 'Any Other Major Risk Identified 3',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'FiF3dtgnKjg',
        name: 'Other Comments 3',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'KvMjVwzQ1Au',
        name: 'Any Other Major Risk Identified 4',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'gNhV6F9rV5V',
        name: 'Other Comments 4',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'l6d486NvthX',
        name: 'Any Other Major Risk Identified 5',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'XKVkYCnlHYE',
        name: 'Other Comments 5',
        style: 'background:#0f9ed5;'
      },
    ]
    var tableHead = `<tr><td style="font-weight:bold">Region</td><td style="font-weight:bold">Affiliate Name</td>`;
    deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
    tableHead += '</tr>';

    dataValuesOU.forEach(item => {

      item.dataValuesRO = {
        ...item.dataValuesRO,
        ...item.attributes
      }
      var region = '';
      level2OU.forEach(parent => parent.children.forEach(ou => {
        if (ou.name == item.orgUnit) region = parent.name
      }))
      tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;
      deList.forEach((de,index) => {
        var value='';
        if(de.id=='flagRating') {
         var color = '';
         if(item.dataValuesRO) color = selectedRatings(item.dataValuesRO);
         tableRow += `<td class="${color}"> </td>`
        } else {
          if(item.dataValuesRO && item.dataValuesRO[de.id]) value=item.dataValuesRO[de.id];
          
          if(de.id=='HOuFie6msc6' && value=='true') tableRow += `<td style="color:#54ca68">Unqualified</td>`;
          else if(de.id=='HOuFie6msc6' && value=='false') tableRow += `<td style="color:#fc544b">Qualified</td>`;
          else if(value=='true') tableRow += `<td style="color:#54ca68">Yes</td>`;
          else if(value=='false') tableRow += `<td style="color:#fc544b">No</td>`;
          else tableRow += `<td>${value}</td>`
        }
      })
      tableRow += '</tr>'

    })
    return {
      tableHead,
      tableRow
    }

  }


  fetchOrganizationUnitUid();
});

    function selectedRatings(dataValues) {
      var color = ''
      const generalRatings = {
        yesCount: 0,
        noCount: 0
      };
      const criticalRatings = {
        yesCount: 0,
        noCount: 0
      };
      var seriousRisk =false;
      const generalRequirements = ['Tok83eP5gqa', 'bddU8SI1wLz', 'ua6hoN645RR', 'P7a9Jl3z8Xa', 'NaiRFWqjv9q', 'c4TpY3CTEQv'];
      
      var criticalRequirements = [];
      
      if(dataElements.periodicity.value == "Semi-Annual Reporting") {
        criticalRequirements = ['aXjINT5ttfR'];
      } else criticalRequirements = ['HOuFie6msc6', 'vacCAltV8Pp', 'aXjINT5ttfR'];
      

      ['RjUbLBU2k8l', 'S2ZTyifVF3P', 'e04OAehV9dD', 'KvMjVwzQ1Au', 'l6d486NvthX'].forEach((risk) => {
        if(dataValues[risk] && dataValues[risk].trim()) seriousRisk = true;
      })
      if(seriousRisk) {
        color='bg-red';
        return;
      }

      generalRequirements.forEach(requirement => {
          if(dataValues[requirement]=="true") generalRatings['yesCount']++;
          else if(dataValues[requirement]=="false") generalRatings['noCount']++;
      })
      criticalRequirements.forEach(requirement => {
          if(dataValues[requirement]=="true") criticalRatings['yesCount']++;
          else if(dataValues[requirement]=="false") criticalRatings['noCount']++;
      })

      if(generalRatings['yesCount'] >= 4 && criticalRatings['yesCount']==criticalRequirements.length) {
        color= 'bg-green';
      } else {
        color='bg-red';
      }
      return color;
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

function colorCode(num) {
  if (Number(num) == 0) return ''
  else return 'red'
}
