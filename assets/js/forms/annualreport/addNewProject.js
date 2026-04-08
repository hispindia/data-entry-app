import { createEventOther, getEvents, getEventsPeriodicity, getProgramStagePeriodicity, getTEI, pushDataElement } from '../../api/func.js';
import { tei, dataElements, program, programStage } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { formatNumberInput, getYears, unformatNumber } from '../func.js';

const maxWords = 200;
var projectDescriptionCount = 0;
const eventIds = {
    projectDescription: '',
    projectBudget: '',
    projectFA: '',
    projectEC: '',
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

        document
        .getElementById("submit-button")
        .addEventListener("click", function () {
            pushProject();
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
    document.getElementById('year-update').innerHTML = years.filter(year => !tei.hideReportingYears.includes(year)).map(year => `<option value="${year}" ${tei.year.selectReporting==year? 'selected': ''}>${year}</option>`).join('');
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
        $("#project-description").html(projectDescription);

        document.getElementById("project-description").addEventListener('input', (ev) => {
            if(ev.target.matches('.input-budget')) {
              var { id, value, dataset } = ev.target;
              ev.target.value = formatNumberInput(value);
            }  else if(ev.target.matches('.textlimit')) {
              var { id, value } = ev.target;
              checkWords(ev.target, 1, 250)
            }
        });
        const projectFocusArea = createProjectFocusArea();
        $("#project-focus-area").append(projectFocusArea);

        document.getElementById("project-focus-area").addEventListener('input', (ev) => {
            if(ev.target.matches('.input-budget')) {
              var { id, value, dataset } = ev.target;
              ev.target.value = formatNumberInput(value);
            }
        });

        const projectExpenseCategory = createProjectExpenseCategory();
        $("#project-expense-category").append(projectExpenseCategory);
        
        document.getElementById("project-expense-category").addEventListener('input', (ev) => {
            if(ev.target.matches('.input-budget')) {
              var { id, value, dataset } = ev.target;
              ev.target.value = formatNumberInput(value);
            }
        });
        $('.loader-container').addClass('d-none').removeClass('d-flex');
        $('.myContainer').show();
      // Localize content
      $('body').localize();
    }

    function createProjectDescription() {
        return `
            <div class="form-group col-md-12 textbox-wrap">
                <label for="projectName" data-i18n="intro.project_name">Project Name</label>
                <input type="text" class="form-control textContent" id="projectName"  ${tei.disabled ? 'disabled readonly': ''} >
                <div class="invalid-feedback" id="projectName-error"> Error here </div>
            </div>
    <table class="table w-100">
      <tbody>
        <tr>
          <td>
            <label for="startDate"><span data-i18n="intro.start_date">Start Date:</span> </label>
            <input type="date" id="startDate"  
              ${tei.disabled ? 'disabled readonly': ''} 
              class="w-100 form-control textContent"
            />
            <div class="invalid-feedback" id="startDate-error"> Error here </div>
          </td>
          <td>
            <label for="projectTheme"><span data-i18n="intro.project_theme">Project Theme:</span> </label>
              <select class="form-control textContent" ${tei.disabled ? 'disabled readonly': ''}  id="projectTheme" name="projectThemeOther" >
                <option value="" data-i18n="intro.choose">Choose</option>
                <option value="Abortion Care" data-i18n="intro.p_1">Abortion Care</option>
                <option value="General Contraception" data-i18n="intro.p_2">General Contraception</option>
                <option value="Digital Health Interventions & Selfcare" data-i18n="intro.p_18">Digital Health Interventions & Selfcare</option>
                <option value="Fertility Care /Support" data-i18n="intro.p_10">Fertility Care /Support</option>
                <option value="HIV & AIDS" data-i18n="intro.p_6">HIV & AIDS</option>
                <option value="Humanitarian SRHR" data-i18n="intro.p_4">Humanitarian SRHR</option>
                <option value="SGBV / Gender" data-i18n="intro.p_8">SGBV / Gender</option>
                <option value="Advocacy & Norms Change" data-i18n="intro.p_17">Advocacy & Norms Change</option>
                <option value="Communications & Campaigns" data-i18n="intro.p_9">Communications & Campaign</option>
                <option value="Youth" data-i18n="intro.p_5">Youth</option>
                <option value="Research / evidence" data-i18n="intro.p_11">Research / evidence</option>
                <option value="Organisational Processes and Systems" data-i18n="intro.p_12">Organisational Processes and Systems</option>
                <option value="Commecial Sustainability" data-i18n="intro.p_13">Commercial Sustainability</option>
                <option value="Social Enterprise & Marketing" data-i18n="intro.p_14">Social Enterprise & Marketing</option>
                <option value="Marginalised Pops (incl. LGBTQ+)" data-i18n="intro.p_7">Marginalised Pops (incl. LGBTQ+)</option>
                <option value="Not applicable" data-i18n="intro.p_16">Not applicable</option>
                <option value="Other (please fill in)" data-i18n="intro.p_15">Other (please fill in)</option>
              </select>
            <div>
              <input type="text" 
                class="w-100 form-control my-1 projectTheme-other textContent"
                id="projectThemeOther"
                placeholder="Other (Please specify)"
              />
            </div>
            <div class="invalid-feedback" id="projectTheme-error"> Error here </div>
          </td>
          <td>
          <label for="projectFunding"><span data-i18n="intro.funding_type">Funding Type:</span> </label>
              <select class="form-control textContent" ${tei.disabled ? 'disabled readonly': ''} id="projectFunding">
                <option value="" data-i18n="intro.choose">Choose</option>
                <option value="Restricted" data-i18n="intro.restricted">Restricted</option>
                <option value="Unrestricted" data-i18n="intro.unrestricted">Unrestricted</option>
              </select>
            <div class="invalid-feedback" id="projectFunding-error"> Error here </div>
          </td>
          <td>
            <label for="projectContract"><span data-i18n="intro.total_contract_value">Total Contract Value:</span> </label>
            <input type="text" id="projectContract"  
              ${tei.disabled ? 'disabled readonly': ''} 
              class="w-100 form-control input-budget "
            />
            <div class="invalid-feedback" id="projectContract-error"> Error here </div>
          </td>
        </tr>
        <tr>
          <td>
            <label for="endDate"><span data-i18n="intro.end_date">End Date:</span> </label>
            <input type="date" id="endDate"  max="${tei.year.end+3}-12-31"
              ${tei.disabled ? 'disabled readonly': ''}
              class="w-100 form-control textContent" 
            >
            <div class="invalid-feedback" id="endDate-error"> Error here </div>
          </td> 
          <td>
            <label for="projectDonor"><span data-i18n="intro.project_donor">Project Donor:</span> </label>
              <select class="form-control textContent" ${tei.disabled ? 'disabled readonly': ''}  id="projectDonor" name="projectDonorOther" >
                <option value="" data-i18n="intro.choose">Choose</option>
                <option value="Government of Australia / DFAT" data-i18n="intro.g_aus">Government of Australia / DFAT</option>
                <option value="Government of Canada / GAC" data-i18n="intro.g_can">Government of Canada / GAC</option>
                <option value="Government of China" data-i18n="intro.g_ch">Government of China</option>
                <option value="Government of Denmark / DANIDA" data-i18n="intro.g_den">Government of Denmark / DANIDA</option>
                <option value="Government of Finland / FINNIDA" data-i18n="intro.g_fin">Government of Finland / FINNIDA</option>
                <option value="Government of France / Agence Française de Développement" data-i18n="intro.g_fran">Government of France / Agence Française de Développement</option>
                <option value="Government of Germany / GIZ" data-i18n="intro.g_ger">Government of Germany / GIZ</option>
                <option value="Government of Japan / Ministry of Foreign Affairs Japan" data-i18n="intro.g_jap">Government of Japan / Ministry of Foreign Affairs Japan</option>
                <option value="Government of New Zealand / MFAT" data-i18n="intro.g_new">Government of New Zealand / MFAT</option>
                <option value="Government of Norway / NORAD" data-i18n="intro.g_nor">Government of Norway / NORAD</option>
                <option value="Government of Spain / AECID" data-i18n="intro.g_spain">Government of Spain / AECID</option>
                <option value="Government of United Kingdom / FCDO" data-i18n="intro.g_uk">Government of United Kingdom / FCDO</option>
                <option value="European Commission (EU/EC)" data-i18n="intro.g_eu_comm">European Commission (EU/EC)</option>
                <option value="Global Fund for AIDS,  Tuberculosis, and Malaria (GFATM)" data-i18n="intro.gl_fund_aids">Global Fund for AIDS,  Tuberculosis, and Malaria (GFATM)</option>
                <option value="Reproductive Health Supplies Coalition (RHSC)" data-i18n="intro.rep_health">Reproductive Health Supplies Coalition (RHSC)</option>
                <option value="UNAIDS" data-i18n="intro.unaids">UNAIDA</option>
                <option value="UNDP" data-i18n="intro.undp">>UNDP</option>
                <option value="UNESCO" data-i18n="intro.unesco">UNESCO</span></option>
                <option value="UNFPA" data-i18n="intro.unfpa">UNFPA</option>
                <option value="UNICEF" data-i18n="intro.unicef">UNICEF</option>
                <option value="World Health Organisation (WHO)" data-i18n="intro.who">World Health Organisation (WHO)</option>
                <option value="Amplify Change" data-i18n="intro.amp_ch">Amplify Change</option>
                <option value="Bill & Melinda Gates Foundation" data-i18n="intro.bill_melinda">Bill & Melinda Gates Foundation</option>
                <option value="Open Society Foundations (OSF)" data-i18n="intro.osf">Open Society Foundations (OSF)</option>
                <option value="The William and Flora Hewlett Foundation" data-i18n="intro.th_william_fl_found">The William and Flora Hewlett Foundation</option>
                <option value="Danish FPA / Sex og Samfund (Denmark)" data-i18n="intro.danish_fpa">Danish FPA / Sex og Samfund (Denmark)</option>
                <option value="International Planned Parenthood Federation (IPPF)" data-i18n="intro.int_plan_parenth_fed">International Planned Parenthood Federation (IPPF)</option>
                <option value="Planned Parenthood Federation of America (USA)" data-i18n="intro.planned_parenthood_fed_usa">Planned Parenthood Federation of America (USA)</option>
                <option value="RFSU (Sweden)" data-i18n="intro.rfsu_sweden">RFSU (Sweden)</option>
                <option value="Rutgers (Netherlands)" data-i18n="intro.rutgers">Rutgers (Netherlands)</option>
                <option value="Center for Disease Control (CDC)" data-i18n="intro.center_dis_cont">Center for Disease Control (CDC))</option>
                <option value="USAID" data-i18n="intro.usaid">USAID</option>
                <option value="Not applicable" data-i18n="intro.not_app">Not applicable</option> 
                <option value="Other (please write below)" data-i18n="intro.other_please">Other (please write below)</option>
              </select>
            <div>
              <input type="text"  
                class="w-100 form-control projectDonor-other  my-1 textContent"
                ${tei.disabled ? 'disabled readonly': ''} 
                id="projectDonorOther"
                placeholder="Other (Please specify)"
              />
            </div>
            <div class="invalid-feedback" id="projectDonor-error"> Error here </div>
          </td>
          <td>
            <label for="projectIncome"><span data-i18n="intro.annual_proj_income">Annual Project Income:</span> </label>
            <input type="text" id="projectIncome" 
              ${tei.disabled ? 'disabled readonly': ''}  
              class="w-100 form-control input-budget"
            />
            <div class="invalid-feedback" id="projectIncome-error"> Error here </div>
          </td>
        </tr>
      </tbody>
    </table>
            <div class="form-group col-md-12 textbox-wrap">
                <label for="projectDescription" data-i18n="intro.description_project">Description of Project </label>
                <textarea class="form-control-resize textlimit" id="projectDescription" ${tei.disabled ? 'disabled readonly': ''}></textarea>
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
                    class="form-control input-budget currency"
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
                    class="form-control input-budget currency"
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
                class="form-control input-budget currency"
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
            class="form-control input-budget currency"
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
    const fields = [
        'projectName',
        'startDate',
        'endDate',
        'projectTheme',
        'projectDonor',
        'projectFunding',
        'projectIncome',
        'projectContract'
    ];

    const unfilledDetails = fields
        .filter(id => !document.getElementById(id)?.value).join(', ')

    fields.forEach(detail => {
        if(unfilledDetails.includes(detail)) document.getElementById(`${detail}-error`).style.display = 'block';
        else document.getElementById(`${detail}-error`).style.display = 'none';
    });
    if (unfilledDetails) {
        alert(`Please fill mandatory fields: ${unfilledDetails}`);
        return;
    } 

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

        eventIds['projectDescription'] = dataValuesPD[tei.year.value]['event'];
        eventIds['projectBudget'] = dataValuesPB[tei.year.value]['event'];
        eventIds["projectFA"] = dataValuesFA[tei.year.value]["event"];
        eventIds["projectEC"] = dataValuesEC[tei.year.value]["event"];

        eventIds["projectSAFA"] = dataValuesSemiAnnualFA.event;
        eventIds["projectAFA"] = dataValuesAnnualFA.event;
        eventIds["projectSAEC"] = dataValuesSemiAnnualEC.event;
        eventIds["projectAEC"] = dataValuesAnnualEC.event;

        var updatedDataValues = [];
        const projectDescription = [{
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].name}`,
            value: document.getElementById('projectName').value
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].description}`,
            value: document.getElementById('projectDescription').value
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].startDate}`,
            value: document.getElementById('startDate').value
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].endDate}`,
            value: document.getElementById('endDate').value
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].theme}`,
            value: document.getElementById('projectTheme').value
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].donor}`,
            value: document.getElementById('projectDonor').value
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].funding}`,
            value: document.getElementById('projectFunding').value
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].income}`,
            value: unformatNumber(document.getElementById('projectIncome').value)
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].contract}`,
            value: unformatNumber(document.getElementById('projectContract').value)
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].themeOther}`,
            value: document.getElementById('projectThemeOther').value
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].donorOther}`,
            value: document.getElementById('projectDonorOther').value
        }, {
            dataElement: `${dataElements.projectDescription[projectDescriptionCount].comment}`,
            value: tei.year.value + ',' + reportingPeriodicity
        }]
        try {
            tei.program = program.auProjectDescription;
            tei.programStage = programStage.auProjectDescription;
            tei.event = eventIds["projectDescription"];
            for(let element of projectDescription) {
                if(element.value) await pushDataElement(element.dataElement, element.value);
            }
            
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
            for (let element of dataValuesPFA) {
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
                    value: JSON.stringify({ area: focusAreas[index]['area'], pillar: focusAreas[index]['pillar'], assignedBudget: unformatNumber(document.getElementById(`assignedBudget-${index}`).value), expense: '', variation: ''})
                })
            }
        })

        try {

            tei.program = program.arProjectFocusArea;
            tei.programStage = programStage.arProjectFocusArea;

            if (reportingPeriodicity != "Annual Reporting") {
                tei.event = eventIds["projectSAFA"];
                if (eventIds['projectSAFA']) {
                    for (let element of dataValuesARPFA) {
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
                for (let element of dataValuesARPFA) {
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
                    for (let element of dataValuesAREC) {
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
                for (let element of dataValuesAREC) {
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
    if (value) counter.textContent = `${maxWords - words.length}`;
    else counter.textContent = `${maxWords}`;
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
