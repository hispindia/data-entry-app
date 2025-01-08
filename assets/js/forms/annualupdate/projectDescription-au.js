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
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchEvents();
    });

    document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      tei.disabledYear = {};
      for(let year=tei.year.start; year <=tei.year.end; year++) {
        if(year<ev.target.value)  tei.disabledYear[year] = true;
      }
      window.localStorage.setItem("annualYear", ev.target.value);
      // populateProgramEvents(tei.dataValues);
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
    dataElements.period.value = document.getElementById("headerPeriod").value;
    tei.program = program.auProjectDescription;
    tei.programStage = programStage.auProjectDescription;
    tei.year = {
      ...tei.year,
      start:dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    var yearOptions = ''
    tei.disabledYear = {};
    var annualYear = window.localStorage.getItem("annualYear");
    for(let year=tei.year.start; year <=tei.year.end; year++) {
      if(tei.hideYears.includes(year))  tei.disabledYear[year] = true;
      if(tei.hideYears.includes(year)) continue;
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById('year-update').innerHTML = yearOptions;
    document.getElementById('year-update').options[0].selected = true;
    if(annualYear) document.getElementById('year-update').value = annualYear;

    const year = document.getElementById("year-update").value;

    const data = await events.get(tei.orgUnit);


    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program
        );

      tei.dataValues = getEvents(filteredPrograms, tei.program, dataElements.year.id); //data vlaues period wise
    
      if(tei.dataValues[year] && tei.dataValues[year][dataElements.submitAnnualUpdate])  tei.disabled = true;

      if (!tei.dataValues[year]) {
        tei.event = await createEvent([{
          dataElement: dataElements.year.id,
          value: year
        },{
          dataElement: dataElements.period.id,
          value: dataElements.period.value
        }]);
      } else tei.event = tei.dataValues[year]["event"];

      populateProgramEvents(tei.dataValues[year]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    projectCount = 0;
    $(".btn-wrap").prevAll().remove();

    var projectRows = "";
    const projectNames =  checkProjects(dataElements.projectDescription, dataValues);
    if(!projectNames.length) {
      projectRows += addRow(1, dataElements.projectDescription[0], "", "");
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
          projectRows += addRow(
            index + 1,
            project,
            projectName,
            projectDescription
          );
          projectCount++;
      })
      $("#total-projects").val(projectCount);
    } 
    $(projectRows).insertBefore(".btn-wrap");
    
      // Localize content
      $('body').localize();
  }
  function addRow(count, project, projectName, projectDescription) {
    return `
   <div class="form-row project-list" id="project-list-${count}">
    <div class="form-group col-md-12 textbox-wrap">
        <label for="${project.name}"><span data-i18n="intro.project_name">Project Name</span> ${count} </label>
        <input type="text" ${tei.disabled ? 'disabled readonly': ''} class="form-control" id="${
          project.name
        }" value="${projectName}" oninput='pushDataElement(this.id, this.value)'>
        <div class="invalid-feedback"> Error here </div>
    </div>
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
    </div>
    <hr>`;
  }
  fetchOrganizationUnitUid();
});

function checkProjects(projects, values) {
  var prevEmptyNames = [];
  var names= [];
  if(values) {
    projects.forEach(project => {
      if(values[project.name]) {
        names = [...names, ...prevEmptyNames, project.name];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      }
    })
  }
  return names;
}