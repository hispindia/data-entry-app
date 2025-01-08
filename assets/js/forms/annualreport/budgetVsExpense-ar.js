
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
        
        const userConfig = userGroupConfig(data);
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
        document.getElementById("headerOrgId").value =  data.organisationUnits[0].parent ? data.organisationUnits[0].parent.name: '';

        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;
        document.getElementById("headerOrgCode").value =
          data.organisationUnits[0].code;

          const fpaIndiaButton = document.querySelector('.fa-building-o').closest('a');
          if (fpaIndiaButton) {
              const fpaIndiaDiv = fpaIndiaButton.querySelector('div');
              if (fpaIndiaDiv) {
                  fpaIndiaDiv.textContent =  data.organisationUnits[0].name;;
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
    
    tei.program = program.arProjectExpenseCategory;
    tei.programStage = programStage.arProjectExpenseCategory;
    dataElements.period.value = document.getElementById("headerPeriod").value;
    dataElements.periodicity.value = document.getElementById("reporting-periodicity").value;

    tei.year = {
      ...tei.year,
      start:dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    
    var yearOptions = '';
    for(let year=tei.year.start; year <=tei.year.end; year++) {
      if(tei.hideReportingYears.includes(year)) continue;
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById('year-update').innerHTML = yearOptions;
    document.getElementById('year-update').options[0].selected = true;
    var annualYear = window.localStorage.getItem("annualYearAR");
    if(annualYear) document.getElementById('year-update').value = annualYear;
  }
  async function fetchEvents() {
    tei.projects = [];
    tei.dataValues={};
    const year = document.getElementById("year-update").value;
    dataElements.periodicity.value = document.getElementById("reporting-periodicity").value;
    
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program == program.auProjectDescription || enroll.program == program.auProjectExpenseCategory  ||  enroll.program == program.arTotalIncome
      );

      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, dataElements.year.id); //data vlaues period wise
      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[year]);

      const dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: dataElements.year.id, value: year }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value }); //data vlaues period wise
      if(dataValuesAI && dataValuesAI[dataElements.submitAnnualUpdate])  tei.disabled = true;

      const dataValuesPE = getEvents(filteredPrograms, program.auProjectExpenseCategory,  dataElements.year.id);
      if(dataValuesPE[year]) {
        dataElements.projectExpenseCategory.forEach((project) => {
          if(dataValuesPE[year][project.name]) {
            tei.yearlyAmount[`amount-${year}`] = dataValuesPE[year][dataElements.totalBudget]? dataValuesPE[year][dataElements.totalBudget] : ''
            
          }
        })
      }
      tei.dataValues={};
      const dataValues = getEventsPeriodicity(filteredPrograms, tei.program, {id:dataElements.year.id, value: year}, {id:dataElements.periodicity.id, value:dataElements.periodicity.value}); //data vlaues period wise
      
      if(tei.projects.length) {
        if(!dataValues) {
        if(year && dataElements.period.value && dataElements.periodicity.value) {
            let data = [{ 
              dataElement: dataElements.year.id,
              value: year
            },{
              dataElement: dataElements.period.id,
              value: dataElements.period.value
            }, {
              dataElement: dataElements.periodicity.id,
              value: dataElements.periodicity.value
            }];
            tei.projects.forEach((project,index) => {
              data.push({
              dataElement:dataElements.projectExpenseCategory[index].name,
              value: project.name
            })
          })
        
          let calculatedElements = loadCalculatedVariables({}, dataValuesPE[year], dataElements, year);
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

        let calculatedElements = loadCalculatedVariables(dataValues, dataValuesPE[year], dataElements, year);
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
      $('#accordion').append(projectRows);
    } else {
      $('#accordion').append(`<h4 class="text-center text-warning my-4">No Existing Projects! Please add project in the Project Budget Section.</h4>`);
    }

    var totalsRow = displayTotals(dataValues);
    $('#totals').empty();
    $('#totals').append(totalsRow);

      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues) {
      const totalBudget = (dataValues[dataElements.totalBudget]) ? Number(dataValues[dataElements.totalBudget]) : '';
      const actualExpense = (dataValues[dataElements.totalExpenses]) ? Number(dataValues[dataElements.totalExpenses]) : '';
      const difference = (dataValues[dataElements.difference]) ? Number(dataValues[dataElements.difference]) : '';
    var totalsRow = `
      <tr>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" value="${totalBudget.toLocaleString()}" id="${dataElements.totalBudget}" class="form-control totalBudget  currency" readonly disabled>
    </div>
  </td>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" value="${actualExpense.toLocaleString()}" id="${dataElements.totalExpenses}" class="form-control totalExpenses  currency" readonly disabled>
    </div>
  </td>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" style="background:${difference >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}"  value="${difference.toLocaleString()}" id="${dataElements.difference}" class="form-control totalDifference currency" readonly disabled>
    </div>
  </td>
</tr>
`;
    return totalsRow;
  }
  function displayProjectDetails(projectDetails, dataValues) {
    var projectRows = '';
    var length = projectDetails.length;
    var total = 0;
    projectDetails.forEach((list, index) => {
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
                                          <th data-i18n="intro.personnel">Personnel</th>
                                          <th data-i18n="intro.activities">Direct project activities</th>
                                          <th data-i18n="intro.commodities">Commodities</th>
                                          <th data-i18n="intro.indirect">Indirect/support costs</th>
                                          <th data-i18n="intro.total">Total</th>

                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <td>
                                              <strong data-i18n="intro.budget_expenses">Budgeted Expenses</strong>
                                          </td>`
                                          total = 0;
                                          for(let budgetExpense in dataElements.arProjectExpenseCategory[index]['budgetExpense']){
                                            let id = dataElements.arProjectExpenseCategory[index]['budgetExpense'][budgetExpense]
                                            let expense= dataValues[id] ? Number(dataValues[id]): '';
                                            total+= Number(expense)
                                            projectRows += `<td>
                                              <div class="input-group">
                                                  <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                      $
                                                    </div>
                                                  </div>
                                                  <input 
                                                  type="number" 
                                                  ${(!list.comment) ? 'disabled': ''}
                                                  id="${id}"
                                                  oninput="pushDataElement(this.id,this.value);calculateTotals('${index}',this.id)" 
                                                  value="${expense}" 
                                                  class="form-control input-budget-${index} currency">
                                              </div>
                                          </td>`
                                          }
                                          projectRows += `
                                          <td>
                                              <div class="input-group">
                                                  <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                      $
                                                    </div>
                                                  </div>
                                                  <input type="text" 
                                                  disabled
                                                  value="${total.toLocaleString()}" class="form-control input-budgetExpense currency">
                                              </div>
                                          </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <strong data-i18n="intro.actual_expense">Actual Expenses</strong>
                                              </td>`

                                              total = 0;
                                            for(let actualExpense in dataElements.arProjectExpenseCategory[index]['actualExpense']){
                                            let id = dataElements.arProjectExpenseCategory[index]['actualExpense'][actualExpense]
                                            let expense = dataValues[id] ? dataValues[id]: '';
                                            total+= Number(expense)
                                            projectRows += `<td>
                                              <div class="input-group">
                                                  <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                      $
                                                    </div>
                                                  </div>
                                                  <input 
                                                  type="number" 
                                                  ${tei.disabled ? 'disabled readonly': ''} 
                                                  id="${id}"
                                                  oninput="pushDataElement(this.id,this.value);calculateTotals('${index}',this.id)" 
                                                  value="${expense}" class="form-control currency">
                                              </div>
                                          </td>`
                                          }
                                          projectRows += `
                                          <td>
                                              <div class="input-group">
                                                  <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                      $
                                                    </div>
                                                  </div>
                                                  <input type="text" 
                                                  disabled
                                                  id="total-actualExpense-${index}"
                                                  value="${total.toLocaleString()}" class="form-control input-budget currency">
                                              </div>
                                          </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <strong data-i18n="intro.variation">Variation</strong>
                                              </td>`
                                              total = 0;
                                              for(let variation in dataElements.arProjectExpenseCategory[index]['variation']){
                                              let id = dataElements.arProjectExpenseCategory[index]['variation'][variation]
                                              let varitaionVal= dataValues[id] ? dataValues[id]:0;
                                              total+= Number(varitaionVal)
                                              projectRows += `<td>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                      <div class="input-group-text">
                                                        $
                                                      </div>
                                                    </div>
                                                    <input type="text" 
                                                    id="${id}"
                                                    disabled
                                                    style="background:${varitaionVal >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" 
                                                    value="${varitaionVal.toLocaleString()}" class="form-control input-budget currency">
                                                </div>
                                            </td>`
                                            }
                                        projectRows += `
                                        <td>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                  <div class="input-group-text">
                                                    $
                                                  </div>
                                                </div>
                                                <input type="text" 
                                                disabled
                                                id="total-variation-${index}"
                                                style="background:${total >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" 
                                                value="${total.toLocaleString()}" class="form-control input-budget currency">
                                            </div>
                                        </td>
                                        </tr></tbody></table>
                                        </div>
                                        <div class="form-row">
                                        <div class="form-group col-md-12 textbox-wrap">
                                          <label for="" data-i18n="intro.remarks">
                                              Remarks
                                          </label>
                                          <textarea 
                                          class="form-control-resize textlimit"       
                                          ${tei.disabled ? 'disabled readonly': ''}                                     
                                          id="${dataElements.arProjectExpenseCategory[index].comment}"
                                          onchange="pushDataElement(this.id,this.value);checkWords(this, ${index})"
                                          >${dataValues[dataElements.arProjectExpenseCategory[index].comment]? dataValues[dataElements.arProjectExpenseCategory[index].comment]: ''}</textarea>
                          
                                          <div
                                          class="char-counter form-text text-muted"
                                          id="counter${index}"
                                        >${maxWords- (dataValues[dataElements.arProjectExpenseCategory[index].comment] ? dataValues[dataElements.arProjectExpenseCategory[index].comment].trim().split(/\s+/).length: 0)} words remaining
                                        </div>
                                          <div class="invalid-feedback"> Error here 
                                          </div>
                                        </div>
                                      </div>
                                        <div class="form-row">
                                        <div class="col-sm-12 text-right">
                                            <div
                                              class="form-group text-end mar-b-0"
                                            >
                                              <!--                                                     <input type="button" value="CANCEL" class="btn btn-secondary mr-3"> -->
                                              <input
                                                type="button"
                                                value="SAVE AS DRAFT" onclick="submitProjects()" data-i18n="[value]intro.save_as_draft" 
                                                class="btn btn-secondary"
                                              />
                                              ${(length-1 == index) ? `                                              
                                              <button ${tei.disabled ? 'disabled readonly': ''}  class="btn btn-primary" onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/6-actual-income-ar.html'">
                                              <span data-i18n="intro.next">Next</span>:  
                                              <span data-i18n="intro.actual_income">6. Actual Income</span>
                                            </button>`:`<input
                                              type="button"
                                              value="NEXT"
                                              data-i18n="[value]intro.next" 
                                              onClick=changePanel('panel-body-${index+2}')
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

  fetchOrganizationUnitUid();
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
  const year = document.getElementById("year-update").value;
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
        names = [...names, ...prevEmptyNames, {name:values[project.name],comment: values[project.comment]}];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push("");
      }
    });
  }
  return names;
}
