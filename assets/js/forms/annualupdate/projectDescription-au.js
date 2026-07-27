import { createEvent, formatDate, getEvents, getTEI, pushDataElement } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears, unformatNumber } from "../func.js";

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

      tei.dataValues = getEvents(filteredPrograms, tei.program, {id:tei.year.id, value: tei.year.value}); //data vlaues period wise

      if (tei.dataValues[tei.year.value] && tei.dataValues[tei.year.value][dataElements.submitAnnualUpdate]) tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

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
      projectRows += addRow(1, dataElements.projectDescription[0], 
      { name: "",  description: "", startDate: "", endDate: "", theme: "", themeOther: "", donor: "", donorOther: "", contract: "", income: "", funding: "" }
      );
      $("#total-projects").val(projectCount);
      projectCount++;
    } else {
      projectNames.forEach((_, index) => {
        const project = dataElements.projectDescription[index];
        const values = {
          name: dataValues[project.name] ? dataValues[project.name] : "",
          description: dataValues[project.description] ? dataValues[project.description] : "",
          startDate: dataValues[project.startDate] ? dataValues[project.startDate] : "",
          endDate: dataValues[project.endDate] ? dataValues[project.endDate] : "",
          theme: dataValues[project.theme] ? dataValues[project.theme] : "",
          themeOther: dataValues[project.themeOther] ? dataValues[project.themeOther] : "",
          donor: dataValues[project.donor] ? dataValues[project.donor] : "",
          donorOther: dataValues[project.donorOther] ? dataValues[project.donorOther] : "",
          contract: dataValues[project.contract] ? dataValues[project.contract] : "",
          income: dataValues[project.income] ? dataValues[project.income] : "",
          funding: dataValues[project.funding] ? dataValues[project.funding] : "",
        }
        projectRows += addRow(
          index + 1,
          project,
          values
        );
        projectCount++;
      })
      $("#total-projects").val(projectCount);
    }
    // $(projectRows).insertBefore(".btn-wrap");
    const content = document.getElementById('content')
    content.innerHTML=projectRows;

    content.addEventListener('input', (ev) => {
      if(ev.target.matches('.textValue')) {
        const { id, value } = ev.target;
        pushDataElement(id,unformatNumber(value));
        ev.target.value = formatNumberInput(value);
      } else if (ev.target.matches('.textContent')) {
        const { id, value } = ev.target;
        if(value == 'Other (please fill in)' || value == "Other (please write below)") {
          $(`.${id}-other`).show();
        } else if($(`#${id}`).hasClass(`${id}-other`) && $(`#${id}`).val() && ($(`[name="${id}"]`).val() !='Other (please fill in)' &&  $(`[name="${id}"]`).val() != 'Other (please write below)')) {
          $(`.${id}-other`).hide();
          console.log( $(`[name="${id}"]`).val())
         
          pushDataElement($(`.${id}-other`)[0].id,'');
        }
        pushDataElement(id,value);
      } else if (ev.target.matches('.textlimit')) {
        const { id, value } = ev.target;
        pushDataElement(id,value);
        checkWords(ev.target, id)

      }
    });
    $('.loader-container').addClass("d-none").removeClass("d-flex");
    $('.myContainer').show();
    // Localize content
    $('body').localize();
  }
  function addRow(count, project, values) {

    return `
  <div class="form-row project-list data-row" id="project-list-${count}">

    <div class="form-group col-md-12 textbox-wrap my-2">
        <label for="${project.name}"><span data-i18n="intro.project_name">Project Name</span> <span class="required">${count}</span> </label>
        <input type="text" ${tei.disabled ? 'disabled readonly': ''} class="form-control textContent" id="${
          project.name
        }" value="${values['name']}">
        <div class="invalid-feedback"> Error here </div>
    </div>
    <table class="table w-100">
      <tbody>
        <tr>
          <td>
            <label for="${project.startDate}"><span data-i18n="intro.start_date" class="required">Start Date</span></span> </label>
            <input type="date" id="${project.startDate}"  
              ${tei.disabled ? 'disabled readonly': ''} 
              class="w-100 form-control textContent"
              value="${values['startDate']}" 
            />
            <div class="invalid-feedback"> Error here </div>
          </td>
          <td>
            <label for="${project.theme}"><span data-i18n="intro.project_theme">Project Theme</span><span class="required">:</span></label>
              <select class="form-control textContent" ${tei.disabled ? 'disabled readonly': ''}  id="${project.theme}" name="${project.themeOther}" >
                <option ${(values['theme']=="") ? "selected": ''} value="" data-i18n="intro.choose">Choose</option>
                <option ${(values['theme']=="Abortion Care") ? "selected": ''} value="Abortion Care" data-i18n="intro.p_1">Abortion Care</option>
                <option ${(values['theme']=="General Contraception") ? "selected": ''} value="General Contraception" data-i18n="intro.p_2">General Contraception</option>
                <option ${(values['theme']=="Digital Health Interventions & Selfcare") ? "selected": ''} value="Digital Health Interventions & Selfcare" data-i18n="intro.p_18">Digital Health Interventions & Selfcare</option>
                <option ${(values['theme']=="Fertility Care /Support") ? "selected": ''} value="Fertility Care /Support" data-i18n="intro.p_10">Fertility Care /Support</option>
                <option ${(values['theme']=="HIV & AIDS") ? "selected": ''} value="HIV & AIDS" data-i18n="intro.p_6">HIV & AIDS</option>
                <option ${(values['theme']=="Humanitarian SRHR") ? "selected": ''} value="Humanitarian SRHR" data-i18n="intro.p_4">Humanitarian SRHR</option>
                <option ${(values['theme']=="SGBV / Gender") ? "selected": ''} value="SGBV / Gender" data-i18n="intro.p_8">SGBV / Gender</option>
                <option ${(values['theme']=="Advocacy & Norms Change") ? "selected": ''} value="Advocacy & Norms Change" data-i18n="intro.p_17">Advocacy & Norms Change</option>
                <option ${(values['theme']=="Communications & Campaigns") ? "selected": ''} value="Communications & Campaigns" data-i18n="intro.p_9">Communications & Campaign</option>
                <option ${(values['theme']=="Youth") ? "selected": ''} value="Youth" data-i18n="intro.p_5">Youth</option>
                <option ${(values['theme']=="Research / evidence") ? "selected": ''} value="Research / evidence" data-i18n="intro.p_11">Research / evidence</option>
                <option ${(values['theme']=="Organisational Processes and Systems") ? "selected": ''} value="Organisational Processes and Systems" data-i18n="intro.p_12">Organisational Processes and Systems</option>
                <option ${(values['theme']=="Commecial Sustainability") ? "selected": ''} value="Commecial Sustainability" data-i18n="intro.p_13">Commercial Sustainability</option>
                <option ${(values['theme']=="Social Enterprise & Marketing") ? "selected": ''} value="Social Enterprise & Marketing" data-i18n="intro.p_14">Social Enterprise & Marketing</option>
                <option ${(values['theme']=="Marginalised Pops (incl. LGBTQ+)") ? "selected": ''} value="Marginalised Pops (incl. LGBTQ+)" data-i18n="intro.p_7">Marginalised Pops (incl. LGBTQ+)</option>
                <option ${(values['theme']=="Not applicable") ? "selected": ''} value="Not applicable" data-i18n="intro.p_16">Not applicable</option>
                <option ${(values['theme']=="Other (please fill in)") ? "selected": ''} value="Other (please fill in)" data-i18n="intro.p_15">Other (please fill in)</option>
              </select>
            <div>
              <input type="text" 
                class="w-100 form-control my-1 ${project.theme}-other textContent"
                id="${project.themeOther}"
                style="${values['theme']!="Other (please fill in)" ? `display:none`:``}"
                value="${values['themeOther']}" 
                placeholder="Other (Please specify)"
              />
            </div>
            <div class="invalid-feedback"> Error here </div>
          </td>
          <td>
          <label for="${project.funding}" class="required"><span data-i18n="intro.funding_type">Funding Type:</span> </label>
              <select class="form-control textContent" ${tei.disabled ? 'disabled readonly': ''}  id="${project.funding}">
                <option ${(values['funding']=="") ? "selected": ''} value="" data-i18n="intro.choose">Choose</option>
                <option ${(values['funding']=="Restricted") ? "selected": ''} value="Restricted" data-i18n="intro.restricted">Restricted</option>
                <option ${(values['funding']=="Unrestricted") ? "selected": ''} value="Unrestricted" data-i18n="intro.unrestricted">Unrestricted</option>
              </select>
            <div class="invalid-feedback"> Error here </div>
          </td>
          <td>
            <label for="${project.contract}" class="required"><span data-i18n="intro.total_contract_value">Total Project Lifetime Value</span>: </label>
            <input type="text" id="${project.contract}"  
              ${tei.disabled ? 'disabled readonly': ''} 
              class="w-100 form-control textValue"
              value="${formatNumberInput(values['contract'])}" 
            />
            <div class="invalid-feedback"> Error here </div>
          </td>
        </tr>
        <tr>
          <td>
            <label for="${project.endDate}" class="required"><span data-i18n="intro.end_date">End Date:</span> </label>
            <input type="date" id="${project.endDate}"  max="${tei.year.end+3}-12-31"
              ${tei.disabled ? 'disabled readonly': ''}
              class="w-100 form-control textContent" 
              value="${values['endDate']}"
            >
            <div class="invalid-feedback"> Error here </div>
          </td> 
          <td>
            <label for="${project.donor}" class="required"><span data-i18n="intro.project_donor">Project Donor:</span> </label>
              <select class="form-control textContent" ${tei.disabled ? 'disabled readonly': ''}  id="${project.donor}" name="${project.donorOther}" >
                <option ${(values['donor']=="") ? "selected": ''} value="" data-i18n="intro.choose">Choose</option>
                <option ${(values['donor']=="Government of Australia / DFAT") ? "selected": ''} value="Government of Australia / DFAT" data-i18n="intro.g_aus">Government of Australia / DFAT</option>
                <option ${(values['donor']=="Government of Canada / GAC") ? "selected": ''} value="Government of Canada / GAC" data-i18n="intro.g_can">Government of Canada / GAC</option>
                <option ${(values['donor']=="Government of China") ? "selected": ''} value="Government of China"  data-i18n="intro.g_ch">Government of China</option>
                <option ${(values['donor']=="Government of Denmark / DANIDA") ? "selected": ''} value="Government of Denmark / DANIDA" data-i18n="intro.g_den">Government of Denmark / DANIDA</option>
                <option ${(values['donor']=="Government of Finland / FINNIDA") ? "selected": ''} value="Government of Finland / FINNIDA" data-i18n="intro.g_fin">Government of Finland / FINNIDA</option>
                <option ${(values['donor']=="Government of France / Agence Française de Développement") ? "selected": ''} value="Government of France / Agence Française de Développement" data-i18n="intro.g_fran">Government of France / Agence Française de Développement</option>
                <option ${(values['donor']=="Government of Germany / GIZ") ? "selected": ''} value="Government of Germany / GIZ"  data-i18n="intro.g_ger">Government of Germany / GIZ</option>
                <option ${(values['donor']=="Government of Japan / Ministry of Foreign Affairs Japan") ? "selected": ''} value="Government of Japan / Ministry of Foreign Affairs Japan" data-i18n="intro.g_jap">Government of Japan / Ministry of Foreign Affairs Japan</option>
                <option ${(values['donor']=="Government of New Zealand / MFAT ") ? "selected": ''} value="Government of New Zealand / MFAT" data-i18n="intro.g_new">Government of New Zealand / MFAT</option>
                <option ${(values['donor']=="Government of Norway / NORAD") ? "selected": ''} value="Government of Norway / NORAD" data-i18n="intro.g_nor">Government of Norway / NORAD</option>
                <option ${(values['donor']=="Government of Spain / AECID") ? "selected": ''} value="Government of Spain / AECID" data-i18n="intro.g_spain">Government of Spain / AECID</option>
                <option ${(values['donor']=="Government of United Kingdom / FCDO") ? "selected": ''} value="Government of United Kingdom / FCDO" data-i18n="intro.g_uk">Government of United Kingdom / FCDO</option>
                <option ${(values['donor']=="European Commission (EU/EC)") ? "selected": ''} value="European Commission (EU/EC)" data-i18n="intro.g_eu_comm">European Commission (EU/EC)></option>
                <option ${(values['donor']=="Global Fund for AIDS,  Tuberculosis, and Malaria (GFATM)") ? "selected": ''} value="Global Fund for AIDS,  Tuberculosis, and Malaria (GFATM)" data-i18n="intro.gl_fund_aids">Global Fund for AIDS,  Tuberculosis, and Malaria (GFATM)</option>
                <option ${(values['donor']=="Reproductive Health Supplies Coalition (RHSC)") ? "selected": ''} value="Reproductive Health Supplies Coalition (RHSC)" data-i18n="intro.rep_health">Reproductive Health Supplies Coalition (RHSC)</option>
                <option ${(values['donor']=="UNAIDS") ? "selected": ''} value="UNAIDS" data-i18n="intro.unaids">UNAIDA</option>
                <option ${(values['donor']=="UNDP") ? "selected": ''} value="UNDP" data-i18n="intro.undp">UNDP</option>
                <option ${(values['donor']=="UNESCO") ? "selected": ''} value="UNESCO" data-i18n="intro.unesco">UNESCO</option>
                <option ${(values['donor']=="UNFPA") ? "selected": ''} value="UNFPA" data-i18n="intro.unfpa">UNFPA</option>
                <option ${(values['donor']=="UNICEF") ? "selected": ''} value="UNICEF" data-i18n="intro.unicef">UNICEF</option>
                <option ${(values['donor']=="World Health Organisation (WHO)") ? "selected": ''} value="World Health Organisation (WHO)" data-i18n="intro.who">World Health Organisation (WHO)</option>
                <option ${(values['donor']=="Amplify Change") ? "selected": ''} value="Amplify Change" data-i18n="intro.amp_ch">Amplify Change</option>
                <option ${(values['donor']=="Bill & Melinda Gates Foundation") ? "selected": ''} value="Bill & Melinda Gates Foundation" data-i18n="intro.bill_melinda">Bill & Melinda Gates Foundation</option>
                <option ${(values['donor']=="Open Society Foundations (OSF)") ? "selected": ''} value="Open Society Foundations (OSF)" data-i18n="intro.osf">Open Society Foundations (OSF)</option>
                <option ${(values['donor']=="The William and Flora Hewlett Foundation") ? "selected": ''} value="The William and Flora Hewlett Foundation" data-i18n="intro.th_william_fl_found">The William and Flora Hewlett Foundation</option>
                <option ${(values['donor']=="Danish FPA / Sex og Samfund (Denmark)") ? "selected": ''} value="Danish FPA / Sex og Samfund (Denmark)" data-i18n="intro.danish_fpa">Danish FPA / Sex og Samfund (Denmark)</option>
                <option ${(values['donor']=="International Planned Parenthood Federation (IPPF)") ? "selected": ''} value="International Planned Parenthood Federation (IPPF)" data-i18n="intro.int_plan_parenth_fed">International Planned Parenthood Federation (IPPF)</option>
                <option ${(values['donor']=="Planned Parenthood Federation of America (USA)") ? "selected": ''} value="Planned Parenthood Federation of America (USA)" data-i18n="intro.planned_parenthood_fed_usa">Planned Parenthood Federation of America (USA)</option>
                <option ${(values['donor']=="RFSU (Sweden)") ? "selected": ''} value="RFSU (Sweden)" data-i18n="intro.rfsu_sweden">RFSU (Sweden)</option>
                <option ${(values['donor']=="Rutgers (Netherlands)") ? "selected": ''} value="Rutgers (Netherlands)" data-i18n="intro.rutgers">Rutgers (Netherlands)</option>
                <option ${(values['donor']=="Center for Disease Control (CDC)") ? "selected": ''} value="Center for Disease Control (CDC)" data-i18n="intro.center_dis_cont">Center for Disease Control (CDC))</option>
                <option ${(values['donor']=="USAID") ? "selected": ''} value="USAID" data-i18n="intro.usaid">USAID</option>
                <option ${(values['donor']=="Not applicable") ? "selected": ''} value="Not applicable" data-i18n="intro.not_app">Not applicable</option> 
                <option ${(values['donor']=="Other (please write below)") ? "selected": ''} value="Other (please write below)" data-i18n="intro.other_please">Other (please write below)</option>
              </select>
            <div>
              <input type="text"  
                class="w-100 form-control ${project.donor}-other  my-1 textContent"
                ${tei.disabled ? 'disabled readonly': ''} 
                id="${project.donorOther}"
                style="${values['donor']!="Other (please write below)" ? `display:none`:``}"
                value="${values['donorOther']}" 
                placeholder="Other (Please specify)"
              />
            </div>
            <div class="invalid-feedback"> Error here </div>
          </td>
          <td>
            <label for="${project.income}" class="required"><span data-i18n="intro.annual_proj_income">Annual Project Income</span>: </label>
            <input type="text" id="${project.income}" 
              ${tei.disabled ? 'disabled readonly': ''}  
              class="w-100 form-control textValue"
              value="${formatNumberInput(values['income'])}" 
            />
            <div class="invalid-feedback"> Error here </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="form-group col-md-12 textbox-wrap">
        <label for="${project.description}" class="required"><span data-i18n="intro.description_project">Description of Project </span> ${count} </label>
        <textarea 
        class="form-control-resize textlimit" 
        id="${project.description}" 
        ${tei.disabled ? 'disabled readonly': ''}>${values['description']}</textarea>
        <div class="char-counter form-text text-muted"> <span id="counter-${
          project.description
        }">${maxWords - (values['description'] ? values['description'].trim().split(/\s+/).length : 0)}</span> <span data-i18n="intro.words_remaining">words remaining</span></div>
        <div class="invalid-feedback"> Error here </div>
    </div>
  </div><hr>`;
  }

  document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      $('.loader-container').addClass("d-flex").removeClass("d-none");
      $('.myContainer').hide();
      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents();
    });

 

  $(".plus").click(function (e) {
    e.preventDefault();
    const newProjectRow = addRow((projectCount + 1), dataElements.projectDescription[projectCount], { name: "",  description: "", startDate: "", endDate: "", theme: "", themeOther: "", donor: "", donorOther: "", contract: "", income: "", funding: "" });
    projectCount++;
    $('#content').append(newProjectRow);
    $('#total-projects').val(projectCount)
    // Localize content
    $('body').localize();
  });

  //textarea word limit
  function checkWords(event, id) {
    const counter = document.getElementById('counter-' + (id));
    const { value } = event;
    const words = value.trim().split(/\s+/)

    if (words.length >= maxWords) {
      event.value = words.slice(0, maxWords).join(' ');
      return
    }
    if (value) counter.textContent = `${(maxWords - words.length)}`;
    else counter.textContent = `${maxWords}`;
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