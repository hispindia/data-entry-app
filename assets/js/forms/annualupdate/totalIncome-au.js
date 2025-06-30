import { getEvents, getProgramStageEvents, getTEI, pushDataElementYear } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears } from "../func.js";

var filledYear = {};
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
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents();
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
    document.getElementById('year-update').innerHTML = years.map(year => tei.hideYears.includes(year) ? `<option value="${year}">${year}</option>`: '').join('');
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

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) =>
            enroll.program == tei.program  ||
            enroll.program == program.auProjectExpenseCategory || enroll.program==program.auProjectDescription 
            );
      
            const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  tei.year.id);
            if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      
      const dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory , program.auProjectExpenseCategory , tei.year.id) //data vlaues year wise

      totalExpenses = dataValuesEC[dataElements.totalBudget] ? Number(dataValuesEC[dataElements.totalBudget] ): 0;
      
      tei.dataValues = getProgramStageEvents(filteredPrograms, tei.programStage, tei.program, tei.year.id) //data vlaues year wise

        if (!tei.dataValues[tei.year.value]) {
          const data = [
            {
              dataElement: tei.year.id,
              value: year,
            },
          ];

          tei.dataValues[tei.year.value] = {
            [tei.year.id]:year,
          }
          tei.event = {
            ...tei.event,
           [tei.year.value]: await createEvent(data)
          }
        } else {
          tei.event = {
            ...tei.event,
            [tei.year.value]: tei.dataValues[tei.year.value]["event"],
          };
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
                <input type="text"  ${tei.disabled ? 'disabled readonly': ''} value="${organisation}" id="${dataElements.organisation}" onblur="pushDataElementYear(this.id,this.value)" class="form-control currency">     
                </td>
                <td>
                    <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">
                        $
                          </div>
                        </div>
                        <input type="text" value="${formatNumberInput(incomeProvided)}" id="${dataElements.incomeProvided}" onblur="formatNumberInput(this);pushDataElementYear(this.id,unformatNumber(this.value))" class="form-control currency">                         
                    </div>
                </td>
            </tr>`

   return rows;
  }

  function displayTotals(dataValues, period) {
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
            <input type="text" value="${formatNumberInput(restricted)}" id="${dataElements.restrictedIncome}" 
            class="form-control restricted  currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(unrestricted)}" id="${dataElements.unrestrictedIncome}" 
            class="form-control unrestricted  currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(totalIncome)}" id="${dataElements.totalIncome}" 
            class="form-control totalIncome  currency" disabled readonly>
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
            style="background:${deficit >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" 
            value="${formatNumberInput(deficit)}" class="form-control input-budget currency" disabled>
          </div>
        </td>
      </tr>

      `;
    return totalsRow;
  }

  function displayTotalIncome(dataValues) {
      dataElements.projectTotalIncome.forEach((income, index) => {
        // if (dataValues[income.category]) {
          // projectRows += addProjectIncome(income, dataValues, year, index);
        // }
      });
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
      projectRows += `</div>`

    return projectRows;
  }

  configurePage();
});

// function addProjectIncome(income, dataValues, year, index) {
//   var projectRows = ''
//   const category = dataValues && dataValues[income.category]
//     ? dataValues[income.category] : "";
//   const subCategory = dataValues && dataValues[income.subCategory]
//     ? dataValues[income.subCategory] : "";
//   const unrestricted = dataValues && dataValues[income.unrestricted]
//     ? dataValues[income.unrestricted] : "";
//   const restricted = dataValues && dataValues[income.restricted]
//     ? dataValues[income.restricted] : "";
//   const totalIncome = Number(restricted) + Number(unrestricted);
//   var subCategoryOptions = categoryIncome.find(list => (list.code == category));
//   subCategoryOptions = subCategoryOptions ? subCategoryOptions : {options:[]};

//   projectRows += `
//   <div class="accordion wrap-project-area-${year}">
//     <div class="accordion-header active" role="button" data-toggle="collapse" data-target="#panel-body-${year}-${index}" aria-expanded="false">
//       <h4><span class="number">${index + 1}</span><span data-i18n="intro.year">Year</span> ${year}</h4>
//     </div>
//     <div class="accordion-body collapse show" id="panel-body-${year}-${index}" data-parent="#accordion" style="">
//       <div class="budget-wrap">
//         <div class="form-row">
//           <div class="form-group col-md-12 textbox-wrap">
//           <label for="" data-i18n="intro.income_category">Income Category</label>
//           <select 
//           class="form-control" 
//           ${tei.disabled ? 'disabled readonly': ''}
//           id="${income.category}-${year}" 
//           onchange="pushDataElementYear(this.id,this.value);changeSubCategory(this.value, '${income.subCategory}-${year}');"
//           >
//           <option class="choose" value="" data-i18n="intro.choose">Choose </option>`
//            categoryIncome.forEach(ci => {
//               projectRows += `<option ${(category == ci.code) ? "selected" : ''} value="${ci.code}" data-i18n="intro.${ci.format}">${ci.name}</option>`
//             })
//             projectRows += `</select>
//            <div class="invalid-feedback"> Error here</div>
//           </div>
//         </div>
//         <div class="form-row">
//           <div class="form-group col-md-12 textbox-wrap">
//           <label for=""  data-i18n="intro.sub_category">Sub Category</label>
//            <select
//             class="form-control" 
//             ${tei.disabled ? 'disabled readonly': ''}
//             id="${income.subCategory}-${year}"
//             onchange="pushDataElementYear(this.id,this.value)"
//             >
//             <option class="choose" value="" data-i18n="intro.choose">Choose </option>`
//             subCategoryOptions.options.forEach(sp => {
//               projectRows += `<option ${(subCategory == sp.code) ? "selected" : ''} value="${sp.code}" data-i18n="intro.${sp.format}">${sp.name}</option>`
//             })
//             projectRows += `</select>
//             <div class="invalid-feedback"> Error here </div>
//           </div>
//         </div>
//         <table class="table table-striped table-md mb-0 " width="100%">
//           <thead>
//             <tr>
//               <th  data-i18n="intro.restricted">Restricted</th>
//               <th  data-i18n="intro.unrestricted">Unrestricted</th>
//               <th  data-i18n="intro.total">Total</th>
//               </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>
//               <div class="input-group">
//                 <div class="input-group-prepend">
//                    <div class="input-group-text">$ </div>
//                 </div>
//                 <input 
//                 type="text" 
//                 ${tei.disabled ? 'disabled readonly': ''}
//                 id="${income.restricted}-${year}"
//                 value="${formatNumberInput(restricted)}" 
//                 ${tei.disabledYear[year] ? 'disabled':''} 
//                 oninput="formatNumberInput(this);pushDataElementYear(this.id,unformatNumber(this.value));calculateTotals('${income.restricted}', '${income.unrestricted}','${year}')" 
             
//                 class="form-control input-restricted-${year} currency">
//               </div>
//               </td>
//               <td>
//               <div class="input-group">
//                 <div class="input-group-prepend">
//                   <div class="input-group-text">$</div>
//                 </div>
//                 <input 
//                 type="text" 
//                 ${tei.disabled ? 'disabled readonly': ''}
//                 ${tei.disabledYear[year] ? 'disabled':''} 
//                 id="${income.unrestricted}-${year}" 
//                 value="${formatNumberInput(unrestricted)}" 
//                 oninput="formatNumberInput(this);pushDataElementYear(this.id,unformatNumber(this.value));calculateTotals('${income.restricted}', '${income.unrestricted}','${year}')" 
            
//                 class="form-control input-unrestricted-${year} currency">
//               </div>
//               </td>
//               <td>
//                 <div class="input-group">
//                   <div class="input-group-prepend">
//                       <div class="input-group-text">$</div>
//                   </div>
//                   <input 
//                   type="text"
//                   id="${income.restricted}-${income.unrestricted}-${year}" 
//                   value="${formatNumberInput(totalIncome)}" 
//                   disabled
//                   class="form-control  currency">
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>  
//       </div>
//     </div>
//   </div>`

//   return projectRows;
// }

function changeSubCategory(code, changeSubCategory) {
  const selectedCategoryIncome = categoryIncome.find((category) => category.code == code);
  if (selectedCategoryIncome) {
    let options = '<option class="choose" value="" data-i18n="intro.choose">Choose </option>'
    selectedCategoryIncome.options.forEach(subCategory => options += `<option value="${subCategory.code}">${subCategory.name}</option>`)

    document.getElementById(changeSubCategory).innerHTML = options;
  }
}


function calculateTotals(restricted, unrestricted, year) {
  const restrictedVal = $(`#${restricted}-${year}`)? $(`#${restricted}-${year}`).val(): '';
  const unrestrictedVal = $(`#${unrestricted}-${year}`)? $(`#${unrestricted}-${year}`).val(): '';
  const total = Number(restrictedVal) + Number(unrestrictedVal);
  if($(`#${restricted}-${unrestricted}-${year}`)) {
    $(`#${restricted}-${unrestricted}-${year}`).val(formatNumberInput(total));
  }

  var restrictedTotals = 0;
  document.querySelectorAll(`.input-restricted-${year}`).forEach(ev=> {
    var {value} = ev;
    restrictedTotals += unformatNumber(value);
  })
 
  var unrestrictedTotals = 0;
  document.querySelectorAll(`.input-unrestricted-${year}`).forEach(ev=> {
    var {value} = ev;
    unrestrictedTotals += unformatNumber(value);
  })
  var globalTotals = Number(unrestrictedTotals) + Number(restrictedTotals);

  
  $(`#deficit-${year}`).val(formatNumberInput(globalTotals-totalExpenses));
  if(globalTotals-totalExpenses >= 0) $(`#deficit-${year}`)[0].style.setProperty('background','#C1E1C1', 'important')
  else $(`#deficit-${year}`)[0].style.setProperty('background','#FAA0A0', 'important')   

  $(`.unrestricted-${year}`).val(formatNumberInput(unrestrictedTotals));
  $(`.restricted-${year}`).val(formatNumberInput(restrictedTotals));
  $(`.totalIncome-${year}`).val(formatNumberInput(globalTotals));
  pushDataElementYear($(`.unrestricted-${year}`)[0].id, unrestrictedTotals);
  pushDataElementYear($(`.restricted-${year}`)[0].id, restrictedTotals);
  pushDataElementYear($(`.totalIncome-${year}`)[0].id, globalTotals);
}

function submitProjects() {
  alert("Data Saved Successfully!")
}
 function addIncome(year) {

      const income = dataElements.projectTotalIncome[filledYear[year]];

      // const newProjectRow = addProjectIncome(income, {}, year, filledYear[year]);
      // $(newProjectRow).insertBefore(`.btn-index-${year}`);
    }

    function removeIncome(year) {
      if (filledYear[year] > 1) {
        filledYear[year]--;
        const income = dataElements.projectTotalIncome[filledYear[year]];
        $(`.wrap-project-area-${year}`).last().remove();
        calculateTotals(income.restricted, income.unrestricted, year);
        pushDataElementYear(`${income.category}-${year}`, '');
        pushDataElementYear(`${income.subCategory}-${year}`, '');
        pushDataElementYear(`${income.restricted}-${year}`, '');
        pushDataElementYear(`${income.unrestricted}-${year}`, '');
      }
    }

    //textarea word limit
    function checkWords(event, count) {
      const counter = document.getElementById('counter' + (count));
      const { value } = event;
      const words = value.trim().split(/\s+/)

      if (words.length >= maxWords) {
        event.value = words.slice(0, maxWords).join(' ');
        return
      }
      if (value) counter.textContent = `${(maxWords - words.length)} words remaining`;
      else counter.textContent = `${maxWords} words remaining`;
    }