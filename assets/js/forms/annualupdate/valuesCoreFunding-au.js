import { getEvents, getProgramStageEvents, getTEI, pushDataElementYear } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears } from "../func.js";

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


 
    document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      window.localStorage.setItem("annualYear", ev.target.value);
      fetchEvents()
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
    
          const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, tei.year.id);
          if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
    

      tei.dataValues =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,tei.year.id) //data vlaues period wise

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
          tei.event = {
            ...tei.event,
           [tei.year.value]: await createEvent(data)
          }
        } else {
          tei.event = {
            ...tei.event,
            [tei.year.value]: tei.dataValues[tei.year.value]["event"],
          };
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
    $("#values-coreFunding").append(projectRows);

    var totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    
      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues) {
    const amountsUnlocked =dataValues[dataElements.amountsUnlocked]
          ?  Number(dataValues[dataElements.amountsUnlocked]) : "";
    var totalsRow = ` <tbody>
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
    class="form-control-resize textlimit" 
    ${tei.disabled ? 'disabled readonly': ''}
    id="${dataElements.valuesCoreFunding.comments}" 
    onchange="checkWords(this, '1');pushDataElementMultipleYears(this.id,this.value)"  
    rows="5" cols="100">${comments}</textarea>
    <div class="char-counter form-text text-muted" id="counter1">
    ${maxWords -(comments? comments.trim().split(/\s+/).length: 0)} words remaining.
    </div>
    <div class="invalid-feedback"> Error here </div>`
    document.getElementById('comments').innerHTML = description;

    var projectRows = `<thead><tr><th data-i18n="intro.donor_details">Donor Details</th><th>${tei.year.value}</th>`;
    projectRows += `</thead><tbody id="donor-details">`;

    const donors =  checkDonors(dataElements.valuesCoreFunding.donors, dataValues);
    if(donors.length) {
      donors.forEach((_,index) => {
        projectRows += addRow(dataElements.valuesCoreFunding.donors[index], dataValues);
        donorCount++; 
      });

      if(donors.length < dataElements.valuesCoreFunding.length) {
      projectRows += addRow(dataElements.valuesCoreFunding.donors[donorCount], dataValues);
      donorCount++; 
    }
    } else {
      projectRows += addRow(dataElements.valuesCoreFunding.donors[0], dataValues);
      donorCount++; 
    }
    projectRows += '</tbody>'
    return projectRows;
  }
  function addRow(donor, dataValues) {
    const amountLocked = dataValues && dataValues[donor.amountLocked]
          ? dataValues[donor.amountLocked]: "";
    var row = `<tr>
    <td>
    <input type="text" value="${dataValues && dataValues[donor.name]? dataValues[donor.name]: ""}"  id="${donor.name}" oninput="pushDataElementMultipleYears(this.id,this.value)" class="form-control">
    </td>
    <td>
        <div class="input-group">
          <div class="input-group-prepend">
            <div class="input-group-text">
                $
            </div>
          </div>
            <input type="text" ${tei.disabled ? 'disabled readonly': ''} value="${formatNumberInput(amountLocked)}" id="${donor.amountLocked}"  oninput="formatNumberInput(this);pushDataElementYear(this.id, unformatNumber(this.value)); changeTotals('')" class="form-control  input currency">
        </div>
        </td>`;
    row += '</tr>'
    return row;
  }

  configurePage();
});

function checkDonors(donors, values, period) {
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

function changeTotals(year) {
  var totals = 0;
  document.querySelectorAll(`.input-${year}`).forEach(ev => {
      totals += unformatNumber(ev.value);
  })
  $(`.totalBudget-${year}`).val(formatNumberInput(totals));
  pushDataElementYear($(`.totalBudget-${year}`)[0].id, totals)
}

function submitProjects() {
alert("Data Saved Successfully!")
}
$(".plus").click(function (e) {
            e.preventDefault();
            var projectRows = `<tr><td><input type="text" value="" id='${dataElements.valuesCoreFunding.donors[donorCount].name}' oninput="pushDataElementMultipleYears(this.id,this.value)" class="form-control"></td>`;
                projectRows += `<td>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                    $
                    </div>
                  </div>
                    <input type="number" value="" ${tei.disabledYear[tei.year.value] ? 'disabled':''} id='${dataElements.valuesCoreFunding.donors[donorCount].amountLocked}-${tei.year.value}' oninput="formatNumberInput(this);pushDataElementYear(this.id, unformatNumber(this.value)); changeTotals('')"  class="form-control input currency">
                </div>
                </td></tr>`

            donorCount++;
            $("#donor-details").append(projectRows);
      // Localize content
      $('body').localize();
        });

        $(".minus").click(function (e) {
            e.preventDefault();
            
            if (donorCount > 1) {
                donorCount--;
                const incomeByDonor = dataElements.valuesCoreFunding.donors[donorCount];
                $("#donor-details tr:last").remove();
                for (let year = tei.year.start; year <= tei.year.end; year++) {
                pushDataElementYear(`${incomeByDonor.name}-${year}`, '');
                pushDataElementYear(`${incomeByDonor.amountLocked}-${year}`, '');
                changeTotals(year);
                }
            }
        });
        
        //textarea word limit
        function checkWords(event, count) {
            const counter = document.getElementById('counter' + (count));
            const { value } = event;
            const words = value.trim().split(/\s+/)

            if (words.length >= maxWords) {
                event.value = words.slice(0, maxWords).join(' ');
                return
            }
            if (value) counter.textContent = `${(maxWords - words.length)} words remaining`;
            else counter.textContent = `${maxWords} words remaining`;
        }