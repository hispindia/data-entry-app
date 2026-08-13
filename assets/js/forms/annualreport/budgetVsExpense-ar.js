import { createEvent, getEvents, getEventsPeriodicity, getProgramStagePeriodicity, getTEI, pushDataElement } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { formatNumberInput, getYears, unformatNumber } from '../func.js';

const maxWords = 200;

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
      
    if(user.annualReporting) document.getElementById('reporting-periodicity').value = user.annualReporting;
  
    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML = years.filter(year => !tei.hideReportingYears.includes(year)).map(year => `<option value="${year}"  ${tei.year.selectReporting==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYearAR) document.getElementById('year-update').value = user.annualYearAR;
  
    tei.program = program.arProjectExpenseCategory;
    tei.programStage = programStage.arProjectExpenseCategory;
  
    fetchEvents();    
  }

  async function fetchEvents() {
    tei.projects = [];
    tei.dataValues={};
    tei.year.value = document.getElementById("year-update").value;
    tei.periodicity.value = document.getElementById("reporting-periodicity").value;
    
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program == program.auProjectDescription || enroll.program == program.auProjectExpenseCategory  ||  enroll.program == program.arTotalIncome
      );

      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, {id:tei.year.id, value: tei.year.value}); //data vlaues period wise
      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[tei.year.value]);

      const dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value }); //data vlaues period wise
      if(dataValuesAI && dataValuesAI[dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

      const dataValuesPE = getEvents(filteredPrograms, program.auProjectExpenseCategory, {id:tei.year.id, value: tei.year.value});

      tei.dataValues={};
      const dataValues = getEventsPeriodicity(filteredPrograms, tei.program, {id:tei.year.id, value: tei.year.value}, {id:tei.periodicity.id, value:tei.periodicity.value}); //data vlaues period wise
      
      if(tei.projects.length) {
        if(!dataValues) {
        if(tei.year.value && tei.periodicity.value) {
            let data = [{ 
              dataElement: tei.year.id,
              value: tei.year.value
            }, {
              dataElement: tei.periodicity.id,
              value: tei.periodicity.value
            }];
            tei.projects.forEach((project,index) => {
              data.push({
              dataElement:dataElements.projectExpenseCategory[index].name,
              value: project.name
            })
          })
        
          let calculatedElements = loadCalculatedVariables({}, dataValuesPE[tei.year.value], dataElements);
          calculatedElements.forEach(elements => tei.dataValues[elements.dataElement] = elements.value)
          data = [
            ...data,
            ...calculatedElements
          ]
          tei.event = await createEvent(data);
        }
        }
       else {
        tei.event = dataValues['event'];
        tei.dataValues = dataValues;

        let calculatedElements = loadCalculatedVariables(dataValues, dataValuesPE[tei.year.value], {
            projectExpenseCategory: dataElements.projectExpenseCategory,
            arProjectExpenseCategory: dataElements.arProjectExpenseCategory,
            totalBudget: dataElements.totalBudget,
            totalExpenses: dataElements.totalExpenses,
            difference: dataElements.difference,
        });
        calculatedElements.forEach(elements =>  {
          tei.dataValues[elements.dataElement] = elements.value;
          pushDataElement(elements.dataElement, elements.value);
        });
      }
    }
      populateProgramEvents(tei.dataValues);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValues) {
   
    $('#accordion').empty();
    if (tei.projects.length) {
      let projectRows = displayProjectDetails(tei.projects, dataValues)
      $('#accordion').html(projectRows);
          $('#accordion .textValue').toArray().forEach(el => {
            el.addEventListener("input", (ev) => {
              var { id, value, dataset } = ev.target;
              pushDataElement(id, (value ? unformatNumber(value): ''));
              ev.target.value = formatNumberInput(value);
              calculateTotals(dataset.index, id);
            })
          })
          $('#accordion .textlimit').toArray().forEach(el => {
            el.addEventListener("input", (ev) => {
              var { id, value } = ev.target;
              pushDataElement(id, value);
            })
          })
    } else {
      $('#accordion').html(`<h4 class="text-center text-warning my-4">No Existing Projects! Please add project in the Project Budget Section.</h4>`);
    }

    $('#accordion .save-as-draft-btn').toArray().forEach(btn => {
      btn.addEventListener("click", () => {
        alert("Data Saved Successfully!")
      });
    });

    var totalsRow = displayTotals(dataValues);
    $('#totals').empty();
    $('#totals').append(totalsRow);

    // Build pivot summary table by expense category
    buildPivotSummary();

    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();
      // Localize content
    $('body').localize();
  }

  function displayTotals(dataValues) {
      const totalBudget = (dataValues[dataElements.totalBudget]) ? Number(dataValues[dataElements.totalBudget]) : '';
      const actualExpense = (dataValues[dataElements.totalExpenses]) ? Number(dataValues[dataElements.totalExpenses]) : '';
      const difference = (dataValues[dataElements.difference]) ? Number(dataValues[dataElements.difference]) : '';
      const spendPercent = totalBudget && actualExpense/totalBudget && actualExpense/totalBudget!="Infinity" ? ((actualExpense/totalBudget)*100).toFixed(2) : '';
    var totalsRow = `
      <tr>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" value="${formatNumberInput(totalBudget)}" id="${dataElements.totalBudget}" class="form-control totalBudget  currency" readonly disabled>
    </div>
  </td>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" value="${formatNumberInput(actualExpense)}" id="${dataElements.totalExpenses}" class="form-control totalExpenses  currency" readonly disabled>
    </div>
  </td>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" style="background:${difference >= 0 ? '#C1E1C1 !important':'#FAA0A0 !important'}"  value="${formatNumberInput(difference)}" id="${dataElements.difference}" class="form-control totalDifference currency" readonly disabled>
    </div>
  </td>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          %
        </div>
      </div>
      <input type="text" value="${Math.round(spendPercent)}" class="form-control totalSpend currency" readonly disabled>
    </div>
  </td>
</tr>
`;
    return totalsRow;
  }
  function displayProjectDetails(projectDetails, dataValues) {
    var projectRows = '';
    var length = projectDetails.length;
    projectDetails.forEach((list, index) => {
      var rows = [];
      var variationPercent = [];
      var rowsTotal = {
        [`input-budgetExpense-${index}`] : 0,
      };
      rowsTotal[`total-actualExpense-${index}`]= 0;
      rowsTotal[`total-variation-${index}`]= 0;
      rowsTotal[`variation-percent-${index}`]= 0;
      
      var rowIndex = 0;
      projectRows += `
      <!--- sect ${(index + 1)}--->
      <div class="accordion">
      <div
        class="accordion-header active"
        role="button"
        data-toggle="collapse"
        data-target="#panel-body-${index+1}"
      >
        <h4 class="d-flex align-items-center">
        <span class="">${index+1}. </span>
          <span class="input-headings w-100"
            ><input
              class="w-100"
              type="text"
              id="${dataElements.arProjectExpenseCategory[index].name}"
              value="${list.name}"
              title="${list.name}"
              readonly
          /></span>
        </h4>
      </div>
      <div
        class="accordion-body collapse"
        id="panel-body-${index+1}"
        data-parent="#accordion"
      >
        <div class="budget-wrap table-responsive">
        <table class="table table-striped table-md mb-0 " width="100%">
          <thead>
            <tr>
              <th></th>
              <th data-i18n="intro.budget_including_ippf" data-tooltip-key="Budget (Focus Area)">Budget (including IPPF Core)</th>
              <th data-i18n="intro.actual_including_ippf" data-tooltip-key="Actual (including IPPF Core)">Actual (including IPPF Core)</th>
              <th><span data-i18n="intro.variation" data-tooltip-key="Variance ($)">Variation </span> ($)</th>
              <th><span data-i18n="intro.total_spend" data-tooltip-key="Total Spend (%)">Total Spend </span> (%)</th>
            </tr>
          </thead>
        <tbody>`

      rowIndex = 0;
      for (let budgetExpense in dataElements.arProjectExpenseCategory[index]['budgetExpense']) {
        let id = dataElements.arProjectExpenseCategory[index]['budgetExpense'][budgetExpense]
        let expense = dataValues[id] ? Number(dataValues[id]) : '';

        rowsTotal[`input-budgetExpense-${index}`] += Number(expense)
        if (!variationPercent[rowIndex]) variationPercent[rowIndex] = { num: 0, deno: Number(expense) };

        if (!rows[rowIndex]) rows[rowIndex] = '';
        rows[rowIndex] += `<td>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                      <div class="input-group-text">
                                      $
                                      </div>
                                    </div>
                                    <input 
                                    type="text" 
                                    ${(!list.comment) ? 'disabled' : ''}
                                    id="${id}"
                                    data-index="${index}"
                                    value="${formatNumberInput(expense)}" 
                                    class="form-control textValue input-budget-${rowIndex} currency">
                                </div>
                            </td>`
        rowIndex++;
      }
      rowIndex = 0;
      for (let actualExpense in dataElements.arProjectExpenseCategory[index]['actualExpense']) {
        let id = dataElements.arProjectExpenseCategory[index]['actualExpense'][actualExpense]
        let expense = dataValues[id] ? dataValues[id] : '';

        rowsTotal[`total-actualExpense-${index}`] += Number(expense);
        if (!variationPercent[rowIndex]) variationPercent[rowIndex] = { num: 0, deno: 0 };
        variationPercent[rowIndex]['num'] = Number(expense);

        if (!rows[rowIndex]) rows[rowIndex] = '';
        rows[rowIndex] += `<td>
                              <div class="input-group">
                                  <div class="input-group-prepend">
                                    <div class="input-group-text">
                                      $
                                    </div>
                                  </div>
                                  <input 
                                  type="text" 
                                  ${tei.disabled ? 'disabled readonly' : ''} 
                                  data-index="${index}"
                                  id="${id}"
                                  value="${formatNumberInput(expense)}" 
                                  class="form-control textValue input-expense-${rowIndex} currency">
                              </div>
                          </td>`
        rowIndex++;
      }
      rowIndex = 0;
      for (let variation in dataElements.arProjectExpenseCategory[index]['variation']) {
        let id = dataElements.arProjectExpenseCategory[index]['variation'][variation]
        let varitaionVal = dataValues[id] ? dataValues[id] : 0;

        rowsTotal[`total-variation-${index}`] += Number(varitaionVal);

        if (!rows[rowIndex]) rows[rowIndex] = '';
        rows[rowIndex] += `<td>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                  <div class="input-group-text">
                                    $
                                  </div>
                                </div>
                                <input type="text" 
                                id="${id}"
                                disabled
                                style="background:${varitaionVal >= 0 ? '#C1E1C1 !important' : '#FAA0A0 !important'}" 
                                value="${formatNumberInput(varitaionVal)}" class="form-control input-budget currency">
                            </div>
                </td>`
        rowIndex++;
      }
      rowIndex = 0;
      for (let variation in dataElements.arProjectExpenseCategory[index]['variation']) {
        let id = dataElements.arProjectExpenseCategory[index]['variation'][variation]
        let value = (variationPercent[rowIndex]['num'] && variationPercent[rowIndex]['deno'] && variationPercent[rowIndex]['num'] / variationPercent[rowIndex]['deno'] !== "Infinity") ? ((variationPercent[rowIndex]['num'] / variationPercent[rowIndex]['deno']) * 100).toFixed(2) : '';
        rowsTotal[`variation-percent-${index}`] += Number(value);
        if (!rows[rowIndex]) rows[rowIndex] = '';
        rows[rowIndex] += `<td>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                  <div class="input-group-text">
                                    %
                                  </div>
                                </div>
                                <input type="text" 
                                id="${id}-percent"
                                disabled
                                value="${formatNumberInput(value)}" class="form-control input-percent currency">
                            </div>
                          </td>`
        rowIndex++;
      }
      projectRows += `<tr>
                <td><strong data-i18n="intro.personnel" data-tooltip-key="Personnel">Personnel</strong></td>
                ${rows[0]}
                </tr><tr>
                <td><strong data-i18n="intro.activities" data-tooltip-key="Direct Project Activities">Direct project activities</strong></td>
                ${rows[1]}
                </tr><tr>
                <td><strong data-i18n="intro.commodities" data-tooltip-key="Commodities">Commodities</strong></td>
                ${rows[2]}
                </tr><tr>
                <td><strong  data-i18n="intro.indirect" data-tooltip-key="Indirect/support costs">Indirect/ support costs</strong></td>
                ${rows[3]}
                </tr></tr>
                <td><strong  data-i18n="intro.project_total">Project Total</strong></td>`
      for (let total in rowsTotal) {
        let value = '';
        let sign = '$';
        if (total == `variation-percent-${index}`) {
          let num = 0, deno = 0;
          variationPercent.forEach(data => {
            if (data.num) num += Number(data.num);
            if (data.deno) deno += Number(data.deno);
          })
          value = (deno && num / deno && (num / deno) !== "Infinity" ? ((num / deno) * 100).toFixed(2) : '');
          sign='%'
        } else {
          sign = "$"
          value = rowsTotal[total];
        }
          projectRows += `<td>
                          <div class="input-group">
                              <div class="input-group-prepend">
                                <div class="input-group-text font-weight-bold">
                                  ${sign}
                                </div>
                              </div>
                              <input type="text" 
                              disabled
                              id="${total}"
                              value="${formatNumberInput(value)}" class="form-control font-weight-bold ${total} currency">
                          </div>
                          </td>`;
        } 
      projectRows += `</tr>
                          </tbody></table>
                          </div>
                          <div class="form-row">
                          <div class="form-group col-md-12 textbox-wrap">
                            <label for="" data-i18n="intro.variance_explanation" data-tooltip-key="Variance Explanation">
                            Variance Explanation
                            </label>
                            <textarea 
                            class="form-control-resize textlimit"       
                            ${tei.disabled ? 'disabled readonly' : ''}                                     
                            id="${dataElements.arProjectExpenseCategory[index].comment}"
                            >${dataValues[dataElements.arProjectExpenseCategory[index].comment] ? dataValues[dataElements.arProjectExpenseCategory[index].comment] : ''}</textarea>
                          
                            <div
                            class="char-counter form-text text-muted">
                            <span id="counter${index}">
                            ${maxWords - (dataValues[dataElements.arProjectExpenseCategory[index].comment] ? dataValues[dataElements.arProjectExpenseCategory[index].comment].trim().split(/\s+/).length : 0)}</span>
                           <span data-i18n="intro.words_remaining">words remaining</span>
                          </div>
                            <div class="invalid-feedback"> Error here 
                            </div>
                          </div>
                                      </div>
                          <div class="form-row">
                          <div class="col-sm-12 text-right">
                          <div class="form-group text-end mar-b-0">
                          <input
                            type="button"
                            value="SAVE AS DRAFT"  data-i18n="[value]intro.save_as_draft" 
                            class="save-as-draft-btn btn btn-secondary"
                          />
                          ${(length - 1 == index) ? `                          
                          <button ${tei.disabled ? 'disabled readonly' : ''}  class="btn btn-primary" onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/6-actual-income-ar.html'">
                            <span data-i18n="intro.next">Next</span>:  
                            <span data-i18n="intro.actual_income">6.  Income</span>
                          </button>`: `<input
                          type="button"
                          value="NEXT"
                          data-i18n="[value]intro.next" 
                          onClick=changePanel('panel-body-${index + 2}')
                          class="btn btn-primary"
                />`}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--- sect ${(index + 1)}--->`
    })

    return projectRows;
  }

  document
  .getElementById("year-update")
  .addEventListener("change", function (ev) {
    $('.loader-container').addClass('d-flex').removeClass('d-none');
    $('.myContainer').hide();
    window.localStorage.setItem("annualYearAR", ev.target.value);
    fetchEvents();
  });

  document
  .getElementById("reporting-periodicity")
  .addEventListener("change", function (ev) {
    $('.loader-container').addClass('d-flex').removeClass('d-none');
    $('.myContainer').hide();
    window.localStorage.setItem("annualReporting", ev.target.value);
    fetchEvents();
  });

});

function submitBudgetExpense() {
  var value = ''
  const date = new Date();

  var difference = document.getElementById(`${dataElements.difference}-${date.getFullYear()}`);
  if(difference) value = `Total Budget Expense is not equal to Total Expense`  
  
  if(value ) alert(value);
  alert('Event Pushed Successfully!');
}

function loadCalculatedVariables(dataValues, dataValuesPE, dataElements) {
  var projectNames = [];
  var totalBudget = {
    dataElement: dataElements.totalBudget,
    value: 0
  };
  var totalExpenses = {
    dataElement: dataElements.totalExpenses,
    value: 0
  };
  var variations = [];
  var budgetExpense = [];
  tei.projects.forEach((project,index) => {
    projectNames.push({dataElement: `${dataElements.arProjectExpenseCategory[index].name}`, value: project.name})
    for(let id in dataElements.arProjectExpenseCategory[index]['budgetExpense']) {

      let actualExpense = 0
      if(dataValues[dataElements.arProjectExpenseCategory[index]['actualExpense'][id]]) {
        actualExpense = dataValues[dataElements.arProjectExpenseCategory[index]['actualExpense'][id]];
        totalExpenses.value += Number(actualExpense);
      }
      let expenseCategoryVal = dataValuesPE && dataValuesPE[dataElements.projectExpenseCategory[index][id]] ? dataValuesPE[dataElements.projectExpenseCategory[index][id]]: 0
      let arExpenseCategoryVal = dataValues && dataValues[dataElements.arProjectExpenseCategory[index]['budgetExpense'][id]] ? dataValues[dataElements.arProjectExpenseCategory[index]['budgetExpense'][id]]: 0
      let budgetExpenseVal = 0;

      if(project.comment && (arExpenseCategoryVal || arExpenseCategoryVal==0)) budgetExpenseVal = Number(arExpenseCategoryVal);
      else if(expenseCategoryVal || expenseCategoryVal==0)  budgetExpenseVal = Number(expenseCategoryVal);
        
      totalBudget.value += Number(budgetExpenseVal);

      budgetExpense.push({
        dataElement: dataElements.arProjectExpenseCategory[index]['budgetExpense'][id],
        value: budgetExpenseVal
      })
      
      variations.push({
        dataElement:dataElements.arProjectExpenseCategory[index]['variation'][id],
        value: Number(budgetExpenseVal) - Number(actualExpense)
      })    
      
    }

  })

  var difference = {
    dataElement: dataElements.difference,
    value: totalBudget.value-totalExpenses.value
  };

  return [
    ...projectNames,
    ...variations,
    ...budgetExpense,
    totalBudget,
    totalExpenses,
    difference
  ]
}

function checkProjects(projects, values) {
  var prevEmptyNames = [];
  var names = [];
  if (values) {
    projects.forEach((project) => {
      if (values[project.name]) {
        names = [...names, ...prevEmptyNames, {name:values[project.name],comment: (values[project.comment] ? values[project.comment]: '')}];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push({name: '', comment: ''});
      }
    });
  }
  return names;
}

function calculateTotals(idx, expenseId) {
  var totalBudget = 0;
  var totalExpenses = 0;
  var totalDifference = 0;
  dataElements.arProjectExpenseCategory.forEach((project,index) => {
  if($(`#${project.name}`).val()) {
    var expenses = 0;
    var budgets = 0;
    var totalVariation = 0;
    for(let id in project.budgetExpense) {
      const budget = unformatNumber($(`#${project.budgetExpense[id]}`).val());
      const expense = unformatNumber($(`#${project.actualExpense[id]}`).val());
      const variation = Number(budget) - expense;
      const variationPercent = (budget && (expense/budget) && (expense/budget)!=="Infinity")? (expense/budget*100).toFixed(2): ''
      budgets += Number(budget);
      expenses += expense;
      totalVariation += variation;

      if(expenseId==project.actualExpense[id] || expenseId==project.budgetExpense[id] ) {
        $(`#${project.variation[id]}`).val(formatNumberInput(variation));
        $(`#${project.variation[id]}-percent`).val(formatNumberInput(variationPercent));
        pushDataElement(project.variation[id], variation);
        
        if(variation >= 0) $(`#${project.variation[id]}`)[0].style.setProperty('background','#C1E1C1', 'important')
        else $(`#${project.variation[id]}`)[0].style.setProperty('background','#FAA0A0', 'important')
      } 
    }
    if(idx==index) {
    $(`#input-budgetExpense-${idx}`).val(formatNumberInput(budgets));
    $(`#total-actualExpense-${idx}`).val(formatNumberInput(expenses));
    $(`#total-variation-${idx}`).val(formatNumberInput(totalVariation));
    let variationPercnet = (budgets && (expenses/budgets) && (expenses/budgets)!=="Infinity")? (expenses/budgets*100).toFixed(2): ''

    $(`#variation-percent-${idx}`).val(formatNumberInput(variationPercnet));

    
    if(totalVariation >= 0) $(`#total-variation-${idx}`)[0].style.setProperty('background','#C1E1C1', 'important');
    else $(`#total-variation-${idx}`)[0].style.setProperty('background','#FAA0A0', 'important');
    }
    totalExpenses += expenses;
    totalBudget += budgets
  }
  })

  $('.totalExpenses').val(formatNumberInput(totalExpenses));
  if(totalBudget) {
  totalDifference = totalBudget-totalExpenses;
  }
  const totalSpend = totalBudget && totalExpenses/totalBudget && (totalExpenses/totalBudget)!="Infinity"? (totalExpenses/totalBudget)*100 : '';
  $('.totalSpend').val(formatNumberInput(totalSpend));

  $('.totalDifference').val(formatNumberInput(totalDifference));
  
  if(totalDifference >= 0) $('.totalDifference')[0].style.setProperty('background','#C1E1C1', 'important');
  else $('.totalDifference')[0].style.setProperty('background','#FAA0A0', 'important');

  $('.totalBudget').val(formatNumberInput(totalBudget));
  pushDataElement($('.totalBudget')[0].id, totalBudget);
  pushDataElement($('.totalExpenses')[0].id, totalExpenses);
  pushDataElement($('.totalDifference')[0].id, totalDifference);
  buildPivotSummary();

}


  function buildPivotSummary() {
    var globalBudget = 0, globalExpense = 0;

    var categoryNames = [
      { name: 'Personnel', i18n: 'intro.personnel' },
      { name: 'Direct project activities', i18n: 'intro.activities' },
      { name: 'Commodities', i18n: 'intro.commodities' },
      { name: 'Indirect/ support costs', i18n: 'intro.indirect' }
    ];

    var rows = '';

    categoryNames.forEach(function(cat, index) {
      var totalBudget = 0;
      var totalExpense = 0;
      var variance = 0;
      var totalPercent = 0;

      $(`.input-budget-${index}`).each(function () {
          const value = unformatNumber($(this).val()) || 0;
          totalBudget += value;
      });

      $(`.input-expense-${index}`).each(function () {
          const value = unformatNumber($(this).val()) || 0;
          totalExpense += value;
      });
      globalBudget += totalBudget;
      globalExpense += totalExpense;

      var variance = totalBudget - totalExpense;
      totalPercent = totalBudget && totalExpense/totalBudget && totalExpense/totalBudget!="Infinity" ? (totalExpense/totalBudget)*100:''


      rows += `<tr>
        <td class="pivot-focus-area-name"><strong data-i18n="${cat.i18n}">${cat.name}</strong></td>
        <td><div class="input-group"><div class="input-group-prepend"><div class="input-group-text">$</div></div>
          <input type="text" value="${formatNumberInput(totalBudget)}" class="form-control currency" disabled readonly></div></td>
        <td><div class="input-group"><div class="input-group-prepend"><div class="input-group-text">$</div></div>
          <input type="text" value="${formatNumberInput(totalExpense)}" class="form-control currency" disabled readonly></div></td>
        <td><div class="input-group"><div class="input-group-prepend"><div class="input-group-text">$</div></div>
          <input type="text" value="${formatNumberInput(variance)}" style="background:${variance >= 0 ? "#C1E1C1 !important" : "#FAA0A0 !important"} !important" class="form-control currency" disabled readonly></div></td>
        <td><div class="input-group"><div class="input-group-prepend"><div class="input-group-text">%</div></div>
          <input type="text" value="${formatNumberInput(totalPercent)}" class="form-control currency" disabled readonly></div></td>
      </tr>`;
    });

    const globalVariance = globalBudget - globalExpense;
    const globalPercent = globalBudget && globalExpense/globalBudget && globalExpense/globalBudget!="Infinity" ? (globalExpense/globalBudget)*100:''

    rows += `<tr class="pivot-grand-total">
      <td><strong>Grand Total</strong></td>
      <td><div class="input-group"><div class="input-group-prepend"><div class="input-group-text font-weight-bold">$</div></div>
        <input type="text" value="${formatNumberInput(globalBudget)}" class="form-control font-weight-bold currency" disabled readonly></div></td>
      <td><div class="input-group"><div class="input-group-prepend"><div class="input-group-text font-weight-bold">$</div></div>
        <input type="text" value="${formatNumberInput(globalExpense)}" class="form-control font-weight-bold currency" disabled readonly></div></td>
      <td><div class="input-group"><div class="input-group-prepend"><div class="input-group-text font-weight-bold">$</div></div>
        <input type="text" value="${formatNumberInput(globalVariance)}" style="background:${globalVariance >= 0 ? "#C1E1C1 !important" : "#FAA0A0 !important"} !important" class="form-control font-weight-bold currency" disabled readonly></div></td>
      <td><div class="input-group"><div class="input-group-prepend"><div class="input-group-text font-weight-bold">%</div></div>
        <input type="text" value="${formatNumberInput(globalPercent)}" class="form-control font-weight-bold currency" disabled readonly></div></td>
    </tr>`;

    $('#pivot-summary').html(rows);
    $('#pivot-summary-wrap').show();
  }

function submitProjects() {
  alert("Data Saved Successfully!")
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
        if(value) counter.textContent = `${(maxWords - words.length)} words remaining`;
        else counter.textContent = `${maxWords} words remaining`;
    }