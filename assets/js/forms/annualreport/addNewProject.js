import { createEventOther, getEvents, getProgramStagePeriodicity, getTEI, pushDataElement } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { getYears } from '../func.js';

const maxWords = 200;
var projectDescriptionCount = 0;
const eventIds = {
    projectDescription: {},
    projectBudget: {},
    projectFA: {},
    projectEC: {},
    projectSAFA: '',
    projectAFA: '',
    projectSAEC: '',
    projectAEC: '',
};

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
  
  var focusAreas = [{
    area: '1. Care: Static Clinic',
    pillar: "1. Center Care on People",
  }, {
    area: '2. Care: Outreach, mobile clinic, Community-based, delivery',
    pillar: '1. Center Care on People'
  }, {
    area: '3. Care: Other Services, enabled or referred (associated clinics)',
    pillar: '1. Center Care on People'
  }, {
    area: '4. Care: Social Marketing Services',
    pillar: '1. Center Care on People'
  }, {
    area: '5. Care: Digital Health Intervention and Selfcare',
    pillar: '1. Center Care on People'
  }, {
    area: '6. Advocacy',
    pillar: '2. Move the Sexuality Agenda'
  }, {
    area: '7. CSE',
    pillar: '2. Move the Sexuality Agenda'
  }, {
    area: '8. CSE Online, including social media',
    pillar: '2. Move the Sexuality Agenda'
  }, {
    area: '9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting',
    pillar: '3. Solidarity for Change'
  }, {
    area: '10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles',
    pillar: '3. Solidarity for Change'
  }, {
    area: '11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures',
    pillar: '4. Nurture Our Federation'
  }];
  

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
          window.localStorage.setItem("annualYearAR", ev.target.value);
        });

        document
        .getElementById("reporting-periodicity")
        .addEventListener("change", function (ev) {
          window.localStorage.setItem("annualReporting", ev.target.value);
        });


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
    ['aoc-reporting', 'trt-review'].forEach(page => {
      if(user.hideReporting.includes(page.split('-')[0])) $(`.${page}`).hide();
    })
    if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
      $('.aoc-users').show();
    }
    if(window.localStorage.getItem("hideReporting").includes('core')) {
      $('.core-users').show();
    }
    
    if(user.annualReporting) document.getElementById('reporting-periodicity').value = user.annualReporting;

    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${tei.year.selectReporting==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYearAR) document.getElementById('year-update').value = user.annualYearAR;

    fetchEvents();    
  }
    async function fetchEvents() {
        tei.projects = [];
        tei.year.value = document.getElementById("year-update").value;
        tei.periodicity.value = document.getElementById("reporting-periodicity").value;
        const data = await getTEI(tei.orgUnit);

        if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
            tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

            const filteredPrograms =  data.trackedEntityInstances[0].enrollments.filter(
                    (enroll) => enroll.program == program.auProjectDescription ||  enroll.program == program.arTotalIncome
                );

            const dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: tei.year.id, value: tei.year.value }, { id: tei.periodicity.id, value: tei.periodicity.value }); //data vlaues period wise
            if(dataValuesAI && dataValuesAI[dataElements.submitAnnualUpdate])  tei.disabled = true;


            const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  { id: tei.year.id, value: tei.year.value }); //data values period wise
            tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[tei.year.value]);
            if (tei.projects.length) {
                let projectRows = '';
                tei.projects.forEach((project, index) => {
                    projectRows += `<p class="h6 font-weight-bold">${index + 1}. ${project.name}</p>`
                })
                $('#project-list').empty();
                $('#project-list').append(projectRows);
            }
        }
        populateProgramStages();
    }

    // Function to populate program events data
    function populateProgramStages() {
        const projectDescription = createProjectDescription();
        $("#project-description").append(projectDescription);

        const projectFocusArea = createProjectFocusArea();
        $("#project-focus-area").append(projectFocusArea);

        const projectExpenseCategory = createProjectExpenseCategory();
        $("#project-expense-category").append(projectExpenseCategory);
        
      // Localize content
      $('body').localize();
    }

    function createProjectDescription() {
        return `
            <div class="form-group col-md-12 textbox-wrap">
                <label for="projectName" data-i18n="intro.project_name">Project Name</label>
                <input type="text" class="form-control" id="projectName"  ${tei.disabled ? 'disabled readonly': ''} >
                <div class="invalid-feedback"> Error here </div>
            </div>
            <div class="form-group col-md-12 textbox-wrap">
                <label for="projectDescription" data-i18n="intro.description_project">Description of Project </label>
                <textarea class="form-control-resize textlimit" id="projectDescription" ${tei.disabled ? 'disabled readonly': ''} 
                onchange="checkWords(this,1,250)"></textarea>
                <div class="char-counter form-text text-muted"><span id="counter1">250</span> <span data-i18n="intro.words_remaining">Words Remaining</span></div>
                <div class="invalid-feedback"> Error here </div>
            </div>`;
    }

    function createProjectFocusArea() {
        var projectRows = `<table class="table table-striped table-md mb-0" width="100%">
        <thead>
        <tr>
          <th data-i18n="intro.focus_area">Focus Area</th>
          <th data-i18n="intro.budget">Budget</th>
        </tr>
        </thead>
        <tbody>`;
        focusAreas.forEach((_,index) => {
            var focusAreaVal = {
                area: focusAreas[index].area,
                pillar: focusAreas[index].pillar,
                budget: '',
            };
            projectRows += `<tr>
            <td><span id="projectArea-${index}" data-i18n="intro.${focusAreaTranslation[focusAreaVal.area]}">${focusAreaVal.area}</span></td>
            <td>
                <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                    $
                    </div>
                </div>
                <input 
                type="text"  
                id ="assignedBudget-${index}"
                class="form-control input-budget currency"
                oninput="formatNumberInput(this)"
                ${tei.disabled ? 'disabled readonly': ''} 
                value="">
                </div>
            </td>
          </tr>`;
          })
        return projectRows;
    }

    function createProjectExpenseCategory() {
        var projectRows = `<table
        class="table table-striped table-md mb-0"
        width="100%"
      >
        <thead id="project-head">
          <tr>
            <th data-i18n="intro.personnel">Personnel</th>
            <th data-i18n="intro.activities">Direct project activities</th>
            <th data-i18n="intro.commodities">Commodities</th>
            <th data-i18n="intro.indirect">Indirect/support costs</th>
            </tr>
        </thead>
        <tbody>
          <tr>
          <td>
                <div class="input-group">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                    $
                    </div>
                </div>
                <input 
                ${tei.disabled ? 'disabled readonly': ''} 
                    id="budget-personnel"
                    type="text"
                    value=""
                    class="form-control currency"
                    oninput="formatNumberInput(this)"
                />
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
                ${tei.disabled ? 'disabled readonly': ''} 
                    id="budget-activities"
                    type="text"
                    value=""
                    class="form-control currency"
                    oninput="formatNumberInput(this)"
                />
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
            ${tei.disabled ? 'disabled readonly': ''} 
                id="budget-commodities"
                type="text"
                value=""
                class="form-control currency"
                oninput="formatNumberInput(this)"
            />
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
        ${tei.disabled ? 'disabled readonly': ''} 
            id="budget-cost"
            type="text"
            value=""
            class="form-control currency"
            oninput="formatNumberInput(this)"
        />
        </div>
    </td>
        </tr>
        </tbody>
      </table>`;
        return projectRows;
    }
    configurePage();
});

function countProjects(projects, dataValues) {
    var prevEmptyNames = [];
    var names = [];
    if (dataValues) {
        projects.forEach((project) => {
            if (dataValues[project.name]) {
                names = [...names, ...prevEmptyNames, project.name];
                prevEmptyNames = [];
            } else {
                prevEmptyNames.push("");
            }
        });
    }
    return names.length;
}

async function pushProject() {
    document.getElementById("submit-button").disabled = true;
    document.getElementById("submit-button").value = 'Pushing...';
    const data = await getTEI(tei.orgUnit);
    tei.year.value = document.getElementById("year-update").value;
    const reportingPeriodicity = document.getElementById("reporting-periodicity").value;

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
        tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

        const filteredPrograms =
            data.trackedEntityInstances[0].enrollments.filter(
                (enroll) =>
                    enroll.program == program.auProjectDescription ||
                    enroll.program == program.auProjectBudget ||
                    enroll.program == program.auProjectExpenseCategory ||
                    enroll.program == program.auProjectFocusArea ||
                    enroll.program == program.arProjectFocusArea ||
                    enroll.program == program.arProjectExpenseCategory
            );

        const dataValuesPD = getEvents(
            filteredPrograms,
            program.auProjectDescription,
            {id: tei.year.id, value: tei.year.value}
        );
        projectDescriptionCount = countProjects(
            dataElements.projectDescription,
            dataValuesPD[tei.year.value]
        );

        const dataValuesPB = getEvents(
            filteredPrograms,
            program.auProjectBudget,
            {id: tei.year.id, value: tei.year.value}
        );
        const dataValuesFA = getEvents(
            filteredPrograms,
            program.auProjectFocusArea,
            {id: tei.year.id, value: tei.year.value}
        );
        const dataValuesEC = getEvents(
            filteredPrograms,
            program.auProjectExpenseCategory,
            {id: tei.year.id, value: tei.year.value}
        );
        const dataValuesSemiAnnualEC = getEventsPeriodicity(
            filteredPrograms,
            program.arProjectExpenseCategory,
            { id: tei.year.id, value: tei.year.value },
            { id: tei.periodicity.id, value: 'Semi-Annual Reporting' }
        );
        const dataValuesAnnualEC = getEventsPeriodicity(
            filteredPrograms,
            program.arProjectExpenseCategory,
            { id: tei.year.id, value: tei.year.value },
            { id: tei.periodicity.id, value: 'Annual Reporting' }
        );
        const dataValuesSemiAnnualFA = getEventsPeriodicity(
            filteredPrograms,
            program.arProjectFocusArea,
            { id: tei.year.id, value: tei.year.value },
            { id: tei.periodicity.id, value: 'Semi-Annual Reporting' }
        );
        const dataValuesAnnualFA = getEventsPeriodicity(
            filteredPrograms,
            program.arProjectFocusArea,
            { id: tei.year.id, value: tei.year.value },
            { id: tei.periodicity.id, value: 'Annual Reporting' }
        );

        eventIds['projectDescription'][tei.year.value] = dataValuesPD[tei.year.value]['event'];
        eventIds['projectBudget'][tei.year.value] = dataValuesPB[tei.year.value]['event'];
        eventIds["projectFA"][tei.year.value] = dataValuesFA[tei.year.value]["event"];
        eventIds["projectEC"][tei.year.value] = dataValuesEC[tei.year.value]["event"];

        eventIds["projectSAFA"] = dataValuesSemiAnnualFA.event;
        eventIds["projectAFA"] = dataValuesAnnualFA.event;
        eventIds["projectSAEC"] = dataValuesSemiAnnualEC.event;
        eventIds["projectAEC"] = dataValuesAnnualEC.event;

        var updatedDataValues = [];
        const projectDescription = {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].name}`,
            value: document.getElementById('projectName').value
        }
        try {
            tei.program = program.auProjectDescription;
            tei.programStage = programStage.auProjectDescription;
            tei.event = eventIds["projectDescription"];
            await pushDataElement(projectDescription.dataElement, projectDescription.value);
            
        } catch (error) {
            console.error("Error in Project Description!:", error);
        }

        //project Budget 

        const dataValuesAUPB = {
            dataElement: `${dataElements.projectBudget[projectDescriptionCount].name}`,
            value: document.getElementById('projectName').value
        }
        try {
            tei.program = program.auProjectBudget;
            tei.programStage = programStage.auProjectBudget;
            tei.event = eventIds["projectBudget"];
            await pushDataElement(dataValuesAUPB.dataElement, dataValuesAUPB.value);
        } catch (error) {
            console.error("Error in Project Focus Area!:", error);
        }


        //project Expense Category
        const dataValuesAUEC = {
            dataElement: `${dataElements.projectExpenseCategory[projectDescriptionCount].name}`,
            value: document.getElementById('projectName').value
        };
        try {
            tei.program = program.auProjectExpenseCategory;
            tei.programStage = programStage.auProjectExpenseCategory;
            tei.event = eventIds["projectEC"];
            await pushDataElement(dataValuesAUEC.dataElement, dataValuesAUEC.value);
        } catch (error) {
            console.error("Error in Project Focus Area!:", error);
        }

        // project Focus Area
        const dataValuesPFA = [];
        dataValuesPFA.push({
            dataElement: `${dataElements.projectFocusAreaNew[projectDescriptionCount].name}`,
            value: document.getElementById('projectName').value
        })
            dataElements.projectFocusAreaNew[projectDescriptionCount].focusAreas.forEach((fa, index) => {
                if (document.getElementById(`projectArea-${index}`)) {
                    dataValuesPFA.push({
                        dataElement: `${fa}`,
                        value: JSON.stringify({  area: focusAreas[index]['area'], pillar: focusAreas[index]['pillar'], budget: ''})
                    })
                }
            })

        try {
            tei.program = program.auProjectExpenseCategory;
            tei.programStage = programStage.auProjectExpenseCategory;
            tei.event = eventIds["projectFA"];
            for (element of dataValuesPFA) {
                await pushDataElement(element.dataElement, element.value);
            }
        } catch (error) {
            console.error("Error in Project Focus Area!:", error);
        }

        //Project AR Focus Area SemiAnnual and Annual
        const dataValuesARPFA = [{
            dataElement: dataElements.projectFocusAreaNew[projectDescriptionCount].name,
            value: document.getElementById('projectName').value
        }];
        dataElements.projectFocusAreaNew[projectDescriptionCount].focusAreas.forEach((fa, index) => {
            if (document.getElementById(`projectArea-${index}`)) {
                dataValuesARPFA.push({
                    dataElement: fa,
                    value: JSON.stringify({ area: focusAreas[index]['area'], pillar: focusAreas[index]['pillar'], assignedBudget: unformatNumber(document.getElementById(`assignedBudget-${index}`).value) }), expense: '', variation: ''
                })
            }
        })

        try {

            tei.program = program.arProjectFocusArea;
            tei.programStage = programStage.arProjectFocusArea;

            if (reportingPeriodicity != "Annual Reporting") {
                tei.event = eventIds["projectSAFA"];
                if (eventIds['projectSAFA']) {
                    for (element of dataValuesARPFA) {
                        await pushDataElement(element.dataElement, element.value);
                    }
                } else {
                    updatedDataValues = [{
                        dataElement: tei.year.id,
                        value: tei.year.value
                    }, {
                        dataElement: tei.periodicity.id,
                        value: 'Semi-Annual Reporting'
                    }]
                    updatedDataValues = [
                        ...updatedDataValues,
                        ...dataValuesARPFA
                    ]
                    await createEventOther({
                        orgUnit: tei.orgUnit,
                        program: program.arProjectFocusArea,
                        programStage: programStage.arProjectFocusArea,
                        teiId: tei.id,
                        dataElements: updatedDataValues
                    })
                }
            }

            tei.event = eventIds["projectAFA"];
            if (eventIds['projectAFA']) {
                for (element of dataValuesARPFA) {
                    await pushDataElement(element.dataElement, element.value);
                }
            } else {
                updatedDataValues = [{
                    dataElement: tei.year.id,
                    value: tei.year.value
                }, {
                    dataElement: tei.periodicity.id,
                    value: 'Annual Reporting'
                }]
                updatedDataValues = [
                    ...updatedDataValues,
                    ...dataValuesARPFA
                ]
                await createEventOther({
                    orgUnit: tei.orgUnit,
                    program: program.arProjectFocusArea,
                    programStage: programStage.arProjectFocusArea,
                    teiId: tei.id,
                    dataElements: updatedDataValues
                })
            }

        } catch (error) {
            console.error("Error in Project AR Focus Area !:", error);
        }

        const dataValuesAREC = [{
            dataElement: dataElements.arProjectExpenseCategory[projectDescriptionCount].name,
            value: document.getElementById('projectName').value
        }
        ];
        for (let id in dataElements.arProjectExpenseCategory[projectDescriptionCount].budgetExpense) {
            dataValuesAREC.push({
                dataElement: dataElements.arProjectExpenseCategory[projectDescriptionCount].budgetExpense[id],
                value: unformatNumber(document.getElementById(`budget-${id}`).value)
            })
        }


        try {
            tei.program = program.arProjectExpenseCategory;
            tei.programStage = programStage.arProjectExpenseCategory;
            if (reportingPeriodicity != "Annual Reporting") {

                tei.event = eventIds["projectSAEC"];
                if (eventIds['projectSAEC']) {
                    for (element of dataValuesAREC) {
                        await pushDataElement(element.dataElement, element.value);
                    }
                } else {
                    updatedDataValues = [{
                        dataElement: tei.year.id,
                        value: tei.year.value
                    }, {
                        dataElement: tei.periodicity.id,
                        value: 'Semi-Annual Reporting'
                    }]
                    updatedDataValues = [
                        ...updatedDataValues,
                        ...dataValuesAREC
                    ]
                    await createEventOther({
                        orgUnit: tei.orgUnit,
                        program: program.arProjectExpenseCategory,
                        programStage: programStage.arProjectExpenseCategory,
                        teiId: tei.id,
                        dataElements: updatedDataValues
                    })

                }
            }

            tei.event = eventIds["projectAEC"];
            if (eventIds['projectAEC']) {
                for (element of dataValuesAREC) {
                    await pushDataElement(element.dataElement, element.value);
                }
            } else {
                updatedDataValues = [{
                    dataElement: tei.year.id,
                    value: tei.year.value
                }, {
                    dataElement: tei.periodicity.id,
                    value: 'Annual Reporting'
                }]
                updatedDataValues = [
                    ...updatedDataValues,
                    ...dataValuesAREC
                ]
                await createEventOther({
                    orgUnit: tei.orgUnit,
                    program: program.arProjectExpenseCategory,
                    programStage: programStage.arProjectExpenseCategory,
                    teiId: tei.id,
                    dataElements: updatedDataValues
                })

            }
        } catch (error) {
            console.error("Error in Project AR Focus Area !:", error);
        }
        document.getElementById("submit-button").value = 'Done';
        alert('Project Pushed Successfully!')
        window.location.reload();
    }

}
//textarea word limit
function checkWords(event, count, maxWords) {
    const counter = document.getElementById("counter" + count);
    const { value } = event;
    const words = value.trim().split(/\s+/);

    if (words.length >= maxWords) {
        event.value = words.slice(0, maxWords).join(" ");
        return;
    }
    if (value) counter.textContent = `${maxWords - words.length} words remaining`;
    else counter.textContent = `${maxWords} words remaining`;
}


function checkProjects(projects, values) {
    var prevEmptyNames = [];
    var names = [];
    if (values) {
        projects.forEach((project) => {
            if (values[project.name]) {
                names = [...names, ...prevEmptyNames, { name: values[project.name], comment: values[project.comment] }];
                prevEmptyNames = [];
            } else {
                prevEmptyNames.push("");
            }
        });
    }
    return names;
}



    //textarea word limit
    document.addEventListener('DOMContentLoaded', function () {
      const textareas = document.querySelectorAll('.textlimit');
      textareas.forEach((textarea, index) => {
        const counter = document.getElementById(`counter${index + 1}`);
        const updateCounter = () => {

          const words = textarea.value.trim().split(/\s+/)

          if (words.length >= maxWords[`counter${index + 1}`]) {
            textarea.value = words.slice(0, maxWords[`#counter${index + 1}`]).join(' ');
            return
          }

          if (textarea.value) {
            counter.textContent = `${(maxWords[`counter${index + 1}`] - words.length)} words remaining`;
          } else counter.textContent = `${maxWords[`counter${index + 1}`]} words remaining`;
        };
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // initialize counter on page load
      });
    });