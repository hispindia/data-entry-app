 const maxWords = 200
 const commoditiesEC={};
 
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
      fetchOrganizationUnitUid()
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

        const userConfig = userConfig()
        tei.disabled = userConfig.disabled;
        window.localStorage.setItem('hideReporting', userConfig.disabledValues);
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
    tei.program = program.auCommodities;
    tei.programStage = programStage.auCommoditiesSource;
    dataElements.period.value = document.getElementById("headerPeriod").value;

    tei.year = {
      ...tei.year,
      start:dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      annualReportTEI = data.trackedEntityInstances[0];
      
      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program  ||  enroll.program == program.projectExpenseCategory 
      );

      const dataValuesEC =  getProgramStageEvents(filteredPrograms, programStage.projectExpenseCategory, program.projectExpenseCategory,dataElements.year.id) //data vlaues period wise
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        if(dataValuesEC && dataValuesEC[year]) {
          commoditiesEC[year] = calculateExpenseCategory(dataValuesEC, year);
        }
      }
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
              [year]: dataValues[year]["event"]
            }
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
    
    $('#push-button').empty();
    $('#push-button').append(`<button ${tei.disabled ? 'disabled readonly': ''} class="btn btn-success p-2 my-2" onclick="event.preventDefault();pushToAnnualReport()">Submit Business Plan</button>`)
     
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
      const commodities = (dataValues[year] && dataValues[year][dataElements.sourceCommodities['commodities']]) ?  Number(dataValues[year][dataElements.sourceCommodities['commodities']]) : '';
      const variation = commoditiesEC[year] ? commoditiesEC[year]-commodities: 0;
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
            value="${commodities.toLocaleString()}" 
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
            <input type="text" value="${commoditiesEC[year] ? Math.round(commoditiesEC[year]).toLocaleString() : ''}" class="form-control currency" disabled readonly>
          </div>
        </td>
        <td>
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                $
              </div>
            </div>
            <input type="text" style="background:${variation >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}" value="${Math.round(variation).toLocaleString()}" id="${dataElements.sourceCommodities['variation']}-${year}" class="form-control difference-${year} currency" disabled readonly>
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
                  id="${dataElements.sourceCommodities['unrestricted']}-${year}" 
                  class="input-${year} form-control"
                  value="${unrestrictedValue}"
                  oninput="pushDataElementYear(this.id,this.value);calculateTotals(${year})">
                  ${tei.disabled ? 'disabled readonly': ''} 
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
                  id="${dataElements.sourceCommodities['international']}-${year}" 
                  class="input-${year} form-control"
                  value="${internationalValue}"
                  oninput="pushDataElementYear(this.id,this.value);calculateTotals(${year})"
                  ${tei.disabled ? 'disabled readonly': ''} >
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
                  id="${dataElements.sourceCommodities['local']}-${year}" 
                  class="input-${year} form-control"
                  value="${localValue}"
                  oninput="pushDataElementYear(this.id,this.value);calculateTotals(${year})"
                  ${tei.disabled ? 'disabled readonly': ''} >
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
                  id="${dataElements.sourceCommodities['inkind']}-${year}" 
                  class="input-${year} form-control"
                  value="${inkindValue}" 
                  oninput="pushDataElementYear(this.id,this.value);calculateTotals(${year})"
                  ${tei.disabled ? 'disabled readonly': ''} >
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
                  id="${dataElements.sourceCommodities['other']}-${year}" 
                  class="input-${year} form-control"
                  value="${otherValue}"
                  oninput="pushDataElementYear(this.id,this.value);calculateTotals(${year})"
                  ${tei.disabled ? 'disabled readonly': ''} >
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
                  value="${total}"
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
  fetchOrganizationUnitUid();
});


function pushToAnnualReport() {
  eventPushBPtoAU(annualReportTEI);
}

function calculateTotals(year) {
  var totals = 0;
  $(`.input-${year}`).each(function() {
    totals += Number($(this).val());
  })
  $(`.total-${year}`).val(totals.toLocaleString());

  $(`.total-${year}`).each(function() {
    pushDataElementYear(this.id, totals);
  })
  pushDataElementYear()
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