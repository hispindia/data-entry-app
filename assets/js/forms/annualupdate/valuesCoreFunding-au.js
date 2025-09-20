import { createEvent, getEvents, getProgramStageEvents, getTEI, pushDataElement } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, unformatNumber, getYears } from "../func.js";

const maxWords = 300;
var donorCount = 0;

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
    } else $(`.trt-users`).hide();
      
    if(user.hideReporting.includes('core')) {
      $('.core-users').show();
    }
    
    if(user.hideReporting.includes('ma')) {
      $('.ma-users').show();
    }

    const years = getYears(tei.year.start, tei.year.end);
    document.getElementById('year-update').innerHTML = years.map(year => `<option value="${year}" ${tei.year.selectedAnnual==year? 'selected': ''}>${year}</option>`).join('');
    if(user.annualYear) document.getElementById('year-update').value = user.annualYear;

    tei.program = program.auIncomeDetails;
    tei.programStage = programStage.auValueAddCoreFunding;

    fetchEvents();    
  }

  async function fetchEvents() {
    tei.year.value = document.getElementById('year-update').value;
    
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program|| enroll.program==program.auProjectDescription 
          );
    
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, {id:tei.year.id,value: tei.year.value});
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

      tei.dataValues =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,{id:tei.year.id,value: tei.year.value}) //data vlaues period wise

        if (!tei.dataValues[tei.year.value]) {
          const data = [
            {
              dataElement: tei.year.id,
              value: tei.year.value,
            },
          ];

          tei.dataValues[tei.year.value] = {
            [tei.year.id]:tei.year.value,
          }
          tei.event = await createEvent(data);
        } else {
          tei.event = tei.dataValues[tei.year.value]["event"];
        }
      populateProgramEvents(tei.dataValues[tei.year.value]);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    donorCount = 0;

    $("#values-coreFunding").empty();

    let projectRows = displayProjectDetails(dataValues);
    $('#values-coreFunding').html(projectRows);
    const content = document.getElementById('values-coreFunding')
    content.addEventListener('input', (ev) => {
      if(ev.target.matches('.textValue')) {
        var { id, value } = ev.target;
          value = value ? unformatNumber(value) : '';
          pushDataElement(id,value);
          ev.target.value = formatNumberInput(value);
          changeTotals();
      }
      if(ev.target.matches('.textContent')) {
        var { id, value } = ev.target;
        pushDataElement(id, value);
      }
    })

    var totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").append(totalsRow);

    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();
    
    // Localize content
    $('body').localize();
  }

  function displayTotals(dataValues) {
    const amountsUnlocked = dataValues[dataElements.amountsUnlocked]
          ?  Number(dataValues[dataElements.amountsUnlocked]) : "";
    var totalsRow = `<tbody>
    <tr>
      <td>
        <strong data-i18n="intro.amount_unlocked">Amount Unlocked</strong>
      </td>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
              $
          </div>
        </div>
          <input type="text" value="${formatNumberInput(amountsUnlocked)}" id="${dataElements.amountsUnlocked}" class="form-control totalBudget currency" disabled>
      </div>
    </td>`;
    totalsRow += `</tr></tbody>`;

    return totalsRow;
  }
  function displayProjectDetails(dataValues) {

    var comments = '';
    if(dataValues[dataElements.valuesCoreFunding.comments]) {
      comments = dataValues[dataElements.valuesCoreFunding.comments];
    }
    var description = `
    <label for="${dataElements.valuesCoreFunding.comments}" data-i18n="intro.value_add_title">
    Briefly describe the value add of the IPPF unrestricted funding towards achieving your strategic priorities for the funding cycle.
    </label>
    <textarea 
    class="form-control-resize textContent" 
    ${tei.disabled ? 'disabled readonly': ''}
    id="${dataElements.valuesCoreFunding.comments}" 
    rows="5" cols="100">${comments}</textarea>
    <div class="char-counter form-text text-muted">
    <span id="counter">${maxWords -(comments? comments.trim().split(/\s+/).length: 0)}</span>
    <span data-i18n="intro.words_remaining">words remaining</span>
    </div>
    <div class="invalid-feedback"> Error here </div>`
    document.getElementById('comments').innerHTML = description;

    $('#comments .textContent').toArray().forEach(el => {
      el.addEventListener("input", (ev) => {
        var { id, value } = ev.target;
        pushDataElement(id, value);
        checkWords(ev.target);
      })
    })
    
    var projectRows = `<thead><tr><th data-i18n="intro.donor_details">Donor Details</th><th style="text-align:center">${tei.year.value}</th>`;
    projectRows += `</thead><tbody id="donor-details">`;

    const donors =  checkDonors(dataElements.valuesCoreFunding.donors, dataValues);
    if(donors.length) {
      donors.forEach((_,index) => {
        projectRows += addRow(dataElements.valuesCoreFunding.donors[index], dataValues);
        donorCount++; 
      });
      for(let rowAdd = 0; rowAdd < 10-donors.length; rowAdd++)  {
      projectRows += addRow(dataElements.valuesCoreFunding.donors[donorCount], dataValues);
      donorCount++; 
      }
      if(donors.length >= 10 && donors.length <=14) {
      projectRows += addRow(dataElements.valuesCoreFunding.donors[donorCount], dataValues);
      donorCount++; 
      }
    } else {
      for(let rowAdd = 0; rowAdd < 10; rowAdd++)  {
      projectRows += addRow(dataElements.valuesCoreFunding.donors[rowAdd], dataValues);
      donorCount++; 
      }
    }
    projectRows += '</tbody>'
    return projectRows;
  }

    document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      $('.loader-container').addClass('d-flex').removeClass('d-none');
      $('.myContainer').hide();
      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents();
    });
});

  function addRow(donor, dataValues) {
    const amountLocked = dataValues && dataValues[donor.amountLocked]
          ? dataValues[donor.amountLocked]: "";
    var row = `<tr>
    <td>
    <input type="text"  ${tei.disabled ? 'disabled readonly': ''} value="${dataValues && dataValues[donor.name]? dataValues[donor.name]: ""}"  id="${donor.name}" class="form-control textContent">
    </td>
    <td>
        <div class="input-group">
          <div class="input-group-prepend">
            <div class="input-group-text">
                $
            </div>
          </div>
            <input type="text" ${tei.disabled ? 'disabled readonly': ''} value="${formatNumberInput(amountLocked)}" id="${donor.amountLocked}" class="form-control  textValue currency">
        </div>
        </td>`;
    row += '</tr>'
    return row;
  }

function checkDonors(donors, values) {
  var prevEmptyNames = [];
  var names= [];
  if(values) {
    donors.forEach(donor => {
      if(values && values[donor.name]) {
        names = [...names, ...prevEmptyNames, values[donor.name]];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      } 
    })
  }
  return names;
}

function changeTotals() {
  var totals = 0;
  $(`.textValue`).each((_,el) => {
      totals += unformatNumber(el.value);
  })
  $('.totalBudget').val(formatNumberInput(totals));
  pushDataElement($('.totalBudget')[0].id, totals);
}

function submitProjects() {
alert("Data Saved Successfully!")
}

$(".plus").click(function (e) {
  e.preventDefault();
  var projectRows = addRow(dataElements.valuesCoreFunding.donors[donorCount], {})
  donorCount++;
  $("#donor-details").append(projectRows);
  // Localize content
  $('body').localize();
});

//textarea word limit
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