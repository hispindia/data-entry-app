import { createEvent, getEvents, getTEI, pushDataElement, pushDataElementYear } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears, unformatNumber } from "../func.js";

var totalProjectBudget = [];
const maxWords = 200;
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
const focusAreaOptions = [{
  "code": "1. Care: Static Clinic",
  "name": "1. Care: Static Clinic",
  "id": "CZLBwESjbAX",
  "index": 1,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
    }]
  },
  {
  "code": "2. Care: Outreach, mobile clinic, Community-based, delivery",
  "name": "2. Care: Outreach, mobile clinic, Community-based, delivery",
  "id": "OChleCDWjL3",
  "index": 2,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
    }]
  },
  {
  "code": "3. Care: Other Services, enabled or referred (associated clinics)",
  "name": "3. Care: Other Services, enabled or referred (associated clinics)",
  "id": "wqByE5DAD2B",
  "index": 3,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
    }]
  },
  {
  "code": "4. Care: Social Marketing Services",
  "name": "4. Care: Social Marketing Services",
  "id": "fXav463CcEs",
  "index": 4,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
    }]
  },
  {
  "code": "5. Care: Digital Health Intervention and Selfcare",
  "name": "5. Care: Digital Health Intervention and Selfcare",
  "id": "yaHKcQ0QD8R",
  "index": 5,
  pillars: [{
    "code": "1. Center Care on People",
    "name": "1. Center Care on People",
    "id": "Cnof6vSGlxa",
    "index": 1,
    }]
  },
  {
  "code": "6. Advocacy",
  "name": "6. Advocacy",
  "id": "R4l1TP5OZEG",
  "index": 6,
  pillars: [{
    "code": "2. Move the Sexuality Agenda",
    "name": "2. Move the Sexuality Agenda",
    "id": "aWqHHcdbAxP",
    "index": 2,
    }]
  },
  {
  "code": "7. CSE",
  "name": "7. CSE",
  "id": "Nh55R7CiG1p",
  "index": 7,
  pillars: [{
    "code": "2. Move the Sexuality Agenda",
    "name": "2. Move the Sexuality Agenda",
    "id": "aWqHHcdbAxP",
    "index": 2,
    }]
  },
  {
  "code": "8. CSE Online, including social media",
  "name": "8. CSE Online, including social media",
  "id": "aMdeIx8pRwa",
  "index": 8,
  pillars: [{
    "code": "2. Move the Sexuality Agenda",
    "name": "2. Move the Sexuality Agenda",
    "id": "aWqHHcdbAxP",
    "index": 2,
    }]
  },
  {
  "code": "9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting",
  "name": "9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting",
  "id": "njWSsl6dYmM",
  "index": 9,
  pillars: [{
    "code": "3. Solidarity for Change",
    "name": "3. Solidarity for Change",
    "id": "RRZ2NLpKIO7",
    "index": 2,
    }]
  },
  {
  "code": "10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles",
  "name": "10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles",
  "id": "NLcmQt3b23t",
  "index": 10,
  pillars: [{
    "code": "3. Solidarity for Change",
    "name": "3. Solidarity for Change",
    "id": "RRZ2NLpKIO7",
    "index": 3,
    }]
  },
  {
  "code": "11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures",
  "name": "11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures",
  "id": "Th0iZtCIeOQ",
  "index": 11,
  pillars: [{
    "code": "4. Nurture Our Federation",
    "name": "4. Nurture Our Federation",
    "id": "T9b4CVvuq81",
    "index": 4,
    }]
  }
]

const strategicPillarOptions = [{
  "code": "1. Center Care on People",
  "name": "1. Center Care on People",
  "id": "Cnof6vSGlxa",
  "index": 1
  },
  {
  "code": "2. Move the Sexuality Agenda",
  "name": "2. Move the Sexuality Agenda",
  "id": "aWqHHcdbAxP",
  "index": 2
  },
  {
  "code": "3. Solidarity for Change",
  "name": "3. Solidarity for Change",
  "id": "RRZ2NLpKIO7",
  "index": 3
  },
  {
  "code": "4. Nurture Our Federation",
  "name": "4. Nurture Our Federation",
  "id": "T9b4CVvuq81",
  "index": 4
  }
]

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

    tei.program = program.auProjectFocusArea;
    tei.programStage = programStage.auProjectFocusArea;

    fetchEvents();    
  }


  async function fetchEvents() {
    tei.projects = [];
    totalProjectBudget = [];

    tei.year.value = document.getElementById("year-update").value;

    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program == program.auProjectBudget || enroll.program==program.auProjectDescription 
        );
  
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, {id:tei.year.id, value: tei.year.value});
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[tei.year.value]);

      const dataValuesPB = getEvents(filteredPrograms, program.auProjectBudget, {id:tei.year.id, value: tei.year.value});
      if(dataValuesPB[tei.year.value]) {
      tei.yearAmount = dataValuesPB[tei.year.value][dataElements.totalBudget] ? dataValuesPB[tei.year.value][dataElements.totalBudget] : ''
      dataElements.projectBudget.forEach((project,index) => {
        if(dataValuesPB[tei.year.value][project.name] && tei.projects[index]) {
          if(!totalProjectBudget[index]) totalProjectBudget[index] = 0;
          if(dataValuesPB[tei.year.value][project.budget]) totalProjectBudget[index] += Number(dataValuesPB[tei.year.value][project.budget]);
        }
      })
    }

      tei.dataValues = getEvents(filteredPrograms, tei.program, {id:tei.year.id, value: tei.year.value}); //data vlaues period wise

      if(tei.projects.length) {
          if (!tei.dataValues[tei.year.value]) {
            tei.dataValues[tei.year.value] = {};
            const data = [{
              dataElement: tei.year.id,
              value: tei.year.value
            }];
            tei.projects.forEach((name,index) => {
              data.push({
              dataElement:dataElements.projectFocusAreaNew[index].name,
              value: name
            })
          })
          tei.event = await createEvent(data);

          data.forEach(de => tei.dataValues[tei.year.value][de.dataElement]= de.value)
          } else {
  
            tei.event =  tei.dataValues[tei.year.value]["event"];

          var calculatedElements = loadCalculatedVariables(tei.dataValues[tei.year.value], {
            projectFocusAreaNew: dataElements.projectFocusAreaNew,
            totalBudget: dataElements.totalBudget,
            difference: dataElements.difference,
        });
          calculatedElements.forEach(elements =>  {
            tei.dataValues[tei.year.value][elements.dataElement] = elements.value;
            pushDataElement(elements.dataElement, elements.value);
          });
          }
      }
      populateProgramEvents(tei.dataValues[tei.year.value] ? tei.dataValues[tei.year.value] : {});
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    $("#accordion").empty();
    if (tei.projects.length) {
      let projectRows = displayProjectDetails(
        tei.projects,
        dataValues
      );
      $('#accordion').html(projectRows);
      $('#accordion .textValue').toArray().forEach(el => {
        el.addEventListener("input", (ev) => {
          var { id, name, dataset, value } = ev.target;
          pushDataElementFA(id, dataset.index, unformatNumber(value));
          ev.target.value = formatNumberInput(value);
          calculateTotals(name)
        })
      })
    $('#accordion .textlimit').toArray().forEach(el => {
      el.addEventListener("input", (ev) => {
        var { id, value, dataset } = ev.target;
        pushDataElement(id,value);
        checkWords(ev.target, dataset.count);
      })
    })
    } else {
      $("#accordion").append(
        `<h4 class="text-center text-warning my-4">No Existing Projects! Please add some project in the Project Description Section.</h4>`
      );
    }

    $('#accordion .save-as-draft-btn').toArray().forEach(btn => {
      btn.addEventListener("click", () => {
        alert("Data Saved Successfully!")
      });
    });    
    
    var totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    buildPivotSummary();

    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();
    
      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues) {
    var totalsRow = "";
      const totalBudget =
        dataValues[dataElements.totalBudget]
          ? Number(dataValues[dataElements.totalBudget])
          : "";
      const difference =
        dataValues[dataElements.difference]
          ? Number(dataValues[dataElements.difference])
          : "";
      totalsRow += `<tr>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(totalBudget)}" id="${dataElements.totalBudget}" class="form-control totalBudget  currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="FAA0A0; background:${difference >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}"  value="${formatNumberInput(difference)}" id="${dataElements.difference}" class="form-control difference currency" disabled readonly>
          </div>
        </td>
      </tr>
      `;
    return totalsRow;
  }

  function displayProjectDetails(projectDetails, dataValues) {
    var projectRows = "";
    var length = projectDetails.length;
    projectDetails.forEach((list, index) => {
      projectRows += `
      <!--- sect ${index + 1} --->
      <div class="accordion">
        <div class="accordion-header active" role="button" data-toggle="collapse" data-target="#panel-body-${index + 1}">
          <h4 class="d-flex align-items-center">
          <span class="">${index+1}. </span>
          <span class="input-headings w-100">
            <input  class="w-100" type="text" 
            id="${dataElements.projectFocusAreaNew[index].name}"
            value="${list}"
            title="${list}"
            readonly
            ></span>
          </h4>
        </div>
        <div class="accordion-body collapse" id="panel-body-${
          index + 1
        }" data-parent="#accordion">`;

        projectRows += `
            <div class="wrap-project-area wrap-project-area-${index} table-responsive">
                <table class="table">
                <thead>
                  <tr>
                    <th> <span data-i18n="intro.project_focus_area">Project Focus Area</span> </th>
                    <th> <span data-i18n="intro.budget_focus_area">Budget by "Project Focus Area" </span> </th>
                  </tr>
                </thead>
                <tbody>`
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

      dataElements.projectFocusAreaNew[index].focusAreas.forEach( (focusAreaId) =>  {
        if(!newFocusAreaIndex.includes(focusAreaId)) {

          var newIndex = takenIds.indexOf(false);
          if(newIndex != -1) {
            takenIds[newIndex] = true;
            emptyFocusAreaIndex[newIndex]  = focusAreaId;
          }
        }
    })

      dataElements.projectFocusAreaNew[index].focusAreas.forEach((faId,indexFA) => {

          if (newFocusAreaIndex[indexFA]) {
            var faValue = {};
            faValue = JSON.parse(dataValues[newFocusAreaIndex[indexFA]]) 
            projectRows += `<tr><td data-i18n="intro.${focusAreaTranslation[focusAreaOptions[indexFA].name]}">${focusAreaOptions[indexFA].name}</td>
                          <td>
                            <input 
                            type="text" 
                            ${tei.disabled ? 'disabled readonly': ''}
                            id="${faId}" 
                            class="form-control textValue input-budget-${indexFA} currency"
                            value="${formatNumberInput(faValue.budget)}" 
                            data-index="${indexFA}"
                            name="${dataElements.projectFocusAreaNew[index].name}-${index}"
                            />
                        </td></tr>`
          } else {
            
            projectRows += `<tr><td data-i18n="intro.${focusAreaTranslation[focusAreaOptions[indexFA].name]}">${focusAreaOptions[indexFA].name}</td>
                          <td>
                            <input 
                            type="text" 
                            ${tei.disabled ? 'disabled readonly': ''}
                            id="${emptyFocusAreaIndex[indexFA]}" 
                            class="form-control textValue input-budget-${indexFA} currency"
                            value="" 
                            data-index="${indexFA}"
                            name="${dataElements.projectFocusAreaNew[index].name}-${index}"
                            />
                        </td></tr>`
          }
        })
        projectRows += `</tbody>
        </table>
        </div>`
      projectRows += `<hr>
                      <div class="form-row">
                      <div class="form-group col-md-12 textbox-wrap">
                        <label> <span data-i18n="intro.variation_budget">
                          Variation from total project budget </span> ${tei.year.value}
                        </label>`;
      projectRows += `<div class="budget-wrap">       
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <div class="input-group-text">$</div>
                          </div>
                          <input 
                          type="text" 
                          ${tei.disabled ? 'disabled readonly': ''}
                          id="${dataElements.projectFocusAreaNew[index].variation}"  
                          value="${dataValues[dataElements.projectFocusAreaNew[index].variation] ? formatNumberInput(dataValues[dataElements.projectFocusAreaNew[index].variation]): ''}"  
                          class="form-control currency"
                          name="variation-${dataElements.projectFocusAreaNew[index].name}"
                          style="background:${dataValues[dataElements.projectFocusAreaNew[index].variation] ? (dataValues[dataElements.projectFocusAreaNew[index].variation] >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'): ''}" 
                          disabled
                          readonly
                          >
                        </div>
                        <div class="invalid-feedback feedback ${dataValues[dataElements.projectFocusAreaNew[index].variation]<0 ? 'd-block': ''}"> Please provide remarks for the variance </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group col-md-12 textbox-wrap">
                          <label for="${dataElements.projectFocusAreaNew[index].comment}"><span data-i18n="intro.comments">
                          Comments</span> (<small class="text-muted ml-1" data-i18n="intro.optional">optional</small>)
                          </label>
                          <textarea 
                          class="form-control-resize textlimit" 
                          ${tei.disabled ? 'disabled readonly': ''}
                          id="${dataElements.projectFocusAreaNew[index].comment}" 
                          >${dataValues[dataElements.projectFocusAreaNew[index].comment]
                              ? dataValues[dataElements.projectFocusAreaNew[index].comment]: ""}</textarea>
                              <div class="char-counter form-text text-muted">
                              <span id="counter${index}">
                              ${maxWords -(dataValues[dataElements.projectFocusAreaNew[index].comment]
                              ? dataValues[dataElements.projectFocusAreaNew[index].comment].trim().split(/\s+/).length: 0)
                              }</span> <span data-i18n="intro.words_remaining">words remaining</span> </div>
                          <div class="invalid-feedback"> Error here </div> 
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="col-sm-12 text-right">
                          <div class="form-group text-end mar-b-0">
                          <input type="button" value="SAVE AS DRAFT" data-i18n="[value]intro.save_as_draft"  class="save-as-draft-btn btn btn-secondary">
                            ${ length - 1 == index ? 
                              `<button class="btn btn-primary" onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/2.4-breakdown-by-expense-category-au.html'">
                                  <span data-i18n="intro.next">Next</span>:  
                                  <span data-i18n="intro.project_expense">  2.4 Budget by Expense Category</span>
                              
                                </button>`
                                : `<input
                          type="button"
                          data-i18n="[value]intro.next" 
                          value="NEXT"
                          onClick=changePanel('panel-body-${index + 2}')
                          class="btn btn-primary"
                            />`
                            }
                          </div>
                        </div>`
      projectRows += `</div></div>
                      </div>
                      </div>
                      </div>
                    <!--- sect ${index + 1} --->`;
    });

    return projectRows;
  }

  document
  .getElementById("year-update")
  .addEventListener("change", function (ev) {
    $('.loader-container').addClass('d-flex').removeClass('d-now');
    $('.myContainer').hide();
    window.localStorage.setItem("annualYear", ev.target.value);
    fetchEvents();
  });
  
});

function buildPivotSummary() {
  var totalValues = 0;
  var tableRows = '';
  focusAreaNames.forEach((name, index) => {
    var value = 0;
    $(`.input-budget-${index}`).each((_, el) => value += unformatNumber(el.value));
    totalValues += value;
    tableRows += `<tr><td>${name}</td><td><input type="text" disabled readonly class="form-control" value="${formatNumberInput(value)}" /></td></tr>`;
  });
  const difference = tei.yearAmount - totalValues;
  tableRows += `<tr><td class="font-weight-bold" data-i18n="intro.total_budget">Total Annual Budget</td><td><input type="text" disabled readonly class="form-control font-weight-bold" value="${formatNumberInput(totalValues)}" /></td></tr>
  <tr><td class="font-weight-bold" data-i18n="intro.difference">Difference</td><td><input type="text" disabled readonly  style="background:${difference >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" class="form-control font-weight-bold" value="${formatNumberInput(difference)}" /></td></tr>`; 

                            
  $('#pivot-summary').html(tableRows);
  $('#pivot-summary-wrap').show();
}
  
function submitProjectFocusArea() {
  var value = '';
  const date = new Date();

    var difference = document.getElementById(`${dataElements.difference}-${date.getFullYear()}`);
    if(difference) value = `The total project budget should be equal to total project budget by focus areas (Year: ${date.getFullYear()}). Please check the data.`
  
  if(value) alert(value);
  alert('Event Pushed Successfully!')
}

function loadCalculatedVariables(dataValues, dataElements) {
  var projectNames = [];
  var totalBudget = {
    dataElement: dataElements.totalBudget,
    value: 0
  };
  var variations = [];
  tei.projects.forEach((name,index) => {
    var budget = 0;
    projectNames.push({dataElement: `${dataElements.projectFocusAreaNew[index].name}`, value: name})
    dataElements.projectFocusAreaNew[index].focusAreas.forEach(id => {
      if(dataValues[id]) {
        const val = JSON.parse(dataValues[id]);
        if(val.budget) budget += Number(val.budget);
      }
    })
    if(budget) {
      variations.push({dataElement:dataElements.projectFocusAreaNew[index].variation , value: totalProjectBudget[index] - budget})
    } else {
      variations.push({dataElement:dataElements.projectFocusAreaNew[index].variation , value: totalProjectBudget[index]})
    }
    totalBudget.value += budget;
  })

  var difference = {
    dataElement: dataElements.difference,
    value: tei.yearAmount ? `${(tei.yearAmount - totalBudget.value)}`: '0'
  };

  return [
    ...projectNames,
    totalBudget,
    ...variations,
    difference
  ]
}

function pushDataElementFA(id, indexFA, value) {
    const values= {
      area: focusAreaNames[indexFA],
      pillar:PillarAreaNames[indexFA],
      budget:value,
    }
    if(values.budget) pushDataElement(id, JSON.stringify(values))
    else pushDataElement(id, '')
}


function checkProjects(projects, values) {
  var prevEmptyNames = [];
  var names= [];
  if(values) {
    projects.forEach(project => {
      if(values[project.name]) {
        names = [...names, ...prevEmptyNames, values[project.name]];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      }
    })
  }
  return names;
}

function calculateTotals(name) {
  const ids = name.split('-');
  
  var value = 0;
  var variation = 0;
  var budgetFocusArea = 0;
  $(`.textValue`).each((_, el) => value += unformatNumber(el.value));
  $(`.totalBudget`).val(value);
  const difference = tei.yearAmount - value;
  $(`.difference`).val(formatNumberInput(difference)); 
  if(difference >= 0) $(`.difference`)[0].style.setProperty('background','#C1E1C1', 'important')
  else $(`.difference`)[0].style.setProperty('background','#FAA0A0', 'important')
  
  $(`input[name="${ids[0]}-${ids[1]}"]`).each((_, el) => { 
    budgetFocusArea += unformatNumber(el.value);
  })

  if(totalProjectBudget[ids[1]]) {
    variation = Number(totalProjectBudget[ids[1]]) - budgetFocusArea;
  } else if(budgetFocusArea) variation -= budgetFocusArea;

  $(`input[name="variation-${ids[0]}"]`).val(formatNumberInput(variation));
  
  if(variation >= 0) {
    document.querySelector(`input[name="variation-${ids[0]}"]`).style.setProperty('background','#C1E1C1', 'important');
    $(`.feedback`).removeClass('d-block').addClass('d-none');
  }
  else {
    document.querySelector(`input[name="variation-${ids[0]}"]`).style.setProperty('background','#FAA0A0', 'important');
    $(`.feedback`).removeClass('d-none').addClass('d-block');
  }
  
  pushDataElement($(`.totalBudget`)[0].id, value);
  pushDataElement($(`input[name="variation-${ids[0]}"]`)[0].id, variation);
  pushDataElement($(`.difference`)[0].id, difference);
  buildPivotSummary();
}

function submitProjects() {
    alert("Data Saved Successfully!")
}