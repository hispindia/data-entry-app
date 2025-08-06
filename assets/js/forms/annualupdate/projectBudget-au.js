import { createEvent, getEvents, getProgramStageEvents, getTEI, pushDataElement, pushDataElementYear } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, unformatNumber, getYears } from "../func.js";

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
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.auProjectBudget;
    tei.programStage = programStage.auProjectBudget;

    fetchEvents();    
  }


  async function fetchEvents() {
    tei.year.value = document.getElementById("year-update").value;
    
    const data = await getTEI(tei.orgUnit);
    
    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program == program.auProjectDescription || enroll.program == program.auOrganisationDetails 
      );

      const dataValuesOD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, {id:tei.year.id,value: tei.year.value});
      if(dataValuesOD[tei.year.value] && dataValuesOD[tei.year.value][dataElements.yearAmount]) tei.yearAmount = dataValuesOD[tei.year.value][dataElements.yearAmount]

      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, {id:tei.year.id, value: tei.year.value});
      
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

      if (dataValuesPD[tei.year.value]) {
        tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[tei.year.value]);
      }
      tei.dataValues = getEvents(filteredPrograms, tei.program, {id:tei.year.id, value: tei.year.value}); //data vlaues period wise
      
      if (!tei.dataValues[tei.year.value]) {
        const data = [{
          dataElement: tei.year.id,
          value: tei.year.value
        }];
        tei.dataValues[tei.year.value] = {
          [tei.year.id]:tei.year.value,
        }
        tei.projects.forEach((name,index) => {
          tei.dataValues[tei.year.value][dataElements.projectBudget[index].name] = name;
            data.push({
              dataElement:dataElements.projectBudget[index].name,
              value: name
            })
        })
        tei.event = await createEvent(data);

        } else {
          tei.event = tei.dataValues[tei.year.value]["event"];

          var calculatedElements = loadCalculatedVariables(tei.dataValues[tei.year.value], {
           projectBudget: dataElements['projectBudget'],
           donorBudget: dataElements['donorBudget'],
           coreFunding: dataElements['coreFunding'],
           totalBudget: dataElements['totalBudget'],
           difference: dataElements['difference'],
          });
          calculatedElements.forEach(elements =>  {
            tei.dataValues[tei.year.value][elements.dataElement] = elements.value;
            pushDataElement(elements.dataElement, elements.value);
          });
        }

      populateProgramEvents(tei.dataValues[tei.year.value]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    
    $('#accordion').empty();

    if(!tei.projects.length) {   
      $('#accordion').append(`<h4 class="text-center text-warning my-4">No Existing Projects! Please add some project in the Project Description Section.</h4>`);
    } 

    let projectRows = displayProjectDetails(tei.projects, dataValues)
    $('#accordion').html(projectRows);
    $('#accordion .textValue').toArray().forEach(el => {
      el.addEventListener("input", (ev) => {
        var { id, value, name } = ev.target;
        pushDataElement(id,unformatNumber(value));
        ev.target.value = formatNumberInput(value);
        calculateTotals(name);
      })
    })
    $('#accordion .textlimit').toArray().forEach(el => {
      el.addEventListener("input", (ev) => {
        var { id, value, dataset } = ev.target;
        pushDataElement(id,value);
        checkWords(ev.target, dataset.count);
      })
    })

    var totalsRow = displayTotals(dataValues);
    $('#totals').empty();
    $('#totals').append(totalsRow);
          
      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues) {
    var totalsRow = '';
      const donorBudget = (dataValues[dataElements.donorBudget]) ?  Number(dataValues[dataElements.donorBudget]) : '';
      const coreFunding = (dataValues[dataElements.coreFunding]) ?  Number(dataValues[dataElements.coreFunding]) : '';
      const totalBudget = (dataValues[dataElements.totalBudget]) ?  Number(dataValues[dataElements.totalBudget]) : '';
      const difference = (dataValues[dataElements.difference]) ?  Number(dataValues[dataElements.difference]) : '';
      totalsRow += `
        <tr>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(donorBudget)}" id="${dataElements.donorBudget}" class="form-control donorBudget-total currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(coreFunding)}" id="${dataElements.coreFunding}" class="form-control coreFunding-total currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${formatNumberInput(totalBudget)}" id="${dataElements.totalBudget}" class="form-control totalBudget-total currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="background:${difference>=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" value="${formatNumberInput(difference)}" id="${dataElements.difference}" class="form-control difference-total currency" disabled readonly>
          </div>
        </td>
      </tr>
      `;
    
    return totalsRow;
  }
  function displayProjectDetails(projectDetails, dataValues) {

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
                  <th data-i18n="">Donor Budget</th>
                  <th data-i18n="intro.core_funding">IPPF Core Funding Allocated</th>
                  <th data-i18n="intro.total_budget">Total Budget</th>
                  <th data-i18n="intro.estimated_likelihood" >Estimated Likelihood</th>
                </tr>
              </thead>
              <tbody>`
                const donor = (dataValues[dataElements.projectBudget[index].donor]) ? dataValues[dataElements.projectBudget[index].donor] : '';
                const budget = (dataValues[dataElements.projectBudget[index].budget]) ? dataValues[dataElements.projectBudget[index].budget] : '';
                const likelihood = (dataValues[dataElements.projectBudget[index].likelihood]) ? dataValues[dataElements.projectBudget[index].likelihood] : '';
                const funding = (dataValues[dataElements.projectBudget[index].funding]) ? dataValues[dataElements.projectBudget[index].funding] : '';
                projectRows += `
                <tr>
                  <td>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          $
                        </div>
                      </div>
                      <input type="text" ${tei.disabled ? 'disabled readonly': ''} name="donorBudget-${dataElements.projectBudget[index].name}" value="${formatNumberInput(donor)}" id="${dataElements.projectBudget[index].donor}" class="form-control donorBudget currency textValue">
                    </div>
                  </td>
                  <td>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          $
                        </div>
                      </div>
                      <input type="text" ${tei.disabled ? 'disabled readonly': ''} name="coreFunding-${dataElements.projectBudget[index].name}" value="${formatNumberInput(funding)}" id="${dataElements.projectBudget[index].funding}" class="form-control coreFunding currency textValue">
                    </div>
                  </td>
                  <td>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          $
                        </div>
                      </div>
                      <input disabled  value="${formatNumberInput(budget)}" name="totalBudget-${dataElements.projectBudget[index].name}" id="${dataElements.projectBudget[index].budget}" class="form-control totalBudget currency textValue">
                    </div>
                  </td>
                  <td>
                    <select class="form-control textValue" ${tei.disabled ? 'disabled readonly': ''}  id="${dataElements.projectBudget[index].likelihood}">
                      <option ${(likelihood=="Confirmed") ? "selected": ''} value="Confirmed">Confirmed</option>
                      <option ${(likelihood=="Likely (over 80%)") ? "selected": ''} value="Likely (over 80%)">Likely(Over 80%)</option>
                      <option ${(likelihood=="Uncertain") ? "selected": ''} value="Uncertain">Uncertain</option>
                    </select>
                  </td>
                </tr>`
                projectRows += `</tbody>
                </table>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-12 textbox-wrap">
                  <label for=""><span data-i18n="intro.comments">
                  Comments</span> (<small class="text-muted ml-1" data-i18n="intro.optional">optional</small>)
                  </label>
                    <textarea class="form-control-resize textlimit" ${tei.disabled ? 'disabled readonly': ''} data-count="${index}" id="${dataElements.projectBudget[index].comment}">${(dataValues[dataElements.projectBudget[index].comment] ? dataValues[dataElements.projectBudget[index].comment] : '')}</textarea>
                    <div class="char-counter form-text text-muted" id="counter${index}">${maxWords- (dataValues[dataElements.projectBudget[index].comment] ? dataValues[dataElements.projectBudget[index].comment].trim().split(/\s+/).length: 0)} words remaining
                    </div>
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
                    class="btn btn-primary" onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/2.3-breakdown-by-focus-area-au.html'">
                    <span data-i18n="intro.next">Next</span>:  
                    <span data-i18n="intro.project_focusarea"> 2.3 Expense Budget by Focus Area</span></button>`:`<input
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

    document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents();
    });
});

function pushProjectBudget() {
  alert('Event Pushed Successfully!')
}

function loadCalculatedVariables(dataValues, dataElements) {
  var projectNames = [];
  var donorBudget = {
    dataElement: dataElements.donorBudget,
    value: 0
  };
  var coreFunding = {
    dataElement: dataElements.coreFunding,
    value: 0
  };
  var totalBudget = {
    dataElement: dataElements.totalBudget,
    value: 0
  };
  var budgets = [];
  var likelihood = [];
  
  tei.projects.forEach((name,index) => {
    var budget = 0;
    projectNames.push({dataElement: `${dataElements.projectBudget[index].name}`, value: name});
    if(dataValues[dataElements.projectBudget[index].donor]) {
      budget += Number(dataValues[dataElements.projectBudget[index].donor]);
      donorBudget.value += Number(dataValues[dataElements.projectBudget[index].donor]);
    }
    if(dataValues[dataElements.projectBudget[index].funding]) {
      budget += Number(dataValues[dataElements.projectBudget[index].funding]);
      coreFunding.value += Number(dataValues[dataElements.projectBudget[index].funding]);
    }
    if(!dataValues[dataElements.projectBudget[index].donor] && dataValues[dataElements.projectBudget[index].budget]) {
      budgets.push({dataElement: `${dataElements.projectBudget[index].budget}`, value: `${dataValues[dataElements.projectBudget[index].budget]}`});
      totalBudget.value += Number(dataValues[dataElements.projectBudget[index].budget]);
    } else {
      budgets.push({dataElement: `${dataElements.projectBudget[index].budget}`, value: `${budget}`});
      totalBudget.value += Number(budget);
    }
    if(![dataElements.projectBudget[index].likelihood])likelihood.push({dataElement: `${dataElements.projectBudget[index].likelihood}`, value: 'Confirmed'});
  })

  var difference = {
    dataElement: dataElements.difference,
    value: tei.yearAmount ? `${(tei.yearAmount - coreFunding.value)}`: '0'
  };

  return [
    ...projectNames,
    ...likelihood,
    donorBudget,
    coreFunding,
    totalBudget,
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


function calculateTotals(name) {
  const ids = name.split('-');
  var value = 0;
  $(`.${ids[0]}`).each((_,el) => value += unformatNumber(el.value));
  
  $(`.${ids[0]}-total`).val(formatNumberInput(value));
  pushDataElement($(`.${ids[0]}-total`)[0].id, value);

  //For row total
  const donorBudgetVal =  $(`input[name="donorBudget-${ids[1]}"]`).val();
  const coreFundingVal =  $(`input[name="coreFunding-${ids[1]}"]`).val();
  const totalBudgetVal = unformatNumber(donorBudgetVal) + unformatNumber(coreFundingVal);
  $(`input[name="totalBudget-${ids[1]}"]`).val(totalBudgetVal);
  pushDataElement($(`input[name="totalBudget-${ids[1]}"]`)[0].id, totalBudgetVal);

  //For global total
  var totalBudgets = 0;
  $(`.totalBudget`).each((_,el)  => totalBudgets += unformatNumber(el.value));
  pushDataElement($(`.totalBudget-total`)[0].id, value);

  if(ids[0]=="coreFunding") {
    const difference = tei.yearAmount - value;

    $(`.difference-total`).val(formatNumberInput(difference)); 
    if(difference >= 0) $(`.difference-total`)[0].style.setProperty('background','#C1E1C1', 'important')
    else  $(`.difference-total`)[0].style.setProperty('background','#FAA0A0', 'important')
    
    pushDataElement($(`.difference-total`)[0].id, difference);
  }
}

    //textarea word limit
function checkWords(event, count) {
  const counter = document.getElementById('counter' + (count));
  const { value } = event;
  const words = value.trim().split(/\s+/)
      
  if (words.length >= maxWords) {
    event.value = words.slice(0, maxWords).join(' ');
    return
  }
  if(value) counter.textContent = `${(maxWords - words.length)} words remaining`;
  else counter.textContent = `${maxWords} words remaining`;
}