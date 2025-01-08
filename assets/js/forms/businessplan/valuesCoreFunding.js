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
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchEvents();
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
        document.getElementById("headerOrgId").value = data.organisationUnits[0]
          .parent
          ? data.organisationUnits[0].parent.name
          : "";
        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;
        document.getElementById("headerOrgCode").value =
          data.organisationUnits[0].code;

        const fpaIndiaButton = document
          .querySelector(".fa-building-o")
          .closest("a");
        if (fpaIndiaButton) {
          const fpaIndiaDiv = fpaIndiaButton.querySelector("div");
          if (fpaIndiaDiv) {
            fpaIndiaDiv.textContent = data.organisationUnits[0].name;
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
    tei.program = program.incomeDetails;
    tei.programStage = programStage.valueAddCoreFunding;
    tei.year = {
      ...tei.year,
      start: dataElements.period.value.split(" - ")[0],
      end: dataElements.period.value.split(" - ")[1],
    };

    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program
        );

      const dataValues =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,dataElements.year.id) //data vlaues period wise
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        if (!dataValues[year]) {
          const data = [
            {
              dataElement: dataElements.year.id,
              value: year,
            },
            {
              dataElement: dataElements.period.id,
              value: dataElements.period.value,
            },
          ];
          dataValues[year] = {
            [dataElements.year.id]:year,
            [dataElements.period.id]: dataElements.period.value,
          }
          tei.event = {
            ...tei.event,
           [year]: await createEvent(data)
          }
        } else {
          tei.event = {
            ...tei.event,
            [year]: dataValues[year]["event"],
          };
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
      start: tei.year.start,
      end: tei.year.end,
    };

    $("#values-coreFunding").empty();

    let projectRows = displayProjectDetails(dataValues, period);
    $("#values-coreFunding").append(projectRows);

    var totalsRow = displayTotals(dataValues, period);
    $("#totals").empty();
    $("#totals").append(totalsRow);
      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues, period) {
    var totalsRow = ` <thead><tr><th></th>`;
    for (let year = period.start; year <= period.end; year++) {
      totalsRow += `<th>${year}</th>`;
    }
    totalsRow += `</thead><tbody><tr><td><strong data-i18n="intro.amount_unlocked">Amount Unlocked</strong></td>`;
    for (let year = period.start; year <= period.end; year++) {
      const amountsUnlocked =
        dataValues[year] && dataValues[year][dataElements.amountsUnlocked]
          ?  Number(dataValues[year][dataElements.amountsUnlocked])
          : "";
      totalsRow += `<td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
              $
          </div>
        </div>
          <input type="text" value="${amountsUnlocked.toLocaleString()}" id="${dataElements.amountsUnlocked}-${year}" class="form-control totalBudget-${year} currency" disabled>
      </div>
      </td>`;
    }
    totalsRow += `</tr></tbody>`;

    return totalsRow;
  }
  function displayProjectDetails(dataValues, period) {

    var comments = '';
    if(dataValues[period.start] && dataValues[period.start][dataElements.valuesCoreFunding.comments]) {
      comments = dataValues[period.start][dataElements.valuesCoreFunding.comments];
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

    var projectRows = `<thead><tr><th data-i18n="intro.donor_details">Donor Details</th>`;
    for (let year = period.start; year <= period.end; year++) {
      projectRows += `<th>${year}</th>`;
    }
    projectRows += `</thead><tbody id="donor-details">`;

    const donors =  checkDonors(dataElements.valuesCoreFunding.donors, dataValues, period);
    if(donors.length) {
      donors.forEach((_,index) => {
        projectRows += addRow(dataElements.valuesCoreFunding.donors[index], dataValues, period);
        donorCount++; 
      });

      if(donors.length < dataElements.valuesCoreFunding.length) {
      projectRows += addRow(dataElements.valuesCoreFunding.donors[donorCount], dataValues, period);
      donorCount++; 
      }
    } else {
      projectRows += addRow(dataElements.valuesCoreFunding.donors[0], dataValues, period);
      donorCount++; 
    }
    projectRows += '</tbody>'
    return projectRows;
  }
  function addRow(donor, dataValues, period) {
    var row = `<tr><td><input type="text" ${tei.disabled ? 'disabled readonly': ''} value="${dataValues[period.start] && dataValues[period.start][donor.name]? dataValues[period.start][donor.name]: ""}"  id="${donor.name}" oninput="pushDataElementMultipleYears(this.id,this.value)" class="form-control"></td>`;
    for (let year = period.start; year <= period.end; year++) {
      const amountLocked =
        dataValues[year] && dataValues[year][donor.amountLocked]
          ? dataValues[year][donor.amountLocked]: "";
      row += `<td>
        <div class="input-group">
          <div class="input-group-prepend">
            <div class="input-group-text">
                $
            </div>
          </div>
            <input type="number" ${tei.disabled ? 'disabled readonly': ''} value="${amountLocked}" id="${donor.amountLocked}-${year}"  oninput="pushDataElementYear(this.id, this.value); changeTotals('${year}')" class="form-control  input-${year}  currency">
        </div>
        </td>`;
    }
    row += '</tr>'
    return row;
  }

  fetchOrganizationUnitUid();
});

function checkDonors(donors, values, period) {
  var prevEmptyNames = [];
  var names= [];
  if(values) {
    donors.forEach(donor => {
      if(values[period.start] && values[period.start][donor.name]) {
        names = [...names, ...prevEmptyNames, values[period.start][donor.name]];
        prevEmptyNames = [];
      } else {
        prevEmptyNames.push('');
      } 
    })
  }
  return names;
}