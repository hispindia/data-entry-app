var filledYear = {};
var totalExpenses = {};
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
      fetchEvents();
    });
    document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      tei.disabledYear = {};
      for(let year=tei.year.start; year <=tei.year.end; year++) {
        if(year<ev.target.value)  tei.disabledYear[year] = true;
      }
      window.localStorage.setItem("annualYear", ev.target.value);
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

          const userConfig = userConfig()
          tei.disabled = userConfig.disabled;
          window.localStorage.setItem('hideReporting', userConfig.disabledValues);
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

        assignValues();
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }
  function assignValues() {

    dataElements.period.value = document.getElementById("headerPeriod").value;
    tei.program = program.auIncomeDetails;
    tei.programStage = programStage.auTotalIncome;
    tei.year = {
      ...tei.year,
      start: dataElements.period.value.split(" - ")[0],
      end: dataElements.period.value.split(" - ")[1],
    };

    var yearOptions = '';
    tei.disabledYear = {};
    var annualYear = window.localStorage.getItem("annualYear");
    for(let year=tei.year.start; year <=tei.year.end; year++) {
      if(tei.hideYears.includes(year))  tei.disabledYear[year] = true;
      if(tei.hideYears.includes(year)) continue;
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById('year-update').innerHTML = yearOptions;
    document.getElementById('year-update').options[0].selected = true;
    if(annualYear) document.getElementById('year-update').value = annualYear;

  }
  async function fetchEvents() {
    const selectedYear = document.getElementById('year-update').value;
    
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) =>
            enroll.program == tei.program  ||
            enroll.program == program.auProjectExpenseCategory || enroll.program==program.auProjectDescription 
            );
      
            const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  dataElements.year.id);
            if(dataValuesPD[selectedYear] && dataValuesPD[selectedYear][dataElements.submitAnnualUpdate])  tei.disabled = true;
      
      const dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory , program.auProjectExpenseCategory , dataElements.year.id) //data vlaues year wise

      for (let year = tei.year.start; year <= tei.year.end; year++) {
        totalExpenses[year] = dataValuesEC[year] && dataValuesEC[year][dataElements.totalBudget] ? Number(dataValuesEC[year][dataElements.totalBudget] ): 0;
      }
       tei.dataValues = getProgramStageEvents(filteredPrograms, tei.programStage, tei.program, dataElements.year.id) //data vlaues year wise

      for (let year = tei.year.start; year <= tei.year.end; year++) {
        if (!tei.dataValues[year]) {
          const data = [
            {
              dataElement: dataElements.year.id,
              value: year,
            },
            {
              dataElement: dataElements.period.id,
              value: dataElements.period.value,
            },
          ];

          tei.dataValues[year] = {
            [dataElements.year.id]:year,
            [dataElements.period.id]: dataElements.period.value,
          }
          tei.event = {
            ...tei.event,
           [year]: await createEvent(data)
          }
        } else {
          tei.event = {
            ...tei.event,
            [year]: tei.dataValues[year]["event"],
          };
        }
      }
      populateProgramEvents(tei.dataValues);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    const period = {
      start: tei.year.start,
      end: tei.year.end,
    };

    $("#accordion").empty();
    const projectRows = displayTotalIncome(dataValues, period);
    $("#accordion").append(projectRows);

    const organisationContributor = displayContributor(dataValues, period);
    $("#organisation-contributor").empty();
    $("#organisation-contributor").append(organisationContributor);

    const totalsRow = displayTotals(dataValues, period);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    
      // Localize content
      $('body').localize();
  }
  function displayContributor(dataValues, period) {
    let rows = ''
    for (let year = period.start; year <= period.end; year++) {
      const organisation =
        dataValues[year] && dataValues[year][dataElements.organisation]
          ? dataValues[year][dataElements.organisation]
          : "";
      const incomeProvided =
        dataValues[year] && dataValues[year][dataElements.incomeProvided]
          ? dataValues[year][dataElements.incomeProvided]
          : "";

      rows += `<tr>
                <td>${year}</td>
                <td>
                <input type="value"  ${tei.disabled ? 'disabled readonly': ''} value="${organisation}" id="${dataElements.organisation}-${year}" onblur="pushDataElementYear(this.id,this.value)" class="form-control currency">     
                </td>
                <td>
                    <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">
                            $
                          </div>
                        </div>
                        <input type="number" ${tei.disabledYear[year] ? 'disabled':''}  value="${incomeProvided}" id="${dataElements.incomeProvided}-${year}" onblur="pushDataElementYear(this.id,this.value)" class="form-control currency">                         
                    </div>
                </td>
            </tr>`
    }
   return rows;
  }

  function displayTotals(dataValues, period) {
    var totalsRow = "";
    for (let i = period.start; i <= period.end; i++) {
      const restricted =
        dataValues[i] && dataValues[i][dataElements.restrictedIncome]
          ?  Number(dataValues[i][dataElements.restrictedIncome])
          : "0";
      const unrestricted =
        dataValues[i] && dataValues[i][dataElements.unrestrictedIncome]
          ?  Number(dataValues[i][dataElements.unrestrictedIncome])
          : "0";

      const totalIncome = Number(restricted) + Number(unrestricted);
      const expense = totalExpenses[i] ? Number(totalExpenses[i]) : 0;
      const deficit =  totalIncome -expense;
      
      totalsRow += `<tr>
        <td>${i}</td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${restricted.toLocaleString()}" id="${dataElements.restrictedIncome}-${i}" 
            class="form-control restricted-${i}  currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${unrestricted.toLocaleString()}" id="${dataElements.unrestrictedIncome}-${i}" 
            class="form-control unrestricted-${i}  currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${totalIncome.toLocaleString()}" id="${dataElements.totalIncome}-${i}" 
            class="form-control totalIncome-${i}  currency" disabled readonly>
          </div>
        </td>

        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div> <input type="text" 
            id='deficit-${i}'
            style="background:${deficit >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" 
            value="${deficit.toLocaleString()}" class="form-control input-budget currency" disabled>
          </div>
        </td>
      </tr>

      `;
    }
    return totalsRow;
  }

  function displayTotalIncome(dataValues, period) {
    var projectRows = "";
    for (let year = period.start; year <= period.end; year++) {
      filledYear[year] = 0;
      let hasValue = false;
      dataElements.projectTotalIncome.forEach((income, index) => {
        if (dataValues[year][income.category]) {
          hasValue= true;
          projectRows += addProjectIncome(income, dataValues, year, index);
          filledYear[year] += 1;
        }
      });
      if(!hasValue) {
        projectRows += addProjectIncome(dataElements.projectTotalIncome[filledYear[year]], dataValues, year, filledYear[year]);
        filledYear[year] += 1;
      }
      projectRows += `       
      <div class="btn-index-${year} btn-wrap mt-3">
        <div class="btn-wrap-inner">
          <a  onclick="addIncome('${year}')" class="plus">+</a>
          <a  onclick="removeIncome('${year}')" class="minus">-</a>                 
        </div>                
      </div>
      <hr>
      </div>
      <div class="form-row">
        <div class="col-sm-12 text-right">
          <div class="form-group text-end mar-b-0">
          <input type="button" value="SAVE AS DRAFT" data-i18n="[value]intro.save_as_draft"  class="btn btn-secondary">
          ${period.end == year ? ``: `<input
                type="button"
                data-i18n="[value]intro.next" 
                value="NEXT"
                onClick=changePanel('panel-body-${(Number(year) + 1)}-0')
                class="btn btn-primary"
                />`}
          </div>
        </div>
      </div>`
    }

    return projectRows;
  }

  fetchOrganizationUnitUid();
});

function addProjectIncome(income, dataValues, year, index) {
  var projectRows = ''
  const category = dataValues[year] && dataValues[year][income.category]
    ? dataValues[year][income.category] : "";
  const subCategory = dataValues[year] && dataValues[year][income.subCategory]
    ? dataValues[year][income.subCategory] : "";
  const unrestricted = dataValues[year] && dataValues[year][income.unrestricted]
    ? dataValues[year][income.unrestricted] : "";
  const restricted = dataValues[year] && dataValues[year][income.restricted]
    ? dataValues[year][income.restricted] : "";
  const totalIncome = Number(restricted) + Number(unrestricted);
  var subCategoryOptions = categoryIncome.find(list => (list.code == category));
  subCategoryOptions = subCategoryOptions ? subCategoryOptions : {options:[]};

  projectRows += `
  <div class="accordion wrap-project-area-${year}">
    <div class="accordion-header active" role="button" data-toggle="collapse" data-target="#panel-body-${year}-${index}" aria-expanded="false">
      <h4><span class="number">${index + 1}</span><span data-i18n="intro.year">Year</span> ${year}</h4>
    </div>
    <div class="accordion-body collapse show" id="panel-body-${year}-${index}" data-parent="#accordion" style="">
      <div class="budget-wrap">
        <div class="form-row">
          <div class="form-group col-md-12 textbox-wrap">
          <label for="" data-i18n="intro.income_category">Income Category</label>
          <select 
          class="form-control" 
          ${tei.disabled ? 'disabled readonly': ''}
          id="${income.category}-${year}" 
          onchange="pushDataElementYear(this.id,this.value);changeSubCategory(this.value, '${income.subCategory}-${year}');"
          >
          <option class="choose" value="" data-i18n="intro.choose">Choose </option>`
           categoryIncome.forEach(ci => {
              projectRows += `<option ${(category == ci.code) ? "selected" : ''} value="${ci.code}" data-i18n="intro.${ci.format}">${ci.name}</option>`
            })
            projectRows += `</select>
           <div class="invalid-feedback"> Error here</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-12 textbox-wrap">
          <label for=""  data-i18n="intro.sub_category">Sub Category</label>
           <select
            class="form-control" 
            ${tei.disabled ? 'disabled readonly': ''}
            id="${income.subCategory}-${year}"
            onchange="pushDataElementYear(this.id,this.value)"
            >
            <option class="choose" value="" data-i18n="intro.choose">Choose </option>`
            subCategoryOptions.options.forEach(sp => {
              projectRows += `<option ${(subCategory == sp.code) ? "selected" : ''} value="${sp.code}" data-i18n="intro.${sp.format}">${sp.name}</option>`
            })
            projectRows += `</select>
            <div class="invalid-feedback"> Error here </div>
          </div>
        </div>
        <table class="table table-striped table-md mb-0 " width="100%">
          <thead>
            <tr>
              <th  data-i18n="intro.restricted">Restricted</th>
              <th  data-i18n="intro.unrestricted">Unrestricted</th>
              <th  data-i18n="intro.total">Total</th>
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
                id="${income.restricted}-${year}"
                value="${restricted}" 
                ${tei.disabledYear[year] ? 'disabled':''} 
                oninput="pushDataElementYear(this.id,this.value);calculateTotals('${income.restricted}', '${income.unrestricted}','${year}')" 
             
                class="form-control input-restricted-${year} currency">
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
                ${tei.disabledYear[year] ? 'disabled':''} 
                id="${income.unrestricted}-${year}" 
                value="${unrestricted}" 
                oninput="pushDataElementYear(this.id,this.value);calculateTotals('${income.restricted}', '${income.unrestricted}','${year}')" 
            
                class="form-control input-unrestricted-${year} currency">
              </div>
              </td>
              <td>
                <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">$</div>
                  </div>
                  <input 
                  type="number"
                  id="${income.restricted}-${income.unrestricted}-${year}" 
                  value="${totalIncome}" 
                  disabled
                  class="form-control  currency">
                </div>
              </td>
            </tr>
          </tbody>
        </table>  
      </div>
    </div>
  </div>`

  return projectRows;
}

function changeSubCategory(code, changeSubCategory) {
  const selectedCategoryIncome = categoryIncome.find((category) => category.code == code);
  if (selectedCategoryIncome) {
    let options = '<option class="choose" value="" data-i18n="intro.choose">Choose </option>'
    selectedCategoryIncome.options.forEach(subCategory => options += `<option value="${subCategory.code}">${subCategory.name}</option>`)

    document.getElementById(changeSubCategory).innerHTML = options;
  }
}
