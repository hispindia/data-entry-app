var totalExpenses = 0;
var negativeIndex = {
  localIncome: 0,
  internationalIncome: 8,
  ippfIncome: 13
};
var filledIndex = {
  localIncome: 0,
  internationalIncome: 8,
  ippfIncome: 13
};
const detailsIndex = {
  localIncome: 8,
  internationalIncome: 13,
  ippfIncome: 15
}
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

const subCategoryIncome = []

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
          
          const userDisabled = data.userGroups.find(group => disabledUserGroups.includes(group.id));
          const trtUserDisabled = data.userGroups.find(group => disabledTRTUserGroups.includes(group.id));
          const edUserDisabled = data.userGroups.find(group => disabledEDUserGroups.includes(group.id));

          if(userDisabled || trtUserDisabled) {
              tei.disabled = true;
          } 
          let disabledValues = '';
          if(!userDisabled) {
              disabledValues += 'aoc'
          }
          if(!trtUserDisabled) {
              disabledValues += 'trt'
          }
          if(edUserDisabled) {
              disabledValues += 'ed'
          }
          window.localStorage.setItem('hideReporting', disabledValues);
        }
  
        if(window.localStorage.getItem("hideReporting").includes('aoc')) {
          $('.aoc-reporting').hide();
        }
        if(window.localStorage.getItem("hideReporting").includes('trt')) {
          $('.trt-review').hide();
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
    filledIndex = {
    localIncome: 0,
    internationalIncome: 8,
    ippfIncome: 13
  };
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
      $('#push-button').append(`<button ${tei.disabled ? 'disabled readonly': ''} class="btn btn-success p-2 my-2" onclick="event.preventDefault();disableAnnualUpdate()">Submit Annual Report </button>`)
    }
    if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
      $('#push-button').append(`<button ${tei.disabled ? 'disabled readonly': ''} class="btn btn-success p-2 my-2" onclick="event.preventDefault();enableAnnualUpdate()">Reopen Annual Report </button>`)
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
                <input type="value" value="${organisation}" id="${dataElements.organisation}" onblur="pushDataElement(this.id,this.value)" class="form-control currency">     
                </td>
                <td>
                    <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">
                            $
                          </div>
                        </div>
                        <input type="number" ${tei.disabled ? 'disabled readonly': ''} ${tei.disabledYear[year] ? 'disabled' : ''}  value="${incomeProvided}" id="${dataElements.incomeProvided}" onblur="pushDataElement(this.id,this.value)" class="form-control currency">                         
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
            <input type="text" value="${displayValue(restricted)}" id="${dataElements[`${details.id}_restricted`]}" 
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
            <input type="text" value="${displayValue(unrestricted)}" id="${dataElements[`${details.id}_unrestricted`]}" 
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
            <input type="text" value="${displayValue(totalIncomeCategory)}" id="${dataElements[`${details.id}_total`]}" 
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
    value="${displayValue(totalIncome)}" class="form-control input-budget currency" disabled></td>
  </tr>
    <tr>
    <td colspan="3" align="right" data-i18n="intro.actual_expense_EC">Total Actual Expenses (by Expense Categories)</td>
    <td> <input type="text" 
    id='actual-expenses'
    value="${displayValue(totalExpenses)}" class="form-control input-budget currency" disabled></td>
  </tr>
  <tr>
  <td colspan="3" align="right" data-i18n="intro.deficit">Deficit/Surplus: </td>
  <td> <input type="text" 
  id='deficit'
  style="background:${deficit >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" 
  value="${displayValue(deficit)}" class="form-control input-budget currency" disabled></td>
</tr>`;
    return totalsRow;
  }

  function displayTotalIncome(dataValues) {
    var projectRows = "";
    var hasValue = false;
    projectRows = `
      <div class="accordion">
        <div class="accordion-header active" role="button" data-toggle="collapse"
          data-target="#panel-body-1">
          <h4>
            <span class="number">1</span> <span data-i18n="intro.locally-generated">Locally generated income</span>
          </h4>
        </div>
        <div class="accordion-body collapse" id="panel-body-1" data-parent="#accordion">`;
    for (let i = 0; i <= 7; i++) {
      const income = dataElements.projectTotalIncome[i];
      if(dataValues[income.subCategory]) {
        hasValue = true;
        filledIndex['localIncome']++;
        
        projectRows += addProjectIncome(income, dataValues, categoryIncome[0].options, 'localIncome');
      }
    }
    if(!hasValue) {
      projectRows += addProjectIncome(dataElements.projectTotalIncome[0], dataValues, categoryIncome[0].options, 'localIncome');
      filledIndex['localIncome']++;
    }
    projectRows += `  
  <div class="btn-localIncome btn-wrap mt-3">
    <div class="btn-wrap-inner">
      <a  onclick="addIncome('localIncome', '0')" class="plus">+</a>
      <a  onclick="removeIncome('localIncome')" class="minus">-</a>                 
    </div>                
  </div>
  <hr>
  <div class="form-row">
    <div class="col-sm-12 text-right">
      <div class="form-group text-end mar-b-0">
      <input type="button" value="SAVE AS DRAFT" data-i18n="[value]intro.save_as_draft"  class="btn btn-secondary">
      <input
            type="button"
            value="NEXT"
            data-i18n="[value]intro.next" 
            onClick=changePanel('panel-body-2')
            class="btn btn-primary"
            />
      </div>
    </div>
  </div>
  
  </div>
  </div>`

    projectRows += `
  <div class="accordion">
    <div class="accordion-header active" role="button" data-toggle="collapse"
      data-target="#panel-body-2">
      <h4>
        <span class="number">2</span>  <span data-i18n="intro.international-income">International income (Non - IPPF)</span>
      </h4>
    </div>
    <div class="accordion-body collapse" id="panel-body-2" data-parent="#accordion">`;
    hasValue = false;
    for (let i =8 ; i <= 12; i++) {
    const income = dataElements.projectTotalIncome[i];
    if(dataValues[income.subCategory]) {
      hasValue = true;
      filledIndex['internationalIncome']++;
      
      projectRows += addProjectIncome(income, dataValues, categoryIncome[1].options, 'internationalIncome');
    }
  }
  if(!hasValue) {
    projectRows += addProjectIncome(dataElements.projectTotalIncome[8], dataValues, categoryIncome[1].options, 'internationalIncome');
    filledIndex['internationalIncome']++;
  }
    projectRows += `     
  <div class="btn-internationalIncome btn-wrap mt-3">
    <div class="btn-wrap-inner">
      <a  onclick="addIncome('internationalIncome', '1')" class="plus">+</a>
      <a  onclick="removeIncome('internationalIncome')" class="minus">-</a>                 
    </div>                
  </div>
  <hr>
  <div class="form-row">
    <div class="col-sm-12 text-right">
      <div class="form-group text-end mar-b-0">
      <input type="button" value="SAVE AS DRAFT" data-i18n="[value]intro.save_as_draft"  class="btn btn-secondary"><input
            type="button"
            value="NEXT"
            data-i18n="[value]intro.next" 
            onClick=changePanel('panel-body-3')
            class="btn btn-primary"
            />
      </div>
    </div>
  </div> 
  </div>
</div> `
    projectRows += `
  <div class="accordion">
    <div class="accordion-header active" role="button" data-toggle="collapse"
      data-target="#panel-body-3">
      <h4>
        <span class="number">3</span>  <span data-i18n="intro.ippf-income">IPPF income</span>
      </h4>
    </div>
    <div class="accordion-body collapse" id="panel-body-3" data-parent="#accordion">`;
    hasValue=false;
    for (let i = 13; i <= 14; i++) {
    const income = dataElements.projectTotalIncome[i];
    if(dataValues[income.subCategory]) {
      hasValue = true;
      filledIndex['ippfIncome']++;
      
      projectRows += addProjectIncome(income, dataValues, categoryIncome[2].options, 'ippfIncome');
    }
  }
  if(!hasValue) {
    projectRows += addProjectIncome(dataElements.projectTotalIncome[13], dataValues, categoryIncome[2].options, 'ippfIncome');
    filledIndex['ippfIncome']++;
  }
    projectRows += `  
  <div class="btn-ippfIncome btn-wrap mt-3">
    <div class="btn-wrap-inner">
      <a  onclick="addIncome('ippfIncome', '2')" class="plus">+</a>
      <a  onclick="removeIncome('ippfIncome')" class="minus">-</a>                 
    </div>                
  </div>
  <hr>
  <div class="form-row">
    <div class="col-sm-12 text-right">
      <div class="form-group text-end mar-b-0">
      <input type="button" value="SAVE AS DRAFT" data-i18n="[value]intro.save_as_draft"  class="btn btn-secondary">
      <input
              id="saveProjectFocusArea"
              type="button"
              data-i18n="[value]intro.submit" 
              onclick="submitIncomeByDonor()"
              value="SUBMIT"
              class="btn btn-primary"
            />
      </div>
    </div>
  </div>
  </div>
</div>     `
    return projectRows;
  }

  fetchOrganizationUnitUid();
});

function addProjectIncome(income, dataValues, subCategories, name) {
  var projectRows = ''
  const subCategory = dataValues && dataValues[income.subCategory]
    ? dataValues[income.subCategory] : "";
  const unrestricted = dataValues && dataValues[income.unrestricted]
    ? dataValues[income.unrestricted] : "";
  const restricted = dataValues && dataValues[income.restricted]
    ? dataValues[income.restricted] : "";
  const totalIncome = Number(restricted) + Number(unrestricted);

  projectRows += `
  <div class="budget-wrap-${name} cont-wrap-inner">

        <div class="form-row">
          <div class="form-group col-md-12 textbox-wrap">
          <label for="" data-i18n="intro.sub_category">Sub Category</label>
           <select
            class="form-control" 
            ${tei.disabled ? 'disabled readonly': ''} 
            id="${income.subCategory}"
            onchange="pushDataElement(this.id,this.value)"
            >
            <option class="choose" value="" data-i18n="intro.choose">Choose </option>`
  subCategories.forEach(sp => {
    projectRows += `<option ${(subCategory == sp.code) ? "selected" : ''} value="${sp.code}" data-i18n="intro.${sp.format}">${sp.name}</option>`
  })
  projectRows += `</select>
            <div class="invalid-feedback"> Error here </div>
          </div>
        </div>
        <table class="table table-striped table-md mb-0 " width="100%">
          <thead>
            <tr>
              <th data-i18n="intro.restricted">Restricted</th>
              <th data-i18n="intro.unrestricted">Unrestricted</th>
              <th data-i18n="intro.total">Total</th>
              </tr>
          </thead>
          <tbody>
            <tr>
              <td>
              <div class="input-group">
                <div class="input-group-prepend">
                   <div class="input-group-text">$ </div>
                </div>
                <input 
                type="number" 
                ${tei.disabled ? 'disabled readonly': ''} 
                id="${income.restricted}"
                value="${restricted}" 
                oninput="pushDataElement(this.id,this.value);calculateTotals('${income.restricted}', '${income.unrestricted}', '${name}')" 
                class="form-control input-restricted-${name} currency">
              </div>
              </td>
              <td>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">$</div>
                </div>
                <input 
                type="number" 
                ${tei.disabled ? 'disabled readonly': ''} 
                id="${income.unrestricted}" 
                value="${unrestricted}" 
                oninput="pushDataElement(this.id,this.value);calculateTotals('${income.restricted}', '${income.unrestricted}', '${name}')" 
                class="form-control input-unrestricted-${name} currency">
              </div>
              </td>
              <td>
                <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">$</div>
                  </div>
                  <input 
                  type="text"
                  id="${income.restricted}-${income.unrestricted}" 
                  value="${totalIncome}" 
                  disabled
                  class="form-control  currency">
                </div>
              </td>
            </tr>
          </tbody>
        </table> 
      </div>`

  return projectRows;
}

async function disableAnnualUpdate() {
  await pushDataElement(dataElements.submitAnnualUpdate,true);
  alert ("Report Submitted Successfully!");
}

async function enableAnnualUpdate() {
  await pushDataElement(dataElements.submitAnnualUpdate,false);
  alert ("Report Reopened Successfully!");
}