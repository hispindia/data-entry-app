import { getEvents, getProgramStageEvents, getTEI, pushDataElementYear } from "../../api/func.js";
import { dataElements, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears } from "../func.js";

const maxWords = 50;
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

    tei.program = program.auIncomeDetails;
    tei.programStage = programStage.auIncomeByDonor;

    fetchEvents();    
  }

  async function fetchEvents() {
    tei.year.value = document.getElementById('year-update').value;
    
    const data = await getTEI(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program || enroll.program==program.auProjectDescription 
          );
    
      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  tei.year.id);
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
    
      tei.dataValues =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,tei.year.id) //data vlaues year wise
      
        if (!tei.dataValues[tei.year.value]) {
          const data = [
            {
              dataElement: tei.year.id,
              value: year,
            },
          ];
          tei.dataValues[tei.year.value] = {
            [tei.year.id]:year,
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
      
      populateProgramEvents(tei.dataValues)[tei.year.value];
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataValues) {
    donorCount = 0;
    $("#donor-details").empty();

    let projectRows = displayProjectDetails(dataValues);
    $("#donor-details").append(projectRows);

    var totalsRow = displayTotals(dataValues);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    
      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues) {
    var totalsRow = `</thead><tbody><tr>
    <td><strong data-i18n="intro.total_anticipated">Total Anticipated income</strong></td>`;
   
      const anticipatedIncome = dataValues[dataElements.anticipatedIncome]
          ? Number(dataValues[dataElements.anticipatedIncome])
          : "";
      totalsRow += `<td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
              $
          </div>
        </div>
          <input type="text" value="${formatNumberInput(anticipatedIncome)}" id="${dataElements.anticipatedIncome}" class="form-control totalBudget currency" disabled>
      </div>
      </td>`;

    totalsRow += `</tr></tbody>`;

    return totalsRow;
  }
  function displayProjectDetails(dataValues, period) {
    var projectRows = `<thead><tr>
    <th data-i18n="intro.donor_name">Donor name</th>
    <th>${tei.year.value}</th>
    <th data-i18n="intro.grant_description">Brief description of the grant, or notes on its likelihood of success (max 50 words)
    </th>
    </thead>
    <tbody>`;
    const donors =  checkDonors(dataElements.incomeByDonor, dataValues);
    if(donors.length) {
      donors.forEach((_,index) => {
        projectRows += addRow(dataElements.incomeByDonor[index], dataValues);
        donorCount++; 
      });
      if(donors.length < dataElements.incomeByDonor.length) {
        projectRows += addRow(dataElements.incomeByDonor[donorCount], dataValues);
        donorCount++; 
      }
    } else {
      projectRows += addRow(dataElements.incomeByDonor[0], dataValues);
      donorCount++; 
    }
    projectRows += '</tbody>'
    return projectRows;
  }
  function addRow(donor, dataValues) {
    var row = `<tr><td><input type="text" ${tei.disabled ? 'disabled readonly': ''} value="${ dataValues[donor.name]? dataValues[donor.name]: ""}"  id="${donor.name}" oninput="pushDataElementMultipleYears(this.id,this.value)" class="form-control"></td>`;

    var comments = '';
    if(dataValues[donor.comments]) {
      comments = dataValues[donor.comments];
    }

      const income =dataValues[donor.income]
          ?dataValues[donor.income]: "";
      row += `<td>
        <div class="input-group">
          <div class="input-group-prepend">
            <div class="input-group-text">
                $
            </div>
          </div>
            <input type="text" ${tei.disabled ? 'disabled readonly': ''} value="${formatNumberInput(income)}" id="${donor.income}"  oninput="formatNumberInput(this);pushDataElementYear(this.id, unformatNumber(this.value)); changeTotals('')" class="form-control currency">
        </div>
        </td>
        <td>
      <textarea class="form-control" ${tei.disabled ? 'disabled readonly': ''} id="${donor.comments}"  oninput="checkWords(this, '${donor.name}');pushDataElementMultipleYears(this.id,this.value)" >${(comments)}</textarea>
      <div class="char-counter form-text text-muted" id="counter${donor.name}">${maxWords -(comments? comments.trim().split(/\s+/).length: 0)} words remaining.</div>
    </td>
  </tr>
  </tr>`
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
            var projectRows = `<tr><td><input type="text" value="" id='${dataElements.incomeByDonor[donorCount].name}' oninput="pushDataElementMultipleYears(this.id,this.value)" class="form-control"></td>`;
                projectRows += `<td>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                    $
                    </div>
                  </div>
                    <input type="text" value="" id='${dataElements.incomeByDonor[donorCount].income}' oninput="formatNumberInput(this);pushDataElementYear(this.id,unformatNumber(this.value)); changeTotals('')"  class="form-control currency">
                </div>
                </td>`;
            
            projectRows += '</tr>'

            donorCount++;
            $("#donor-details tbody").append(projectRows);
            
      // Localize content
      $('body').localize();
        });

        $(".minus").click(function (e) {
            e.preventDefault();
            if (donorCount > 1) {
                donorCount--;
                const incomeByDonor = dataElements.incomeByDonor[donorCount];
                $("#donor-details tbody tr:last").remove();
                for (let year = tei.year.start; year <= tei.year.end; year++) {
                    pushDataElementYear(`${incomeByDonor.name}-${year}`, '');
                    pushDataElementYear(`${incomeByDonor.income}-${year}`, '');
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