var totalExpenses = 0;
const totalsId = [{
  id: 'localIncome',
  name: 'Locally generated income',
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
    name: "Locally generated income",
    code: "Locally generated income",
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
    name: "IPPF income",
    code: "IPPF income",
    id: "iKycH3397wP",
    shortName: 'ippfIncome',
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

  document
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchOrganizationUnitUid()
    });

  document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      window.localStorage.setItem("annualYearAR", ev.target.value);
      fetchEvents();
    });

    document
    .getElementById("reporting-periodicity")
    .addEventListener("change", function (ev) {
      window.localStorage.setItem("annualReporting", ev.target.value);
      fetchEvents();
    });
  

    async function fetchOrganizationUnitUid() {
      try {
        const response = await fetch(
          `../../me.json?fields=id,username,userGroups[id,name],organisationUnits[id,name,path,code,level,parent[id,name]]`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        var data; 
        const masterOU =  window.localStorage.getItem("masterOU");
        if(masterOU) {
          data = {organisationUnits: [{...JSON.parse(masterOU)}]} ;
          tei.disabled = window.localStorage.getItem("userDisabled");
        }
        if(!data) {
          data = await response.json();

          const userConfig = userGroupConfig(data)
          tei.disabled = userConfig.disabled;
          window.localStorage.setItem('hideReporting', userConfig.disabledValues);
        }
  
        if(window.localStorage.getItem("hideReporting").includes('aoc')) {
          $('.aoc-reporting').hide();
        }
        if(window.localStorage.getItem("hideReporting").includes('trt')) {
          $('.trt-review').hide();
        }
        if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
          $('.aoc-users').show();
        }
        if(window.localStorage.getItem("hideReporting").includes('core')) {
          $('.core-users').show();
        }
  
      if (data.organisationUnits && data.organisationUnits.length > 0) {
        tei.orgUnit = data.organisationUnits[0].id;
        document.getElementById("headerOrgId").value = data.organisationUnits[0]
          .parent
          ? data.organisationUnits[0].parent.name
          : "";

        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;
        document.getElementById("headerOrgCode").value =
          data.organisationUnits[0].code;

        const fpaIndiaButton = document
          .querySelector(".fa-building-o")
          .closest("a");
        if (fpaIndiaButton) {
          const fpaIndiaDiv = fpaIndiaButton.querySelector("div");
          if (fpaIndiaDiv) {
            fpaIndiaDiv.textContent = data.organisationUnits[0].name;
          }
        }

        assignValues()
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }


  function assignValues() {
    var annualReporting = window.localStorage.getItem("annualReporting");
    if(annualReporting) document.getElementById('reporting-periodicity').value = annualReporting;

    tei.program = program.arTotalIncome;
    tei.programStage = programStage.arTotalIncome;
    dataElements.period.value = document.getElementById("headerPeriod").value;
    dataElements.periodicity.value = document.getElementById("reporting-periodicity").value;

    tei.year = {
      ...tei.year,
      start: dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }

    var yearOptions = '';
    tei.disabledYear = {};
    for(let year=tei.year.start; year <=tei.year.end; year++) {
      if(tei.hideReportingYears.includes(year)) continue;
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById('year-update').innerHTML = yearOptions;
    document.getElementById('year-update').options[0].selected = true;
    var annualYear = window.localStorage.getItem("annualYearAR");
    if(annualYear) document.getElementById('year-update').value = annualYear;

  }

  async function fetchEvents(year) {
    if (!year) year = document.getElementById("year-update").value;
    dataElements.periodicity.value = document.getElementById("reporting-periodicity").value;

    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program || enroll.program== program.arProjectExpenseCategory);

      const dataValuesEC = getProgramStagePeriodicity(filteredPrograms, program.arProjectExpenseCategory, programStage.arProjectExpenseCategory, { id: dataElements.year.id, value: year }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value }); //data vlaues period wise
      if(dataValuesEC) {
        totalExpenses = dataValuesEC[dataElements.totalExpenses] ?  dataValuesEC[dataElements.totalExpenses]: 0;
      }
      const dataValues = getProgramStagePeriodicity(filteredPrograms, tei.program, tei.programStage, { id: dataElements.year.id, value: year }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value }); //data vlaues period wise
      if(dataValues && dataValues[dataElements.submitAnnualUpdate])  tei.disabled = true;

      if (!dataValues) {
        if(year && dataElements.period.value && dataElements.periodicity.value) {
          let data = [{
            dataElement: dataElements.year.id,
            value: year
          },{
            dataElement: dataElements.period.id,
            value: dataElements.period.value
          },{
            dataElement: dataElements.periodicity.id,
            value: dataElements.periodicity.value
          }];
          tei.event = await createEvent(data);
        }
      }
      else {
        tei.event = dataValues['event'];
        tei.dataValues = dataValues;

        var calculatedElements = loadCalculatedVariables(tei.dataValues, dataElements);
        calculatedElements.forEach((elements) => {
          tei.dataValues[elements.dataElement] = elements.value;
          pushDataElement(elements.dataElement, elements.value);
        });
      }

      populateProgramEvents(tei.dataValues);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    $('#push-button').empty();
    if(window.localStorage.getItem("hideReporting").includes('ed')) {
      $('#push-button').append(`<button class="btn btn-success p-2 my-2" onclick="event.preventDefault();disableAnnualUpdate()">Submit Annual Report </button>`)
    }
    if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
      $('#push-button').append(`<button class="btn btn-success p-2 my-2" onclick="event.preventDefault();enableAnnualUpdate()">Reopen Annual Report </button>`)
    }

    $("#accordion").empty();
    const projectRows = displayTotalIncome(dataValues);
    $("#accordion").append(projectRows);

    const organisationContributor = displayContributor(dataValues);
    $("#organisation-contributor").empty();
    $("#organisation-contributor").append(organisationContributor);

    const totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    
      // Localize content
      $('body').localize();
  }

  function displayContributor(dataValues, year) {
    let rows = ''
    const organisation =
      dataValues && dataValues[dataElements.organisation]
        ? dataValues[dataElements.organisation]
        : "";
    const incomeProvided =
      dataValues && dataValues[dataElements.incomeProvided]
        ? dataValues[dataElements.incomeProvided]
        : "";

    rows += `<tr>
                <td>
                <input type="value" value="${organisation}" id="${dataElements.organisation}" oninput="pushDataElement(this.id,this.value)" class="form-control currency">     
                </td>
                <td>
                    <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">
                            $
                          </div>
                        </div>
                        <input type="text" ${tei.disabled ? 'disabled readonly': ''} ${tei.disabledYear[year] ? 'disabled' : ''}  value="${formatNumberInput(incomeProvided)}" id="${dataElements.incomeProvided}" oninput="formatNumberInput(this);pushDataElement(this.id,unformatNumber(this.value))" class="form-control currency">                         
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
            <input type="text" value="${formatNumberInput(restricted)}" id="${dataElements[`${details.id}_restricted`]}" 
            class="form-control  totalIncome-${details.id}-restricted currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(unrestricted)}" id="${dataElements[`${details.id}_unrestricted`]}" 
            class="form-control  totalIncome-${details.id}-unrestricted currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(totalIncomeCategory)}" id="${dataElements[`${details.id}_total`]}" 
            class="form-control totalIncome-${details.id}-total  currency" disabled readonly>
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
  style="background:${deficit >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" 
  value="${formatNumberInput(deficit)}" class="form-control input-budget currency" disabled></td>
</tr>`;
    return totalsRow;
  }

  function displayTotalIncome(dataValues) {
    var projectRows = "";
    var categoryIndex = 0;
    projectRows = `
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
              value="${formatNumberInput(restricted)}" 
              oninput="formatNumberInput(this);pushDataElement(this.id,unformatNumber(this.value));calculateTotals('${restrictedId}', '${unrestrictedId}', '${category.shortName}')" 
              class="form-control input-restricted-${category.shortName} currency">
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
              value="${formatNumberInput(unrestricted)}" 
              oninput="formatNumberInput(this);pushDataElement(this.id,unformatNumber(this.value));calculateTotals('${restrictedId}', '${unrestrictedId}', '${category.shortName}')" 
              class="form-control input-unrestricted-${category.shortName} currency">
            </div>
          </td>
          <td>
            <div class="input-group">
              <div class="input-group-prepend">
                  <div class="input-group-text">$</div>
              </div>
              <input 
              type="text"
              id="${restrictedId}-${unrestrictedId}" 
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
    return projectRows;
  }

  fetchOrganizationUnitUid();
});

async function disableAnnualUpdate() {
  await pushDataElement(dataElements.submitAnnualUpdate,true);
  alert ("Report Submitted Successfully!");
}

async function enableAnnualUpdate() {
  await pushDataElement(dataElements.submitAnnualUpdate,'');
  alert ("Report Reopened Successfully!");
}

function calculateTotals(restricted, unrestricted,id) {
  const restrictedVal = $(`#${restricted}`)? $(`#${restricted}`).val(): '';
  const unrestrictedVal = $(`#${unrestricted}`)? $(`#${unrestricted}`).val(): '';
  const total = unformatNumber(restrictedVal) + unformatNumber(unrestrictedVal);
  if($(`#${restricted}-${unrestricted}`)) {
    $(`#${restricted}-${unrestricted}`).val(formatNumberInput(total));
  }

  var restrictedTotals = 0;
  document.querySelectorAll(`.input-restricted-${id}`).forEach(ev=> {
    var {value} = ev;
    restrictedTotals += unformatNumber(value);
  })
 
  var unrestrictedTotals = 0;
  document.querySelectorAll(`.input-unrestricted-${id}`).forEach(ev=> {
    var {value} = ev;
    unrestrictedTotals += unformatNumber(value);
  })
  var globalTotals = Number(unrestrictedTotals) + Number(restrictedTotals);
  
  $(`.totalIncome-${id}-unrestricted`).val(formatNumberInput(unrestrictedTotals));
  $(`.totalIncome-${id}-restricted`).val(formatNumberInput(restrictedTotals));
  $(`.totalIncome-${id}-total`).val(formatNumberInput(globalTotals));
  pushDataElement($(`.totalIncome-${id}-unrestricted`)[0].id, unrestrictedTotals);
  pushDataElement($(`.totalIncome-${id}-restricted`)[0].id, restrictedTotals);
  pushDataElement($(`.totalIncome-${id}-total`)[0].id, globalTotals);
  
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
function submitProjects() {
  alert("Data Saved Successfully!")
}