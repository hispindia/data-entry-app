const productList = 38;
var eventSource = {};
var rowIndex = 0;
var combinedCost = 0;
var totalCost = 0;

var unrestrictedCost = 0;
var estimatedCost = 0;
var estimatedCoreGrant = 0;

var frieghtCostT1 = 1;
var frieghtCostT2 =  0.4;
var frieghtCostT3 = 0.25;

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
      fetchOrganizationUnitUid();
    });

    document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      window.localStorage.setItem("annualYear", ev.target.value);
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

        dataElements.period.value = document.getElementById("headerPeriod").value;
        tei.program = program.auCommodities;
        tei.programStage = programStage.auCommoditiesOrder;
        tei.year = {
          ...tei.year,
          start: dataElements.period.value.split(" - ")[0],
          end: dataElements.period.value.split(" - ")[1],
        };

        var yearOptions = '';
        var annualYear = window.localStorage.getItem("annualYear");
        for(let year=tei.year.start; year <=tei.year.end; year++) {
          if(tei.hideYears.includes(year)) continue;
          yearOptions += `<option value="${year}">${year}</option>`;
        }
        document.getElementById('year-update').innerHTML = yearOptions;
        document.getElementById('year-update').options[0].selected = true;
        if(annualYear) document.getElementById('year-update').value = annualYear;

        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }
  async function fetchDataSet(year) {
    const values = {};
    const dataSetElements = await dataSet.getElements(dataSetId);
    const dataValueSet = await dataSet.getValues(dataSetId, tei.orgUnit,year);
    dataValueSet.dataValues.forEach(dv => values[dv.dataElement] = dv.value);
    return {
      dataElements: dataSetElements,
      values
    }
  }
  async function fetchEvents() {
    rowIndex = 0;
    combinedCost = 0;
    totalCost = 0;
    
    unrestrictedCost = 0;
    estimatedCost = 0;
    estimatedCoreGrant = 0;

    const year = document.getElementById('year-update').value;
    var yearIndex = 0;
    for(let i=tei.year.start; i <=tei.year.end; i++) {
      if(i==year) {
        break;
      }
      yearIndex++
    }
    const dataSet = await fetchDataSet(year);
    if(dataSet.values[dataElements.frieghtCost1]) frieghtCostT1 = Number(dataSet.values[dataElements.frieghtCost1]);
    if(dataSet.values[dataElements.frieghtCost2]) frieghtCostT2 = Number(dataSet.values[dataElements.frieghtCost2]);
    if(dataSet.values[dataElements.frieghtCost3]) frieghtCostT3 = Number(dataSet.values[dataElements.frieghtCost3]);

    const LMI =  await (await fetch(`../../organisationUnitGroups/Mh2lrJ4GFnH.json?fields=d,name,description,organisationUnits[id,name`,{headers: {"Content-Type": "application/json"}})).json();
    const UMI = await (await fetch(`../../organisationUnitGroups/klrSsDD70QO.json?fields=d,name,description,organisationUnits[id,name`,{headers: {"Content-Type": "application/json"}})).json();
    const LI = await (await fetch(`../../organisationUnitGroups/zOKTFwOLhmJ.json?fields=d,name,description,organisationUnits[id,name`,{headers: {"Content-Type": "application/json"}})).json();
    const HI = await (await fetch(`../../organisationUnitGroups/r1b22jJ6JaG.json?fields=d,name,description,organisationUnits[id,name`,{headers: {"Content-Type": "application/json"}})).json();

    var productCodeIds = '';
    LMI.organisationUnits.forEach(ou => {
      if(tei.orgUnit==ou.id) productCodeIds += LMI.description
    });
    UMI.organisationUnits.forEach(ou =>  {
      if(tei.orgUnit==ou.id) productCodeIds += UMI.description
    });
    LI.organisationUnits.forEach(ou =>  {
      if(tei.orgUnit==ou.id) productCodeIds += LI.description
    });
    HI.organisationUnits.forEach(ou =>  {
      if(tei.orgUnit==ou.id) productCodeIds += HI.description
    });
    
    const data = await events.get(tei.orgUnit);
    
    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      annualReportTEI = data.trackedEntityInstances[0];
      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program == tei.program || enroll.program==program.auOrganisationDetails || enroll.program==program.auProjectDescription 
        );

      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription,  dataElements.year.id);
      if(dataValuesPD[year] && dataValuesPD[year][dataElements.submitAnnualUpdate])  tei.disabled = true;

    const dataValuesMD =  getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, dataElements.period.id);
    if(dataValuesMD && dataValuesMD[dataElements.period.value] && dataValuesMD[dataElements.period.value][dataElements.yearlyAmount[yearIndex]]) {
      unrestrictedCost = dataValuesMD[dataElements.period.value][dataElements.yearlyAmount[yearIndex]] ? dataValuesMD[dataElements.period.value][dataElements.yearlyAmount[yearIndex]] : 0;
    } 
    const dataValueSC =  getProgramStageEvents(filteredPrograms, programStage.auCommoditiesSource, tei.program,dataElements.year.id) //data vlaues period wise
    
    const dataValues =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,dataElements.year.id) //data vlaues period wise
   
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
          tei.event = await createEvent(data)
        } else {
          tei.event = dataValues[year]["event"]
        }

        if(!dataValueSC[year]) {

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

          eventSource[year] = await createEventOther({
            orgUnit: tei.orgUnit,
            program: tei.program,
            programStage: programStage.auCommoditiesSource,
            teiId: tei.id,
            dataElements: data
          })
        } else {
          eventSource[year] = dataValueSC[year]["event"]
        }
      
      populateProgramEvents(dataSet,dataValues[year],productCodeIds);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataSet,dataValues,productCodeIds) {
    $("#accordion").empty();

    let projectRows = displayOrderprojectCommodities(dataSet, dataValues,productCodeIds);
    $("#accordion").append(projectRows);

    var totalsRow = displayTotals();
    $('#total-cost').empty();
    $('#total-cost').append(totalsRow);

    var totalsRow = displayCombinedCost();
    $('#combined-cost').empty();
    $('#combined-cost').append(totalsRow);
          
    // Localize content
    $('body').localize();
  }

  function displayTotals() {
    estimatedCost = calculateFreightCost(combinedCost);
    
    var totalsRow  =` <tr>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="${dataElements.orderCommoditiesCV['unrestrictedCost']}" value="${Math.round(unrestrictedCost).toLocaleString()}" class="form-control input-budget currency" disabled>
      </div>
    </td>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="totalCost"  value="${Math.round(estimatedCost+combinedCost).toLocaleString()}" class="form-control input-budget currency" disabled>
      </div>
    </td>

    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="${dataElements.orderCommoditiesCV['estimatedCoreGrant']}"  value="${Math.round(unrestrictedCost-(estimatedCost+combinedCost)).toLocaleString()}" class="form-control input-budget currency" disabled>
      </div>
    </td>
  </tr>`
    return totalsRow;
  }

  function displayCombinedCost() {
    estimatedCost = calculateFreightCost(combinedCost);
    var totalsRow  =` <tr>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="${dataElements.orderCommoditiesCV['combinedCost']}" value="${Math.round(combinedCost).toLocaleString()}" class="form-control input-budget currency" disabled>
      </div>
    </td>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="${dataElements.orderCommoditiesCV['estimatedCost']}"  value="${Math.round(estimatedCost).toLocaleString()}" class="form-control input-budget currency" disabled>
      </div>
    </td>

    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="${dataElements.orderCommoditiesCV['totalCost']}" value="${Math.round(combinedCost + estimatedCost).toLocaleString()}" class="form-control input-budget currency" disabled>
      </div>
    </td>
  </tr>`
    return totalsRow;
  }
  function displayOrderprojectCommodities(dataSet, dataValues,productCodeIds) {
    var projectRows = '';
    dataSet.dataElements.sections.forEach((section,index) => {
    if(rowIndex<=productList) {
    projectRows += `
    <!--- sect 1 --->
    <div class="accordion">
      <div class="accordion-header active" role="button" data-toggle="collapse"
        data-target="#panel-body-${index}">

        <h4 class="d-flex align-items-center">
          <span>${index+1}.</span><span class="input-headings w-100"><input
              class="w-100" type="text" value="${section.name}"
              title="${section.name}" readonly></span>
        </h4>

      </div>
      <div class="accordion-body collapse" id="panel-body-${index}" data-parent="#accordion">
        <div class="budget-wrap table-responsive">
          <table class="table table-striped table-md mb-0 " width="100%">
            <thead>
              <tr>
                <th data-i18n="intro.product_code">Product Code</th>
                <th data-i18n="intro.product_name" >Product Name</th>
                <th data-i18n="intro.manufacturer">Manufacturer</th>
                <th data-i18n="intro.formulation">Formulation</th>
                <th data-i18n="intro.unit_measure">Unit of Measure</th>
                <th data-i18n="intro.rate">Rate</th>
                <th data-i18n="intro.order_quantity">Order quantity request (per UoM)</th>
                <th data-i18n="intro.total_price">Total price</th>
              </tr>
            </thead>
            <tbody>`
      section.dataElements.forEach((dataElement) => {
       projectRows += addRow(dataElement, rowIndex, dataSet.values, dataValues, productCodeIds);
       rowIndex++;
      })
    projectRows += `</tbody>
          </table>
        </div>


      </div>
    </div>
    <!--- sect 1 --->`
    }
    })
    return projectRows;
  }

  function addRow(dataElement,index, dataSetValues, dataValues, productCodeIds) {
    const blockField = productCodeIds.includes(dataElement.code);
    const rate = dataSetValues[dataElement.id] ? dataSetValues[dataElement.id]: '';
    const quantityVal = dataValues[dataElements.projectCommodities[index].quantity] ? dataValues[dataElements.projectCommodities[index].quantity]: '';
    const price = dataValues[dataElements.projectCommodities[index].price] ? dataValues[dataElements.projectCommodities[index].price]: '';
    const description = dataElement.description.split(';');
    combinedCost += rate && quantityVal ? Number(rate * quantityVal) : 0;
    const formula = description[4] ? description[4]: '';

    var row = `<tr>
    <td><span id="${dataElements.projectCommodities[index].code}">${dataElement.code}</span></td>
    <td><span id="${dataElements.projectCommodities[index].name}">${dataElement.name}</span></td>
    <td>${(description[0] ? description[0]: '')}</td>
    <td>${(description[1] ? description[1]: '')}</td>
    <td>${(description[2] ? description[2]: '')}</td>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text"> $ </div>
        </div>
        <input type="number" id="${dataElements.projectCommodities[index].quantity}-rate" value="${rate}"
          class="form-control input-budget currency" disabled readonly>
      </div>
    </td>
    <td>
      <input type="number" ${(tei.disabled || blockField) ? 'disabled readonly': ''}  class="form-control" id="${dataElements.projectCommodities[index].quantity}" onblur="pushEvent('${index}', '${rate}', '${formula}', '${description[3]}')" value="${quantityVal}">
      <div id='status-${index}' class='font-italic'></div>
    </td>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text"> $ </div>
        </div>
        <input type="text" id="${dataElements.projectCommodities[index].price}" value="${Math.round(price)}" disabled
          class="form-control input-budget currency">
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="8">
      <p class="mt-1 mb-1"><strong>Notes:</strong></p>
      <textarea class="form-control" disabled>${(description[3] ? description[3]: '')}</textarea>
    </td>
  </tr>`;
    return row;
  }

  fetchOrganizationUnitUid();
});

function calculateFreightCost(cost) {
  var value = 0;
  if(cost) {
    if(cost > 0 && cost <= 1000) {
      value = frieghtCostT1 * cost
    }
    else if(cost > 1000 && cost <= 4999) {
      value = frieghtCostT2 * cost;
    } else {
      value = frieghtCostT3 * cost;
    }
  }
  return value;
}

async function pushEvent(index, rate, formula, notes) {
  $(`#status-${index}`).text('Saving!');
  const name = dataElements.projectCommodities[index].name;
  const code = dataElements.projectCommodities[index].code;
  const quantity = dataElements.projectCommodities[index].quantity;
  const price = dataElements.projectCommodities[index].price;
  var quantityVal = $(`#${quantity}`).val();

  if(formula) {
    if(formula=='512' || formula == '72') {
      let value = quantityVal%formula;
      if(value) {
        $(`#${quantity}`).val('');
        quantityVal=0;
        alert(notes)
      }
    } else if(formula == '10') {
      let value = quantityVal%10;
      if(value) {
        $(`#${quantity}`).val('');
        quantityVal=0;
        alert(notes)
      }
    }
  } 

  pushDataElement(quantity, quantityVal);
  if(quantityVal==0) {
    pushDataElement(price, 0);
    $(`#${price}`).val(0);
    pushDataElement(name, '');
    pushDataElement(code, '');

  } else if(rate && quantityVal) {
    const priceVal = Number(rate) * Number(quantityVal);
    $(`#${price}`).val(Math.round(priceVal));
    await pushDataElement(price, $(`#${price}`).val());
    await pushDataElement(name, $(`#${name}`).val());
    await pushDataElement(code, $(`#${code}`).val());
  }
  addValuesCV(index)
}

async function addValuesCV(index) {
  const year = document.getElementById('year-update').value;
  var totalCost = 0;
  dataElements.projectCommodities.forEach(de => {
    const rate = $(`#${de.quantity}-rate`).val();
    const quantity =  $(`#${de.quantity}`).val();
    totalCost += rate && quantity ? Math.round(rate * quantity) : 0;
  })

  const estimatedCost = calculateFreightCost(totalCost);

  await pushDataElement(dataElements.orderCommoditiesCV['combinedCost'], totalCost);
  await pushDataElement(dataElements.orderCommoditiesCV['estimatedCost'], estimatedCost);
  await pushDataElement(dataElements.orderCommoditiesCV['estimatedCoreGrant'], unrestrictedCost-estimatedCost);
  await pushDataElement(dataElements.orderCommoditiesCV['totalCost'], (totalCost+estimatedCost));
  if(eventSource[year]) await pushDataElementOther(dataElements.sourceCommodities['unrestricted'],(Math.round(totalCost+estimatedCost)), program.auCommodities, programStage.auCommoditiesSource, eventSource[year])

  $(`#${dataElements.orderCommoditiesCV['estimatedCost']}`).val(Math.round(estimatedCost).toLocaleString());
  $(`#${dataElements.orderCommoditiesCV['combinedCost']}`).val(Math.round(totalCost).toLocaleString());
  $(`#${dataElements.orderCommoditiesCV['totalCost']}`).val(Math.round(totalCost+estimatedCost).toLocaleString());
  $('#totalCost').val(Math.round(totalCost+estimatedCost).toLocaleString());
  $(`#${dataElements.orderCommoditiesCV['estimatedCoreGrant']}`).val(Math.round(unrestrictedCost-(totalCost+estimatedCost)).toLocaleString());
  $(`#status-${index}`).text('Saved.');
}