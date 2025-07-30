import { createEvent, getEvents, getTEI } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { getYears } from "../func.js";

var projectCount = 0;
const maxWords = 250;

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
      // populateProgramEvents(tei.dataValues);
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
      if (user.hideReporting.includes(page.split('-')[0])) $(`.${page}`).hide();
    })
    if (!user.hideReporting.includes('aoc')) {
      $('.aoc-users').show();
    }
    if (user.hideReporting.includes('core')) {
      $('.core-users').show();
    }

    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML = years.map(year => tei.hideYears.includes(year) ? `<option value="${year}">${year}</option>` : '').join('');
    if (user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.auProjectDescription;
    tei.programStage = programStage.auProjectDescription;

    fetchEvents();
  }

  async function fetchEvents() {
    tei.year.value = document.getElementById("year-update").value;

    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program
        );

      tei.dataValues = getEvents(filteredPrograms, tei.program, tei.year.id); //data vlaues period wise

      if (tei.dataValues[tei.year.value] && tei.dataValues[tei.year.value][dataElements.submitAnnualUpdate]) tei.disabled = true;

      if (!tei.dataValues[tei.year.value]) {
        tei.event = await createEvent([{
          dataElement: tei.year.id,
          value: tei.year.value
        }]);
      } else tei.event = tei.dataValues[tei.year.value]["event"];

      populateProgramEvents(tei.dataValues[tei.year.value]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    projectCount = 0;
    $(".btn-wrap").prevAll().remove();

    var projectRows = "";
    const projectNames = checkProjects(dataElements.projectDescription, dataValues);
    if (!projectNames.length) {
      projectRows += addRow(1, dataElements.projectDescription[0], "", "", "", "");
      $("#total-projects").val(projectCount);
      projectCount++;
    } else {
      projectNames.forEach((_, index) => {
        const project = dataElements.projectDescription[index];
        const projectName = dataValues[project.name]
          ? dataValues[project.name]
          : "";
        const projectDescription = dataValues[project.description]
          ? dataValues[project.description]
          : "";
        const startDate = dataValues[project.startDate] ? dataValues[project.startDate] : ""; // Fetching Start Date
        const endDate = dataValues[project.endDate] ? dataValues[project.endDate] : ""; // Fetching End Date
        projectRows += addRow(
          index + 1,
          project,
          projectName,
          projectDescription,
          startDate,
          endDate
        );
        projectCount++;
      })
      $("#total-projects").val(projectCount);
    }
    $(projectRows).insertBefore(".btn-wrap");

    // Localize content
    $('body').localize();
  }
  function addRow(count, project, projectName, projectDescription, startDate, endDate) {

    return `
  <div class="form-row project-list data-row" id="project-list-${count}">

    <div class="form-group col-md-12 textbox-wrap my-2">
        <label for="${project.name}"><span data-i18n="intro.project_name">Project Name</span> ${count} </label>
        <input type="text" ${tei.disabled ? 'disabled readonly': ''} class="form-control" id="${
          project.name
        }" value="${projectName}" oninput='pushDataElement(this.id, this.value)'>
        <div class="invalid-feedback"> Error here </div>
    </div>
    <table class="table w-100">
      <tbody>
        <tr>
          <td>
            <label for="${project.startDate}"><span data-i18n="intro.start_date">Start Date:</span> </label>
            <input type="date" id="${project.startDate}"  
              class="w-100 form-control"
              value="${startDate}" 
              onchange='pushDataElement(this.id, this.value)'
            />
            <div class="invalid-feedback"> Error here </div>
          </td>
          <td>
            <label for="${project.donor}"><span data-i18n="intro.project_donor">Project Donor:</span> </label>
              <select class="form-control" ${tei.disabled ? 'disabled readonly': ''}  id="${project.donor}" onchange="pushDataElementYear(this.id,this.value)">
                <option ${(""=="Government of Australia / DFAT") ? "selected": ''} value="Government of Australia / DFAT"><span data-i18n="intro.g_aus">Government of Australia / DFAT</span></option>
                <option ${(""=="Government of Canada / GAC") ? "selected": ''} value="Government of Canada / GAC"><span data-i18n="intro.g_can">Government of Canada / GAC</span></option>
                <option ${(""=="Government of China") ? "selected": ''} value="Government of China"><span data-i18n="intro.g_ch">Government of China</span></option>
                <option ${(""=="Government of Denmark / DANIDA") ? "selected": ''} value="Government of Denmark / DANIDA"><span data-i18n="intro.g_den">Government of Denmark / DANIDA</span></option>
                <option ${(""=="Government of Finland / FINNIDA") ? "selected": ''} value="Government of Finland / FINNIDA"><span data-i18n="intro.g_fin">Government of Finland / FINNIDA</span></option>
                <option ${(""=="Government of France / Agence Française de Développement") ? "selected": ''} value="Government of France / Agence Française de Développement"><span data-i18n="intro.g_fran
                ">Government of France / Agence Française de Développement</span></option>
                <option ${(""=="Government of Germany / GIZ") ? "selected": ''} value="Government of Germany / GIZ"><span data-i18n="intro.g_ger">Government of Germany / GIZ</span></option>
                <option ${(""=="Government of Japan / Ministry of Foreign Affairs Japan") ? "selected": ''} value="Government of Japan / Ministry of Foreign Affairs Japan"><span data-i18n="intro.g_jap">Government of Japan / Ministry of Foreign Affairs Japan</span></option>
                <option ${(""=="Government of New Zealand / MFAT ") ? "selected": ''} value="Government of New Zealand / MFAT "><span data-i18n="intro.g_new">Government of New Zealand / MFAT</span></option>
                <option ${(""=="Government of Norway / NORAD") ? "selected": ''} value="Government of Norway / NORAD"><span data-i18n="intro.g_nor">Government of Norway / NORAD</span></option>
                <option ${(""=="Government of Spain / AECID") ? "selected": ''} value="Government of Spain / AECID"><span data-i18n="intro.g_spain">Government of Spain / AECID</span></option>
                <option ${(""=="Government of United Kingdom / FCDO") ? "selected": ''} value="Government of United Kingdom / FCDO"><span data-i18n="intro.g_uk">Government of United Kingdom / FCDO</span></option>
                <option ${(""=="European Commission (EU/EC)") ? "selected": ''} value="European Commission (EU/EC)"><span data-i18n="intro.g_eu_comm">European Commission (EU/EC)</span></option>
                <option ${(""=="Global Fund for AIDS,  Tuberculosis, and Malaria (GFATM)") ? "selected": ''} value="Global Fund for AIDS,  Tuberculosis, and Malaria (GFATM)"><span data-i18n="intro.gl_fund_aids">Global Fund for AIDS,  Tuberculosis, and Malaria (GFATM)</span></option>
                <option ${(""=="Reproductive Health Supplies Coalition (RHSC)") ? "selected": ''} value="Reproductive Health Supplies Coalition (RHSC)"><span data-i18n="intro.rep_health">Reproductive Health Supplies Coalition (RHSC)</span></option>
                <option ${(""=="UNAIDS") ? "selected": ''} value="UNAIDS"><span data-i18n="intro.unaids">UNAIDA</span></option>
                <option ${(""=="UNDP") ? "selected": ''} value="UNDP"><span data-i18n="intro.undp">UNDP</span></option>
                <option ${(""=="UNESCO") ? "selected": ''} value="UNESCO"><span data-i18n="intro.unesCo">UNESCO</span></option>
                <option ${(""=="UNFPA") ? "selected": ''} value="UNFPA"><span data-i18n="intro.unfpa">UNFPA</span></option>
                <option ${(""=="UNICEF") ? "selected": ''} value="UNICEF"><span data-i18n="intro.unicef">UNICEF</span></option>
                <option ${(""=="World Health Organisation (WHO)") ? "selected": ''} value="World Health Organisation (WHO)"><span data-i18n="intro.who">World Health Organisation (WHO)</span></option>
                <option ${(""=="Amplify Change") ? "selected": ''} value="Amplify Change"><span data-i18n="intro.amp_ch">Amplify Change</span></option>
                <option ${(""=="Bill & Melinda Gates Foundation") ? "selected": ''} value="Bill & Melinda Gates Foundation"><span data-i18n="intro.bill_melinda">Bill & Melinda Gates Foundation</span></option>
                <option ${(""=="Open Society Foundations (OSF)") ? "selected": ''} value="Open Society Foundations (OSF)"><span data-i18n="intro.osf">Open Society Foundations (OSF)</span></option>
                <option ${(""=="The William and Flora Hewlett Foundation") ? "selected": ''} value="The William and Flora Hewlett Foundation"><span data-i18n="intro.th_william_fl_found">The William and Flora Hewlett Foundation</span></option>
                <option ${(""=="Danish FPA / Sex og Samfund (Denmark)") ? "selected": ''} value="Danish FPA / Sex og Samfund (Denmark)"><span data-i18n="intro.danish_fpa">Danish FPA / Sex og Samfund (Denmark)</span></option>
                <option ${(""=="International Planned Parenthood Federation (IPPF)") ? "selected": ''} value="International Planned Parenthood Federation (IPPF)"><span data-i18n="intro.int_plan_parenth_fed">International Planned Parenthood Federation (IPPF)</span></option>
                <option ${(""=="Planned Parenthood Federation of America (USA)") ? "selected": ''} value="Planned Parenthood Federation of America (USA)"><span data-i18n="intro.planned_parenthood_fed_usa">Planned Parenthood Federation of America (USA)</span></option>
                <option ${(""=="RFSU (Sweden)") ? "selected": ''} value="RFSU (Sweden)"><span data-i18n="intro.rfsu_sweden">RFSU (Sweden)</span></option>
                <option ${(""=="Rutgers (Netherlands)") ? "selected": ''} value="Rutgers (Netherlands)"><span data-i18n="intro.rutgers">Rutgers (Netherlands)</span></option>
                <option ${(""=="Center for Disease Control (CDC)") ? "selected": ''} value="Center for Disease Control (CDC)"><span data-i18n="intro.center_dis_cont">Center for Disease Control (CDC)</span>)</option>
                <option ${(""=="USAID") ? "selected": ''} value="USAID"><span data-i18n="intro.usaid">USAID</span></option>
                <option ${(""=="Other (please write below)") ? "selected": ''} value="Other (please write below)"><span data-i18n="intro.other)">Other (please write below)</span></option>
                <option ${(""=="Not applicable") ? "selected": ''} value="Not applicable"><span data-i18n="intro.not_app">Not applicable</span></option>
              </select>
            <div>
              <input type="text" id="other-value"  
                class="w-100 form-control my-1"
                value="" 
                placeholder="Other (Please specify)"
                onchange='pushDataElement(this.id, this.value)'
              />
            </div>
            <div class="invalid-feedback"> Error here </div>
          </td>
          <td>
            <label for="${project.income}"><span data-i18n="intro.annual_proj_income">Annual Project Income:</span> </label>
            <input type="text" id="${project.income}"  
              class="w-100 form-control"
              value="" 
              onchange='pushDataElement(this.id, this.value)'
            />
            <div class="invalid-feedback"> Error here </div>
          </td>
        </tr>
        <tr>
          <td>
            <label for="${project.endDate}"><span data-i18n="intro.">End Date:</span> </label>
            <input type="date" id="${project.endDate}"  
              class="w-100 form-control" 
              value="" 
              onchange='pushDataElement(this.id, this.value)'>
            <div class="invalid-feedback"> Error here </div>
          </td> 
          <td>
          <label for="${project.funding}"><span data-i18n="intro.funding_type">Funding Type:</span> </label>
              <select class="form-control" ${tei.disabled ? 'disabled readonly': ''}  id="${project.funding}" onchange="pushDataElementYear(this.id,this.value)">
                <option ${(""=="Restricted") ? "selected": ''} value="Restricted">Restricted</option>
                <option ${(""=="UnRestricted") ? "selected": ''} value="Unrestricted">Unrestricted</option>
              </select>
            <div class="invalid-feedback"> Error here </div>
          </td>
          <td>
            <label for="${project.theme}"><span data-i18n="intro.project_theme">Project Theme:</span> </label>
              <select class="form-control" ${tei.disabled ? 'disabled readonly': ''}  id="${project.theme}" onchange="changeOther(e);">
                <option ${(""=="Abortion Care") ? "selected": ''} value="Abortion Care"><span data-i18n="intro.p_1">Abortion Care</span></option>
                <option ${(""=="General Contraception") ? "selected": ''} value="General Contraception"><span data-i18n="intro.p_2">General Contraception</span></option>
                <option ${(""=="Digital Health Interventions & Selfcare") ? "selected": ''} value="Digital Health Interventions & Selfcare"><span data-i18n="intro.focus_area_5">Digital Health Interventions & Selfcare</span></option>
                <option ${(""=="Fertility Care /Support") ? "selected": ''} value="Fertility Care /Support"><span data-i18n="intro.p_10">Fertility Care /Support</span></option>
                <option ${(""=="HIV & AIDS") ? "selected": ''} value="HIV & AIDS"><span data-i18n="intro.p_6">HIV & AIDS</span></option>
                <option ${(""=="Humanitarian SRHR") ? "selected": ''} value="Humanitarian SRHR"><span data-i18n="intro.p_4">Humanitarian SRHR</span></option>
                <option ${(""=="SGBV / Gender") ? "selected": ''} value="SGBV / Gender"><span data-i18n="intro.p_8">SGBV / Gender</span></option>
                <option ${(""=="Advocacy & Norms Change") ? "selected": ''} value="Advocacy & Norms Change"><span data-i18n="intro.focus_area_6">Advocacy & Norms Change</span></option>
                <option ${(""=="Communications & Campaigns") ? "selected": ''} value="Communications & Campaigns"><span data-i18n="intro.p_9">Communications & Campaign</span></option>
                <option ${(""=="Youth") ? "selected": ''} value="Youth"><span data-i18n="intro.p_5">Youth</span></option>
                <option ${(""=="Research / evidence") ? "selected": ''} value="Research / evidence"><span data-i18n="intro.p_11>Research / evidence</span></option>
                <option ${(""=="Organisational Processes and Systems") ? "selected": ''} value="Organisational Processes and Systems"><span intro.p_12>Organisational Processes and Systems</span></option>
                <option ${(""=="Commecial Sustainability") ? "selected": ''} value="Commecial Sustainability"><span intro.p_13>Commercial Sustainability</span></option>
                <option ${(""=="Social Enterprise & Marketing") ? "selected": ''} value="Social Enterprise & Marketing"><span data-i18n="intro.p_14">Social Enterprise & Marketing</span></option>
                <option ${(""=="Marginalised Pops (incl. LGBTQ+)") ? "selected": ''} value="Marginalised Pops (incl. LGBTQ+)"><span data-i18n="intro.p_7">Marginalised Pops (incl. LGBTQ+)</span></option>
                <option ${(""=="Not applicable") ? "selected": ''} value="Not applicable"><span data-i18n="intro.p_16">Not applicable</span></option>
                <option id="other-id" ${(""=="Other (please fill in)") ? "selected": ''} value="Other"><span data-i18n="intro.p_15">Other (please fill in)</span></option>
              </select>
            <div>
              <input type="text" id="other-value"  
                class="w-100 form-control my-1"
                value="" 
                placeholder="Other (Please specify)"
                onchange='pushDataElement(this.id, this.value)'
              />
            </div>
            <div class="invalid-feedback"> Error here </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="form-group col-md-12 textbox-wrap">
        <label for="${project.description}"><span data-i18n="intro.description_project">Description of Project </span> ${count} </label>
        <textarea 
        class="form-control-resize textlimit" 
        id="${project.description}" 
        ${tei.disabled ? 'disabled readonly': ''} 
        onchange="pushDataElement(this.id, this.value);checkWords(this, '${project.description}')">${projectDescription}</textarea>
        <div class="char-counter form-text text-muted" id="counter-${
          project.description
        }">${maxWords - (projectDescription ? projectDescription.trim().split(/\s+/).length : 0)} words remaining</div>
        <div class="invalid-feedback"> Error here </div>
    </div>
  </div><hr>`;
  }
  configurePage();

  $(".plus").click(function (e) {
    e.preventDefault();
    const newProjectRow = `
                <div class="form-row project-list" id="project-list-${(projectCount + 1)}">
                    <div class="form-group col-md-12 textbox-wrap">
                    <label for="${dataElements.projectDescription[projectCount]['name']}"><span data-i18n="intro.project_name">Project Name</span> ${(projectCount + 1)}</label>
                    <input type="text" class="form-control" id="${dataElements.projectDescription[projectCount]['name']}" oninput='pushDataElement(this.id, this.value)'>
                    <div class="invalid-feedback"> Error here </div>
                    </div>
                    <div class="form-group col-md-12 textbox-wrap">
                    <label for="${dataElements.projectDescription[projectCount]['description']}"><span data-i18n="intro.description_project">Description of Project </span> ${(projectCount + 1)}</label>
                    <textarea class="form-control-resize textlimit" id="${dataElements.projectDescription[projectCount]['description']}" oninput='pushDataElement(this.id, this.value)'></textarea>
                    <div class="char-counter form-text text-muted" id="counter-${dataElements.projectDescription[projectCount]['description']}">250 words remaining</div>
                    <div class="invalid-feedback"> Error here </div>
                    </div>
                </div>
                 
                <div class="form-row d-flex">
    <div class="form-group col-md-6 textbox-wrap">
        <label for="${dataElements.projectDescription[projectCount]['startDate']}">
            <span data-i18n="intro.start_date">Project Start Date ${(projectCount + 1)}</span>
        </label>
        <div>
            <input type="date" id="${dataElements.projectDescription[projectCount]['startDate']}"  
                   class="w-100 form-control"
                   onchange='pushDataElement(this.id, this.value)'>
        </div>
        <div class="invalid-feedback"> Error here </div>
    </div>

    <div class="form-group col-md-6 textbox-wrap">
        <label for="${dataElements.projectDescription[projectCount]['endDate']}">
            <span data-i18n="intro.end_date">Project End Date ${(projectCount + 1)}</span>
        </label>
        <div>
            <input type="date" id="${dataElements.projectDescription[projectCount]['endDate']}"  
                   class="w-100 form-control" 
                   onchange='pushDataElement(this.id, this.value)'>
        </div>
        <div class="invalid-feedback"> Error here </div>
    </div>
</div><hr>
            `;

    projectCount++;
    $(newProjectRow).insertBefore(".btn-wrap");
    $('#total-projects').val(projectCount)
    // Localize content
    $('body').localize();
  });

  $(".minus").click(function (e) {
    e.preventDefault();
    if (projectCount > 1) {
      $(".project-list").last().remove();
      projectCount--;
      $("hr").last().remove(); // Remove the last <hr> element
      $('#total-projects').val(projectCount)
    }
  });

  //Panel toggle
  function changePanel(id) {
    $(`#${id}`).collapse('toggle');
  }

  //textarea word limit
  function checkWords(event, id) {
    const counter = document.getElementById('counter-' + (id));
    const { value } = event;
    const words = value.trim().split(/\s+/)

    if (words.length >= maxWords) {
      event.value = words.slice(0, maxWords).join(' ');
      return
    }
    if (value) counter.textContent = `${(maxWords - words.length)} words remaining`;
    else counter.textContent = `${maxWords} words remaining`;
  }

});

function checkProjects(projects, values) {
  var prevEmptyNames = [];
  var names = [];
  if (values) {
    projects.forEach(project => {
      if (values[project.name]) {
        names = [...names, ...prevEmptyNames, project.name];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      }
    })
  }
  return names;
}