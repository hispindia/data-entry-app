
var totalProjectBudget = [];
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

  document
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchEvents()
    });

    document
      .getElementById("year-update")
      .addEventListener("change", function (ev) {
        tei.disabledYear = {};
        for(let year=tei.year.start; year <=tei.year.end; year++) {
          if(year<ev.target.value)  tei.disabledYear[year] = true;
        }
          window.localStorage.setItem("annualYear", ev.target.value);
        populateProgramEvents(tei.dataValues);
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
            
            const userDisabled = data.userGroups.find(group => disabledUserGroups.includes(group.id));
            const trtUserDisabled = data.userGroups.find(group => disabledTRTUserGroups.includes(group.id));
            if(userDisabled || trtUserDisabled) {
                tei.disabled = true;
            } 
            let disabledValues = '';
            if(!userDisabled) {
                disabledValues += 'aoc'
            }
            if(!trtUserDisabled) {
                disabledValues += 'trt'
            }
            window.localStorage.setItem('hideReporting', disabledValues);
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
    tei.projects = [];
    dataElements.period.value = document.getElementById("headerPeriod").value;
    tei.program = program.auProjectExpenseCategory;
    tei.programStage = programStage.auProjectExpenseCategory;
    tei.year = {
      ...tei.year,
      start:dataElements.period.value.split(' - ')[0],
      end: dataElements.period.value.split(' - ')[1]
    }
    
    var yearOptions = '';
    tei.disabledYear = {};
    var annualYear = window.localStorage.getItem("annualYear");
    for(let year=tei.year.start; year <=tei.year.end; year++) {
      if(tei.hideYears.includes(year))  tei.disabledYear[year] = true;
      if(tei.hideYears.includes(year)) continue;
      yearOptions += `<option value="${year}">${year}</option>`;
    }
    document.getElementById('year-update').innerHTML = yearOptions;
    document.getElementById('year-update').options[0].selected = true;
    if(annualYear) document.getElementById('year-update').value = annualYear;
    
    const year = document.getElementById("year-update").value;
   
    const data = await events.get(tei.orgUnit);

    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
      data.trackedEntityInstances[0].enrollments.filter(
        (enroll) => enroll.program == tei.program || enroll.program == program.auProjectBudget || enroll.program==program.auProjectDescription 
        );
  
        const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  dataElements.year.id);
        if(dataValuesPD[year] && dataValuesPD[year][dataElements.submitAnnualUpdate])  tei.disabled = true;
      tei.projects = checkProjects(dataElements.projectDescription, dataValuesPD[year]);

      const dataValuesPB = getEvents(filteredPrograms, program.auProjectBudget,  dataElements.year.id);
      if(dataValuesPB[year]) {  
        dataElements.projectBudget.forEach((project,index) => {
          if(dataValuesPB[year][project.name]) {
            // tei.projects.push(dataValuesPB[year][project.name]);
            
            for (let year = tei.year.start; year <= tei.year.end; year++) {
              if(!totalProjectBudget[index]) totalProjectBudget[index] = {};
              if(!totalProjectBudget[index][year]) totalProjectBudget[index][year] = 0;
              if(dataValuesPB[year][project.budget]) totalProjectBudget[index][year] += Number(dataValuesPB[year][project.budget]);
            
              tei.yearlyAmount[`amount-${year}`] = dataValuesPB[year][dataElements.totalBudget]? dataValuesPB[year][dataElements.totalBudget] : ''
            }
          }
        })
      }

      tei.dataValues = getEvents(filteredPrograms, tei.program, dataElements.year.id); //data vlaues period wise

      // if(dataValues) {
      //   let value = ''
      //   for(let year = tei.year.start; year <= tei.year.end; year++) {
      //     var difference = (dataValues[year] && dataValues[year][dataElements.difference]) ? dataValues[year][dataElements.difference]: 0;
      //     if(difference) value = 'The total project budget should be equal to total project budget by expense categories. Please check the data.'  
      //   }
      //   if(value ) alert(value);
      // }
      
      if(tei.projects.length) {
      for (let year = tei.year.start; year <= tei.year.end; year++) {
        if (!tei.dataValues[year]) {
          const data = [{
            dataElement: dataElements.year.id,
            value: year
          },{
            dataElement: dataElements.period.id,
            value: dataElements.period.value
          }];
          tei.dataValues[year] = {
            [dataElements.year.id]:year,
            [dataElements.period.id]: dataElements.period.value,
          }
          tei.projects.forEach((name,index) => {
            tei.dataValues[year][dataElements.projectExpenseCategory[index].name] = name;
            data.push({
            dataElement:dataElements.projectExpenseCategory[index].name,
            value: name
          })
        })

        tei.event = {
          ...tei.event,
         [year]: await createEvent(data)
        }
        } else {

          tei.event = {
            ...tei.event,
            [year]: tei.dataValues[year]["event"]
          }

          var calculatedElements = loadCalculatedVariables(tei.dataValues, dataElements, year);
          calculatedElements.forEach(elements =>  {
            tei.dataValues[year][elements.dataElement] = elements.value;
            pushDataElementYear(`${elements.dataElement}-${year}`, elements.value);
          });
          
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
    $('#accordion').empty();
    if (tei.projects.length) {
      let projectRows = displayProjectDetails(tei.projects, dataValues, period)
      $('#accordion').append(projectRows);
    } else {
      $('#accordion').append(`<h4 class="text-center text-warning my-4">No Existing Projects! Please add project in the Project Budget Section.</h4>`);
    }

    var totalsRow = displayTotals(dataValues, period);
    $('#totals').empty();
    $('#totals').append(totalsRow);

      // Localize content
      $('body').localize();
  }

  function displayTotals(dataValues, period) {
    var totalsRow = '';
    for (let i = period.start; i <= period.end; i++) {
      const totalBudget = (dataValues[i] && dataValues[i][dataElements.totalBudget]) ?  Number(dataValues[i][dataElements.totalBudget]) : '';
      const difference = (dataValues[i] && dataValues[i][dataElements.difference]) ?  Number(dataValues[i][dataElements.difference]) : '';
      totalsRow += `
      <tr>
  <td>${i}</td>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" value="${totalBudget.toLocaleString()}" id="${dataElements.totalBudget}-${i}" class="form-control totalBudget-${i}  currency" readonly disabled>
    </div>
  </td>
  <td>
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
          $
        </div>
      </div>
      <input type="text" style="background:${difference >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'}"  value="${difference.toLocaleString()}" id="${dataElements.difference}-${i}" class="form-control difference-${i}  currency" readonly disabled>
    </div>
  </td>
</tr>
`;
    }
    return totalsRow;
  }
  function displayProjectDetails(projectDetails, dataValues, period) {
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
                <th style="width: 25%" data-i18n="intro.expense_category">
                  Expense Category
                </th>`
            for (let i = period.start; i <= period.end; i++) projectRows += `<th ><span data-i18n="intro.project_year">Year</span> ${i}</th>`
            projectRows +=`</tr>
            </thead>
            <tbody>
              <tr>
                <td>
                <strong data-i18n="intro.personnel">Personnel</strong>
                </td>`

            for (let i = period.start; i <= period.end; i++) projectRows += `<td>
            <div class="input-group">
              <div
                class="input-group-prepend"
              >
                <div
                  class="input-group-text"
                >
                  $
                </div>
              </div>
              <input
                id="${dataElements.projectExpenseCategory[index].personnel}-${i}"
                type="number"
                ${tei.disabled ? 'disabled readonly': ''}
                ${tei.disabledYear[i] ? 'disabled':''} 
                value="${(dataValues[i] && dataValues[i][dataElements.projectExpenseCategory[index].personnel]) ? dataValues[i][dataElements.projectExpenseCategory[index].personnel] : ''}"
                oninput="pushDataElementYear(this.id,this.value);calculateTotals(${i},'totalBudget', ${index})" 
                class="form-control input-totalBudget-${i}  currency"
              />
            </div>
          </td>`
            projectRows +=`</tr>
              <tr>
              <td>
              <strong data-i18n="intro.activities">Direct project activities</strong>
              </td>`

                for (let i = period.start; i <= period.end; i++) projectRows += `<td>
                <div class="input-group">
                  <div
                    class="input-group-prepend"
                  >
                    <div
                      class="input-group-text"
                    >
                      $
                    </div>
                  </div>
                  <input id="${dataElements.projectExpenseCategory[index].activities}-${i}"
                    type="number"
                    ${tei.disabled ? 'disabled readonly': ''}
                    ${tei.disabledYear[i] ? 'disabled':''} 
                    value="${(dataValues[i] && dataValues[i][dataElements.projectExpenseCategory[index].activities]) ? dataValues[i][dataElements.projectExpenseCategory[index].activities] : ''}"
                    oninput="pushDataElementYear(this.id,this.value);calculateTotals(${i},'totalBudget', ${index})" 
                    class="form-control input-totalBudget-${i}  currency"
                  />
                </div>
              </td>`
                projectRows +=`</tr>
              <tr>
              <td>
              <strong data-i18n="intro.commodities">Commodities</strong>
              </td>`

                for (let i = period.start; i <= period.end; i++) projectRows += `<td>
                <div class="input-group">
                  <div
                    class="input-group-prepend"
                  >
                    <div
                      class="input-group-text"
                    >
                      $
                    </div>
                  </div>
                  <input
                    id="${dataElements.projectExpenseCategory[index].commodities}-${i}"
                    type="number"
                    ${tei.disabled ? 'disabled readonly': ''}
                    ${tei.disabledYear[i] ? 'disabled':''} 
                    value="${(dataValues[i] && dataValues[i][dataElements.projectExpenseCategory[index].commodities]) ? dataValues[i][dataElements.projectExpenseCategory[index].commodities] : ''}"
                    oninput="pushDataElementYear(this.id,this.value);calculateTotals(${i},'totalBudget', ${index})" 
                    class="form-control input-totalBudget-${i}  currency"
                  />
                </div>
              </td>`
              projectRows +=`</tr>
            <tr>
            <td>
            <strong data-i18n="intro.indirect">Indirect/support costs</strong>
            </td>`

              for (let i = period.start; i <= period.end; i++) projectRows += `<td>
              <div class="input-group">
                <div
                  class="input-group-prepend"
                >
                  <div
                    class="input-group-text"
                  >
                    $
                  </div>
                </div>
                <input
                  id="${dataElements.projectExpenseCategory[index].cost}-${i}"
                  type="number"
                  ${tei.disabled ? 'disabled readonly': ''}
                  ${tei.disabledYear[i] ? 'disabled':''} 
                  value="${(dataValues[i] && dataValues[i][dataElements.projectExpenseCategory[index].cost]) ? dataValues[i][dataElements.projectExpenseCategory[index].cost] : ''}"
                  oninput="pushDataElementYear(this.id,this.value);calculateTotals(${i},'totalBudget', ${index})" 
                  class="form-control input-totalBudget-${i}  currency"
                />
              </div>
            </td>`
            projectRows +=`</tr>
            </tbody>
          </table>
        </div>

        <div class="form-row">
        <div class="form-group col-md-12 textbox-wrap">
        <label for="" ><span data-i18n="intro.variation_budget">
          Variation from total project budget</span>
          <i class="fas fa-info-circle ml-1" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Difference in Budget provisioned for the project in the concerned year and the expenditure mentioned. Positive number indicates remaining budget and negative number indicates that the expenditure is more than the budget allocated for the project"></i>
                        </label>`;
                projectRows += ` <div class="budget-wrap table-responsive">            
                        <table class="table table-striped table-md mb-0 " width="100%">
                          <thead>`;
                for (let i = period.start; i <= period.end; i++)
                projectRows += `<th>${i}</th>`;
                projectRows += `</thead><tbody><tr>`; 
                for (let i = period.start; i <= period.end; i++)
                projectRows += `<td>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        $
                      </div>
                    </div>
                    <input 
                    type="text" 
                    ${tei.disabled ? 'disabled readonly': ''}
                    id="${dataElements.projectExpenseCategory[index].variation}-${i}" 
                    value="${dataValues[i] && dataValues[i][dataElements.projectExpenseCategory[index].variation]? Number(dataValues[i][dataElements.projectExpenseCategory[index].variation]).toLocaleString(): 0}"  
                    class="form-control currency"
                    style="background:${dataValues[i][dataElements.projectExpenseCategory[index].variation] ? (dataValues[i][dataElements.projectExpenseCategory[index].variation] >=0 ? '#C1E1C1 !important':'#FAA0A0 !important'): ''}" 
                    disabled
                    readonly
                    >
                  </div>
                  <div class="invalid-feedback"> Error here 
                  </div>
                </td>`;
projectRows += `</tr>
                  </tbody>
                  </table>
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
              id="${dataElements.projectExpenseCategory[index].comment}-${period.start}"
              onchange="pushDataElementYear(this.id,this.value);checkWords(this, ${index})"
            >${dataValues[period.start] && dataValues[period.start][dataElements.projectExpenseCategory[index].comment] ? dataValues[period.start][dataElements.projectExpenseCategory[index].comment] : ''}</textarea>
            <div
              class="char-counter form-text text-muted"
              id="counter${index}"
            >${maxWords- (dataValues[period.start] &&
              dataValues[period.start][dataElements.projectExpenseCategory[index].comment] ? dataValues[period.start][dataElements.projectExpenseCategory[index].comment].trim().split(/\s+/).length: 0)} words remaining
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
              ${(length-1 == index) ? `<button class="btn btn-primary" ${tei.disabled ? 'disabled readonly': ''} onclick="event.preventDefault(); window.location.href='../../apps/IPPF-BPR-App/business-plan-3.1-total-income-au.html'">
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

  fetchOrganizationUnitUid();
});

function submitProjectExpense() {
  var value = ''
  const date = new Date();

    var difference = document.getElementById(`${dataElements.difference}-${date.getFullYear()}`);
    if(difference) value = `The total project budget should be equal to total project budget by expense categories (Year: ${date.getFullYear()}). Please check the data.`  
  
  if(value ) alert(value);
  alert('Event Pushed Successfully!');
}

function loadCalculatedVariables(dataValues, dataElements, year) {

  var projectNames = [];
  var totalBudget = {
    dataElement: dataElements.totalBudget,
    value: 0
  };
  var variations = [];
  tei.projects.forEach((name,index) => {
    var budget = 0;
    projectNames.push({dataElement: `${dataElements.projectExpenseCategory[index].name}`, value: name})
    if(dataValues[year] && dataValues[year][dataElements.projectExpenseCategory[index].personnel]) budget += Number(dataValues[year][dataElements.projectExpenseCategory[index].personnel]);
    if(dataValues[year] && dataValues[year][dataElements.projectExpenseCategory[index].activities]) budget += Number(dataValues[year][dataElements.projectExpenseCategory[index].activities]);
    if(dataValues[year] && dataValues[year][dataElements.projectExpenseCategory[index].commodities]) budget += Number(dataValues[year][dataElements.projectExpenseCategory[index].commodities]);
    if(dataValues[year] && dataValues[year][dataElements.projectExpenseCategory[index].cost]) budget += Number(dataValues[year][dataElements.projectExpenseCategory[index].cost]);

    if(totalProjectBudget[index] && totalProjectBudget[index][year]) variations.push({dataElement:dataElements.projectExpenseCategory[index].variation , value: `${totalProjectBudget[index][year]- budget}`})
    totalBudget.value += budget;
  })

  var difference = {
    dataElement: dataElements.difference,
    value: tei.yearlyAmount[`amount-${year}`]? `${(tei.yearlyAmount[`amount-${year}`] - totalBudget.value)}`: '0'
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