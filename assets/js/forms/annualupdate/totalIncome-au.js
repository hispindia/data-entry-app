import { createEvent, getEvents, getProgramStageEvents, getTEI, pushDataElement } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, unformatNumber, getYears } from "../func.js";

var totalExpenses = '';
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
        "name": "IPPF Unrestricted Grant",
        "code": "IPPF Unrestricted Grant",
        "id": "D0YD3aNWqGp",
        format: "ippf-unrestricted"
      },
      {
        "name": "IPPF Restricted Grant",
        "code": "IPPF Restricted Grant",
        "id": "fOsunx90DGG",
        format: "ippf-restricted"
      }
    ],
  },
];

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
    ['aoc-reporting', 'trt-review'].forEach(page => {
      if(user.hideReporting.includes(page.split('-')[0])) $(`.${page}`).hide();
    })
    if(!user.hideReporting.includes('aoc')) {
      $('.aoc-users').show();
    }
    if(user.hideReporting.includes('core')) {
      $('.core-users').show();
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

        if (!tei.dataValues[tei.year.value]) {
          const data = [
            {
              dataElement: tei.year.id,
              value: tei.year.value,
            },
          ];

          tei.dataValues[tei.year.value] = {
            [tei.year.id]:tei.year.value,
          }
          tei.event = await createEvent(data);
        } else {
          tei.event = tei.dataValues[tei.year.value]["event"];
          var calculatedElements = loadCalculatedVariables(tei.dataValues[tei.year.value], {
            projectTotalIncome: dataElements.projectTotalIncome,
            restrictedIncome: dataElements.restrictedIncome,
            unrestrictedIncome: dataElements.unrestrictedIncome,
          });

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
          value = value ? unformatNumber(value) : '';
          pushDataElement(id,value);
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

    const totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    
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
      const restricted = dataValues[dataElements.restrictedIncome]
          ?  Number(dataValues[dataElements.restrictedIncome])
          : "0";
      const unrestricted = dataValues[dataElements.unrestrictedIncome]
          ?  Number(dataValues[dataElements.unrestrictedIncome])
          : "0";

      const totalIncome = Number(restricted) + Number(unrestricted);
      const expense = totalExpenses ? Number(totalExpenses) : 0;
      const deficit =  totalIncome -expense;
      
      totalsRow += `<tr>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" 
              value="${formatNumberInput(restricted)}" 
              id="${dataElements.restrictedIncome}" 
              class="form-control restricted  currency" 
              disabled readonly />
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
              id="${dataElements.unrestrictedIncome}" 
              class="form-control unrestricted  currency" 
              disabled readonly />
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(totalIncome)}" 
            id="${dataElements.totalIncome}" 
            class="form-control totalIncome  currency" 
            disabled readonly />
          </div>
        </td>

        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div> <input type="text" 
            id='deficit'
            style="background:${deficit >= 0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" 
            value="${formatNumberInput(deficit)}" 
            class="form-control input-budget currency" 
            disabled readonly />
          </div>
        </td>
      </tr>

      `;
    return totalsRow;
  }

  function displayTotalIncome(dataValues) {
    var categoryIndex = 0;
    var projectRows = `
            <table class="table table-striped table-md mb-0 " width="100%">
            <tbody>`
            categoryIncome.forEach(category=> {
              projectRows+= `<tr><td class="text-center font-weight-bold" colspan="4" data-i18n="intro.${category.format}">${category.name}</td></tr>
              <tr>
              <th data-i18n="intro.incomeSubCategories">Income Sub-Categories </th>
              <th data-i18n="intro.restricted" class="text-center">Restricted</th>
              <th data-i18n="intro.unrestricted" class="text-center">Unrestricted</th>
              <th data-i18n="intro.total" class="text-center">Total</th>
              </tr>`
              category.options.forEach(option => {
                const restrictedId = dataElements.projectTotalIncome[categoryIndex].restricted;
                const unrestrictedId = dataElements.projectTotalIncome[categoryIndex].unrestricted;
                const restricted = dataValues && dataValues[restrictedId]  ? dataValues[restrictedId] : "";
                const unrestricted = dataValues && dataValues[unrestrictedId] ? dataValues[unrestrictedId] : "";
                const totalIncome = Number(restricted) + Number(unrestricted);
                projectRows += `<tr>
                <td class="font-weight-bold" data-i18n="intro.${option.format}" >${option.name}</td>
                <td>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$ </div>
                    </div>
                    <input 
                    type="text" 
                    ${tei.disabled ? 'disabled readonly': ''} 
                    id="${restrictedId}"
                    name="${option.id}-restricted" 
                    value="${formatNumberInput(restricted)}" 
                    class="form-control input-restricted textValue currency">
                  </div>
                </td>
                <td>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$ </div>
                    </div>
                    <input 
                    type="text" 
                    ${tei.disabled ? 'disabled readonly': ''} 
                    id="${unrestrictedId}"
                    name="${option.id}-unrestricted"  
                    value="${formatNumberInput(unrestricted)}" 
                    class="form-control input-unrestricted textValue currency">
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
    window.localStorage.setItem("annualYear", ev.target.value);
    fetchEvents();
  });
});

function loadCalculatedVariables(dataValues, dataElements) {
  var restricted = 0, unrestricted = 0;
  dataElements.projectTotalIncome.forEach(de => {
    restricted += (dataValues[de.restricted] ? unformatNumber(dataValues[de.restricted]) : 0);
    unrestricted += (dataValues[de.unrestricted] ? unformatNumber(dataValues[de.unrestricted]) : 0);
  })

  return [
    {
      dataElement: dataElements.restrictedIncome,
      value: restricted
    },
    {
      dataElement: dataElements.unrestrictedIncome,
      value: unrestricted
    }
  ]

}

function calculateTotals(name) {
  const ids = name.split('-');
  const restrictedVal = $(`input[name="${ids[0]}-restricted"]`).val();
  const unrestrictedVal = $(`input[name="${ids[0]}-unrestricted"]`).val();
  const total = unformatNumber(restrictedVal) + unformatNumber(unrestrictedVal);
  $(`#${ids[0]}`).val(total);

  var restrictedTotals = 0;
  var unrestrictedTotals = 0;
  $(`.input-restricted`).each((_,el) => restrictedTotals += unformatNumber(el.value));
  $(`.input-unrestricted`).each((_,el) => unrestrictedTotals += unformatNumber(el.value));
 
  var globalTotals = Number(restrictedTotals) + Number(unrestrictedTotals);
  $(`#deficit`).val(formatNumberInput(globalTotals-totalExpenses));
  if(globalTotals-totalExpenses >= 0) $(`#deficit`)[0].style.setProperty('background','#C1E1C1', 'important')
  else $(`#deficit`)[0].style.setProperty('background','#FAA0A0', 'important')   

  $(`.restricted`).val(formatNumberInput(restrictedTotals));
  $(`.unrestricted`).val(formatNumberInput(unrestrictedTotals));
  $(`.totalIncome`).val(formatNumberInput(globalTotals));
  pushDataElement($(`.unrestricted`)[0].id, unrestrictedTotals);
  pushDataElement($(`.restricted`)[0].id, restrictedTotals);
  pushDataElement($(`.totalIncome`)[0].id, globalTotals);
}
