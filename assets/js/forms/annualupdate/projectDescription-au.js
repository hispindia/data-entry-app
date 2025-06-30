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
  <div class="form-row project-list" id="project-list-${count}">
    <table class="table w-100">
      <caption style="caption-side:top">Project Details ${count}</caption>
      <thead>
        <tr>
          <th>
            <label for="${project.name}"><span data-i18n="intro.project_name">Project Name</span> ${count} </label>
          </th>
          <th>
            <label for="${project.description}"><span data-i18n="intro.description_project">Description of Project </span> ${count} </label>
          </th>
          <th>
            <label for="${project.startDate}"><span data-i18n="intro.start_date">Project Start Date ${count}</span></label>
          </th>
          <th>
            <label for="${project.endDate}"><span data-i18n="intro.end_date">Project End Date ${count}</span></label>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input 
              type="text" ${tei.disabled ? "disabled readonly" : ""} 
              id="${project.name}" 
              class="form-control" 
              value="${projectName}" 
              oninput='pushDataElement(this.id, this.value)' 
            />
          <div class="invalid-feedback"> Error here </div></th>
        </td>
          <td>
            <textarea 
              class="form-control-resize textlimit" 
              id="${project.description}" 
              ${tei.disabled ? "disabled readonly" : ""} 
              onchange="pushDataElement(this.id, this.value);checkWords(this, '${
                project.description
              }')">${projectDescription}</textarea>
              <div class="char-counter form-text text-muted" id="counter-${
                project.description
              }">${
              maxWords -
              (projectDescription ? projectDescription.trim().split(/\s+/).length : 0)
              } words remaining</div>
            <div class="invalid-feedback"> Error here </div>
          </td>
          <td>
            <input type="date" id="${project.startDate}"  
              class="w-100 form-control"
              value="${startDate}" 
              onchange='pushDataElement(this.id, this.value)'
            />
            <div class="invalid-feedback"> Error here </div>
          </td>
          <td>
            <input type="date" id="${project.endDate}"  
              class="w-100 form-control" 
              value="${endDate}" 
              onchange='pushDataElement(this.id, this.value)'>
            <div class="invalid-feedback"> Error here </div>
          </td>
        </tr>
      </tbody>
    </table>
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