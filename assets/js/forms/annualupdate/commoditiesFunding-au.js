import { createEvent, getEvents, getProgramStageEvents, getTEI } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears } from "../func.js";

 const maxWords = 200
 var eventPD = '';
 var commoditiesEC={};
 
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
    document.getElementById('year-update').innerHTML = years.map(year => tei.hideYears.includes(year) ? `<option value="${year}">${year}</option>`: '').join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.auCommodities;
    tei.programStage = programStage.auCommoditiesSource;

    fetchEvents();    
  }

  async function fetchEvents() {
    tei.year.value = document.getElementById('year-update').value;
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;
      
      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program  ||  enroll.program == program.auProjectExpenseCategory ||  enroll.program == program.auProjectDescription
      );

      const dataValuesEC =  getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory,tei.year.id) //data vlaues period wise
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        if(dataValuesEC && dataValuesEC[year]) {
          commoditiesEC[year] = calculateExpenseCategory(dataValuesEC, year);
        }
      }
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  tei.year.id);
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value]['event']) eventPD =dataValuesPD[tei.year.value]['event']
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      
      tei.dataValues =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,tei.year.id) //data vlaues period wise
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        if (!tei.dataValues[year]) {
          const data = [
            {
              dataElement: tei.year.id,
              value: year,
            }
          ];
          tei.dataValues[year] = {
            [tei.year.id]:year,
          }
          tei.event = {
            ...tei.event,
           [year]: await createEvent(data)
          }
          } else {
            tei.event = {
              ...tei.event,
              [year]: tei.dataValues[year]["event"]
            }
        }
      }
      
      populateProgramEvents(tei.dataValues);
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
    
    $('#push-button').empty();
    console.trace("-----")
    // if(window.localStorage.getItem("hideReporting").includes('ed')) {
    //   $('#push-button').append(`<button ${tei.disabled ? 'disabled readonly': ''} class="btn btn-success p-2 my-2" onclick="event.preventDefault();disableAnnualUpdate()">Submit Annual Update ${tei.year.value}</button>`)
    // }
    // if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
    //   $('#push-button').append(`<button ${tei.disabled ? 'disabled readonly': ''} class="btn btn-success p-2 my-2" onclick="event.preventDefault();enableAnnualUpdate()">Reopen Annual Update ${tei.year.value}</button>`)
    // }
    if(window.localStorage.getItem("hideReporting").includes('ed')) {
      $('#push-button').append(`<button ${tei.disabled ? 'disabled readonly': ''} class="btn btn-success p-2 my-2" onclick="event.preventDefault();disableAnnualUpdate()">Submit Annual Update ${tei.year.value}</button>`)
    }
    if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
      $('#push-button').append(`<button ${tei.disabled ? 'disabled readonly': ''} class="btn btn-success p-2 my-2" onclick="event.preventDefault();enableAnnualUpdate()">Reopen Annual Update ${tei.year.value}</button>`)
    }

    $("#accordion").empty();

    let projectRows = displaySourceCommodities(dataValues, period);
    $("#accordion").append(projectRows);

    var totalsRow = displayTotals(dataValues, period);
    $('#totals').empty();
    $('#totals').append(totalsRow);
    
      // Localize content
      $('body').localize();
           
  }

  function displayTotals(dataValues, period) {
    var totalsRow = '';
    for (let year = period.start;year <= period.end; year++) {
      const unrestrictedValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['unrestricted']]) ?  Number(dataValues[year][dataElements.sourceCommodities['unrestricted']]) : '';
      const internationalValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['international']]) ?  Number(dataValues[year][dataElements.sourceCommodities['international']]) : '';
      const localValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['local']]) ?  Number(dataValues[year][dataElements.sourceCommodities['local']]) : '';
      const inkindValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['inkind']]) ?  Number(dataValues[year][dataElements.sourceCommodities['inkind']]) : '';
      const otherValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['other']]) ?  Number(dataValues[year][dataElements.sourceCommodities['other']]) : '';
      const commodities = Number(unrestrictedValue) + Number(internationalValue) + Number(localValue) + Number(inkindValue) + Number(otherValue);
     
      var variation = 0;
      if(commoditiesEC[year]) variation = commoditiesEC[year]-commodities;
      else if(commodities) variation = -commodities;
      totalsRow += `
            <tr>
        <td>${year}</td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" 
            id="${dataElements.sourceCommodities['commodities']}-${year}" 
            class="form-control total-${year} currency" 
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
            <input type="text" value="${commoditiesEC[year] ? formatNumberInput(Math.round(commoditiesEC[year])) : ''}" class="form-control currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="background:${variation >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" value="${formatNumberInput(Math.round(variation))}" id="${dataElements.sourceCommodities['variation']}-${year}" class="form-control difference-${year} currency" disabled readonly>
          </div>
        </td>
      </tr>
      `;
    }
    return totalsRow;
  }

  function displaySourceCommodities(dataValues, period) {

    var totalsRow = '';
    for (let year = period.start;year <= period.end; year++) {
      const unrestrictedValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['unrestricted']]) ?  Number(dataValues[year][dataElements.sourceCommodities['unrestricted']]) : '';
      const internationalValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['international']]) ?  Number(dataValues[year][dataElements.sourceCommodities['international']]) : '';
      const localValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['local']]) ?  Number(dataValues[year][dataElements.sourceCommodities['local']]) : '';
      const inkindValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['inkind']]) ?  Number(dataValues[year][dataElements.sourceCommodities['inkind']]) : '';
      const otherValue = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['other']]) ?  Number(dataValues[year][dataElements.sourceCommodities['other']]) : '';
      const total = Number(unrestrictedValue) + Number(internationalValue) + Number(localValue) + Number(inkindValue) + Number(otherValue);
     
      totalsRow += `<tr>
          <td><strong>${year}</strong></td>
          <td>
              <div class="input-group">
                  <div class="input-group-prepend">
                      <div class="input-group-text">
                          $
                      </div>
                  </div>
                  <input type="text" 
                  ${tei.disabled ? 'disabled readonly': ''} 
                  ${tei.disabledYear[year] ? 'disabled':''} 
                  id="${dataElements.sourceCommodities['unrestricted']}-${year}" 
                  class="input-${year} form-control"
                  value="${formatNumberInput(unrestrictedValue)}"
                  oninput="formatNumberInput(this);pushDataElementYear(this.id,unformatNumber(this.value));calculateTotals(${year})">
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
                  ${tei.disabledYear[year] ? 'disabled':''} 
                  id="${dataElements.sourceCommodities['international']}-${year}" 
                  class="input-${year} form-control"
                  value="${formatNumberInput(internationalValue)}"
                  oninput="formatNumberInput(this);pushDataElementYear(this.id,unformatNumber(this.value));calculateTotals(${year})">
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
                  ${tei.disabledYear[year] ? 'disabled':''} 
                  id="${dataElements.sourceCommodities['local']}-${year}" 
                  class="input-${year} form-control"
                  value="${formatNumberInput(localValue)}"
                  oninput="formatNumberInput(this);pushDataElementYear(this.id,unformatNumber(this.value));calculateTotals(${year})">
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
                  ${tei.disabledYear[year] ? 'disabled':''} 
                  id="${dataElements.sourceCommodities['inkind']}-${year}" 
                  class="input-${year} form-control"
                  value="${formatNumberInput(inkindValue)}" 
                  oninput="formatNumberInput(this);pushDataElementYear(this.id,unformatNumber(this.value));calculateTotals(${year})">
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
                  ${tei.disabledYear[year] ? 'disabled':''} 
                  id="${dataElements.sourceCommodities['other']}-${year}" 
                  class="input-${year} form-control"
                  value="${formatNumberInput(otherValue)}"
                  oninput="formatNumberInput(this);pushDataElementYear(this.id,unformatNumber(this.value));calculateTotals(${year})">
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
                  id="${dataElements.sourceCommodities['total']}-${year}" 
                  class="total-${year} form-control"
                  value="${formatNumberInput(total)}"
                  disabled>
              </div>
          </td>
      </tr>
      <tr>
          <td></td>
          <td colspan="6">
              <div class="form-group textbox-wrap">
  
                  <textarea class="form-control textlimit"
                  ${tei.disabled ? 'disabled readonly': ''} 
                  ${tei.disabledYear[year] ? 'disabled':''} 
                  id="${dataElements.sourceCommodities['comment']}-${year}" 
                  oninput="pushDataElementYear(this.id,this.value);checkWords(this, ${year})">${(dataValues[year] && dataValues[year][dataElements.sourceCommodities['comment']] ? dataValues[year][dataElements.sourceCommodities['comment']]: '')}</textarea>
                  <div class="char-counter form-text text-muted"
                      id="counter-${year}">${maxWords- (dataValues[year] && dataValues[year][dataElements.sourceCommodities['comment']] ? dataValues[year][dataElements.sourceCommodities['comment']].trim().split(/\s+/).length: 0)} words remaining</div>
  
                  <div class="invalid-feedback"> Error here
                  </div>
              </div>
          </td>
      </tr>`
    }
    return totalsRow;
  }
  configurePage();
});


function disableAnnualUpdate() {
  alert('Annual Update Submitted Successfully!');
  if(eventPD) pushDataElementOther(dataElements.submitAnnualUpdate,true, program.auProjectDescription, programStage.auProjectDescription, eventPD)
}

function enableAnnualUpdate() {
  alert('Annual Update Reopened Successfully!');
  if(eventPD) pushDataElementOther(dataElements.submitAnnualUpdate,false, program.auProjectDescription, programStage.auProjectDescription, eventPD)
}

function calculateTotals(year) {
  var totals = 0;
  $(`.input-${year}`).each(function() {
    totals += unformatNumber($(this).val());
  })
  $(`.total-${year}`).val(formatNumberInput(totals));

  $(`.total-${year}`).each(function() {
    pushDataElementYear(this.id, totals);
  })
}
function calculateExpenseCategory(dataValues, year) {
  var value = 0;
  dataElements.projectExpenseCategory.forEach(de => {
    if(dataValues[year] && dataValues[year][de.commodities]) {
      value += Number(dataValues[year][de.commodities]);
    }
  })
  return value ? value: 0;
}
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
    
  function submitProjects() {
      alert("Data Saved Successfully!")
  }