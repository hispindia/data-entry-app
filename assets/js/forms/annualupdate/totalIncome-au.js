import { dataSet } from "../../api/dataSet.js";
import { createEvent, getEvents, getProgramStageEvents, getTEI, pushDataElement } from "../../api/func.js";
import { dataElements, dataSetFunds, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, unformatNumber, getYears } from "../func.js";

var totalExpenses = '';
const totalsId = [{
  id: 'localIncome',
  name: 'locally generated income',
  format: 'locally-generated'
}, {
  id: 'internationalIncome',
  name: 'International income (Non - IPPF)',
  format: 'international-income'
}, {
  id: 'ippfIncome',
  name: 'IPPF income',
  format: 'ippf-income'
}]
const categoryIncome = [
  {
    name: "locally generated income",
    code: "locally generated income",
    shortName: 'localIncome',
    format: 'locally-generated',
    id: "AwylsBWgOEK",
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
        "name": "Membership fees",
        "code": "Membership fees",
        "id": "QhSUed8nt0j",
        format: "membership-fees"
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
    name: "Actual international income (Non - IPPF)",
    code: "Actual international income (Non - IPPF)",
    id: "EbbYrTYLZNZ",
    shortName: 'internationalIncome',
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
    name: "Actual IPPF income",
    code: "Actual IPPF income",
    id: "iKycH3397wP",
    shortName: 'ippfIncome',
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

async function fetchDataSet(year) {
  const values = {};
    
  const dataValuesQuantity = await dataSet.getValues(dataSetFunds, tei.orgUnit, year);
  dataValuesQuantity.dataValues.forEach(dv => values[dv.dataElement] = dv.value);

  return values;
}

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

  configurePage();
 async function configurePage() {
    const user = await getUserConfig();
    tei.userDisabled = user.disabled;

    if (user.organisationUnits?.length) {
      tei.orgUnit = user.organisationUnits[0].id;
      if (user.organisationUnits[0].parent) {
        document.getElementById("headerOrgId").value = user.organisationUnits[0].parent.name;
      }
      document.getElementById("facility").innerHTML = user.organisationUnits[0].name;
      document.getElementById("headerOrgName").value = user.organisationUnits[0].name;
      document.getElementById("headerOrgCode").value = user.organisationUnits[0].code;
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
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.auIncomeDetails;
    tei.programStage = programStage.auTotalIncome;

    fetchEvents();    
  }

  async function fetchEvents() {
    tei.year.value = document.getElementById('year-update').value;
    
    const dataSetValues = await fetchDataSet(tei.year.value);
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms = data.trackedEntityInstances[0].enrollments.filter(
          (enroll) =>
            enroll.program == tei.program  ||
            enroll.program == program.auProjectExpenseCategory || enroll.program==program.auProjectDescription 
            );
      
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, {id:tei.year.id, value: tei.year.value});
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

      const dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory , program.auProjectExpenseCategory , {id:tei.year.id, value: tei.year.value}) //data vlaues year wise

      totalExpenses = dataValuesEC[tei.year.value] && dataValuesEC[tei.year.value][dataElements.totalBudget] ? Number(dataValuesEC[tei.year.value][dataElements.totalBudget] ): 0;
      
      tei.dataValues = getProgramStageEvents(filteredPrograms, tei.programStage, tei.program, {id:tei.year.id, value: tei.year.value}) //data vlaues year wise
debugger;
        if (!tei.dataValues[tei.year.value]) {
          const data = [
            {
              dataElement: tei.year.id,
              value: tei.year.value,
            },
          ];

          tei.dataValues[tei.year.value] = {
            [tei.year.id]:tei.year.value,
            'tGS8X8B4BtK': dataSetValues[dataElements.fullAllocation] ? dataSetValues[dataElements.fullAllocation] : '',
          }
          tei.event = await createEvent(data);
        } else {
          tei.event = tei.dataValues[tei.year.value]["event"];
          if(dataSetValues[dataElements.fullAllocation]) tei.dataValues[tei.year.value]['tGS8X8B4BtK'] = dataSetValues[dataElements.fullAllocation];
          
          var calculatedElements = loadCalculatedVariables(tei.dataValues[tei.year.value], dataElements);

          calculatedElements.forEach(elements =>  {
          tei.dataValues[tei.year.value][elements.dataElement] = elements.value;
            pushDataElement(elements.dataElement, elements.value);
          });       
        }
        
      populateProgramEvents(tei.dataValues[tei.year.value]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {

    $("#accordion").empty();
    const projectRows = displayTotalIncome(dataValues);
      $('#accordion').html(projectRows);
      $('#accordion .textValue').toArray().forEach(el => {
        el.addEventListener("input", (ev) => {
          var { id, value, name } = ev.target;
          pushDataElement(id,(value ? unformatNumber(value): ''));
          ev.target.value = formatNumberInput(value);
          calculateTotals(name);
        })
      })
      $('#accordion .textArea').toArray().forEach(el => {
        el.addEventListener("input", (ev) => {
          var { id, value } = ev.target;
          pushDataElement(id, value);
        })
      })

    const organisationContributor = displayContributor(dataValues);
    $("#organisation-contributor").empty();
    $("#organisation-contributor").append(organisationContributor);

      $('#organisation-contributor .textValue').toArray().forEach(el => {
        el.addEventListener("input", (ev) => {
          var { id, value, name } = ev.target;
          value = value ? unformatNumber(value) : '';
          pushDataElement(id,value);
          ev.target.value = formatNumberInput(value);
          calculateTotals(name);
        })
      })
      $('#organisation-contributor .textArea').toArray().forEach(el => {
        el.addEventListener("input", (ev) => {
          var { id, value } = ev.target;
          pushDataElement(id, value);
        })
      })
    const totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").append(totalsRow);

    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();
      // Localize content
      $('body').localize();
  }
  function displayContributor(dataValues) {
    let rows = ''
      const organisation =dataValues[dataElements.organisation]
          ? dataValues[dataElements.organisation]
          : "";
      const incomeProvided = dataValues[dataElements.incomeProvided]
          ? dataValues[dataElements.incomeProvided]
          : "";

      rows += `<tr>
                <td>
                <input type="text" ${tei.disabled ? 'disabled readonly': ''} value="${organisation}" id="${dataElements.organisation}" class="form-control textArea currency">     
                </td>
                <td>
                    <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">
                        $
                          </div>
                        </div>
                        <input type="text" value="${formatNumberInput(incomeProvided)}" id="${dataElements.incomeProvided}" class="form-control textValue currency">                         
                    </div>
                </td>
            </tr>`

   return rows;
  }
  
  function displayTotals(dataValues) {
    var totalsRow = "";
    var totalIncome = 0;
    var deficit = 0;
    totalsId.forEach(details => {
      const restricted =
        dataValues && dataValues[dataElements[`${details.id}_restricted`]]
          ?  Number(dataValues[dataElements[`${details.id}_restricted`]])
          : "";
      const unrestricted =
        dataValues && dataValues[dataElements[`${details.id}_unrestricted`]]
          ? Number(dataValues[dataElements[`${details.id}_unrestricted`]])
          : "";
      totalIncome = Number(restricted) + Number(unrestricted) + totalIncome;

      const totalIncomeCategory = Number(restricted) + Number(unrestricted);
      totalsRow += `<tr>
        <td data-i18n="intro.${details.format}">${details.name}</td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" 
            value="${formatNumberInput(restricted)}" 
            id="${dataElements[`${details.id}_restricted`]}" 
            class="form-control restricted-${details.id} currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" 
            value="${formatNumberInput(unrestricted)}" 
            id="${dataElements[`${details.id}_unrestricted`]}" 
            class="form-control unrestricted-${details.id} currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" 
            value="${formatNumberInput(totalIncomeCategory)}" 
            id="${dataElements[`${details.id}_total`]}" 
            class="form-control totalIncome-${details.id}  currency" disabled readonly>
          </div>
        </td>
      </tr>`
      })
      deficit = totalIncome-totalExpenses;
      totalsRow += `<tr>
      <td colspan="3" align="right" data-i18n="intro.total_income_ar">Total Income</td>
      <td> <input type="text" 
      id='actual-income'
      value="${formatNumberInput(totalIncome)}" class="form-control input-budget currency" disabled></td>
    </tr>
      <tr>
      <td colspan="3" align="right" data-i18n="intro.actual_expense_EC">Total Actual Expenses (by Expense Categories)</td>
      <td> <input type="text" 
      id='actual-expenses'
      value="${formatNumberInput(totalExpenses)}" class="form-control input-budget currency" disabled></td>
    </tr>
    <tr>
    <td colspan="3" align="right" data-i18n="intro.deficit">Deficit/Surplus: </td>
    <td> <input type="text" 
    id='deficit'
    style="background:${deficit >= 0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" 
    value="${formatNumberInput(deficit)}" class="form-control input-budget currency" disabled></td>
    </tr>`;
    return totalsRow;
  }

  function displayTotalIncome(dataValues) {
    var categoryIndex = 0;
    var projectRows = `
            <table class="table table-striped table-md mb-0 " width="100%">
            <tbody>`
            categoryIncome.forEach(category=> {
              projectRows+= `<tr class="income-section-${category.format}"><td class="text-center income-category-header" colspan="4" data-i18n="intro.${category.format}">${category.name}</td></tr>
              <tr class="income-section-${category.format}">
              <th data-i18n="intro.incomeSubCategories">Income Sub-Categories</th>
              <th data-i18n="intro.restricted" class="text-center">Restricted</th>
              <th data-i18n="intro.unrestricted" class="text-center">Unrestricted</th>
              <th data-i18n="intro.total" class="text-center">Total</th>
              </tr>`
              category.options.forEach(option => {
                var restrictedSelected = categoryIndex < 4 ? true : false;
                var unrestrictedSelected = false;
                if(option.format == "ippf-unrestricted") {
                  restrictedSelected = true;
                  unrestrictedSelected = true;
                }
                const restrictedId = dataElements.projectTotalIncome[categoryIndex].restricted;
                const unrestrictedId = dataElements.projectTotalIncome[categoryIndex].unrestricted;
                const restricted = dataValues && dataValues[restrictedId]  ? dataValues[restrictedId] : "";
                const unrestricted = dataValues && dataValues[unrestrictedId] ? dataValues[unrestrictedId] : "";
                const totalIncome = Number(restricted) + Number(unrestricted);
                projectRows += `<tr class="income-section-${category.format}">
                <td class="font-weight-bold" data-i18n="intro.${option.format}" >${option.name}</td>
                <td>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$ </div>
                    </div>
                    <input 
                    type="text" 
                    ${(tei.disabled ||  restrictedSelected) ? 'disabled readonly': ''} 
                    id="${restrictedId}"
                    name="${option.id}-restricted-${category.shortName}" 
                    value="${formatNumberInput(restricted)}" 
                    class="form-control input-restricted-${category.shortName} textValue currency">
                  </div>
                </td>
                <td>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$ </div>
                    </div>
                    <input 
                    type="text" 
                    ${(tei.disabled || unrestrictedSelected) ? 'disabled readonly': ''} 
                    id="${unrestrictedId}"
                    name="${option.id}-unrestricted-${category.shortName}"  
                    value="${formatNumberInput(unrestricted)}" 
                    class="form-control input-unrestricted-${category.shortName} textValue currency">
                  </div>
                </td>
                <td>
                  <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">$</div>
                    </div>
                    <input 
                    type="text"
                    id="${option.id}" 
                    value="${formatNumberInput(totalIncome)}" 
                    disabled
                    class="form-control  currency">
                  </div>
                </td>
            </tr>`
                categoryIndex++;
              })
            })
            projectRows += `</tbody>
            </table> `
      projectRows += `</div>`

    return projectRows;
  }

  document.getElementById("year-update")
  .addEventListener("change", function (ev) {
    $('.loader-container').addClass('d-flex').removeClass('d-none');
    $('.myContainer').hide();
    window.localStorage.setItem("annualYear", ev.target.value);
    fetchEvents();
  });
});

// function loadCalculatedVariables(dataValues, dataElements) {
//   var restricted = 0, unrestricted = 0;
//   dataElements.projectTotalIncome.forEach(de => {
//     restricted += (dataValues[de.restricted] ? unformatNumber(dataValues[de.restricted]) : 0);
//     unrestricted += (dataValues[de.unrestricted] ? unformatNumber(dataValues[de.unrestricted]) : 0);
//   })

//   return [
//     {
//       dataElement: dataElements.restrictedIncome,
//       value: restricted
//     },
//     {
//       dataElement: dataElements.unrestrictedIncome,
//       value: unrestricted
//     }
//   ]

// }

function loadCalculatedVariables(dataValues, dataElements) {
  var localIncome_restricted = 0;
  var localIncome_unrestricted = 0;
  var internationalIncome_restricted = 0;
  var internationalIncome_unrestricted = 0;
  var ippfIncome_restricted = 0;
  var ippfIncome_unrestricted = 0;

  dataElements.projectTotalIncome.forEach((de,index) => {
    if(index<=7) {
      localIncome_restricted += dataValues[de.restricted]? Number(dataValues[de.restricted]): 0;
      localIncome_unrestricted += dataValues[de.unrestricted]? Number(dataValues[de.unrestricted]): 0;
    } else if(index <= 12) {
      internationalIncome_restricted += dataValues[de.restricted]? Number(dataValues[de.restricted]): 0;
      internationalIncome_unrestricted += dataValues[de.unrestricted]? Number(dataValues[de.unrestricted]): 0;
    }else {
      ippfIncome_restricted += dataValues[de.restricted]? Number(dataValues[de.restricted]): 0;
      ippfIncome_unrestricted += dataValues[de.unrestricted]? Number(dataValues[de.unrestricted]): 0;
    }
  })

  return [{
    dataElement:dataElements['localIncome_restricted'],
    value: localIncome_restricted
  },{
    dataElement:dataElements['localIncome_unrestricted'],
    value: localIncome_unrestricted
  },{
    dataElement:dataElements['localIncome_total'],
    value: localIncome_restricted + localIncome_unrestricted
  },{
    dataElement:dataElements['internationalIncome_restricted'],
    value: internationalIncome_restricted
  },{
    dataElement:dataElements['internationalIncome_unrestricted'],
    value: internationalIncome_unrestricted
  },{
    dataElement:dataElements['internationalIncome_total'],
    value: internationalIncome_restricted + internationalIncome_unrestricted
  },{
    dataElement:dataElements['ippfIncome_restricted'],
    value: ippfIncome_restricted
  },{
    dataElement:dataElements['ippfIncome_unrestricted'],
    value: ippfIncome_unrestricted
  },{
    dataElement:dataElements['ippfIncome_total'],
    value: ippfIncome_restricted + ippfIncome_unrestricted
  }]

}

// function calculateTotals(name) {
//   const ids = name.split('-');
//   const restrictedVal = $(`input[name="${ids[0]}-restricted"]`).val();
//   const unrestrictedVal = $(`input[name="${ids[0]}-unrestricted"]`).val();
//   const total = unformatNumber(restrictedVal) + unformatNumber(unrestrictedVal);
//   $(`#${ids[0]}`).val(total);

//   var restrictedTotals = 0;
//   var unrestrictedTotals = 0;
//   $(`.input-restricted`).each((_,el) => restrictedTotals += unformatNumber(el.value));
//   $(`.input-unrestricted`).each((_,el) => unrestrictedTotals += unformatNumber(el.value));
 
//   var globalTotals = Number(restrictedTotals) + Number(unrestrictedTotals);
//   $(`#deficit`).val(formatNumberInput(globalTotals-totalExpenses));
//   if(globalTotals-totalExpenses >= 0) $(`#deficit`)[0].style.setProperty('background','#C1E1C1', 'important')
//   else $(`#deficit`)[0].style.setProperty('background','#FAA0A0', 'important')   

//   $(`.restricted`).val(formatNumberInput(restrictedTotals));
//   $(`.unrestricted`).val(formatNumberInput(unrestrictedTotals));
//   $(`.totalIncome`).val(formatNumberInput(globalTotals));
//   pushDataElement($(`.unrestricted`)[0].id, unrestrictedTotals);
//   pushDataElement($(`.restricted`)[0].id, restrictedTotals);
//   pushDataElement($(`.totalIncome`)[0].id, globalTotals);
// }

function calculateTotals(name) {
  const ids = name.split('-');
  const restrictedVal = $(`input[name="${ids[0]}-restricted-${ids[2]}"]`).val();
  const unrestrictedVal = $(`input[name="${ids[0]}-unrestricted-${ids[2]}"]`).val();
  const total = unformatNumber(restrictedVal) + unformatNumber(unrestrictedVal);
  $(`#${ids[0]}`).val(total);

  var restrictedTotals = 0;
  var unrestrictedTotals = 0;
  $(`.input-restricted-${ids[2]}`).each((_,el) => restrictedTotals += unformatNumber(el.value));
  $(`.input-unrestricted-${ids[2]}`).each((_,el) => unrestrictedTotals += unformatNumber(el.value));
 
  var globalTotals = Number(restrictedTotals) + Number(unrestrictedTotals);

  $(`.restricted-${ids[2]}`).val(formatNumberInput(restrictedTotals));
  $(`.unrestricted-${ids[2]}`).val(formatNumberInput(unrestrictedTotals));
  $(`.totalIncome-${ids[2]}`).val(formatNumberInput(globalTotals));
  pushDataElement($(`.unrestricted-${ids[2]}`)[0].id, unrestrictedTotals);
  pushDataElement($(`.restricted-${ids[2]}`)[0].id, restrictedTotals);
  pushDataElement($(`.totalIncome-${ids[2]}`)[0].id, globalTotals);

  const localIncome = unformatNumber($(`#${dataElements.localIncome_total}`).val());
  const internationalIncome = unformatNumber($(`#${dataElements.internationalIncome_total}`).val());
  const ippfIncome = unformatNumber($(`#${dataElements.ippfIncome_total}`).val());
  const totalIncome = Number(localIncome) + Number(internationalIncome) + Number(ippfIncome);
  const deficit = totalIncome-totalExpenses;
  $('#actual-income').val(formatNumberInput(totalIncome)); 
  $('#deficit').val(formatNumberInput(deficit)); 
  if(deficit >= 0) $('#deficit')[0].style.setProperty('background','#C1E1C1', 'important')
  else $('#deficit')[0].style.setProperty('background','#FAA0A0', 'important')    
}
