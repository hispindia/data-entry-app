const maxWords = 200;
var focusAreaList = {};
const focusAreaTranslation = {
  '1. Care: Static Clinic': 'focus_area_1',
  '2. Care: Outreach, mobile clinic, Community-based, delivery': 'focus_area_2',
  '3. Care: Other Services, enabled or referred (associated clinics)': 'focus_area_3',
  '4. Care: Social Marketing Services': 'focus_area_4',
  '5. Care: Digital Health Intervention and Selfcare': 'focus_area_5',
  '6. Advocacy': 'focus_area_6',
  '7. CSE': 'focus_area_7',
  '8. CSE Online, including social media': 'focus_area_8',
  '9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting': 'focus_area_9',
  '10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles': 'focus_area_10',
  '11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures': 'focus_area_11',
  '1. Center Care on People':'strategic_pillar_1',
  '2. Move the Sexuality Agenda':'strategic_pillar_2',
  '3. Solidarity for Change':'strategic_pillar_3',
  '4. Nurture Our Federation':'strategic_pillar_4',
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

  document
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchOrganizationUnitUid();
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

    var annualReporting = window.localStorage.getItem("annualReporting");
    if(annualReporting) document.getElementById('reporting-periodicity').value = annualReporting;

    tei.program = program.arProjectFocusArea;
    tei.programStage = programStage.arProjectFocusArea;
    dataElements.period.value = document.getElementById("headerPeriod").value;
    dataElements.periodicity.value = document.getElementById(
      "reporting-periodicity"
    ).value;

    tei.year = {
      ...tei.year,
      start: dataElements.period.value.split(" - ")[0],
      end: dataElements.period.value.split(" - ")[1],
    };

    var yearOptions = "";
    for (let year = tei.year.start; year <= tei.year.end; year++) {
      if(tei.hideReportingYears.includes(year)) continue;
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById("year-update").innerHTML = yearOptions;
    document.getElementById('year-update').options[0].selected = true;
    var annualYear = window.localStorage.getItem("annualYearAR");
    if(annualYear) document.getElementById('year-update').value = annualYear;
  }
  async function fetchEvents(year) {
    tei.projects = [];
    tei.dataValues={};
    focusAreaList = {};
    if (!year) year = document.getElementById("year-update").value;
    dataElements.periodicity.value = document.getElementById(
      "reporting-periodicity"
    ).value;

    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) =>
          enroll.program == program.auProjectDescription ||
          enroll.program == program.arProjectFocusArea ||
            enroll.program == program.auProjectFocusArea ||
            enroll.program == program.arTotalIncome

        );
      
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, dataElements.year.id); //data vlaues period wise
      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[year]);

      const dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: dataElements.year.id, value: year }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value }); //data vlaues period wise
      if(dataValuesAI && dataValuesAI[dataElements.submitAnnualUpdate])  tei.disabled = true;

      const dataValuesFA = getEvents(
        filteredPrograms,
        program.auProjectFocusArea,
        dataElements.year.id
      );
      if (dataValuesFA[year]) {
        dataElements.projectFocusAreaNew.forEach((project) => {
          if (dataValuesFA[year][project.name]) {

            tei.yearlyAmount[`amount-${year}`] = dataValuesFA[year][
              dataElements.totalBudget
            ]
              ? dataValuesFA[year][dataElements.totalBudget]
              : "";
          }
        });
      }

      const dataValues = getEventsPeriodicity(
        filteredPrograms,
        program.arProjectFocusArea,
        { id: dataElements.year.id, value: year },
        {
          id: dataElements.periodicity.id,
          value: dataElements.periodicity.value,
        }
      ); //data vlaues period wise

      if (tei.projects.length) {
        //for dataValue 2
        if (!dataValues) {
        if(year && dataElements.period.value && dataElements.periodicity.value) {
          let data = [
            {
              dataElement: dataElements.year.id,
              value: year,
            },
            {
              dataElement: dataElements.period.id,
              value: dataElements.period.value,
            },
            {
              dataElement: dataElements.periodicity.id,
              value: dataElements.periodicity.value,
            },
          ];
          tei.projects.forEach((project, index) => {
            data.push({
              dataElement: dataElements.projectFocusAreaNew[index].name,
              value: project.name,
            });
          });

          let calculatedElements = loadCalculatedVariables(
            {},
            dataValuesFA[year],
            dataElements
          );
          calculatedElements.forEach(
            (elements) => (dataValues[elements.dataElement] = elements.value)
          );
          data = [...data, ...calculatedElements];
          tei.event = await createEvent(data);
        }
        } else {
          tei.event = dataValues["event"];
          tei.dataValues = dataValues;

          let calculatedElements = loadCalculatedVariables(
            dataValues,
            dataValuesFA[year],
            dataElements
          );
          calculatedElements.forEach((elements) => {
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
    $("#accordion").empty();
    if (tei.projects.length) {
      let projectRows = displayProjectDetails(tei.projects, dataValues);
      $("#accordion").append(projectRows);
    } else {
      $("#accordion").append(
        `<h4 class="text-center text-warning my-4">No Existing Projects! Please add project in the Project Budget Section.</h4>`
      );
    }

    var totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    
      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues) {
    const totalBudget = dataValues[dataElements.totalBudget]
      ? Number(dataValues[dataElements.totalBudget])
      : "";
    const actualExpense = dataValues[dataElements.totalExpenses]
      ? Number(dataValues[dataElements.totalExpenses])
      : "";
    const difference = dataValues[dataElements.difference]
      ? Number(dataValues[dataElements.difference])
      : "";
    var totalsRow = `
      <tr>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" value="${formatNumberInput(totalBudget)}" id="${
      dataElements.totalBudget
    }" class="form-control totalBudget  currency" readonly disabled>
    </div>
  </td>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" value="${formatNumberInput(actualExpense)}" id="${
      dataElements.totalExpenses
    }" class="form-control totalExpenses  currency" readonly disabled>
    </div>
  </td>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" style="background:${
        difference >= 0 ? "#C1E1C1 !important" : "#FAA0A0 !important"
      }"  value="${formatNumberInput(difference)}" id="${
      dataElements.difference
    }" class="form-control totalDifference currency" readonly disabled>
    </div>
  </td>
</tr>
`;
    return totalsRow;
  }
  function displayProjectDetails(projectDetails, dataValues) {
    var projectRows = "";
    var length = projectDetails.length;
    var totalBudget = 0;
    var totalActualExpense = 0;
    var totalVariation = 0;

    projectDetails.forEach((list, index) => {
      totalBudget = 0;
      totalActualExpense = 0;
      totalVariation = 0;
      projectRows += `
      <!--- sect ${index + 1}--->
      <div class="accordion">
      <div
        class="accordion-header active"
        role="button"
        data-toggle="collapse"
        data-target="#panel-body-${index + 1}"
      >
        <h4 class="d-flex align-items-center">
        <span class="">${index + 1}. </span>
          <span class="input-headings w-100"
            ><input
              class="w-100"
              type="text"
              id="${dataElements.projectFocusAreaNew[index].name}"
              value="${list.name}"
              title="${list.name}"
              readonly
          /></span>
        </h4>
      </div>
      <div
        class="accordion-body collapse"
        id="panel-body-${index + 1}"
        data-parent="#accordion"
      >
      
      <div class="wrap-project-area">
        <div class="budget-wrap table-responsive">
        <table class="table table-striped table-md mb-0 " width="100%">
                                  <thead>
                                  <tr>
                                    <th data-i18n="intro.focus_area">Focus Area</th>
                                    <th data-i18n="intro.pillar">Pillar</th>
                                    <th data-i18n="intro.budget">Budget</th>
                                    <th data-i18n="intro.actual_expense">Actual Expense</th>
                                    <th data-i18n="intro.variation">Variation</th>

                                  </tr>
                                  </thead>
                                  <tbody>`;
      dataElements.projectFocusAreaNew[index].focusAreas.forEach(
        (focusAreaId) => {
          if (dataValues[focusAreaId]) {
            const focusAreaVal = JSON.parse(dataValues[focusAreaId]);
            totalBudget += focusAreaVal.assignedBudget
              ? Number(focusAreaVal.assignedBudget)
              : 0;
            totalActualExpense += focusAreaVal.expense
              ? Number(focusAreaVal.expense)
              : 0;
            totalVariation += focusAreaVal.variation
              ? Number(focusAreaVal.variation)
              : 0;

            focusAreaList[`${focusAreaId}area`]=focusAreaVal.area;
            focusAreaList[`${focusAreaId}pillar`]=focusAreaVal.pillar;

          projectRows += `<tr>
          <td><span id="${focusAreaId}-area" data-i18n="intro.${focusAreaTranslation[focusAreaVal.area]}">${focusAreaVal.area}</span></td>
          <td><span id="${focusAreaId}-pillar" data-i18n="intro.${focusAreaTranslation[focusAreaVal.pillar]}">${focusAreaVal.pillar}</span></td>
          <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input 
            type="text" 
            id ="${focusAreaId}-assignedBudget"
            oninput="formatNumberInput(this);pushDataElementFA(this.id);calculateTotals('${index}',this.id)"
            value="${
              focusAreaVal.assignedBudget
                ? formatNumberInput(focusAreaVal.assignedBudget)
                : 0
            }"
            ${(!list.comment) ? 'disabled': ''}
            class="form-control input-budget currency">
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input 
            type="text"  
            id ="${focusAreaId}-expense"
            ${tei.disabled ? 'disabled readonly': ''} 
            oninput="formatNumberInput(this);pushDataElementFA(this.id);calculateTotals('${index}',this.id)" 
            value="${focusAreaVal.expense ? formatNumberInput(focusAreaVal.expense) : 0}"
            class="form-control input-budget currency">
          </div>
        </td>
  
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input 
            type="text" 
            id ="${focusAreaId}-variation"
            style="background:${
              focusAreaVal.variation
                ? focusAreaVal.variation >= 0
                  ? "#C1E1C1 !important"
                  : "#FAA0A0 !important"
                : ""
            }" 
            value="${
              focusAreaVal.variation
                ? formatNumberInput(focusAreaVal.variation)
                : 0
            }"
            disabled
            class="form-control input-budget currency">
          </div>
        </td>
      </tr>`;
          }
        }
      );

      projectRows += `    <tr>
                              <td colspan="2" class="text-center">
                                <strong data-i18n="intro.project_total">Project Total</strong>
                              </td>
                              <td>
                                <div class="input-group">
                                  <div class="input-group-prepend">
                                    <div class="input-group-text">
                                      $
                                    </div>
                                  </div>
                                  <input 
                                  type="text" 
                                  id="total-budget-${index}"
                                  value="${formatNumberInput(totalBudget)}"
                                  disabled
                                    class="form-control input-budget currency" disabled>
                                </div>
                              </td>
                              <td>
                                <div class="input-group">
                                  <div class="input-group-prepend">
                                    <div class="input-group-text">
                                      $
                                    </div>
                                  </div>
                                  <input 
                                  type="text" 
                                  id="total-actualExpense-${index}"
                                  value="${formatNumberInput(totalActualExpense)}"
                                  disabled
                                    class="form-control input-budget currency" disabled>
                                </div>
                              </td>


                              <td>
                                <div class="input-group">
                                  <div class="input-group-prepend">
                                    <div class="input-group-text">
                                      $
                                    </div>
                                  </div>
                                  <input
                                  type="text" 
                                  id="total-variation-${index}"
                                  value="${formatNumberInput(totalVariation)}"
                                  disabled
                                    class="form-control input-budget currency" disabled>
                                </div>
                              </td>
                            </tr>


                            <tr>
                            <td colspan="2" class="text-center" valign="top">
                              <strong data-i18n="intro.remarks">Remarks</strong>
                            </td>
                            <td colspan="3">
                              <textarea 
                              class="form-control-resize textlimit"                                           
                              id="${
                                dataElements.projectFocusAreaNew[index].comment
                              }"
                              ${tei.disabled ? 'disabled readonly': ''} 
                              onchange="pushDataElement(this.id,this.value);checkWords(this, ${index})"
                              >${
                                dataValues[
                                  dataElements.projectFocusAreaNew[index]
                                    .comment
                                ]
                                  ? dataValues[
                                      dataElements.projectFocusAreaNew[index]
                                        .comment
                                    ]
                                  : ""
                              }</textarea>
              
                              <div class="char-counter form-text text-muted" 
                              id="counter${index}"
                            >${
                              maxWords -
                              (dataValues[
                                dataElements.projectFocusAreaNew[index].comment
                              ]
                                ? dataValues[
                                    dataElements.projectFocusAreaNew[index]
                                      .comment
                                  ]
                                    .trim()
                                    .split(/\s+/).length
                                : 0)
                            } words remaining
                            </div>

                              <div class="invalid-feedback"> Error here
                              </div>
                            </td>

                          </tr>

                        </tbody>
                      </table>
                    </div>

                  </div>
                  <div class="form-row">
                    <div class="col-sm-12 text-right">
                    <div
                    class="form-group text-end mar-b-0"
                    >
                   <!-- <input type="button" value="CANCEL" class="btn btn-secondary mr-3"> -->
                   <input
                      type="button"
                       value="SAVE AS DRAFT" onclick="submitProjects()" data-i18n="[value]intro.save_as_draft" 
                        class="btn btn-secondary"
                        />
                        ${length - 1 == index? 
                          ` <button  ${tei.disabled ? 'disabled readonly': ''} class="btn btn-primary" onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/5-budget-vs-actual-expense-wise.html'">
                          <span data-i18n="intro.next">Next</span>:  
                          <span data-i18n="intro.budget_vs_expense">5. Budget vs Actuals by Expense Category</span>
                      </button>`
                            : `<input
                            type="button"
                            value="NEXT"
                            data-i18n="[value]intro.next" 
                            onClick=changePanel('panel-body-${index + 2}')
                            class="btn btn-primary"
                            />`
                            }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--- sect ${index + 1}--->`;
    });

    return projectRows;
  }

  fetchOrganizationUnitUid();
});

function submitBudgetExpense() {
  var value = "";
  const date = new Date();

  var difference = document.getElementById(
    `${dataElements.difference}-${date.getFullYear()}`
  );
  if (difference) value = `Total Budget Expense is not equal to Total Expense`;

  if (value) alert(value);
  alert("Event Pushed Successfully!");
}

function loadCalculatedVariables(
  dataValues,
  dataValuesFA,
  dataElements
) {
  const year = document.getElementById("year-update").value;
  var projectNames = [];
  var focusAreas = [];

  var totalBudget = {
    dataElement: dataElements.totalBudget,
    value: 0,
  };
  var totalExpenses = {
    dataElement: dataElements.totalExpenses,
    value: 0,
  };

  tei.projects.forEach((project, index) => {
    projectNames.push({
      dataElement: `${dataElements.projectFocusAreaNew[index].name}`,
      value: project.name,
    });
    dataElements.projectFocusAreaNew[index].focusAreas.forEach((focusAreaId) => {
        let assignedBudget = 0;
        let actualExpense = 0;

        if (dataValuesFA[focusAreaId]) {
          const arFocusArea = dataValues[focusAreaId] ? JSON.parse(dataValues[focusAreaId]) : "";
          const auFocusArea =  JSON.parse(dataValuesFA[focusAreaId]);
          const focusArea = {
            area: auFocusArea.area,
            pillar:auFocusArea.pillar,
            expense: arFocusArea ? arFocusArea.expense : "",
          };
          if (auFocusArea.budget) {
            assignedBudget =auFocusArea.budget;
            focusArea["assignedBudget"] = assignedBudget;
            totalBudget.value += Number(assignedBudget);
          } else if(project.comment && arFocusArea.assignedBudget ) {
            assignedBudget = arFocusArea.assignedBudget;
            focusArea["assignedBudget"] = assignedBudget;
            totalBudget.value += Number(assignedBudget);
          }
          
          if (focusArea["expense"]) {
            actualExpense = focusArea["expense"];
            totalExpenses.value += Number(actualExpense);
          }
          focusArea["variation"] =
            Number(assignedBudget) - Number(actualExpense);

          focusAreas.push({
            dataElement: focusAreaId,
            value: JSON.stringify(focusArea),
          });
        } else {
          focusAreas.push({
            dataElement: focusAreaId,
            value: '',
          });
        }
      }
    );
  });

  var difference = {
    dataElement: dataElements.difference,
    value: totalBudget.value - totalExpenses.value,
  };

  return [
    ...projectNames,
    ...focusAreas,
    totalBudget,
    totalExpenses,
    difference,
  ];
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


function pushDataElementFA(id) {
  const ids = id.split('-');
  var assignedBudget = document.getElementById(`${ids[0]}-assignedBudget`).value;
  if(assignedBudget) assignedBudget = unformatNumber(assignedBudget);
    const values= {
      area: focusAreaList[`${ids[0]}area`],
      pillar: focusAreaList[`${ids[0]}pillar`],
      assignedBudget:assignedBudget,
      expense: unformatNumber(document.getElementById(`${ids[0]}-expense`).value),
      variation: unformatNumber(document.getElementById(`${ids[0]}-variation`).value),
    }
    pushDataElement(ids[0],JSON.stringify(values));
}

function calculateTotals(idx, expenseId) {
  var totalExpenses = 0;
  var totalDifference = 0;
  dataElements.projectFocusAreaNew.forEach((project,index) => {
  if($(`#${project.name}`).val()) {
    var definedBudget = 0;
    var expenses = 0;
    var totalVariation = 0;
    project.focusAreas.forEach(focusArea => {
      if($(`#${focusArea}-assignedBudget`).val()) {
      
      const budget = unformatNumber($(`#${focusArea}-assignedBudget`).val());
      const expense = unformatNumber($(`#${focusArea}-expense`).val());
      const variation = budget-expense;

      definedBudget += budget;
      expenses += expense;
      totalVariation += variation;

      if(expenseId==`${focusArea}-expense`) {
        $(`#${focusArea}-variation`).val(formatNumberInput(variation));
        
        if(variation >= 0) $(`#${focusArea}-variation`)[0].style.setProperty('background','#C1E1C1', 'important')
        else $(`#${focusArea}-variation`)[0].style.setProperty('background','#FAA0A0', 'important')
        const focusAreaVal = JSON.stringify({
          area:focusAreaList[`${focusArea}area`],
          pillar:focusAreaList[`${focusArea}pillar`],
          assignedBudget:unformatNumber($(`#${focusArea}-assignedBudget`).val()),
          expense: expense,
          variation: variation
        })
        pushDataElement(focusArea, focusAreaVal);
      } 
      else if (expenseId==`${focusArea}-assignedBudget`) {
        $(`#${focusArea}-variation`).val(formatNumberInput(variation));
        
        if(variation >= 0) $(`#${focusArea}-variation`)[0].style.setProperty('background','#C1E1C1', 'important')
        else $(`#${focusArea}-variation`)[0].style.setProperty('background','#FAA0A0', 'important')
      const focusAreaVal = JSON.stringify({
        area:focusAreaList[`${focusArea}area`],
        pillar:focusAreaList[`${focusArea}pillar`],
        assignedBudget:unformatNumber($(`#${focusArea}-assignedBudget`).val()),
        expense: expense,
        variation: variation
      })
        pushDataElement(focusArea, focusAreaVal);
      }
      } 
    })
    if(idx==index) {
      $(`#total-budget-${idx}`).val(formatNumberInput(definedBudget));
      $(`#total-actualExpense-${idx}`).val(formatNumberInput(expenses));
      $(`#total-variation-${idx}`).val(formatNumberInput(totalVariation));
    }
    totalDifference += totalVariation;
    totalExpenses += expenses;
  }
  })

  $('.totalExpenses').val(formatNumberInput(totalExpenses));
  $('.totalDifference').val(formatNumberInput(totalDifference));
  if(totalDifference >= 0) $('.totalDifference')[0].style.setProperty('background','#C1E1C1', 'important');
  else $('.totalDifference')[0].style.setProperty('background','#FAA0A0', 'important');
  pushDataElement($('.totalExpenses')[0].id, totalExpenses);
  pushDataElement($('.totalDifference')[0].id, totalDifference);

}

function submitProjects() {
  alert("Data Saved Successfully!")
}