import { getEvents, getTEI, pushDataElement } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, unformatNumber, getYears } from "../func.js";

var totalProjectBudget = {};
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

    tei.program = program.auProjectDescription;
    tei.programStage = programStage.auProjectDescription;

    fetchEvents();    
  }

  async function fetchEvents() {
    tei.projects = [];
    tei.year.value = document.getElementById("year-update").value;
   
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program == program.auProjectBudget || enroll.program==program.auProjectDescription 
        );
  
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  {id:tei.year.id, value: tei.year.value});
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[tei.year.value]);

      const dataValuesPB = getEvents(filteredPrograms, program.auProjectBudget, {id:tei.year.id, value: tei.year.value});
      if(dataValuesPB[tei.year.value]) {  
        tei.yearAmount = dataValuesPB[tei.year.value][dataElements.totalBudget] ? dataValuesPB[tei.year.value][dataElements.totalBudget] : ''
        dataElements.projectBudget.forEach((project,index) => {
          if(dataValuesPB[tei.year.value][project.name] && tei.projects[index]) {
              if(!totalProjectBudget[index]) totalProjectBudget[index] = 0;
              if(dataValuesPB[tei.year.value][project.budget]) totalProjectBudget[index] += Number(dataValuesPB[tei.year.value][project.budget]);
          }
        })
      }

      tei.dataValues = getEvents(filteredPrograms, tei.program, {id:tei.year.id, value: tei.year.value}); //data vlaues period wise
      
      if(tei.projects.length) {
        if (!tei.dataValues[tei.year.value]) {
          const data = [{
            dataElement: tei.year.id,
            value: tei.year.value
          }];
          tei.dataValues[tei.year.value] = {
            [tei.year.id]:tei.year.value,
          }
          tei.projects.forEach((name,index) => {
            tei.dataValues[tei.year.value][dataElements.projectExpenseCategory[index].name] = name;
            data.push({
            dataElement:dataElements.projectExpenseCategory[index].name,
            value: name
          })
        })

        tei.event = await createEvent(data);
        } else {

          tei.event = tei.dataValues[tei.year.value]["event"];

          var calculatedElements = loadCalculatedVariables(tei.dataValues[tei.year.value], {
            projectBudget: dataElements.projectBudget,
            projectExpenseCategory: dataElements.projectExpenseCategory,
            totalBudget: dataElements.totalBudget,
            difference: dataElements.difference,
        });
          calculatedElements.forEach(elements =>  {
            tei.dataValues[tei.year.value][elements.dataElement] = elements.value;
            pushDataElement(elements.dataElement, elements.value);
          });
          
        }
    }
      populateProgramEvents(tei.dataValues[tei.year.value]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }


  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    $('#accordion').empty();
    if (tei.projects.length) {
      let projectRows = displayProjectDetails(tei.projects, dataValues)
      $('#accordion').html(projectRows);
      $('#accordion .textValue').toArray().forEach(el => {
        el.addEventListener("input", (ev) => {
          var { id, value, name } = ev.target;
          pushDataElement(id,unformatNumber(value));
          ev.target.value = formatNumberInput(value);
          calculateTotals(name)
        })
      })
      $('#accordion .textlimit').toArray().forEach(el => {
        el.addEventListener("input", (ev) => {
          var { id, value, dataset } = ev.target;
          pushDataElement(id,value);
          checkWords(ev.target, dataset.count);
        })
      })
    } else {
      $('#accordion').append(`<h4 class="text-center text-warning my-4">No Existing Projects! Please add project in the Project Budget Section.</h4>`);
    }

    var totalsRow = displayTotals(dataValues);
    $('#totals').empty();
    $('#totals').append(totalsRow);

      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues) {
    var totalsRow = '';
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
            <input type="text" value="${formatNumberInput(totalBudget)}" id="${dataElements.totalBudget}" class="form-control totalBudget-total currency" readonly disabled>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="background:${difference >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}"  value="${formatNumberInput(difference)}" id="${dataElements.difference}" class="form-control difference-total currency" readonly disabled>
          </div>
        </td>
      </tr>
      `;
    return totalsRow;
  }
  function displayProjectDetails(projectDetails, dataValues) {
    var projectRows = '';
    var length = projectDetails.length;
    projectDetails.forEach((list, index) => {
      projectRows += `
      <!--- sect ${(index + 1)}--->
      <div class="accordion">
      <div
        class="accordion-header active"
        role="button"
        data-toggle="collapse"
        data-target="#panel-body-${index+1}"
      >
        <h4 class="d-flex align-items-center">
        <span class="">${index+1}. </span>
          <span class="input-headings w-100"
            ><input
              class="w-100"
              type="text"
              id="${dataElements.projectExpenseCategory[index].name}"
              value="${list}"
              title="${list}"
              readonly
          /></span>
        </h4>
      </div>
      <div
        class="accordion-body collapse"
        id="panel-body-${index+1}"
        data-parent="#accordion"
      >
        <div class="budget-wrap table-responsive">
          <table
            class="table table-striped table-md mb-0"
            width="100%"
          >
            <thead id="project-head">
              <tr>
                <th><strong data-i18n="intro.personnel">Personnel</strong></th>
                <th><strong data-i18n="intro.activities">Direct project activities</strong></th>
                <th><strong data-i18n="intro.commodities">Commodities</strong></th>
                <th><strong data-i18n="intro.indirect">Indirect/support costs</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
              <td>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text">$</div>
                </div>
                <input
                  id="${dataElements.projectExpenseCategory[index].personnel}"
                  type="text"
                  ${tei.disabled ? 'disabled readonly': ''}
                  value="${(dataValues[dataElements.projectExpenseCategory[index].personnel]) ? formatNumberInput(dataValues[dataElements.projectExpenseCategory[index].personnel]) : ''}"
                  name="personnel-${dataElements.projectExpenseCategory[index].name}-${index}"
                  class="form-control textValue currency"
                />                
              </div>
              </td>
              <td>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">$</div>
                  </div>
                  <input id="${dataElements.projectExpenseCategory[index].activities}"
                        type="text"
                        ${tei.disabled ? 'disabled readonly': ''}
                      value="${(dataValues[dataElements.projectExpenseCategory[index].activities]) ? formatNumberInput(dataValues[dataElements.projectExpenseCategory[index].activities]) : ''}"
                      class="form-control textValue currency"
                      name="activities-${dataElements.projectExpenseCategory[index].name}-${index}"
                    />
                </div>
              <td>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">$</div>
                  </div>
                <input
                      id="${dataElements.projectExpenseCategory[index].commodities}"
                      type="text"
                      ${tei.disabled ? 'disabled readonly': ''}
                      value="${(dataValues[dataElements.projectExpenseCategory[index].commodities]) ? formatNumberInput(dataValues[dataElements.projectExpenseCategory[index].commodities]) : ''}"
                      class="form-control textValue currency"
                      name="commodities-${dataElements.projectExpenseCategory[index].name}-${index}"
                    />
                </div>
              </td>
              <td>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">$</div>
                  </div>
                  <input
                      id="${dataElements.projectExpenseCategory[index].cost}"
                      type="text"
                      ${tei.disabled ? 'disabled readonly': ''}
                      value="${(dataValues[dataElements.projectExpenseCategory[index].cost]) ? formatNumberInput(dataValues[dataElements.projectExpenseCategory[index].cost]) : ''}"
                      class="form-control textValue  currency"
                      name="cost-${dataElements.projectExpenseCategory[index].name}-${index}"
                    />
                </div>
              </td>`
            projectRows +=`</tr>
            </tbody>
          </table>
        </div>

        <div class="form-row">
        <div class="form-group col-md-12 textbox-wrap">
        <label for="${dataElements.projectExpenseCategory[index].variation}" ><span data-i18n="intro.variation_budget">
          Variation from total project budget</span>
          <i class="fas fa-info-circle ml-1" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Difference in Budget provisioned for the project in the concerned year and the expenditure mentioned. Positive number indicates remaining budget and negative number indicates that the expenditure is more than the budget allocated for the project"></i>
                        </label>
          <div>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">$</div>
            </div>
            <input 
            type="text" 
            ${tei.disabled ? 'disabled readonly': ''}
            id="${dataElements.projectExpenseCategory[index].variation}" 
            value="${dataValues[dataElements.projectExpenseCategory[index].variation]? formatNumberInput(dataValues[dataElements.projectExpenseCategory[index].variation]): 0}"  
            class="form-control currency"
            style="background:${dataValues[dataElements.projectExpenseCategory[index].variation] ? (dataValues[dataElements.projectExpenseCategory[index].variation] >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'): ''}" 
            name="variation-${dataElements.projectExpenseCategory[index].name}"
            disabled readonly
            >
          </div>
          <div class="invalid-feedback feedback ${dataValues[dataElements.projectExpenseCategory[index].variation]<0 ? 'd-block': ''}"> Please provide remarks for the variance </div>
          </div>
        </div>
        </div>
        <div class="form-row">
          <div
            class="form-group col-md-12 textbox-wrap"
          > <label for=""><span data-i18n="intro.comments">
          Comments</span> (<small class="text-muted ml-1" data-i18n="intro.optional">optional</small>)
        </label>
            <textarea
              class="form-control-resize textlimit"
              ${tei.disabled ? 'disabled readonly': ''}
              data-count="${index}"
              id="${dataElements.projectExpenseCategory[index].comment}"
            >${dataValues[dataElements.projectExpenseCategory[index].comment] ? dataValues[dataElements.projectExpenseCategory[index].comment] : ''}</textarea>
            <div
              class="char-counter form-text text-muted"
              id="counter${index}"
            >${maxWords- (dataValues[dataElements.projectExpenseCategory[index].comment] ? dataValues[dataElements.projectExpenseCategory[index].comment].trim().split(/\s+/).length: 0)} words remaining
            </div>

            <div class="invalid-feedback">
              Error here
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="col-sm-12 text-right">
            <div
              class="form-group text-end mar-b-0"
            >
              <!--<input type="button" value="CANCEL" class="btn btn-secondary mr-3"> -->
              <input
                type="button"
                onclick="submitProjects()"
                value="SAVE AS DRAFT" data-i18n="[value]intro.save_as_draft" 
                class="btn btn-secondary"
              />
              ${(length-1 == index) ? `<button class="btn btn-primary" ${tei.disabled ? 'disabled readonly': ''} onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/3.1-total-income-au.html'">
              <span data-i18n="intro.next">Next</span>:  
              <span data-i18n="intro.total_income">3.1 Total Income</span>
            </button>`:`<input
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
    </div>
    <!--- sect ${(index + 1)}--->`
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

function submitProjectExpense() {
  var value = ''
  const date = new Date();

    var difference = document.getElementById(`${dataElements.difference}-${date.getFullYear()}`);
    if(difference) value = `The total project budget should be equal to total project budget by expense categories (Year: ${date.getFullYear()}). Please check the data.`  
  
  if(value ) alert(value);
  alert('Event Pushed Successfully!');
}

function loadCalculatedVariables(dataValues, dataElements) {

  var projectNames = [];
  var totalBudget = {
    dataElement: dataElements.totalBudget,
    value: 0
  };
  var variations = [];
  tei.projects.forEach((name,index) => {
    var budget = 0;
    projectNames.push({dataElement: `${dataElements.projectExpenseCategory[index].name}`, value: name})
    if(dataValues[dataElements.projectExpenseCategory[index].personnel]) budget += Number(dataValues[dataElements.projectExpenseCategory[index].personnel]);
    if(dataValues[dataElements.projectExpenseCategory[index].activities]) budget += Number(dataValues[dataElements.projectExpenseCategory[index].activities]);
    if(dataValues[dataElements.projectExpenseCategory[index].commodities]) budget += Number(dataValues[dataElements.projectExpenseCategory[index].commodities]);
    if(dataValues[dataElements.projectExpenseCategory[index].cost]) budget += Number(dataValues[dataElements.projectExpenseCategory[index].cost]);

    if(totalProjectBudget[dataElements.projectBudget.name]) variations.push({dataElement:dataElements.projectExpenseCategory[index].variation , value: `${totalProjectBudget[dataElements.projectBudget.name]- budget}`})
    totalBudget.value += budget;
  })

  var difference = {
    dataElement: dataElements.difference,
    value: tei.yearAmount ? `${(tei.yearAmount - totalBudget.value)}` : '0'
  };

  return [
    ...projectNames,
    totalBudget,
    ...variations,
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
  var variation = 0;
  var budgetExpense = 0;
  $(`.textValue`).each((_, el) => value += unformatNumber(el.value));
  const difference = tei.yearAmount - value;

  $(`.totalBudget-total`).val(formatNumberInput(value));

  $(`.difference-total`).val(formatNumberInput(difference)); 
  if(difference >= 0) $(`.difference-total`)[0].style.setProperty('background','#C1E1C1', 'important')
  else $(`.difference-total`)[0].style.setProperty('background','#FAA0A0', 'important')

  
  const personnel =  $(`input[name="personnel-${ids[1]}-${ids[2]}"]`).val();
  const activites =  $(`input[name="activites-${ids[1]}-${ids[2]}"]`).val();
  const commodities =  $(`input[name="commodities-${ids[1]}-${ids[2]}"]`).val();
  const cost =  $(`input[name="cost-${ids[1]}-${ids[2]}"]`).val();

  budgetExpense += unformatNumber(personnel);
  budgetExpense += unformatNumber(activites);
  budgetExpense += unformatNumber(commodities);
  budgetExpense += unformatNumber(cost);

  if(totalProjectBudget[ids[2]]) {
    variation = totalProjectBudget[ids[2]] - budgetExpense;
  } else if(budgetExpense) variation -= budgetExpense;

  $(`input[name="variation-${ids[1]}"]`).val(formatNumberInput(variation));
  if(variation >= 0) {
     document.querySelector(`input[name="variation-${ids[1]}"]`).style.setProperty('background','#C1E1C1', 'important');
    $(`.feedback`).removeClass('d-block').addClass('d-none');
  }
  else {
     document.querySelector(`input[name="variation-${ids[1]}"]`).style.setProperty('background','#FAA0A0', 'important');
    $(`.feedback`).removeClass('d-none').addClass('d-block');
  } 

  pushDataElement( $(`input[name="variation-${ids[1]}"]`)[0].id, variation);
  pushDataElement($(`.totalBudget-total`)[0].id, value);
  pushDataElement($(`.difference-total`)[0].id, difference);
}
function submitProjects() {
  alert("Data Saved Successfully!")
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