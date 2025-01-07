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
    .getElementById("headerPeriod")
    .addEventListener("change", function () {
      fetchOrganizationUnitUid();
    });

    document
    .getElementById("year-update")
    .addEventListener("change", function (ev) {
      fetchEvents();
    });



    async function fetchOrganizationUnitUid() {
      try {
        const response = await fetch(
          `../../me.json?fields=id,username,organisationUnits[id,name,level,children[id,name],parent[id,name]],userGroups[id,name]`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const apiOUGroup = await fetch(
          `../../organisationUnitGroups/mwQWyy8TGZv.json?fields=id,name,organisationUnits[id,name,path,code,level,parent[id,name]]`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const resOUGroup = await apiOUGroup.json();

      if (data.organisationUnits && data.organisationUnits.length > 0) {
        document.getElementById("headerOrgName").value =
          data.organisationUnits[0].name;

        const fpaIndiaButton = document
          .querySelector(".fa-building-o")
          .closest("a");
        if (fpaIndiaButton) {
          const fpaIndiaDiv = fpaIndiaButton.querySelector("div");
          if (fpaIndiaDiv) {
            fpaIndiaDiv.textContent = data.organisationUnits[0].name;
          }
        }
        

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
    
        $('.aoc-reporting').hide();
        $('.trt-review').hide()

        dataElements.period.value = document.getElementById("headerPeriod").value;
        tei.program = program.auCommodities;
        tei.programStage = programStage.auCommoditiesOrder;
        tei.year = {
          ...tei.year,
          start: dataElements.period.value.split(" - ")[0],
          end: dataElements.period.value.split(" - ")[1],
        };

        // var yearOptions = '';
        // for(let year=tei.year.start; year <=tei.year.end; year++) {
        //   yearOptions += `<option value="${year}">${year}</option>`;
        // }
        // document.getElementById('year-update').innerHTML = yearOptions;
        document.getElementById('year-update').innerHTML = '<option value="2025">2025</option>';

        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchDataSet(orgUnit, year) {
    const values = {};
    const dataSetElements = await dataSet.getElements(dataSetId);
    const dataValueSet = await dataSet.getValues(dataSetId, orgUnit,year);
    dataValueSet.dataValues.forEach(dv => values[dv.dataElement] = dv.value);
    return {
      dataElements: dataSetElements,
      values
    }
  }

  async function fetchEvents() {
    const year = $('#year-update').val();
    $("#table-head").empty();
    $("#table-body").empty();
    $("#loader").html('<div class="h2 text-center">Loading api...</div>');

    var dataSetOUValues = [];
    var dataElementOUValues = {};
    for(let headOU of level2OU) {
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      for(let ou of headOU.children) {
      $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);
        const dsValues = await fetchDataSet(ou.id, year);
        dataSetOUValues.push(dsValues);
        const event = await events.fromStage(ou.id, tei.program,tei.programStage);
        if(event.trackedEntityInstances.length) {
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) => enroll.program == tei.program);
          const dataValues =  getProgramStageEvents(filteredPrograms, tei.programStage, tei.program,dataElements.year.id) //data vlaues period wise
          if(dataValues && dataValues[year]) dataElementOUValues[ou.id] = dataValues[year]
        }
      }
    }
    
    populateProgramEvents(level2OU,dataSetOUValues,dataElementOUValues);
    
  }

  // Function to populate program events data
  function populateProgramEvents(level2OU, dataSetOUValues,dataValues) {

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
      dataSet[0].dataElements.sections.forEach(section => {
        if(rowIndex<=productList) {
          tableBody += `<tr><td colspan="${(8+(ouLength*2))}" style="background:#50C878;font-weight:bold">${section.name}</td></tr>`
          section.dataElements.forEach((dataElement) => {
         
          const rate = dataSet[0]['values'][dataElement.id] ? dataSet[0]['values'][dataElement.id]: '';
          const description = dataElement.description.split(';');
          const rowVal = rowValues(level2OU, rowIndex, dataValues);

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
          <td>${totalPrice}</td>
          ${rowVal.row}`;
          
          rowIndex++;
          })
        }
      })

        tableBody +=`<tr>
        <td colspan="8">total Product Request</td>`
        totalProductRequest.forEach(product => { tableBody += `<td>${product}</td>` })
        tableBody +=`</tr>
        <tr>
        <td colspan="8">Estimated freight costs:</td>`
        totalProductRequest.forEach(product => { 
          var freightCost = calculateFreightCost(product);
          tableBody += `<td>${freightCost ? Math.round(freightCost) : ''}</td>` 
        })
        tableBody +=`</tr>
        <tr>
        <td colspan="8">Total:</td>`
        totalProductRequest.forEach(product => { 
          var freightCost = calculateFreightCost(product);
          tableBody += `<td>${(product && freightCost) ? (Number(product)+Math.round(freightCost)) : ''}</td>` 
        })
        tableBody +=`</tr>`
    }
    
    return tableBody;
  }

  function rowValues(level2OU, rowIndex, dataValues) {
    var row = '';

    var totalPrice = 0;
    var totalQuantityVal = 0;
    var ouIndex = -1;

    level2OU.forEach(headOU => {
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      headOU.children.forEach(ou=> {
        const quantityVal = dataValues[ou.id] && dataValues[ou.id][dataElements.projectCommodities[rowIndex].quantity] ? dataValues[ou.id] && dataValues[ou.id][dataElements.projectCommodities[rowIndex].quantity]: '';
        const price = dataValues[ou.id] && dataValues[ou.id][dataElements.projectCommodities[rowIndex].price] ? dataValues[ou.id] && dataValues[ou.id][dataElements.projectCommodities[rowIndex].price]: '';
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

  fetchOrganizationUnitUid();
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
