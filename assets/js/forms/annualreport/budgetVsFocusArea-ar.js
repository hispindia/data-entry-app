import { createEvent, getEvents, getEventsPeriodicity, getProgramStagePeriodicity, getTEI, pushDataElement } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { formatNumberInput, getYears, unformatNumber } from '../func.js';

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
var focusAreaStatus = {
  "1. Care: Static Clinic": false,
  "2. Care: Outreach, mobile clinic, Community-based, delivery":false,
  "3. Care: Other Services, enabled or referred (associated clinics)":false,
  "4. Care: Social Marketing Services":false,
  "5. Care: Digital Health Intervention and Selfcare":false,
  "6. Advocacy":false,
  "7. CSE":false,
  "8. CSE Online, including social media":false,
  "9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting":false,
  "10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles":false,
  "11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures":false
};

var focusAreaNames = [
  "1. Care: Static Clinic",
  "2. Care: Outreach, mobile clinic, Community-based, delivery",
  "3. Care: Other Services, enabled or referred (associated clinics)",
  "4. Care: Social Marketing Services",
  "5. Care: Digital Health Intervention and Selfcare",
  "6. Advocacy",
  "7. CSE",
  "8. CSE Online, including social media",
  "9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting",
  "10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles",
  "11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures"
];

var PillarAreaNames = [
  "1. Center Care on People",
  "1. Center Care on People",
  "1. Center Care on People",
  "1. Center Care on People",
  "1. Center Care on People",
  "2. Move the Sexuality Agenda",
  "2. Move the Sexuality Agenda",
  "2. Move the Sexuality Agenda",
  "3. Solidarity for Change",
  "3. Solidarity for Change",
  "4. Nurture Our Federation"
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
  
      tei.program = program.arProjectFocusArea;
      tei.programStage = programStage.arProjectFocusArea;
  
      fetchEvents();    
    }

  async function fetchEvents(year) {
    tei.projects = [];
    tei.dataValues={};
    focusAreaList = {};
    tei.year.value = document.getElementById("year-update").value;
    tei.periodicity.value = document.getElementById("reporting-periodicity").value;

    const data = await getTEI(tei.orgUnit);

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
      
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, {id:tei.year.id, value: tei.year.value}); //data vlaues period wise
      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[tei.year.value]);

      const dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value }); //data vlaues period wise
      if(dataValuesAI && dataValuesAI[dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

      const dataValuesFA = getEvents(
        filteredPrograms,
        program.auProjectFocusArea,
        { id: tei.year.id, value: tei.year.value }
      );
      if (dataValuesFA[tei.year.value]) {
        dataElements.projectFocusAreaNew.forEach((project) => {
          if (dataValuesFA[tei.year.value][project.name]) {

            tei.yearAmount = dataValuesFA[tei.year.value][
              dataElements.totalBudget
            ]
              ? dataValuesFA[tei.year.value][dataElements.totalBudget]
              : "";
          }
        });
      }

      tei.dataValues = getEventsPeriodicity(
        filteredPrograms,
        program.arProjectFocusArea,
        { id: tei.year.id, value: tei.year.value },
        {
          id: tei.periodicity.id,
          value: tei.periodicity.value,
        }
      ); //data vlaues period wise

      if (tei.projects.length) {
        //for dataValue 2
        if (!tei.dataValues) {
        if(tei.year.value && tei.periodicity.value) {
          let data = [
            {
              dataElement: tei.year.id,
              value: tei.year.value,
            },
            {
              dataElement: tei.periodicity.id,
              value: tei.periodicity.value,
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
            dataValuesFA[tei.year.value],
            dataElements
          );
          tei.dataValues = {};
          calculatedElements.forEach(
            (elements) => (tei.dataValues[elements.dataElement] = elements.value)
          );
          data = [...data, ...calculatedElements];
          tei.event = await createEvent(data);
        }
        } else {
          tei.event = tei.dataValues["event"];

          let calculatedElements = loadCalculatedVariables(
            tei.dataValues,
            dataValuesFA[tei.year.value],
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
      $("#accordion").html(projectRows);
      $('#accordion .textValue').toArray().forEach(el => {
        el.addEventListener("input", (ev) => {
          var { id, value, dataset } = ev.target;
          pushDataElementFA(id, (value ? unformatNumber(value): ''));
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
      $("#accordion").html(
        `<h4 class="text-center text-warning my-4">No Existing Projects! Please add project in the Project Budget Section.</h4>`
      );
    }

    $('#accordion .save-as-draft-btn').toArray().forEach(btn => {
      btn.addEventListener("click", () => {
        alert("Data Saved Sucessfully!")
      });
    });
      
    var totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").html(totalsRow);

    // Build pivot summary table by focus area
    buildPivotSummary();

    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();

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
      const totalSpend = totalBudget && (actualExpense/totalBudget) && (actualExpense/totalBudget)!="Infinity" ? (actualExpense/totalBudget)*100:''
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
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          %
        </div>
      </div>
      <input type="text" value="${formatNumberInput(totalSpend)}" class="form-control totalSpend currency" readonly disabled>
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
    var totalPercent = 0;

    projectDetails.forEach((list, index) => {

      var focusAreaStatus = {
        "1. Care: Static Clinic": false,
        "2. Care: Outreach, mobile clinic, Community-based, delivery":false,
        "3. Care: Other Services, enabled or referred (associated clinics)":false,
        "4. Care: Social Marketing Services":false,
        "5. Care: Digital Health Intervention and Selfcare":false,
        "6. Advocacy":false,
        "7. CSE":false,
        "8. CSE Online, including social media":false,
        "9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting":false,
        "10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles":false,
        "11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures":false
      };
      totalBudget = 0;
      totalActualExpense = 0;
      totalVariation = 0;
      totalPercent = 0;
      projectRows += `
      <!--- sect ${index + 1}--->
      <div class="accordion">
      <div
        class="accordion-header"
        role="button"
        data-toggle="collapse"
        data-target="#panel-body-${index + 1}"
        aria-expanded="false"
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
                            <th data-i18n="intro.budget">Budget</th>
                            <th data-i18n="intro.actual_expense">Actual Expense</th>
                            <th><span data-i18n="intro.variation">Variation </span> ($)</th>
                            <th><span data-i18n="intro.total_spend">Total Spend </span> (%)</th>
                          </tr>
                          </thead>
                          <tbody>`;
      var newFocusAreaIndex = [];
      var emptyFocusAreaIndex = [];
      var takenIds = [];
      dataElements.projectFocusAreaNew[index].focusAreas.forEach( (focusAreaId,index) => {
        if(!takenIds[index]) takenIds[index] = false;
        if(dataValues[focusAreaId]) {
          const dataJson = dataValues[focusAreaId];
          if (dataJson.includes('1. Care: Static Clinic')) {
            newFocusAreaIndex[0] = focusAreaId;
            takenIds[0] = true;
          }
          else if (dataJson.includes('2. Care: Outreach, mobile clinic, Community-based, delivery')) {
            newFocusAreaIndex[1] = focusAreaId;
            takenIds[1] = true;
          }
          else if (dataJson.includes('3. Care: Other Services, enabled or referred (associated clinics)')) {
            newFocusAreaIndex[2] = focusAreaId;
            takenIds[2] = true;
          }
          else if (dataJson.includes('4. Care: Social Marketing Services')) {
            newFocusAreaIndex[3] = focusAreaId;
            takenIds[3] = true;
          }
          else if (dataJson.includes('5. Care: Digital Health Intervention and Selfcare')) {
            newFocusAreaIndex[4] = focusAreaId;
            takenIds[4] = true;
          }
          else if (dataJson.includes('6. Advocacy')) {
            newFocusAreaIndex[5] = focusAreaId;
            takenIds[5] = true;
          }
          else if (dataJson.includes('7. CSE')) {
            newFocusAreaIndex[6] = focusAreaId;  
            takenIds[6] = true;
          }
          else if (dataJson.includes('8. CSE Online, including social media')) {
            newFocusAreaIndex[7] = focusAreaId;
            takenIds[7] = true;
          }
          else if (dataJson.includes('9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting')) {
            newFocusAreaIndex[8] = focusAreaId;
            takenIds[8] = true;
          }
          else if (dataJson.includes('10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles')) {
            newFocusAreaIndex[9] = focusAreaId;
            takenIds[9] = true;
          }
          else if (dataJson.includes('11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures')) {
            newFocusAreaIndex[10] = focusAreaId;
            takenIds[10] = true;
          }
        }
      });

      dataElements.projectFocusAreaNew[index].focusAreas.forEach( (focusAreaId,index) =>  {
        if(!newFocusAreaIndex.includes(focusAreaId)) {

          var newIndex = takenIds.indexOf(false);
          if(newIndex != -1) {
            takenIds[newIndex] = true;
            emptyFocusAreaIndex[newIndex]  = focusAreaId;
          }
        }
    })
    // function findIndex(takenIds,newFocusAreaIndex) {
    //   var newIndex = takenIds.indexOf(false);
    //   var idIndex = newFocusAreaIndex[newIndex];
    //   if(idIndex && newIndex) {
    //     return findIndex(takenIds,newFocusAreaIndex)
    //   } else return newIndex;      
    // }
  
    
      dataElements.projectFocusAreaNew[index].focusAreas.forEach(
        (focusAreaId,indexFA) => {
          if (newFocusAreaIndex[indexFA]) {
            const focusAreaVal = JSON.parse(dataValues[newFocusAreaIndex[indexFA]]);
            const newAssignedBudget = focusAreaVal.assignedBudget
            ? Number(focusAreaVal.assignedBudget)
            : 0;
            const newActualExpense = focusAreaVal.expense
            ? Number(focusAreaVal.expense)
            : 0;
            const focusAreaPercent = newAssignedBudget && newActualExpense/newAssignedBudget && newActualExpense/newAssignedBudget!="Infinity" ? (newActualExpense/newAssignedBudget)*100:''
            totalBudget += focusAreaVal.assignedBudget
              ? Number(focusAreaVal.assignedBudget)
              : 0;
            totalActualExpense += focusAreaVal.expense
              ? Number(focusAreaVal.expense)
              : 0;
            totalVariation += focusAreaVal.variation
              ? Number(focusAreaVal.variation)
              : 0;

            focusAreaList[`${newFocusAreaIndex[indexFA]}area`]=focusAreaVal.area;
            focusAreaList[`${newFocusAreaIndex[indexFA]}pillar`]=focusAreaVal.pillar;

            focusAreaStatus[focusAreaVal.area] = true;

          projectRows += `<tr>
          <td><span id="${newFocusAreaIndex[indexFA]}-area" data-i18n="intro.${focusAreaTranslation[focusAreaVal.area]}">${focusAreaVal.area}</span></td>
          <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input 
            type="text" 
            id ="${newFocusAreaIndex[indexFA]}-assignedBudget"
            data-index="${index}"
            value="${
              focusAreaVal.assignedBudget
                ? formatNumberInput(focusAreaVal.assignedBudget)
                : 0
            }"
            ${(!list.comment) ? 'disabled': ''}
            class="form-control textValue input-budget-${indexFA} currency">
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
            id ="${newFocusAreaIndex[indexFA]}-expense"
            data-index="${index}"
            ${tei.disabled ? 'disabled readonly': ''} 
            value="${focusAreaVal.expense ? formatNumberInput(focusAreaVal.expense) : 0}"
            class="form-control textValue input-expense-${indexFA} currency">
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
            id ="${newFocusAreaIndex[indexFA]}-variation"
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
            class="form-control currency">
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                %
              </div>
            </div>
            <input 
            type="text" 
            id ="${newFocusAreaIndex[indexFA]}-percent"
            value="${
              focusAreaPercent
                ? formatNumberInput(focusAreaPercent)
                : 0
            }"
            disabled
            class="form-control ${newFocusAreaIndex[indexFA]}-percent currency">
          </div>
        </td>
      </tr>`;
          } else {
            const focusAreaVal = {
              area:focusAreaNames[indexFA],
              pillar: PillarAreaNames[indexFA],
              assignedBudget:'',
              expense:'',
              variation: ''
            }
            totalBudget +=  0;
            totalActualExpense +=  0;
            totalVariation +=  0;

            focusAreaList[`${emptyFocusAreaIndex[indexFA]}area`]=focusAreaVal.area;
            focusAreaList[`${emptyFocusAreaIndex[indexFA]}pillar`]=focusAreaVal.pillar;

            focusAreaStatus[focusAreaVal.area] = true;

          projectRows += `<tr>
          <td><span  id="${emptyFocusAreaIndex[indexFA]}-area" data-i18n="intro.${focusAreaTranslation[focusAreaVal.area]}">${focusAreaVal.area}</span></td>
          <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input 
            type="text" 
            id ="${emptyFocusAreaIndex[indexFA]}-assignedBudget"
            data-index="${index}"
            value="${formatNumberInput(focusAreaVal.assignedBudget)}"
            ${(!list.comment) ? 'disabled': ''}
            class="form-control textValue input-budget-${indexFA} currency">
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
            id ="${emptyFocusAreaIndex[indexFA]}-expense"
            ${tei.disabled ? 'disabled readonly': ''} 
            data-index="${index}"
            value="${formatNumberInput(focusAreaVal.expense)}"
            class="form-control textValue input-expense-${indexFA} currency">
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
            disabled
            id ="${emptyFocusAreaIndex[indexFA]}-variation"
            style="background:${
              focusAreaVal.variation
                ? focusAreaVal.variation >= 0
                  ? "#C1E1C1 !important"
                  : "#FAA0A0 !important"
                : ""
            }" 
            value="${formatNumberInput(focusAreaVal.variation)}"
            disabled
            class="form-control input-budget currency">
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                %
              </div>
            </div>
            <input 
            type="text" 
            id ="${emptyFocusAreaIndex[indexFA]}-percent"
            value=""
            disabled
            class="form-control ${focusAreaId}-percent currency">
          </div>
        </td>
      </tr>`;
          }
        }
      );

      totalPercent = totalBudget && totalActualExpense/totalBudget && totalActualExpense/totalBudget!="Infinity" ? (totalActualExpense/totalBudget)*100:''
         
      projectRows += `<tr>
                      <td class="text-center">
                        <strong data-i18n="intro.project_total">Project Total</strong>
                      </td>
                      <td>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <div class="input-group-text font-weight-bold">
                              $
                            </div>
                          </div>
                          <input 
                          type="text" 
                          id="total-budget-${index}"
                          value="${formatNumberInput(totalBudget)}"
                          disabled
                            class="form-control font-weight-bold input-budget currency" disabled>
                        </div>
                      </td>
                      <td>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <div class="input-group-text font-weight-bold">
                              $
                            </div>
                          </div>
                          <input 
                          type="text" 
                          id="total-actualExpense-${index}"
                          value="${formatNumberInput(totalActualExpense)}"
                          disabled
                            class="form-control font-weight-bold input-budget currency" disabled>
                        </div>
                      </td>
                      <td>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <div class="input-group-text font-weight-bold">
                              $
                            </div>
                          </div>
                          <input
                          type="text" 
                          id="total-variation-${index}"
                          value="${formatNumberInput(totalVariation)}"
                          disabled
                            class="form-control font-weight-bold input-budget currency" disabled>
                        </div>
                      </td>
                      <td>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <div class="input-group-text font-weight-bold">
                              %
                            </div>
                          </div>
                          <input
                          type="text" 
                          id="total-percent-${index}"
                          value="${formatNumberInput(totalPercent)}"
                          disabled
                            class="form-control font-weight-bold  input-budget currency" disabled>
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
              
                      <div class="char-counter form-text text-muted">
                      <span id="counter${index}">
                    ${
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
                    }</span>
                    <span data-i18n="intro.words_remaining">words remaining</span>
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
                       value="SAVE AS DRAFT" data-i18n="[value]intro.save_as_draft" 
                    class="save-as-draft-btn btn btn-secondary"
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

});

  function buildPivotSummary() {
    debugger;
    var rows = '';
    var globalBudget = 0, globalExpense = 0, globalVariance = 0, globalPercent = 0;
    focusAreaNames.forEach((name, index) => {
      var totalBudget = 0
      $(`.input-budget-${index}`).each(function () {
          const value = unformatNumber($(this).val()) || 0;
          totalBudget += value;
      });
      var totalExpense = 0
      $(`.input-expense-${index}`).each(function () {
          const value = unformatNumber($(this).val()) || 0;
          totalExpense += value;
      });
      globalBudget += totalBudget;
      globalExpense += totalExpense;

      var variance = totalBudget - totalExpense;
      let totalPercent = totalBudget && totalExpense/totalBudget && totalExpense/totalBudget!="Infinity" ? (totalExpense/totalBudget)*100:''

      rows += `<tr>
          <td><span data-i18n="intro.${focusAreaTranslation[name]}">${name}</span></td>
          <td>
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text font-weight-bold">$</div>
              </div>
              <input 
                type="text" 
                  value="${formatNumberInput(totalBudget)}"
                  disabled
                  class="form-control font-weight-bold input-budget currency" disabled
              />
            </div>
          </td>
          <td>
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text font-weight-bold">$</div>
              </div>
              <input 
                type="text" 
                  value="${formatNumberInput(totalExpense)}"
                  disabled
                  class="form-control font-weight-bold input-budget currency" disabled
              />
            </div>
          </td>
          <td>
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text font-weight-bold">$</div>
              </div>
              <input 
                type="text" 
                  value="${formatNumberInput(variance)}"
                  disabled
                  class="form-control font-weight-bold input-budget currency" disabled
              />
            </div>
          </td>
          <td>
            <div class="input-group">
              <div class="input-group-prepend">
                <div class="input-group-text font-weight-bold">%</div>
              </div>
              <input
                type="text" 
                  value="${formatNumberInput(totalPercent)}"
                disabled
                class="form-control font-weight-bold  input-budget currency" disabled>
            </div>
          </td>
      </tr>`
    });

    globalVariance = globalBudget - globalExpense;
    globalPercent = globalBudget && globalExpense/globalBudget && globalExpense/globalBudget!="Infinity" ? (globalExpense/globalBudget)*100:''

    rows += `<tr class="pivot-grand-total">
              <td><strong>Grand Total</strong></td>
              <td>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      $
                    </div>
                  </div>
                  <input type="text" value="${formatNumberInput(globalBudget)}" 
                  class="form-control font-weight-bold currency" readonly disabled>
                </div>
            </td>
            <td>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    $
                  </div>
                </div>
                <input type="text" value="${formatNumberInput(globalExpense)}"  
                class="form-control font-weight-bold currency" readonly disabled>
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
                style="background:${globalVariance >= 0 ? "#C1E1C1 !important" : "#FAA0A0 !important"}"  
                value="${formatNumberInput(globalVariance)}"
                class="form-control font-weight-bold currency" readonly disabled>
              </div>
            </td>
            <td>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    %
                  </div>
                </div>
                <input type="text" value="${formatNumberInput(globalPercent)}" 
                class="form-control font-weight-bold currency" readonly disabled>
              </div>
            </td>
          </tr>`;

    $('#pivot-summary').html(rows);
    $('#pivot-summary-wrap').show();
  }

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

        if (dataValuesFA[focusAreaId] || dataValues[focusAreaId]) {
          const arFocusArea = dataValues[focusAreaId] ? JSON.parse(dataValues[focusAreaId]) : "";
          const auFocusArea =  dataValuesFA[focusAreaId] ? JSON.parse(dataValuesFA[focusAreaId]): "";
          const focusArea = {
            area: '',
            pillar:'',
            expense: (arFocusArea && arFocusArea.area) ? arFocusArea.expense : "",
          };
          
          if(auFocusArea) {
            focusArea['area'] = auFocusArea.area;
            focusArea['pillar'] = auFocusArea.pillar;
          }
          else if(arFocusArea) {
            focusArea['area'] = arFocusArea.area;
            focusArea['pillar'] = arFocusArea.pillar;
          } 
          
          if (auFocusArea.budget) {
            assignedBudget =auFocusArea.budget;
            focusArea["assignedBudget"] = assignedBudget;
            totalBudget.value += Number(assignedBudget);
          } else if(project.comment && arFocusArea.assignedBudget) {
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
        names = [...names, ...prevEmptyNames, {name:values[project.name],comment: (values[project.comment] ? values[project.comment]: '')}];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push({name: '', comment: ''});
      }
    });
  }
  return names;
}


async function pushDataElementFA(id) {
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
  var totalBudget = 0;
  dataElements.projectFocusAreaNew.forEach((project,index) => {
  if($(`#${project.name}`).val()) {
    var definedBudget = 0;
    var expenses = 0;
    var totalVariation = 0;
    project.focusAreas.forEach(focusArea => {
      if($(`#${focusArea}-assignedBudget`).val() || expenseId==`${focusArea}-expense` || expenseId==`${focusArea}-assignedBudget`) {
      
      const budget = unformatNumber($(`#${focusArea}-assignedBudget`).val());
      const expense = unformatNumber($(`#${focusArea}-expense`).val());
      const variation = budget-expense;
      const variationPercent =  budget && (expense/budget) && (expense/budget)!="Infinity" ? (expense/budget)*100 : '';

      definedBudget += budget;
      expenses += expense;
      totalVariation += variation;

      if(expenseId==`${focusArea}-expense`) {
        $(`#${focusArea}-variation`).val(formatNumberInput(variation));
        $(`#${focusArea}-percent`).val(formatNumberInput(variationPercent));
        
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
        $(`#${focusArea}-percent`).val(formatNumberInput(variationPercent));
        
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
      let totalPercent = definedBudget && expenses/definedBudget && expenses/definedBudget!="Infinity" ? (expenses/definedBudget)*100:''
      $(`#total-budget-${idx}`).val(formatNumberInput(definedBudget));
      $(`#total-actualExpense-${idx}`).val(formatNumberInput(expenses));
      $(`#total-variation-${idx}`).val(formatNumberInput(totalVariation));
      $(`#total-percent-${idx}`).val(formatNumberInput(totalPercent));
    }
    totalDifference += totalVariation;
    totalExpenses += expenses;
    totalBudget += definedBudget;
  }
  })

  const totalSpend = totalBudget && totalExpenses/totalBudget && (totalExpenses/totalBudget)!="Infinity"? ((totalExpenses/totalBudget)*100).toFixed(2) : '';
  $('.totalSpend').val(formatNumberInput(totalSpend));

  $('.totalBudget').val(formatNumberInput(totalBudget));
  $('.totalExpenses').val(formatNumberInput(totalExpenses));
  $('.totalDifference').val(formatNumberInput(totalDifference));
  if(totalDifference >= 0) $('.totalDifference')[0].style.setProperty('background','#C1E1C1', 'important');
  else $('.totalDifference')[0].style.setProperty('background','#FAA0A0', 'important');
  pushDataElement($('.totalBudget')[0].id, totalBudget);
  pushDataElement($('.totalExpenses')[0].id, totalExpenses);
  pushDataElement($('.totalDifference')[0].id, totalDifference);
  
  buildPivotSummary();
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
    