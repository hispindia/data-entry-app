const maxWords = 200;
var projectDescriptionCount = 0;
var projectFAIndex = 0;
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
          window.localStorage.setItem("annualYearAR", ev.target.value);
        });

        document
        .getElementById("reporting-periodicity")
        .addEventListener("change", function (ev) {
          window.localStorage.setItem("annualReporting", ev.target.value);
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

                const userDisabled = data.userGroups.find(group => disabledUserGroups.includes(group.id));
                const trtUserDisabled = data.userGroups.find(group => disabledTRTUserGroups.includes(group.id));
                if(userDisabled || trtUserDisabled) {
                    tei.disabled = true;
                } 
                let disabledValues = '';
                if(!userDisabled) {
                    disabledValues += 'aoc'
                }
                if(!trtUserDisabled) {
                    disabledValues += 'trt'
                }
                window.localStorage.setItem('hideReporting', disabledValues);
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
                fetchEvents();
            }
        } catch (error) {
            console.error("Error fetching organization unit:", error);
        }
    }

    async function fetchEvents() {
        tei.projects = [];
        dataElements.period.value = document.getElementById("headerPeriod").value;
        tei.year = {
          ...tei.year,
          start:dataElements.period.value.split(' - ')[0],
          end: dataElements.period.value.split(' - ')[1]
        }

        var yearOptions = "";
        for (let year = tei.year.start; year <= tei.year.end; year++) {
            if(tei.hideReportingYears.includes(year)) continue;
            yearOptions += `<option value="${year}">${year}</option>`;
        }
        document.getElementById("year-update").innerHTML = yearOptions;
        document.getElementById('year-update').options[0].selected = true;
        var annualYear = window.localStorage.getItem("annualYearAR");
        if(annualYear) document.getElementById('year-update').value = annualYear;
        
        const updateYear = document.getElementById("year-update").value;
        dataElements.periodicity.value = document.getElementById("reporting-periodicity").value;

        var annualReporting = window.localStorage.getItem("annualReporting");
        if(annualReporting) document.getElementById('reporting-periodicity').value = annualReporting;

        const data = await events.get(tei.orgUnit);

        if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
            tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

            const filteredPrograms =
                data.trackedEntityInstances[0].enrollments.filter(
                    (enroll) =>
                        enroll.program == program.auProjectDescription ||  enroll.program == program.arTotalIncome
                );

            const dataValuesAI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: dataElements.year.id, value: updateYear }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value }); //data vlaues period wise
            if(dataValuesAI && dataValuesAI[dataElements.submitAnnualUpdate])  tei.disabled = true;


            const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, dataElements.year.id); //data vlaues period wise
            tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[updateYear]);
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
        const period = {
            start: tei.year.start,
            end: tei.year.end,
        };
        const projectDescription = createProjectDescription(period);
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
                <div class="char-counter form-text text-muted" id="counter1">250 words remaining</div>
                <div class="invalid-feedback"> Error here </div>
            </div>`;
    }

    function createProjectFocusArea() {
        var projectRows = "";
        projectRows += displayProjectFocusArea(projectFAIndex);
        projectRows += `
    <div class="btn-pfa btn-wrap mt-3">
        <div class="btn-wrap-inner">
            <a  onclick="addPFA()" class="plus">+</a>
            <a  onclick="removePFA()" class="minus">-</a>                 
        </div>                
    </div>`;
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
                    type="number"
                    value=""
                    class="form-control currency"
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
                    type="number"
                    value=""
                    class="form-control currency"
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
                type="number"
                value=""
                class="form-control currency"
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
            type="number"
            value=""
            class="form-control currency"
        />
        </div>
    </td>
        </tr>
        </tbody>
      </table>`;
        return projectRows;
    }
    fetchOrganizationUnitUid();
});

function displayProjectFocusArea(index) {
    var projectFARows = "";

    projectFARows += `
    <!--- Project area sec start--->

    <div class="wrap-project-area">
        <div class="form-row">
            <div class="form-group col-md-12 textbox-wrap">
                <label for=""><span data-i18n="intro.project_focus_area">Project Focus Area</span> ${index + 1}
                </label>

                <select 
                ${tei.disabled ? 'disabled readonly': ''} 
                class="form-control" 
                id="projectArea-${index}" 
              onchange="changeStrategicPillar('projectPillar-${index}', this.value);"
                >
                    <option class="choose" value="" data-i18n="intro.choose">Choose </option>`;
    focusAreaOptions.forEach((fa) => {
        projectFARows += `<option value="${fa.code}" data-i18n="intro.focus_area_${fa.index}">${fa.name}</option>`;
    });
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
                ${tei.disabled ? 'disabled readonly': ''} 
                class="form-control" 
                id="projectPillar-${index}"
                >
                </select>
                <div class="invalid-feedback"> Error here 
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group col-md-12 mb-1">
            <label for="" data-i18n="intro.budget_focus_area">Budget by "Project Focus Area"</label>
            </div>
            <div class="input-group">
            <div class="input-group-prepend">
                <div class="input-group-text">$</div>
            </div>
            <input type="number" value="" id="assignedBudget-${index}" class="form-control currency">
            </div>
            </div>
        </div>
    <!--- Project area sec ends--->`;
    projectFAIndex++;
    return projectFARows;
}

function changeStrategicPillar(strategicPillarId, code) {
    const focusArea = focusAreaOptions.find((area) => area.code == code);
    if (focusArea) {
        let pillar = focusArea.pillars[0];
        let option = `<option selected value="${pillar.code}" data-i18n="intro.strategic_pillarr_${pillar.index}">${pillar.name}</option>`;
        document.getElementById(strategicPillarId).innerHTML = option;
    } else {
        let option = `<option selected value="" data-i18n="intro.choose">Choose</option>`;
        document.getElementById(strategicPillarId).innerHTML = option;
    }
}

function addPFA() {
    const newProjectRow = displayProjectFocusArea(
        projectFAIndex
    );

    $(newProjectRow).insertBefore(`.btn-pfa`);
    
      // Localize content
      $('body').localize();
}
function removePFA() {
    if (projectFAIndex > 1) {
        projectFAIndex--;
        $(`.wrap-project-area`).last().remove();
    }
}
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
    const data = await events.get(tei.orgUnit);
    const updateYear = document.getElementById("year-update").value;
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
            dataElements.year.id
        );
        var hasYear = false;
        const years = [];
        for (let year = tei.year.start; year <= tei.year.end; year++) {
            if(year==updateYear) hasYear = true;
            if(hasYear) years.push(year)
        }

        projectDescriptionCount = countProjects(
            dataElements.projectDescription,
            dataValuesPD[updateYear]
        );

        const dataValuesPB = getEvents(
            filteredPrograms,
            program.auProjectBudget,
            dataElements.year.id
        );
        const dataValuesFA = getEvents(
            filteredPrograms,
            program.auProjectFocusArea,
            dataElements.year.id
        );
        const dataValuesEC = getEvents(
            filteredPrograms,
            program.auProjectExpenseCategory,
            dataElements.year.id
        );
        const dataValuesSemiAnnualEC = getEventsPeriodicity(
            filteredPrograms,
            program.arProjectExpenseCategory,
            { id: dataElements.year.id, value: updateYear },
            { id: dataElements.periodicity.id, value: 'Semi-Annual Reporting' }
        );
        const dataValuesAnnualEC = getEventsPeriodicity(
            filteredPrograms,
            program.arProjectExpenseCategory,
            { id: dataElements.year.id, value: updateYear },
            { id: dataElements.periodicity.id, value: 'Annual Reporting' }
        );
        const dataValuesSemiAnnualFA = getEventsPeriodicity(
            filteredPrograms,
            program.arProjectFocusArea,
            { id: dataElements.year.id, value: updateYear },
            { id: dataElements.periodicity.id, value: 'Semi-Annual Reporting' }
        );
        const dataValuesAnnualFA = getEventsPeriodicity(
            filteredPrograms,
            program.arProjectFocusArea,
            { id: dataElements.year.id, value: updateYear },
            { id: dataElements.periodicity.id, value: 'Annual Reporting' }
        );

        for (let year = tei.year.start; year <= tei.year.end; year++) {
            if(dataValuesPD[year]) {
                eventIds['projectDescription'][year] = dataValuesPD[year]['event'];
            }
            if (dataValuesPB[year]) {
                eventIds['projectBudget'][year] = dataValuesPB[year]['event'];
            }
            if (dataValuesFA[year]) {
                eventIds["projectFA"][year] = dataValuesFA[year]["event"];
            }
            if (dataValuesEC[year]) {
                eventIds["projectEC"][year] = dataValuesEC[year]["event"];
            }
        }

        eventIds["projectSAFA"] = dataValuesSemiAnnualFA.event;
        eventIds["projectAFA"] = dataValuesAnnualFA.event;
        eventIds["projectSAEC"] = dataValuesSemiAnnualEC.event;
        eventIds["projectAEC"] = dataValuesAnnualEC.event;

        var updatedDataValues = [];

        // project Description
        const dataValuesAUPD = []
        years.forEach(year => {
            dataValuesAUPD.push(
                {
                    dataElement: `${dataElements.projectDescription[projectDescriptionCount].name}-${year}`,
                    value: document.getElementById('projectName').value
                },
                {
                    dataElement: `${dataElements.projectDescription[projectDescriptionCount].description}-${year}`,
                    value: document.getElementById('projectDescription').value
                },
                {
                    dataElement: `${dataElements.projectDescription[projectDescriptionCount].comment}-${year}`,
                    value: updateYear + ',' + reportingPeriodicity
                });
        })

        try {
            tei.program = program.auProjectDescription;
            tei.programStage = programStage.auProjectDescription;
            tei.event = eventIds["projectDescription"];
            for (element of dataValuesAUPD) {
                await pushDataElementYear(element.dataElement, element.value);
            }
        } catch (error) {
            console.error("Error in Project Description!:", error);
        }

        //project Budget 

        const dataValuesAUPB = [];
        for (let year = tei.year.start; year <= tei.year.end; year++) {
            dataValuesAUPB.push({
                dataElement: `${dataElements.projectBudget[projectDescriptionCount].name}-${year}`,
                value: document.getElementById('projectName').value
            });
        }

        try {
            tei.program = program.auProjectBudget;
            tei.programStage = programStage.auProjectBudget;
            tei.event = eventIds["projectBudget"];
            for (element of dataValuesAUPB) {
                await pushDataElementYear(element.dataElement, element.value);
            }
        } catch (error) {
            console.error("Error in Project Focus Area!:", error);
        }


        //project Expense Category

        const dataValuesAUEC = [];
        for (let year = tei.year.start; year <= tei.year.end; year++) {
            dataValuesAUEC.push({
                dataElement: `${dataElements.projectExpenseCategory[projectDescriptionCount].name}-${year}`,
                value: document.getElementById('projectName').value
            })
        }

        try {
            tei.program = program.auProjectExpenseCategory;
            tei.programStage = programStage.auProjectExpenseCategory;
            tei.event = eventIds["projectEC"];
            for (element of dataValuesAUEC) {
                await pushDataElementYear(element.dataElement, element.value);
            }
        } catch (error) {
            console.error("Error in Project Focus Area!:", error);
        }

        // project Focus Area
        const dataValuesPFA = [];
        for (let year = tei.year.start; year <= tei.year.end; year++) {
            dataValuesPFA.push({
                dataElement: `${dataElements.projectFocusAreaNew[projectDescriptionCount].name}-${year}`,
                value: document.getElementById('projectName').value
            })
            dataElements.projectFocusAreaNew[projectDescriptionCount].focusAreas.forEach((fa, index) => {
                if (document.getElementById(`projectArea-${index}`)) {
                    dataValuesPFA.push({
                        dataElement: `${fa}-${year}`,
                        value: JSON.stringify({ area: document.getElementById(`projectArea-${index}`).value, pillar: document.getElementById(`projectPillar-${index}`).value, budget: '' })
                    })
                }
            })
        }

        try {
            tei.program = program.auProjectExpenseCategory;
            tei.programStage = programStage.auProjectExpenseCategory;
            tei.event = eventIds["projectFA"];
            for (element of dataValuesPFA) {
                await pushDataElementYear(element.dataElement, element.value);
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
                    value: JSON.stringify({ area: document.getElementById(`projectArea-${index}`).value, pillar: document.getElementById(`projectPillar-${index}`).value, assignedBudget: document.getElementById(`assignedBudget-${index}`).value }), expense: '', variation: ''
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
                        dataElement: dataElements.period.id,
                        value: budgetCycle
                    }, {
                        dataElement: dataElements.year.id,
                        value: updateYear
                    }, {
                        dataElement: dataElements.periodicity.id,
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
                    dataElement: dataElements.period.id,
                    value: budgetCycle
                }, {
                    dataElement: dataElements.year.id,
                    value: updateYear
                }, {
                    dataElement: dataElements.periodicity.id,
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
                value: document.getElementById(`budget-${id}`).value
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
                        dataElement: dataElements.period.id,
                        value: budgetCycle
                    }, {
                        dataElement: dataElements.year.id,
                        value: updateYear
                    }, {
                        dataElement: dataElements.periodicity.id,
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
                    dataElement: dataElements.period.id,
                    value: budgetCycle
                }, {
                    dataElement: dataElements.year.id,
                    value: updateYear
                }, {
                    dataElement: dataElements.periodicity.id,
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
