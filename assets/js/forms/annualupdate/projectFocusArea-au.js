import { getEvents, getTEI, pushDataElementYear } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears } from "../func.js";

var totalProjectBudget = [];
const maxWords = 200;
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

  document
  .getElementById("year-update")
  .addEventListener("change", function (ev) {
    window.localStorage.setItem("annualYear", ev.target.value);
    populateProgramEvents(tei.dataValues);
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

    tei.program = program.auProjectFocusArea;
    tei.programStage = programStage.auProjectFocusArea;

    fetchEvents();    
  }


  async function fetchEvents() {
    tei.projects = [];
    tei.year.value = document.getElementById("year-update").value;

    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program == program.auProjectBudget || enroll.program==program.auProjectDescription 
        );
  
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  tei.year.id);
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[tei.year.value]);

      const dataValuesPB = getEvents(filteredPrograms, program.auProjectBudget,  tei.year.id);
      if(dataValuesPB[tei.year.value]) {
      tei.yearAmount = dataValuesPB[tei.year.value][dataElements.totalBudget] ? dataValuesPB[tei.year.value][dataElements.totalBudget] : ''
      dataElements.projectBudget.forEach((project,index) => {
        if(dataValuesPB[tei.year.value][project.name] && tei.projects[index]) {
          if(!totalProjectBudget[index]) totalProjectBudget[index] = {};
          if(!totalProjectBudget[index][tei.year.value]) totalProjectBudget[index][tei.year.value] = 0;
          if(dataValuesPB[tei.year.value][project.budget]) totalProjectBudget[index][tei.year.value] += Number(dataValuesPB[tei.year.value][project.budget]);        
        }
      })
    }

      tei.dataValues = getEvents(filteredPrograms, tei.program, tei.year.id); //data vlaues period wise

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
          tei.event = {
            ...tei.event,
            [tei.year.value]: await createEvent(data)
          }
          data.forEach(de => tei.dataValues[tei.year.value][de.dataElement]= de.value)
          } else {
  
            tei.event = {
              ...tei.event,
              [tei.year.value]: tei.dataValues[tei.year.value]["event"]
            }

          var calculatedElements = loadCalculatedVariables(tei.dataValues, dataElements, tei.year.value);
          calculatedElements.forEach(elements =>  {
            tei.dataValues[tei.year.value][elements.dataElement] = elements.value;
            pushDataElementYear(`${elements.dataElement}-${tei.year.value}`, elements.value);
          });
          }
      }
      populateProgramEvents(tei.dataValues[tei.year.value]);
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
      $("#accordion").append(projectRows);
    } else {
      $("#accordion").append(
        `<h4 class="text-center text-warning my-4">No Existing Projects! Please add some project in the Project Description Section.</h4>`
      );
    }

    var totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    
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
            <input type="text" value="${formatNumberInput(totalBudget)}" id="${dataElements.totalBudget}-${tei.year.value}" class="form-control totalBudget-${tei.year.value}  currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="FAA0A0; background:${difference >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}"  value="${formatNumberInput(difference)}" id="${dataElements.difference}-${tei.year.value}" class="form-control difference-${tei.year.value}  currency" disabled readonly>
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
      dataElements.projectFocusAreaNew[index].focusAreas.forEach((faId,indexFA) => {
        var faValue = {};
        if(dataValues[faId]) faValue = JSON.parse(dataValues[faId]);

          projectRows += `<tr><td>${focusAreaOptions[indexFA].name}</td>
                          <td><input 
                          type="text" 
                          ${tei.disabled ? 'disabled readonly': ''}
                          id="${faId}" 
                          class="form-control input-totalBudget currency"
                          value="${formatNumberInput(faValue.budget)}" 
                          oninput="formatNumberInput(this);pushDataElementFA(this.id);calculateTotals('totalBudget', ${index})" 
                          />
                          </td> </tr>`

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
                          id="${dataElements.projectFocusAreaNew[index].variation}-${tei.year.value}"  
                          value="${dataValues[dataElements.projectFocusAreaNew[index].variation] ? formatNumberInput(dataValues[dataElements.projectFocusAreaNew[index].variation]): ''}"  
                          class="form-control currency"
                          style="background:${dataValues[dataElements.projectFocusAreaNew[index].variation] ? (dataValues[dataElements.projectFocusAreaNew[index].variation] >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'): ''}" 
                          disabled
                          readonly
                          >
                        </div>
                        <div class="invalid-feedback feedback-${tei.year.value} ${dataValues[dataElements.projectFocusAreaNew[index].variation]<0 ? 'd-block': ''}"> Please provide remarks for the variance </div>
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
                          onchange="pushDataElementYear(this.id,this.value);checkWords(this, ${index})"
                            >${dataValues[dataElements.projectFocusAreaNew[index].comment]
                              ? dataValues[dataElements.projectFocusAreaNew[index].comment]: ""}</textarea>
                              <div class="char-counter form-text text-muted" id="counter${index}">
                              ${maxWords -(dataValues[dataElements.projectFocusAreaNew[index].comment]
                              ? dataValues[dataElements.projectFocusAreaNew[index].comment].trim().split(/\s+/).length: 0)
                              } words remaining</div>
                          <div class="invalid-feedback"> Error here </div> 
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="col-sm-12 text-right">
                          <div class="form-group text-end mar-b-0">
                          <input type="button" value="SAVE AS DRAFT" onclick="submitProjects()" data-i18n="[value]intro.save_as_draft"  class="btn btn-secondary">
                            ${ length - 1 == index ? 
                              `<button class="btn btn-primary"  ${tei.disabled ? 'disabled readonly': ''} onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/2.4-breakdown-by-expense-category-au.html'">
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

  configurePage();
  
});

  function addPFA(index) {

    const values = {
        id: dataElements.projectFocusAreaNew[index].focusAreas[filledProjectFocusArea[index]],
        area: '',
        pillar: '',
        budget: {}
    }
    
    const newProjectRow = displayProjectFocusArea(values, index, filledProjectFocusArea[index])

    $(newProjectRow).insertBefore(`.btn-index-${index}`);
    filledProjectFocusArea[index]++;
    
      // Localize content
      $('body').localize();
  }
  function removePFA(index) {
    if (filledProjectFocusArea[index] > 1) {
      filledProjectFocusArea[index]--;
      const id = dataElements.projectFocusAreaNew[index].focusAreas[filledProjectFocusArea[index]];
      $(`.wrap-project-area-${index}`).last().remove();
      for(let year=tei.year.start; year<=tei.year.end; year++) {
        calculateTotals(year, 'totalBudget', index);
      }
      pushDataElementFA(id);
    }
  }
  
function submitProjectFocusArea() {
  var value = '';
  const date = new Date();

    var difference = document.getElementById(`${dataElements.difference}-${date.getFullYear()}`);
    if(difference) value = `The total project budget should be equal to total project budget by focus areas (Year: ${date.getFullYear()}). Please check the data.`
  
  if(value) alert(value);
  alert('Event Pushed Successfully!')
}

function changeStrategicPillar(focusAreaId, strategicPillarId, code) {
  const focusArea = focusAreaOptions.find(area => area.code == code);
  if(focusArea) {
    let pillar = focusArea.pillars[0];
    let option = `<option selected value="${pillar.code}" data-i18n="intro.strategic_pillar_${pillar.index}">${pillar.name}</option>`;
    document.getElementById(strategicPillarId).innerHTML = option;
    pushDataElementFA(focusAreaId);
  } else {
    let option = `<option selected value="" data-i18n="intro.choose">Choose</option>`;
    document.getElementById(strategicPillarId).innerHTML = option;

    pushDataElementFA(focusAreaId);

  }

}

function loadCalculatedVariables(dataValues, dataElements, year) {
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
      if(dataValues[year][id]) {
        const val = JSON.parse(dataValues[year][id]);
        if(val.budget) budget += Number(val.budget);
      }
    })
    if(totalProjectBudget[index] && !isNaN(totalProjectBudget[index][year])) {
      let value = ''
      if(budget || totalProjectBudget[index][year]) value = totalProjectBudget[index][year] - budget;
      variations.push({dataElement:dataElements.projectFocusAreaNew[index].variation , value})
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

function pushDataElementFA(id) {
  const ids = id.split('-');
  if(ids.length>2) {
    const values= {
      area: document.getElementById(`${ids[0]}-area`).value,
      pillar:document.getElementById(`${ids[0]}-pillar`).value,
      budget:unformatNumber(document.getElementById(`${ids[0]}-budget-${ids[2]}`).value),
    }
    if(values.area) pushDataElementYear(`${ids[0]}-${ids[2]}`, JSON.stringify(values))
    else pushDataElementYear(`${ids[0]}-${ids[2]}`, '')
  
  } else {
    for(let year=tei.year.start; year<=tei.year.end; year++) {
      const values= {
        area: document.getElementById(`${ids[0]}-area`) ? document.getElementById(`${ids[0]}-area`).value: '',
        pillar:document.getElementById(`${ids[0]}-pillar`) ? document.getElementById(`${ids[0]}-pillar`).value:'',
        budget:document.getElementById(`${ids[0]}-budget-${year}`) ? unformatNumber(document.getElementById(`${ids[0]}-budget-${year}`).value):''
      }
      if(values.area) pushDataElementYear(`${ids[0]}-${year}`, JSON.stringify(values))
      else  pushDataElementYear(`${ids[0]}-${year}`, '')
    }
  }
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

function calculateTotals(year, id, idx) {
  const element = document.querySelectorAll(`.input-${id}-${year}`);
  var value = 0;
  var variation = 0;
  var budgetFocusArea = 0;
  element.forEach((el) => {
    value += unformatNumber(el.value);
  });
  $(`.${id}-${year}`).val(formatNumberInput(value));
  const difference = tei.yearAmount - value;

  $(`.difference-${year}`).val(formatNumberInput(difference)); 
  if(difference >= 0) $(`.difference-${year}`)[0].style.setProperty('background','#C1E1C1', 'important')
  else $(`.difference-${year}`)[0].style.setProperty('background','#FAA0A0', 'important')
  
  dataElements.projectFocusAreaNew[idx].focusAreas.forEach(focusArea => {
    if( $(`#${focusArea}-budget-${year}`).val()) budgetFocusArea+= unformatNumber($(`#${focusArea}-budget-${year}`).val());
  })

  if(totalProjectBudget[idx] && !isNaN(totalProjectBudget[idx][year])) {
    variation = Number(totalProjectBudget[idx][year]) - budgetFocusArea;
  } else if(budgetFocusArea) variation -= budgetFocusArea;

  $(`#${dataElements.projectFocusAreaNew[idx].variation}-${year}`).val(formatNumberInput(variation));
  if(variation >= 0) {
    $(`#${dataElements.projectFocusAreaNew[idx].variation}-${year}`)[0].style.setProperty('background','#C1E1C1', 'important');
    $(`.feedback-${year}`).removeClass('d-block').addClass('d-none');
  }
  else {
    $(`#${dataElements.projectFocusAreaNew[idx].variation}-${year}`)[0].style.setProperty('background','#FAA0A0', 'important');
    $(`.feedback-${year}`).removeClass('d-none').addClass('d-block');
  }

  pushDataElementYear(`${dataElements.projectFocusAreaNew[idx].variation}-${year}`, variation,0);
  pushDataElementYear($(`.${id}-${year}`)[0].id, value,0);
  pushDataElementYear($(`.difference-${year}`)[0].id, difference,0);
}

function submitProjects() {
    alert("Data Saved Successfully!")
}