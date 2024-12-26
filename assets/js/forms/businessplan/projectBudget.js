const maxWords = 200;

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
      fetchEvents()
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

        document.getElementById("headerOrgId").value =  data.organisationUnits[0].parent ? data.organisationUnits[0].parent.name: '';
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
    tei.program = program.projectBudget;
    tei.programStage = programStage.projectBudget;
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
        (enroll) => enroll.program == tei.program || enroll.program == program.projectDescription || enroll.program == program.organisationDetails 
      );

      const dataValuesOD = getProgramStageEvents(filteredPrograms, programStage.membershipDetails, program.organisationDetails, dataElements.period.id);
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        const period = dataElements.period.value;
        const amountId = dataElements.yearlyAmount[year-tei.year.start];

        tei.yearlyAmount[`amount-${year}`] = ''
        if(dataValuesOD[period] && dataValuesOD[period][amountId]) {
          tei.yearlyAmount[`amount-${year}`] = dataValuesOD[period][amountId]
        }
      }
      const dataValuesPD = getEvents(filteredPrograms, program.projectDescription,  dataElements.period.id);
   
    if (dataValuesPD[dataElements.period.value]) {
      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[dataElements.period.value]);
    }
      const dataValues = getEvents(filteredPrograms, tei.program, dataElements.year.id); //data vlaues period wise
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        if (!dataValues[year]) {
          const data = [{
            dataElement: dataElements.year.id,
            value: year
          },{
            dataElement: dataElements.period.id,
            value: dataElements.period.value
          }];
          
          dataValues[year] = {
            [dataElements.year.id]:year,
            [dataElements.period.id]: dataElements.period.value,
          }

          tei.projects.forEach((name,index) => {
            dataValues[year][dataElements.projectBudget[index].name] = name
            data.push({
            dataElement:dataElements.projectBudget[index].name,
            value: name
          })
        })

        tei.event = {
          ...tei.event,
         [year]: await createEvent(data)
        }
        } else {

          tei.event = {
            ...tei.event,
            [year]: dataValues[year]["event"]
          }

          var calculatedElements = loadCalculatedVariables(dataValues, dataElements, year);
          calculatedElements.forEach(elements =>  {
            dataValues[year][elements.dataElement] = elements.value;
            pushDataElementYear(`${elements.dataElement}-${year}`, elements.value);
          });
        }

      }
      populateProgramEvents(dataValues);
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
    
    $('#accordion').empty();

    if(!tei.projects.length) {   
      $('#accordion').append(`<h4 class="text-center text-warning my-4">No Existing Projects! Please add some project in the Project Description Section.</h4>`);
    } 

    let projectRows = displayProjectDetails(tei.projects, dataValues, period)
    $('#accordion').append(projectRows);

    var totalsRow = displayTotals(dataValues, period);
    $('#totals').empty();
    $('#totals').append(totalsRow);
          
      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues, period) {
    var totalsRow = '';
    for (let i = period.start;i <= period.end; i++) {
      const totalBudget = (dataValues[i] && dataValues[i][dataElements.totalBudget]) ?  Number(dataValues[i][dataElements.totalBudget]) : '';
      const coreFunding = (dataValues[i] && dataValues[i][dataElements.coreFunding]) ?  Number(dataValues[i][dataElements.coreFunding]) : '';
      const difference = (dataValues[i] && dataValues[i][dataElements.difference]) ?  Number(dataValues[i][dataElements.difference]) : '';
      totalsRow += `
            <tr>
        <td>${i}</td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${totalBudget.toLocaleString()}" id="${dataElements.totalBudget}-${i}" class="form-control totalBudget-${i} currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${coreFunding.toLocaleString()}" id="${dataElements.coreFunding}-${i}" class="form-control coreFunding-${i} currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="background:${difference >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" value="${difference.toLocaleString()}" id="${dataElements.difference}-${i}" class="form-control difference-${i} currency" disabled readonly>
          </div>
        </td>
      </tr>
      `;
    }
    return totalsRow;
  }
  function displayProjectDetails(projectDetails, dataValues, period) {

    var projectRows = '';
    var length = projectDetails.length;
    projectDetails.forEach((name,index) => {
      projectRows += `
      <!--- sect ${(index+1)}--->
      <div class="accordion">
        <div class="accordion-header active" role="button" data-toggle="collapse"
          data-target="#panel-body-${(index+1)}">
          
        <h4 class="d-flex align-items-center">
        <span class="">${index+1}. </span>
        <span class="input-headings w-100"
          ><input
            class="w-100"   
            id="${dataElements.projectBudget[index].name}" 
            value="${name}"
            readonly 
        /></span>
      </h4>
        </div>
        <div class="accordion-body collapse" id="panel-body-${(index+1)}" data-parent="#accordion">

          <div class="budget-wrap table-responsive">
            <table class="table table-striped table-md mb-0 " width="100%">
              <thead>
                <tr>
                  <th  data-i18n="intro.project_year">Year</th>
                  <th data-i18n="intro.budget">Budget</th>
                  <th data-i18n="intro.estimated_likelihood" >Estimated Likelihood</th>
                  <th data-i18n="intro.core_funding">Core Funding Allocated</th>
                </tr>
              </thead>
              <tbody>`

              for(let i = period.start; i<=period.end; i++) {
                const budget = (dataValues[i] && dataValues[i][dataElements.projectBudget[index].budget]) ? dataValues[i][dataElements.projectBudget[index].budget] : '';
                const likelihood = (dataValues[i] && dataValues[i][dataElements.projectBudget[index].likelihood]) ? dataValues[i][dataElements.projectBudget[index].likelihood] : '';
                const funding = (dataValues[i] && dataValues[i][dataElements.projectBudget[index].funding]) ? dataValues[i][dataElements.projectBudget[index].funding] : '';
                projectRows += `<tr>
                  <td>${i}</td>
                  <td>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          $
                        </div>
                      </div>
                      <input type="number" ${tei.disabled ? 'disabled readonly': ''} value="${budget}" id="${dataElements.projectBudget[index].budget}-${i}" oninput="calculateTotals(${i}, 'totalBudget');pushDataElementYear(this.id,this.value)" class="form-control input-totalBudget-${i} currency">
                    </div>
                  </td>
                  <td>
                    <select class="form-control" ${tei.disabled ? 'disabled readonly': ''} id="${dataElements.projectBudget[index].likelihood}-${i}" onchange="pushDataElementYear(this.id,this.value)">
                      <option ${(likelihood=="Confirmed") ? "selected": ''} value="Confirmed">Confirmed</option>
                      <option ${(likelihood=="Likely (over 80%)") ? "selected": ''} value="Likely (over 80%)">Likely(Over 80%)</option>
                      <option ${(likelihood=="Uncertain") ? "selected": ''} value="Uncertain">Uncertain</option>
                    </select>
                  </td>
                  <td>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          $
                        </div>
                      </div>
                      <input type="number" ${tei.disabled ? 'disabled readonly': ''} value="${funding}" id="${dataElements.projectBudget[index].funding}-${i}" oninput="calculateTotals(${i}, 'coreFunding');pushDataElementYear(this.id,this.value)"  class="form-control input-coreFunding-${i} currency">
                    </div>
                  </td>
                </tr>`
              }
            projectRows += `</tbody>
              </table>
            </div>

            <div class="form-row">
              <div class="form-group col-md-12 textbox-wrap">
                <label for=""><span data-i18n="intro.comments">
                  Comments</span> (<small class="text-muted ml-1" data-i18n="intro.optional">optional</small>)
                </label>
                <textarea class="form-control-resize textlimit" ${tei.disabled ? 'disabled readonly': ''} id="${dataElements.projectBudget[index].comment}-${period.start}" onchange="pushDataElementYear(this.id,this.value);checkWords(this, ${index})">${(dataValues[period.start] && dataValues[period.start][dataElements.projectBudget[index].comment] ? dataValues[period.start][dataElements.projectBudget[index].comment] : '')}</textarea>
                <div class="char-counter form-text text-muted" id="counter${index}">${maxWords- (dataValues[period.start] && dataValues[period.start][dataElements.projectBudget[index].comment] ? dataValues[period.start][dataElements.projectBudget[index].comment].trim().split(/\s+/).length: 0)} words remaining</div>

                <div class="invalid-feedback"> Error here
                </div>
              </div>
            </div>
            <div class="form-row">
            <div class="col-sm-12 text-right">
              <div class="form-group text-end mar-b-0">
              <input type="button" value="SAVE AS DRAFT" onclick="submitProjects()" data-i18n="[value]intro.save_as_draft"  class="btn btn-secondary">
                ${(length-1 == index) ? `
                <button 
                ${tei.disabled ? 'disabled readonly': ''}
                class="btn btn-primary" onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/2.3-breakdown-by-focus-area.html'">
                <span data-i18n="intro.next">Next</span>:  
                <span data-i18n="intro.project_focusarea"> 2.3 Budget by Focus Area</span></button>`: `<input
                type="button"
                data-i18n="[value]intro.next" 
                value="NEXT"
                onClick=changePanel('panel-body-${index+2}')
                class="btn btn-primary"
              />`}  
            </div>
            </div>
          </div>
            
              
          </div>
        </div><!--- sect ${(index+1)}--->`

    })
    return projectRows;
  }

  fetchOrganizationUnitUid();
});

function pushProjectBudget() {
  alert('Event Pushed Successfully!')
}

function loadCalculatedVariables(dataValues, dataElements, year) {

  var projectNames = [];
  var totalBudget = {
    dataElement: dataElements.totalBudget,
    value: 0
  };
  var coreFunding = {
    dataElement: dataElements.coreFunding,
    value: 0
  };
  var likelihood = []
  
  tei.projects.forEach((name,index) => {
    projectNames.push({dataElement: `${dataElements.projectBudget[index].name}`, value: name});
    if(!dataValues[year][dataElements.projectBudget[index].likelihood])likelihood.push({dataElement: `${dataElements.projectBudget[index].likelihood}`, value: 'Confirmed'})
    else likelihood.push({dataElement: `${dataElements.projectBudget[index].likelihood}`, value: dataValues[year][dataElements.projectBudget[index].likelihood]})
    if(dataValues[year] && dataValues[year][dataElements.projectBudget[index].budget]) totalBudget.value += Number(dataValues[year][dataElements.projectBudget[index].budget]);
    if(dataValues[year] && dataValues[year][dataElements.projectBudget[index].funding]) coreFunding.value += Number(dataValues[year][dataElements.projectBudget[index].funding]);
  })

  var difference = {
    dataElement: dataElements.difference,
    value: tei.yearlyAmount[`amount-${year}`]? `${(tei.yearlyAmount[`amount-${year}`] - coreFunding.value)}`: '0'
  };

  return [
    ...projectNames,
    ...likelihood,
    totalBudget,
    coreFunding,
    difference
  ]
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