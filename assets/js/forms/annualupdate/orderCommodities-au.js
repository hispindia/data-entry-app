import { dataSet } from "../../api/dataSet.js";
import { getEvents, getOrganisationUnits, getProgramStageEvents, getTEI } from "../../api/func.js";
import { dataElements, dataSetFunds, dataSetPrice, dataSetQuantity, program, programStage, tei } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { formatNumberInput, getYears } from "../func.js";

var combinedCost = 0;

var unrestrictedCost = 0;

var freightCostT1 = 1;
var freightCostT2 =  0.4;
var freightCostT3 = 0.25;

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

configurePage()
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

    fetchEvents();    
  }

  async function fetchDataSet(year) {
    const values = {};
    const dataElementsPrice = await dataSet.getElements(dataSetPrice);
    const dataElementsQuantity = await dataSet.getElements(dataSetQuantity);
    const dataValuesFunds = await dataSet.getValues(dataSetFunds, tei.orgUnit,year);
    const dataValuesPrice = await dataSet.getValues(dataSetPrice, tei.orgUnit,year);
    const dataValuesQuantity = await dataSet.getValues(dataSetQuantity, tei.orgUnit, year);
    dataValuesFunds.dataValues.forEach(dv => values[dv.dataElement] = dv.value);
    dataValuesPrice.dataValues.forEach(dv => values[dv.dataElement] = dv.value);
    dataValuesQuantity.dataValues.forEach(dv => values[dv.dataElement] = dv.value);

    var quantities = {};
    dataElementsQuantity.sections.forEach(quantity => quantity.dataElements.forEach(de => quantities[de.code] = de.id));
    dataElementsPrice.sections.forEach(price => {
      price.dataElements.forEach(de => {
        de['quantity'] = quantities[`${de.code}-quantity`] ? quantities[`${de.code}-quantity`]: ''
        de['price'] = quantities[`${de.code}-price`] ? quantities[`${de.code}-price`]: ''
      })
    })

    return {
      dataElements: dataElementsPrice.sections,
      values
    }
  }
  async function fetchEvents() {
    combinedCost = 0;    
    unrestrictedCost = 0;

    tei.year.value = document.getElementById('year-update').value;
    const dataSet = await fetchDataSet(tei.year.value);
    if(dataSet.values[dataElements.freightCost1]) freightCostT1 = Number(dataSet.values[dataElements.freightCost1]);
    if(dataSet.values[dataElements.freightCost2]) freightCostT2 = Number(dataSet.values[dataElements.freightCost2]);
    if(dataSet.values[dataElements.freightCost3]) freightCostT3 = Number(dataSet.values[dataElements.freightCost3]);

    const LMI =  await getOrganisationUnits('Mh2lrJ4GFnH');
    const UMI = await getOrganisationUnits('klrSsDD70QO');
    const LI = await getOrganisationUnits('zOKTFwOLhmJ');
    const HI = await getOrganisationUnits('r1b22jJ6JaG');

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
    
    const data = await getTEI(tei.orgUnit);
    
    if (data.trackedEntityInstances && data.trackedEntityInstances.length > 0) {
      tei.id = data.trackedEntityInstances[0].trackedEntityInstance;

      const filteredPrograms =
        data.trackedEntityInstances[0].enrollments.filter(
          (enroll) => enroll.program==program.auOrganisationDetails || enroll.program==program.auProjectDescription 
        );

      const dataValuesPD = getEvents(filteredPrograms, program.auProjectDescription, {id: tei.year.id,value: tei.year.value});
      if(dataValuesPD[tei.year.value] && dataValuesPD[tei.year.value][dataElements.submitAnnualUpdate])  tei.disabled = true;
      else if(tei.userDisabled == "true") tei.disabled = true;
      else tei.disabled = false;

    unrestrictedCost = dataSet.values[dataElements.formulaGenerated] ? dataSet.values[dataElements.formulaGenerated] : '';

      populateProgramEvents(dataSet, productCodeIds);
    } else {
      console.log("No data found for the organisation unit.");
    }
  }

  // Function to populate program events data
  function populateProgramEvents(dataSet, productCodeIds) {
    $("#accordion").empty();

    let projectRows = displayOrderprojectCommodities(dataSet, productCodeIds);
    $("#accordion").html(projectRows);

    $('#accordion .textValue').toArray().forEach(el => {
      el.addEventListener("blur", (ev) => {
        var { id, value, dataset } = ev.target;
        pushEvent(id, value, dataset.formula, dataset.notes);
      })
    });

    var totalsRow = displayTotals();
    $('#total-cost').empty();
    $('#total-cost').append(totalsRow);

    var totalsRow = displayCombinedCost();
    $('#combined-cost').empty();
    $('#combined-cost').append(totalsRow);

    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show();
          
    // Localize content
    $('body').localize();
  }

  function displayTotals() {
    var estimatedCost = calculateFreightCost(combinedCost);
    
    var totalsRow  =` <tr>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="${dataElements.orderCommoditiesCV['unrestrictedCost']}" value="${formatNumberInput(Math.round(unrestrictedCost))}" class="form-control input-budget currency" disabled>
      </div>
    </td>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="totalCombinedEstimated"  value="${formatNumberInput(Math.round(estimatedCost+combinedCost))}" class="form-control input-budget currency" disabled>
      </div>
    </td>

    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="estimatedCoreGrant"  value="${formatNumberInput(Math.round(unrestrictedCost-(estimatedCost+combinedCost)))}" class="form-control input-budget currency" disabled>
      </div>
    </td>
  </tr>`
    return totalsRow;
  }

  function displayCombinedCost() {
    var estimatedCost = calculateFreightCost(combinedCost);
    var totalsRow  =` <tr>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="combinedCost" value="${formatNumberInput(Math.round(combinedCost))}" class="form-control input-budget currency" disabled>
      </div>
    </td>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="estimatedCost"  value="${formatNumberInput(Math.round(estimatedCost))}" class="form-control input-budget currency" disabled>
      </div>
    </td>

    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text">
            $
          </div>
        </div>
        <input type="text" id="totalCost" value="${formatNumberInput(Math.round(combinedCost + estimatedCost))}" class="form-control input-budget currency" disabled>
      </div>
    </td>
  </tr>`
    return totalsRow;
  }
  function displayOrderprojectCommodities(dataSet, productCodeIds) {
    var projectRows = '';
    dataSet.dataElements.forEach((section,index) => {
      var rows = '';
      var idExist = false;
      section.dataElements.forEach((dataElement) => {
        if(dataElement.quantity) idExist = true;
        rows += addRow(dataElement, dataSet.values, productCodeIds);
      });
      if(idExist) {
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
                <tbody>
                ${rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!--- sect {${index+1}} --->`

      }
    })
    return projectRows;
  }

  function addRow(dataElement, dataSetValues, productCodeIds) {
    if(!dataSetValues[dataElement.id] || !dataElement.quantity || !dataElement.price) return '';
    const blockField = productCodeIds.includes(dataElement.code);
    const rate = dataSetValues[dataElement.id] ? dataSetValues[dataElement.id]: '';
    const quantity = dataSetValues[dataElement.quantity] ? dataSetValues[dataElement.quantity]: '';
    const price = dataSetValues[dataElement.price] ? dataSetValues[dataElement.price]: '';
    const description = dataElement.description.split(';');
    const notes = description[3] ? description[3]: '';
    combinedCost += rate && quantity ? Math.round(rate * quantity) : 0;
    const formula = description[4] ? description[4]: '';

    var row = `<tr>
    <td>${dataElement.code}</td>
    <td id="${dataElement.quantity}-name">${dataElement.name}</td>
    <td>${(description[0] ? description[0]: '')}</td>
    <td>${(description[1] ? description[1]: '')}</td>
    <td>${(description[2] ? description[2]: '')}</td>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text"> $ </div>
        </div>
        <input type="number" id="${dataElement.id}" name="${dataElement.quantity}-rate" value="${rate}"
          class="form-control input-budget currency" disabled readonly>
      </div>
    </td>
    <td>
      <input type="number" 
      ${(tei.disabled || blockField) ? 'disabled readonly': ''}  
      class="form-control textValue" 
      id="${dataElement.quantity}" 
      data-formula="${formula}"
      data-notes="${notes}"
      value="${quantity}">
      <div id='status-${dataElement.quantity}' class='font-italic'></div>
    </td>
    <td>
      <div class="input-group">
        <div class="input-group-prepend">
          <div class="input-group-text"> $ </div>
        </div>
        <input type="text" 
        id="${dataElement.price}"
        name="${dataElement.quantity}-price" 
        value="${formatNumberInput(Math.round(price))}" 
        disabled
        class="form-control input-budget currency">
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="8">
      <p class="mt-1 mb-1"><strong>Notes:</strong></p>
      <textarea class="form-control" disabled>${notes}</textarea>
    </td>
  </tr>`;
    return row;
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

function calculateFreightCost(cost) {
  var value = 0;
  if(cost) {
    if(cost > 0 && cost <= 1000) {
      value = freightCostT1 * cost
    }
    else if(cost > 1000 && cost <= 4999) {
      value = freightCostT2 * cost;
    } else {
      value = freightCostT3 * cost;
    }
  }
  return value;
}

async function pushEvent(id, quantity, formula, notes) {
  $(`#status-${id}`).text('Saving!');
  const price = $(`input[name="${id}-price"]`)[0].id;
  const rate = $(`input[name="${id}-rate"]`).val();

  if(formula) {
    if(formula == '512' || formula == '72') {
      let value = quantity%formula;
      if(value) {
        $(`#${id}`).val('');
        quantity=0;
        alert(notes)
      }
    } else if(formula == '10') {
      let value = quantity%10;
      if(value) {
        $(`#${id}`).val('');
        quantity=0;
        alert(notes)
      }
    }
  } 

  //Quantity
  await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement: id, value: quantity});
  if(quantity==0) {  
    await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement: price, value: 0});
    $(`#${price}`).val(0);
  } else if(rate && quantity) {
    const priceVal = Number(rate) * Number(quantity);
    $(`#${price}`).val(formatNumberInput(Math.round(priceVal)));
    await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement: price, value: priceVal});
  }
  addValuesCV(id)
}

async function addValuesCV(id) {
  var totalCost = 0;
  $('.textValue').each((_, de) => {
    const quantity = $(`#${de.id}`).val()
    const rate = $(`input[name="${de.id}-rate"]`).val();
    totalCost += rate && quantity ? Math.round(rate * quantity) : 0;
  })

  const estimatedCost = calculateFreightCost(totalCost);

  $('#estimatedCost').val(formatNumberInput(Math.round(estimatedCost)));
  $('#combinedCost').val(formatNumberInput(Math.round(totalCost)));
  $('#totalCost').val(formatNumberInput(Math.round(totalCost+estimatedCost)));
  $('#totalCombinedEstimated').val(formatNumberInput(Math.round(totalCost+estimatedCost)));
  $('#estimatedCoreGrant').val(formatNumberInput(Math.round(unrestrictedCost-(totalCost+estimatedCost))));  
  await dataSet.post({dataSetId: dataSetQuantity, co: "HllvX50cXC0", orgUnit: tei.orgUnit, period: tei.year.value, dataElement: dataElements.sourceCommodities['unrestricted'], value:Math.round(totalCost+estimatedCost)});
  
  $(`#status-${id}`).text('Saved.');
}