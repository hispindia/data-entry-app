
var filledProjectFocusArea = [];
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
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
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
        document.getElementById("headerOrgId").value = data.organisationUnits[0].parent ? data.organisationUnits[0].parent.name: '';

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
          
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchEvents() {
    tei.projects = [];
    dataElements.period.value = document.getElementById("headerPeriod").value;
    tei.program = program.projectFocusArea;
    tei.programStage = programStage.projectFocusArea;
    tei.year = {
      ...tei.year,
      start:dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program == program.projectBudget || enroll.program==program.projectDescription 
      );

      const dataValuesPD = getEvents(filteredPrograms, program.projectDescription,  dataElements.period.id);
      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[dataElements.period.value]);

      const dataValuesPB = getEvents(filteredPrograms, program.projectBudget,  dataElements.year.id);
      if(dataValuesPB[tei.year.start]) {
        dataElements.projectBudget.forEach((project,index) => {
        if(dataValuesPB[tei.year.start][project.name] && tei.projects[index]) {
          for (let year = tei.year.start; year <= tei.year.end; year++) {
            if(!totalProjectBudget[index]) totalProjectBudget[index] = {};
            if(!totalProjectBudget[index][year]) totalProjectBudget[index][year] = 0;
            if(dataValuesPB[year][project.budget]) totalProjectBudget[index][year] += Number(dataValuesPB[year][project.budget]);
            
            tei.yearlyAmount[`amount-${year}`] = dataValuesPB[year][dataElements.totalBudget] ? dataValuesPB[year][dataElements.totalBudget] : ''
            
          }
        }
      })
    }

      tei.dataValues = getEvents(filteredPrograms, tei.program, dataElements.year.id); //data vlaues period wise

      // if(dataValues) {
      //   let value = ''
      //   for(let year = tei.year.start; year <= tei.year.end; year++) {
      //     var difference = (dataValues[year] && dataValues[year][dataElements.difference]) ? dataValues[year][dataElements.difference]: 0;
      //     if(difference) value = 'The total project budget should be equal to total project budget by focus areas. Please check the data.'  
      //   }
      //   if(value ) alert(value);
      // }

      if(tei.projects.length) {
        for (let year = tei.year.start; year <= tei.year.end; year++) {
          if (!tei.dataValues[year]) {
            tei.dataValues[year] = {};
            const data = [{
              dataElement: dataElements.year.id,
              value: year
            },{
              dataElement: dataElements.period.id,
              value: dataElements.period.value
            }];
            tei.projects.forEach((name,index) => {
              data.push({
              dataElement:dataElements.projectFocusAreaNew[index].name,
              value: name
            })
          })
          tei.event = {
            ...tei.event,
            [year]: await createEvent(data)
          }
          data.forEach(de => tei.dataValues[year][de.dataElement]= de.value)
          } else {
  
            tei.event = {
              ...tei.event,
              [year]: tei.dataValues[year]["event"]
            }

          var calculatedElements = loadCalculatedVariables(tei.dataValues, dataElements, year);
          calculatedElements.forEach(elements =>  {
            tei.dataValues[year][elements.dataElement] = elements.value;
            pushDataElementYear(`${elements.dataElement}-${year}`,elements.value);
          });
          
          }
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
      start:tei.year.start,
      end: tei.year.end
    }

    $("#accordion").empty();
    if (tei.projects.length) {
      let projectRows = displayProjectDetails(
        tei.projects,
        dataValues,
        period
      );
      $("#accordion").append(projectRows);
    } else {
      $("#accordion").append(
        `<h4 class="text-center text-warning my-4">No Existing Projects! Please add some project in the Project Description Section.</h4>`
      );
    }

    var totalsRow = displayTotals(dataValues, period);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    
      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues, period) {
    var totalsRow = "";
    for (let i = period.start; i <= period.end; i++) {
      const totalBudget =
        dataValues[i] && dataValues[i][dataElements.totalBudget]
          ? Number(dataValues[i][dataElements.totalBudget])
          : "";
      const difference =
        dataValues[i] && dataValues[i][dataElements.difference]
          ? Number(dataValues[i][dataElements.difference])
          : "";
      totalsRow += `<tr>
        <td>${i}</td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(totalBudget)}" id="${dataElements.totalBudget}-${i}" class="form-control totalBudget-${i}  currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="FAA0A0; background:${difference >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}"  value="${formatNumberInput(difference)}" id="${dataElements.difference}-${i}" class="form-control difference-${i}  currency" disabled readonly>
          </div>
        </td>
      </tr>
      `;
    }
    return totalsRow;
  }

  function displayProjectDetails(projectDetails, dataValues, period) {
    var projectRows = "";
    var length = projectDetails.length;
    projectDetails.forEach((list, index) => {
      if (!filledProjectFocusArea[index]) filledProjectFocusArea[index] = 0;
      filledProjectFocusArea[index] = dataElements.projectFocusAreaNew[ index].focusAreas.filter(
        (area) =>
          dataValues[period.start] && dataValues[period.start][area]
      );
      filledProjectFocusArea[index] = filledProjectFocusArea[index].length
        ? filledProjectFocusArea[index].length
        : 1;
      projectRows += `
      <!--- sect ${index + 1} --->
      <div class="accordion">
        <div class="accordion-header active" role="button" data-toggle="collapse" data-target="#panel-body-${
          index + 1
        }">
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

      for (let i = 0; i < filledProjectFocusArea[index]; i++) {
        const focusAreaId= dataElements.projectFocusAreaNew[index].focusAreas[i];
        const focusAreaVal = {
          id: focusAreaId,
          area: '',
          pillar: '',
          budget: {}
        }
        for(let year=period.start; year<=period.end;year++) {
          if(dataValues[year][focusAreaId]) {
            const val = JSON.parse(dataValues[year][focusAreaId]);
            focusAreaVal['area'] = val.area;
            focusAreaVal['pillar'] = val.pillar;
            focusAreaVal['budget'][year] = val.budget;
          }
        }
        projectRows += displayProjectFocusArea(focusAreaVal,period,index,i);
      }
      projectRows += `
              <div class="btn-index-${index} btn-wrap mt-3">
                  <div class="btn-wrap-inner">
                      <a  onclick="addPFA(${index})" class="plus">+</a>
                      <a  onclick="removePFA(${index})" class="minus">-</a>                 
                  </div>                
              </div>
              <hr> 
              <div class="form-row">
                <div class="form-group col-md-12 textbox-wrap">
                  <label for="" data-i18n="intro.variation_budget">
                    Variation from total project budget
                  </label>`;
      projectRows += ` <div class="budget-wrap table-responsive">            
                  <table class="table table-striped table-md mb-0 " width="100%">
                    <thead>`;
      for (let i = period.start; i <= period.end; i++)
        projectRows += `<th>${i}</th>`;
      projectRows += `</thead><tbody><tr>`;

      for (let i = period.start; i <= period.end; i++)
        projectRows += `<td>
                          <div class="input-group">
                            <div class="input-group-prepend">
                              <div class="input-group-text">
                                $
                              </div>
                            </div>
                            <input 
                            type="text"  
                            ${tei.disabled ? 'disabled readonly': ''}
                            id="${dataElements.projectFocusAreaNew[index].variation}-${i}" 
                            value="${dataValues[i] && dataValues[i][dataElements.projectFocusAreaNew[index].variation]? formatNumberInput(dataValues[i][dataElements.projectFocusAreaNew[index].variation]): ''}"  
                            class="form-control currency"
                            style="background:${dataValues[i][dataElements.projectFocusAreaNew[index].variation] ? (dataValues[i][dataElements.projectFocusAreaNew[index].variation] >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'): ''}" 
                            disabled
                            readonly
                            >
                          </div>
                          <div class="invalid-feedback feedback-${i} ${dataValues[i] && dataValues[i][dataElements.projectFocusAreaNew[index].variation]<0 ? 'd-block': ''}"> Please provide remarks for the variance
                          </div>
                        </td>`;
      projectRows += `</tr>
                          </tbody>
                          </table>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-12 textbox-wrap"><span data-i18n="intro.comments">
                          Comments</span> (<small class="text-muted ml-1" data-i18n="intro.optional">optional</small>)
                            </label>
                            <textarea 
                            class="form-control-resize textlimit" 
                            ${tei.disabled ? 'disabled readonly': ''}
                            id="${dataElements.projectFocusAreaNew[index].comment }-${period.start}" 
                            onchange="pushDataElementYear(this.id,this.value);checkWords(this, ${index})"
                            >${dataValues[period.start] && dataValues[period.start][dataElements.projectFocusAreaNew[index].comment]
          ? dataValues[period.start][dataElements.projectFocusAreaNew[index].comment]: ""}</textarea>
                                <div class="char-counter form-text text-muted" id="counter${index}">
                                ${maxWords -(dataValues[period.start] && dataValues[period.start][dataElements.projectFocusAreaNew[index].comment]
          ? dataValues[period.start][dataElements.projectFocusAreaNew[index].comment].trim().split(/\s+/).length: 0)
      } words remaining</div>
                            
                            <div class="invalid-feedback"> Error here 
                            </div>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="col-sm-12 text-right">
                            <div class="form-group text-end mar-b-0">
                            <input type="button" value="SAVE AS DRAFT" onclick="submitProjects()" data-i18n="[value]intro.save_as_draft"  class="btn btn-secondary">
                              ${length - 1 == index ? 
                            `<button class="btn btn-primary" onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/2.4-breakdown-by-expense-category.html'">
                              <span data-i18n="intro.next">Next</span>:  
                              <span data-i18n="intro.project_expense">  2.4 Budget by Expense Category</span>
                            </button>` : `<input
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
                      </div>
                    </div>
                    <!--- sect ${index + 1} --->`;
    });

    return projectRows;
  }

  fetchOrganizationUnitUid();
});

function displayProjectFocusArea(values, period, index, i) {
  var projectFARows = "";

  projectFARows += `
      <!--- Project area sec start--->

      <div class="wrap-project-area wrap-project-area-${index}">
          <div class="form-row">
              <div class="form-group col-md-12 textbox-wrap">
                  <label for=""><span data-i18n="intro.project_focus_area">Project Focus Area</span> ${i + 1}
                  </label>
                  <select 
                  class="form-control" 
                  id="${values.id}-area" 
                  ${tei.disabled ? 'disabled readonly': ''}
                  onchange="changeStrategicPillar(this.id,'${values.id}-pillar', this.value);"
                  >
                      <option class="choose" value="" data-i18n="intro.choose">Choose </option>`
                      focusAreaOptions.forEach( fa => {
                        projectFARows += `<option ${(values.area==fa.code) ? "selected": ''} value="${fa.code}" data-i18n="intro.focus_area_${fa.index}">${fa.name}</option>`
                      })
                  projectFARows += `</select>
                  
                  <div class="invalid-feedback"> Error here 
                  </div>
              </div>
          </div>

          <div class="form-row">
              <div class="form-group col-md-12 textbox-wrap">
                  <label for="" data-i18n="intro.strategic_pillar">Associated Strategic Pillar
                  </label>
                  <select
                  class="form-control" 
                  id="${values.id}-pillar" 
                  ${tei.disabled ? 'disabled readonly': ''}
                  >`
                  strategicPillarOptions.forEach(sp => {
                    if(values.pillar==sp.code) projectFARows += `<option ${(values.pillar==sp.code) ? "selected": ''} value="${sp.code}" data-i18n="intro.strategic_pillar_${sp.index}">${sp.name}</option>`
                  })
                  projectFARows +=  `</select>
                  <div class="invalid-feedback"> Error here 
                  </div>
              </div>
          </div>

          <div class="form-row">
            <div class="form-group col-md-12 mb-1">
              <label for="" data-i18n="intro.budget_focus_area">Budget by "Project Focus Area"</label>
            </div>
          </div>


           <div class="budget-wrap table-responsive">            
           <table class="table table-striped table-md mb-0 " width="100%">
                      <thead>`;
            for (let year = period.start; year <= period.end; year++) {
              projectFARows += `<th>${year}</th>`;
            }
            projectFARows += `</thead><tbody><tr>`;

            for (let year = period.start; year <= period.end; year++) {
              const budget =values['budget'][year] ? values['budget'][year]  : ''
              projectFARows += `<td>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <div class="input-group-text">
                                  $
                                </div>
                              </div>
                              <input type="text" ${tei.disabled ? 'disabled readonly': ''} value="${formatNumberInput(budget)}" id="${values.id}-budget-${year}" oninput="formatNumberInput(this);pushDataElementFA(this.id);calculateTotals(${year},'totalBudget', ${index})" class="form-control input-totalBudget-${year} currency">
                            </div>
                          </td>`;
            }
            projectFARows += `</tr>
                            </tbody>
                            </table>
                          </div>
                        </div>
                <!--- Project area sec ends--->`;

  return projectFARows;
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
    value: tei.yearlyAmount[`amount-${year}`]? `${(tei.yearlyAmount[`amount-${year}`] - totalBudget.value)}`: '0'
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

function calculateTotals(year, id, idx) {
  const element = document.querySelectorAll(`.input-${id}-${year}`);
  var value = 0;
  var variation = '';
  var budgetFocusArea = 0;
  element.forEach((el) => {
    value += unformatNumber(el.value);
  });
  $(`.${id}-${year}`).val(formatNumberInput(value));
  const difference = tei.yearlyAmount[`amount-${year}`] - value;

  $(`.difference-${year}`).val(formatNumberInput(difference)); 
  if(difference >= 0) $(`.difference-${year}`)[0].style.setProperty('background','#C1E1C1', 'important')
  else $(`.difference-${year}`)[0].style.setProperty('background','#FAA0A0', 'important')
  
  dataElements.projectFocusAreaNew[idx].focusAreas.forEach(focusArea => {
    if( $(`#${focusArea}-budget-${year}`).val()) budgetFocusArea += unformatNumber($(`#${focusArea}-budget-${year}`).val());
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

  pushDataElementYear(`${dataElements.projectFocusAreaNew[idx].variation}-${year}`,variation,0);
  
  pushDataElementYear($(`.${id}-${year}`)[0].id, value,0);
  pushDataElementYear($(`.difference-${year}`)[0].id, difference,0);
}

function submitProjects() {
  alert("Data Saved Successfully!")
}
