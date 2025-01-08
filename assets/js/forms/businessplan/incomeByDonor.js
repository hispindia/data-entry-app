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
          $('.aoc-reporting').show();
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
    tei.programStage = programStage.incomeByDonor;
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

      const dataValues =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,dataElements.year.id) //data vlaues year wise
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

    $("#donor-details").empty();

    let projectRows = displayProjectDetails(dataValues, period);
    $("#donor-details").append(projectRows);

    var totalsRow = displayTotals(dataValues, period);
    $("#totals").empty();
    $("#totals").append(totalsRow);
    
      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues, period) {
    var totalsRow = ` <thead><tr><th></th>`;
    for (let year = period.start; year <= period.end; year++) {
      totalsRow += `<th data-i18n="intro.year">${year}</th>`;
    }
    totalsRow += `</thead><tbody><tr><td><strong data-i18n="intro.total_anticipated">Total Anticipated income</strong></td>`;
    for (let year = period.start; year <= period.end; year++) {
      const anticipatedIncome =
        dataValues[year] && dataValues[year][dataElements.anticipatedIncome]
          ?  Number(dataValues[year][dataElements.anticipatedIncome])
          : "";
      totalsRow += `<td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
              $
          </div>
        </div>
          <input type="text"  ${tei.disabled ? 'disabled readonly': ''} value="${anticipatedIncome.toLocaleString()}" id="${dataElements.anticipatedIncome}-${year}" class="form-control totalBudget-${year} currency" disabled>
      </div>
      </td>`;
    }
    totalsRow += `</tr></tbody>`;

    return totalsRow;
  }
  function displayProjectDetails(dataValues, period) {


    var projectRows = `<thead ><tr><th data-i18n="intro.donor_name">Donor name</th>`;
    for (let year = period.start; year <= period.end; year++) {
      projectRows += `<th >${year}</th>`;
    }
    projectRows += `<th data-i18n="intro.grant_description">Brief description of the grant, or notes on its likelihood of success (max 50 words)</th></thead><tbody>`;

    const donors =  checkDonors(dataElements.incomeByDonor, dataValues, period);
    if(donors.length) {
      donors.forEach((_,index) => {
        projectRows += addRow(dataElements.incomeByDonor[index], dataValues, period);
        donorCount++; 
      });

      if(donors.length < dataElements.incomeByDonor.length) {
      projectRows += addRow(dataElements.incomeByDonor[donorCount], dataValues, period);
      donorCount++; 
      }
    } else {
      projectRows += addRow(dataElements.incomeByDonor[0], dataValues, period);
      donorCount++; 
    }
    projectRows += '</tbody>'
    return projectRows;
  }
  function addRow(donor, dataValues, period) {
    var row = `<tr><td><input type="text" ${tei.disabled ? 'disabled readonly': ''} value="${dataValues[period.start] && dataValues[period.start][donor.name]? dataValues[period.start][donor.name]: ""}"  id="${donor.name}" oninput="pushDataElementMultipleYears(this.id,this.value)" class="form-control"></td>`;
   
    var comments = '';
    if(dataValues[period.start] && dataValues[period.start][donor.comments]) {
      comments = dataValues[period.start][donor.comments];
    }

    for (let year = period.start; year <= period.end; year++) {
      const income =
        dataValues[year] && dataValues[year][donor.income]
          ? dataValues[year][donor.income]: "";
      row += `<td>
        <div class="input-group">
          <div class="input-group-prepend">
            <div class="input-group-text">
                $
            </div>
          </div>
            <input type="number" ${tei.disabled ? 'disabled readonly': ''} value="${income}" id="${donor.income}-${year}"  oninput="pushDataElementYear(this.id, this.value); changeTotals('${year}')" class="form-control  input-${year}  currency">
        </div>
        </td>`;
    } 
    row += `<td>
      <textarea class="form-control" ${tei.disabled ? 'disabled readonly': ''} id="${donor.comments}"  oninput="checkWords(this, '${donor.name}');pushDataElementMultipleYears(this.id,this.value)" >${(comments)}</textarea>
      <div class="char-counter form-text text-muted" id="counter${donor.name}">${maxWords -(comments? comments.trim().split(/\s+/).length: 0)} words remaining.</div>
    </td>
  </tr>`
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