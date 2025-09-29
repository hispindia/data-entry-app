import { dataSet } from "../../api/dataSet.js";
import { getEvents, getProgramStageEvents, getTEI, pushDataElementOther } from "../../api/func.js";
import { dataElements, dataSetQuantity, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears, unformatNumber } from "../func.js";

 const maxWords = 200
 var eventPD = '';
 var commoditiesEC='';
 
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
      tei.disabledYear = {};
      for(let year=tei.year.start; year <=tei.year.end; year++) {
        if(year<ev.target.value)  tei.disabledYear[year] = true;
      }
      $('.loader-container').addClass('d-flex').removeClass('d-none');
      $('.myContainer').hide();

      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents();
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
    document.getElementById('year-update').innerHTML =years.map(year => `<option value="${year}" ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    fetchEvents();    
  }
    async function fetchDataSet(year) {
      const values = {};
      
      const dataValuesQuantity = await dataSet.getValues(dataSetQuantity, tei.orgUnit, year);
      dataValuesQuantity.dataValues.forEach(dv => values[dv.dataElement] = dv.value);
  
      return values;
    }

  async function fetchEvents() {
    tei.year.value = document.getElementById('year-update').value;
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;
      
      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == program.auProjectExpenseCategory ||  enroll.program == program.auProjectDescription
      );

      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  {id: tei.year.id, value: tei.year.value});
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value]['event']) eventPD =dataValuesPD[tei.year.value]['event']
      if (dataValuesPD[tei.year.value]) {
        tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[tei.year.value]);
      }
      const dataValuesEC =  getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, {id: tei.year.id, value: tei.year.value})//data vlaues period wise
        if(dataValuesEC && dataValuesEC[tei.year.value] && tei.projects.length) {
          commoditiesEC = calculateExpenseCategory(dataValuesEC[tei.year.value], tei.projects);
        }

      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;
      
      tei.dataValues = await fetchDataSet(tei.year.value);

      populateProgramEvents(tei.dataValues);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    
    $('#push-button').empty();

    if(window.localStorage.getItem("hideReporting").includes('ed')) {
      const btn = document.createElement("button");
      btn.innerHTML = `<span data-i18n="intro.submit_business_plan">Submit Business Plan </span> ${tei.year.value}`;
      btn.classList.add("btn", "btn-success", "p-2", "m-2");
      if(tei.disabled) btn.setAttribute("disabled", "true");
      btn.addEventListener("click", async(event) => {
      event.preventDefault(); 
      if(eventPD) await pushDataElementOther(dataElements.submitAnnualUpdate,true, program.auProjectDescription, programStage.auProjectDescription, eventPD);
      alert('Annual Update Submitted Successfully!');
      });
      $('#push-button').append(btn);
    }
    if(window.localStorage.getItem("hideReporting").includes('aoc')) {
      const btn = document.createElement("button");
      btn.innerHTML = `<span data-i18n="intro.reopen_business_plan">Reopen Business Plan </span> ${tei.year.value}`;
      btn.classList.add("btn", "btn-success", "p-2", "m-2");
      btn.addEventListener("click", async(event) => {
        event.preventDefault(); 
        if(eventPD) await pushDataElementOther(dataElements.submitAnnualUpdate,'', program.auProjectDescription, programStage.auProjectDescription, eventPD);
        alert('Annual Update Reopened Successfully!');
      });
      $('#push-button').append(btn);
    }

    $("#accordion").empty();

    let projectRows = displaySourceCommodities(dataValues);
    $("#accordion").html(projectRows);
    $('#accordion .textValue').toArray().forEach(el => {
      el.addEventListener("input", async (ev) => {
        var { id, value } = ev.target;
        ev.target.value = formatNumberInput(value);
        await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement: id, value: unformatNumber(value)});
        calculateTotals();
      })
    });
    $('#accordion .textlimit').toArray().forEach(el => {
      el.addEventListener("input", async (ev) => {
        var { id, value } = ev.target;
        await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement: id, value: value});
        checkWords(ev.target);
      })
    })
    var totalsRow = displayTotals(dataValues);
    $('#totals').empty();
    $('#totals').append(totalsRow);
    
    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();
      // Localize content
      $('body').localize();
           
  }

  function displayTotals(dataValues) {
    var totalsRow = '';
      const unrestrictedValue = (dataValues[dataElements.sourceCommodities['unrestricted']]) ?  Number(dataValues[dataElements.sourceCommodities['unrestricted']]) : '';
      const internationalValue = (dataValues[dataElements.sourceCommodities['international']]) ?  Number(dataValues[dataElements.sourceCommodities['international']]) : '';
      const localValue = (dataValues[dataElements.sourceCommodities['local']]) ?  Number(dataValues[dataElements.sourceCommodities['local']]) : '';
      const inkindValue = (dataValues[dataElements.sourceCommodities['inkind']]) ?  Number(dataValues[dataElements.sourceCommodities['inkind']]) : '';
      const otherValue = (dataValues[dataElements.sourceCommodities['other']]) ?  Number(dataValues[dataElements.sourceCommodities['other']]) : '';
      const commodities = Number(unrestrictedValue) + Number(internationalValue) + Number(localValue) + Number(inkindValue) + Number(otherValue);
     
      var variation = 0;
      if(commoditiesEC) variation = commoditiesEC-commodities;
      else if(commodities) variation = -commodities;
      totalsRow += `
            <tr>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" 
            id="${dataElements.sourceCommodities['commodities']}" 
            class="form-control total currency" 
            value="${formatNumberInput(commodities)}" 
            disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" value="${commoditiesEC ? formatNumberInput(Math.round(commoditiesEC)) : ''}" class="form-control currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="background:${variation >= 0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" value="${formatNumberInput(Math.round(variation))}" id="${dataElements.sourceCommodities['variation']}" class="form-control difference currency" disabled readonly>
          </div>
        </td>
      </tr>
      `;
    
    return totalsRow;
  }

  function displaySourceCommodities(dataValues) {

    var totalsRow = '';
      const unrestrictedValue = (dataValues[dataElements.sourceCommodities['unrestricted']]) ?  Number(dataValues[dataElements.sourceCommodities['unrestricted']]) : '';
      const internationalValue = (dataValues[dataElements.sourceCommodities['international']]) ?  Number(dataValues[dataElements.sourceCommodities['international']]) : '';
      const localValue = (dataValues[dataElements.sourceCommodities['local']]) ?  Number(dataValues[dataElements.sourceCommodities['local']]) : '';
      const inkindValue = (dataValues[dataElements.sourceCommodities['inkind']]) ?  Number(dataValues[dataElements.sourceCommodities['inkind']]) : '';
      const otherValue = (dataValues[dataElements.sourceCommodities['other']]) ?  Number(dataValues[dataElements.sourceCommodities['other']]) : '';
      const total = Number(unrestrictedValue) + Number(internationalValue) + Number(localValue) + Number(inkindValue) + Number(otherValue);
     
      totalsRow += `<tr>
          <td>
              <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">
                          $
                      </div>
                  </div>
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['unrestricted']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(unrestrictedValue)}"
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
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['international']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(internationalValue)}"
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
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['local']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(localValue)}"
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
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['inkind']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(inkindValue)}" 
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
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['other']}" 
                  class="form-control textValue"
                  value="${formatNumberInput(otherValue)}"
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
                  <input type="text" 
                  id="${dataElements.sourceCommodities['total']}" 
                  class="total form-control"
                  value="${formatNumberInput(total)}"
                  disabled>
              </div>
          </td>
      </tr>
      <tr>
          <td colspan="12">
              <div class="form-group textbox-wrap">
  
                  <textarea class="form-control textlimit"
                  ${tei.disabled ? 'disabled readonly': ''} 
                  id="${dataElements.sourceCommodities['comment']}" >${(dataValues[dataElements.sourceCommodities['comment']] ? dataValues[dataElements.sourceCommodities['comment']]: '')}</textarea>
                  <div class="char-counter form-text text-muted">
                    <span id="counter">${maxWords- (dataValues[dataElements.sourceCommodities['comment']] ? dataValues[dataElements.sourceCommodities['comment']].trim().split(/\s+/).length: 0)}</span>
                    <span data-i18n="intro.words_remaining">words remaining</span>
                    </div>
  
                  <div class="invalid-feedback"> Error here
                  </div>
              </div>
          </td>
      </tr>`

    return totalsRow;
  }
  configurePage();
});


async function calculateTotals() {
  var totals = 0;
  $(`.textValue`).each((_, de) => {
    totals += unformatNumber($(`#${de.id}`).val());
  })
  $(`.total`).val(formatNumberInput(totals));
  await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement:  dataElements.sourceCommodities['total'], value: totals});
  await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement:  $('.difference')[0].id, value: commoditiesEC-totals});
}

function calculateExpenseCategory(dataValues, projects) {
  var value = 0;
  dataElements.projectExpenseCategory.forEach((de, index) => {
    if(dataValues[de.commodities] && projects[index]) {
      value += Number(dataValues[de.commodities]);
    }
  })
  return value ? value: 0;
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
 function checkWords(event) {
      const counter = document.getElementById('counter');
      const { value } = event;
      const words = value.trim().split(/\s+/)

      if (words.length >= maxWords) {
        event.value = words.slice(0, maxWords).join(' ');
        return
      }
      if (value) counter.textContent = `${(maxWords - words.length)} words remaining`;
      else counter.textContent = `${maxWords} words remaining`;
    }
    
  function submitProjects() {
      alert("Data Saved Successfully!")
  }