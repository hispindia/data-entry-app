import { eventApi } from '../../api/DataApi.js';
import { dataSet } from '../../api/dataSet.js';
import { getMeData, getOrganisationUnits, getProgramStageEvents } from '../../api/func.js';
import { tei, dataElements, dataSetPrice, program, programStage, dataSetQuantity } from '../../constant.js';
import { getUserConfig } from '../config.js';
import { formatNumberInput, getYears } from '../func.js';

const productList = 38;
var eventSource = {};
var rowIndex = 0;
var combinedCost = 0;
var totalCost = 0;
var level2OU = [];
var totalProductRequest = [];

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
      $('.loader-container').addClass('d-flex').removeClass('d-none');
      $('.myContainer').hide();
      fetchEvents();
    });

    async function configurePage() {
      try {
        const user = await getUserConfig();
         tei.userDisabled = user.disabled;
             
         if (user.organisationUnits?.length) {
           tei.orgUnit = user.organisationUnits[0].id;
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
       
        const data = await getMeData();
        const resOUGroup = await getOrganisationUnits("mwQWyy8TGZv");
        const orgUnitGroup = resOUGroup.organisationUnits;

        data.organisationUnits.forEach(orgUnits => {
         if(orgUnits.level == 1) { 
            level2OU = orgUnits.children;
          } else if(orgUnits.level == 2) { 
            level2OU.push(orgUnits);
          } else if(orgUnits.parent) {
            level2OU.push(orgUnits.parent);
          }
        });
        level2OU.sort((a, b) => a.name.localeCompare(b.name));
        level2OU.forEach(headOU => {
          headOU['children'] = [];
          orgUnitGroup.forEach(ou => {
            if (ou.path.includes(headOU.id)) headOU['children'].push(ou)
          })
        })
    
        tei.program = program.auCommodities;
        tei.programStage = programStage.auCommoditiesOrder;

        fetchEvents();
      
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchDataSet(orgUnit, year) {
    const values = {};
    const dataElementsPrice = await dataSet.getElements(dataSetPrice);
    const dataElementsQuantity = await dataSet.getElements(dataSetQuantity);
    const dataValuesPrice = await dataSet.getValues(dataSetPrice, orgUnit,year);
    const dataValuesQuantity = await dataSet.getValues(dataSetQuantity, orgUnit, year);
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
    $("#table-head").empty();
    $("#table-body").empty();
    $("#loader").html('<div class="h2 text-center">Loading api...</div>');

    const year = $('#year-update').val();

    var dataSetOUValues = [];
    var dataElementOUValues = {};
    for(let headOU of level2OU) {
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      for(let ou of headOU.children) {
      $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);
        const dsValues = await fetchDataSet(ou.id, year);
        dataSetOUValues.push(dsValues);
        dataElementOUValues[ou.id] = dsValues.values;
      }
    }

    $('.loader-container').addClass('d-none').removeClass('d-flex');
    $('.myContainer').show(); 
    
    populateProgramEvents(level2OU,dataSetOUValues,dataElementOUValues);
    
  }

  // Function to populate program events data
  function populateProgramEvents(level2OU, dataSetOUValues, dataValues) {

    var tableHead = `<tr>
                      <th colspan="6" style="background:#276696;color:white;text-align:center;">Product requested</th>
                      <th colspan="2" style="background:#276696;color:white;text-align:center;">Order Totals</th>`
    level2OU.forEach(headOU => {
      tableHead += `<th colspan="${headOU.children.length*2}" style="background:#276696;color:white;text-align:center;">${headOU.name}</th>`
    })

    tableHead += `</tr><tr>
                      <th rowspan="2" style="background:#276696;color:white;text-align:center;">IPPF Code</th>
                      <th rowspan="2" style="background:#276696;color:white;text-align:center;">Product Name</th>
                      <th rowspan="2" style="background:#276696;color:white;text-align:center;">Manufacturer</th>
                      <th rowspan="2" style="background:#276696;color:white;text-align:center;">Formulation</th>
                      <th rowspan="2" style="background:#276696;color:white;text-align:center;">Unit of Measure</th>
                      <th rowspan="2" style="background:#276696;color:white;text-align:center;">Unit Price</th>
                      <th rowspan="2" style="background:#276696;color:white;text-align:center;">Quantity requested</th>
                      <th rowspan="2" style="background:#276696;color:white;text-align:center;">Value</th>`
    level2OU.forEach(headOU => (headOU.children.forEach(ou => tableHead += `<th colspan="2" style="background:#276696;color:white;text-align:center;">${ou.name}</th>`)))
    tableHead += `</tr><tr>`;

    level2OU.forEach(headOU => (headOU.children.forEach(ou => tableHead += `<th  style="background:#276696;color:white;text-align:center;">Quantity requested</th><th  style="background:#276696;color:white;text-align:center;">Value</th>`)))
    tableHead += `</tr>`;

    $('#table-head').html(tableHead);

    let projectRows = displayOrderprojectCommodities(level2OU, dataSetOUValues, dataValues);
    $("#table-body").html(projectRows);

    $("#loader").empty();

          
    // Localize content
    $('body').localize();
  }

  function displayOrderprojectCommodities(level2OU, dataSet, dataValues) {

    var tableBody = '';
    if(dataSet.length) {
      var  ouLength = 0;
        level2OU.forEach(headOU => {
          ouLength += headOU.children.length
        });
      
      dataSet[0].dataElements.forEach(section => {
          tableBody += `<tr><td colspan="${(8+(ouLength*2))}" style="background:#50C878;font-weight:bold">${section.name}</td></tr>`
          section.dataElements.forEach((dataElement) => {
            if(!dataElement.quantity || !dataElement.price) return;  
            const rate = dataSet[0]['values'][dataElement.id] ? dataSet[0]['values'][dataElement.id]: '';
            const description = dataElement.description.split(';');
            const rowVal = rowValues(level2OU, dataElement, dataValues);

            const totalQuantityVal = rowVal.totalQuantityVal;
            const totalPrice = rowVal.totalPrice;

            tableBody +=`<tr>
            <td>${dataElement.code}</td>
            <td>${dataElement.name}</td>
            <td>${(description[0] ? description[0]: '')}</td>
            <td>${(description[1] ? description[1]: '')}</td>
            <td>${(description[2] ? description[2]: '')}</td>
            <td>${rate}</td>
            <td>${totalQuantityVal}</td>
            <td>${formatNumberInput(totalPrice)}</td>
            ${rowVal.row}`;
          })
      })

        tableBody +=`<tr>
        <td colspan="8">total Product Request</td>`
        totalProductRequest.forEach(product => { tableBody += `<td>${product}</td>` })
        tableBody +=`</tr>
        <tr>
        <td colspan="8">Estimated freight costs:</td>`
        totalProductRequest.forEach(product => { 
          var freightCost = calculateFreightCost(product);
          tableBody += `<td>${freightCost ? formatNumberInput(Math.round(freightCost)) : ''}</td>` 
        })
        tableBody +=`</tr>
        <tr>
        <td colspan="8">Total:</td>`
        totalProductRequest.forEach(product => { 
          var freightCost = calculateFreightCost(product);
          tableBody += `<td>${(product && freightCost) ? formatNumberInput(Number(product)+Math.round(freightCost)) : ''}</td>` 
        })
        tableBody +=`</tr>`
    }
    
    return tableBody;
  }

  function rowValues(level2OU, dataElement, dataValues) {
    var row = '';

    var totalPrice = 0;
    var totalQuantityVal = 0;
    var ouIndex = -1;

    level2OU.forEach(headOU => {
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      headOU.children.forEach(ou=> {
        const quantityVal = dataValues[ou.id] && dataValues[ou.id][dataElement.quantity] ? dataValues[ou.id][dataElement.quantity]: '';
        const price = dataValues[ou.id] && dataValues[ou.id][dataElement.price] ?  dataValues[ou.id][dataElement.price]: '';
        row += `<td>${quantityVal}</td><td>${price}</td>`;

        totalQuantityVal += Number(quantityVal);
        totalPrice += Number(price);

        ouIndex++;
        totalProductRequest[ouIndex] = '';

        ouIndex++;
        if(!totalProductRequest[ouIndex]) totalProductRequest[ouIndex] = 0;
        totalProductRequest[ouIndex] += Number(price);
        
      })
    })

    return {row, totalPrice, totalQuantityVal};
  }

  configurePage();
});


function calculateFreightCost(cost) {
  var value = 0;
  if(cost) {
    if(cost > 0 && cost <= 1000) {
      value = cost
    }
    else if(cost > 1000 && cost <= 4999) {
      value = 0.4 * cost;
    } else {
      value = 0.25 * cost;
    }
  }
  return value;
}
