var pillars = {};
var regionMA = {};

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

        const userConfig = userGroupConfig(data)
        tei.disabled = userConfig.disabled;
        window.localStorage.setItem('hideReporting', userConfig.disabledValues);
  
        if (window.localStorage.getItem("hideReporting").includes('aoc')) {
          $('.aoc-reporting').hide();
        }
        if (window.localStorage.getItem("hideReporting").includes('trt')) {
          $('.trt-review').hide();
        }
        if(!window.localStorage.getItem("hideReporting").includes('aoc')) {
          $('.aoc-reporting').show();
        }
        if(window.localStorage.getItem("hideReporting").includes('core')) {
          $('.core-users').show();
        }

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
        tei.year = {
          ...tei.year,
          start: dataElements.period.value.split(" - ")[0],
          end: dataElements.period.value.split(" - ")[1],
        };
        fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  async function fetchEvents() {
    $("#table-head").empty();
    $("#table-body").empty();
    $("#loader").html('<div class="h2 text-center">Loading api...</div>');

    var dataValuesOU = [];
    for(let headOU of level2OU) {
      regionMA[headOU] = {
        totalBudget: 0
      }
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      for(let ou of headOU.children) {
      $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);
       
        const event = await events.get(ou.id);
        if(event.trackedEntityInstances.length) {
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) => enroll.program == program.auProjectFocusArea
          || enroll.program == program.auProjectExpenseCategory
          || enroll.program == program.auIncomeDetails
          || enroll.program == program.auProjectDescription
          || enroll.program == program.auProjectBudget
          );
            
          let dataValuesPD = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, dataElements.year.id) //data values year wise
          let dataValuesPB = getProgramStageEvents(filteredPrograms, programStage.auProjectBudget, program.auProjectBudget, dataElements.year.id) //data values year wise
          let dataValuesFA = getProgramStageEvents(filteredPrograms, programStage.auProjectFocusArea, program.auProjectFocusArea, dataElements.year.id) //data values year wise
          let dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, dataElements.year.id) //data values year wise
          let dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, dataElements.year.id) //data values year wise
          let dataValuesCF = getProgramStageEvents(filteredPrograms, programStage.auValueAddCoreFunding, program.auIncomeDetails, dataElements.year.id) //data values year wise
            
          dataValuesOU.push({
            orgUnit: ou.name,
            ouId: ou.id,
            dataValuesPB: dataValuesPB,
            dataValuesPD: dataValuesPD,
            dataValuesFA: dataValuesFA,
            dataValuesEC: dataValuesEC,
            dataValuesTI: dataValuesTI,
            dataValuesCF: dataValuesCF
          })          
        }
      }
    }
    
    populateProgramEvents(level2OU,dataValuesOU);
    
  }

  // Function to populate program events data
  function populateProgramEvents(level2OU,dataValuesOU) {
    const listPB = getPillarBudgetPB(dataValuesOU);
    const list = getPillarBudgetFA(dataValuesOU,level2OU);
    const listEC = getBudgetEC(dataValuesOU);
    const listTI = getPillarBudgetTI(dataValuesOU);
    const listCF = getPillarBudgetCF(dataValuesOU);

    //Pillar Spending
    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Pillar</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-pillar-spending').html(tableHead);

    var modifiedArr = [];
    var currObj = list.pillars;
    for(let name in currObj) {
      modifiedArr.push({
        name: name,
        value: currObj[name][tei.year.end] ? displayValue(currObj[name][tei.year.end]) : ''
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    
    var tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    $('#tb-pillar-spending').html(tableBody);

    //Focus area Ma list with values
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">MA Pillars with Budget</th></tr>`
    $('#th-maPillarBudget-spending').html(tableHead);

    tableBody = '<tr><td rowspan="2">1. Center Care on People</td>';
    var tableBodySecond = `<tr>`
    var total = 0
    for(let ou in list.maPillars['1. Center Care on People'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maPillars['1. Center Care on People'][tei.year.end][ou]}</td>`;
      total += Number(list.maPillars['1. Center Care on People'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    tableBody += '<tr><td rowspan="2">2. Move the Sexuality Agenda</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maPillars['2. Move the Sexuality Agenda'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maPillars['2. Move the Sexuality Agenda'][tei.year.end][ou]}</td>`;
      total += Number(list.maPillars['2. Move the Sexuality Agenda'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`
    
    tableBody += '<tr><td rowspan="2">3. Solidarity for Change</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maPillars['3. Solidarity for Change'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maPillars['3. Solidarity for Change'][tei.year.end][ou]}</td>`;
      total += Number(list.maPillars['3. Solidarity for Change'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    tableBody += '<tr><td rowspan="2">4. Nurture Our Federation</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maPillars['4. Nurture Our Federation'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maPillars['4. Nurture Our Federation'][tei.year.end][ou]}</td>`;
      total += Number(list.maPillars['4. Nurture Our Federation'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    $('#tb-maPillarBudget-spending').html(tableBody);

    //Pillar Project Spending
    tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Project Pillar</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-project-spending').html(tableHead);

    modifiedArr = [];
    for(let name in list.assignedProjects) {
      modifiedArr.push({
        name: name,
        value: (list.assignedProjects[name] && list.assignedProjects[name][tei.year.end] && list.totalProjects[tei.year.end]) ?  displayValue((list.assignedProjects[name][tei.year.end]/list.totalProjects[tei.year.end])*100) :""
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    $('#tb-project-spending').html(tableBody);

    //Project Pillar Spending
    tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Pillar Spending</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-projectPercent-spending').html(tableHead);


    modifiedArr = [];
    for(let name in list.pillars) {
      modifiedArr.push({
        name: name,
        value: (list.pillars[name] && list.pillars[name][tei.year.end] && list.totalBugetProject[tei.year.end]) ?   displayValue((list.pillars[name][tei.year.end]/list.totalBugetProject[tei.year.end])*100):""
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    $('#tb-projectPercent-spending').html(tableBody);


    //Project region Spending
    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Region Spending ${tei.year.end}</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `
      <th style="background:#276696;color:white;text-align:center;">1. Center Care on People</th>
      <th style="background:#276696;color:white;text-align:center;">2. Move the Sexuality Agenda</th>
      <th style="background:#276696;color:white;text-align:center;">3. Solidarity for Change</th>
      <th style="background:#276696;color:white;text-align:center;">4. Nurture Our Federation</th>
      `
    // }
    tableHead += `</tr>`
    $('#th-regionPercent-spending').html(tableHead);

    var tableBody = '';
    for(let region in list.regionBudgetProject) {
      tableBody += `<tr><td>${region}</td>`;
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${(list.regionBudgetProject[region]['1. Center Care on People'] && list.regionBudgetProject[region]['1. Center Care on People'][tei.year.end] && list.regionBudgetTotal[region][tei.year.end]) ? displayValue((list.regionBudgetProject[region]['1. Center Care on People'][tei.year.end]/list.regionBudgetTotal[region][tei.year.end])*100):""}</td>
        <td>${(list.regionBudgetProject[region]['2. Move the Sexuality Agenda'] && list.regionBudgetProject[region]['2. Move the Sexuality Agenda'][tei.year.end] && list.regionBudgetTotal[region][tei.year.end]) ? displayValue((list.regionBudgetProject[region]['2. Move the Sexuality Agenda'][tei.year.end]/list.regionBudgetTotal[region][tei.year.end])*100):""}</td>
        <td>${(list.regionBudgetProject[region]['3. Solidarity for Change'] && list.regionBudgetProject[region]['3. Solidarity for Change'][tei.year.end] && list.regionBudgetTotal[region][tei.year.end]) ? displayValue((list.regionBudgetProject[region]['3. Solidarity for Change'][tei.year.end]/list.regionBudgetTotal[region][tei.year.end])*100):""}</td>
        <td>${(list.regionBudgetProject[region]['4. Nurture Our Federation'] && list.regionBudgetProject[region]['4. Nurture Our Federation'][tei.year.end] && list.regionBudgetTotal[region][tei.year.end]) ? displayValue((list.regionBudgetProject[region]['4. Nurture Our Federation'][tei.year.end]/list.regionBudgetTotal[region][tei.year.end])*100):""}</td>`
      // }
      tableBody += "</tr>"
    }
    $('#tb-regionPercent-spending').html(tableBody);


    //FocusArea Spending
    tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">FocusArea</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-focusArea-spending').html(tableHead);

    modifiedArr = [];
    for(let name in list.fa) {
      modifiedArr.push({
        name: name,
        value:(list.fa[name] && list.fa[name][tei.year.end]) ?  displayValue(list.fa[name][tei.year.end]) :""
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    $('#tb-focusArea-spending').html(tableBody);

    //Focus area Ma list
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">MA FocusArea</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-maFocusArea-spending').html(tableHead);

    modifiedArr = [];
    for(let name in list.maFA) {
      modifiedArr.push({
        name: name,
        value:(list.maFA[name] && list.maFA[name][tei.year.end]) ?  Object.keys(list.maFA[name][tei.year.end]).length :""
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    $('#tb-maFocusArea-spending').html(tableBody);


    //Focus area Ma list with values
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">MA FocusArea with Budget</th></tr>`
    $('#th-maFocusAreaBudget-spending').html(tableHead);

    tableBody = '<tr><td rowspan="2">1. Care: Static Clinic</td>';
    var tableBodySecond = `<tr>`
    var total = 0
    for(let ou in list.maFA['1. Care: Static Clinic'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['1. Care: Static Clinic'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['1. Care: Static Clinic'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    tableBody += '<tr><td rowspan="2">2. Care: Outreach, mobile clinic, Community-based, delivery</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['2. Care: Outreach, mobile clinic, Community-based, delivery'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['2. Care: Outreach, mobile clinic, Community-based, delivery'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['2. Care: Outreach, mobile clinic, Community-based, delivery'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`
    
    tableBody += '<tr><td rowspan="2">3. Care: Other Services, enabled or referred (associated clinics)</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['3. Care: Other Services, enabled or referred (associated clinics)'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['3. Care: Other Services, enabled or referred (associated clinics)'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['3. Care: Other Services, enabled or referred (associated clinics)'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    tableBody += '<tr><td rowspan="2">4. Care: Social Marketing Services</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['4. Care: Social Marketing Services'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['4. Care: Social Marketing Services'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['4. Care: Social Marketing Services'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    tableBody += '<tr><td rowspan="2">5. Care: Digital Health Intervention and Selfcare</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['5. Care: Digital Health Intervention and Selfcare'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['5. Care: Digital Health Intervention and Selfcare'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['5. Care: Digital Health Intervention and Selfcare'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`
    
    tableBody += '<tr><td rowspan="2">6. Advocacy</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['6. Advocacy'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['6. Advocacy'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['6. Advocacy'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    tableBody += '<tr><td rowspan="2">7. CSE</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['7. CSE'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['7. CSE'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['7. CSE'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    
    tableBody += '<tr><td rowspan="2">8. CSE Online, including social media</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['8. CSE Online, including social media'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['8. CSE Online, including social media'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['8. CSE Online, including social media'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`


    tableBody += '<tr><td rowspan="2">9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`


    tableBody += '<tr><td rowspan="2">10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    

    tableBody += '<tr><td rowspan="2">11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures</td>';
    tableBodySecond = `<tr>`;
    total = 0;
    for(let ou in list.maFA['11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures'][tei.year.end]) {
      tableBody += `<td>${ou}</td>`;
      tableBodySecond += `<td>${list.maFA['11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures'][tei.year.end][ou]}</td>`;
      total += Number(list.maFA['11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures'][tei.year.end][ou]);
    }
    tableBody += `<td>Total</td></tr>${tableBodySecond}<td>${total}</tr>`

    $('#tb-maFocusAreaBudget-spending').html(tableBody);

    //Focus area Ma list
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">Pillars</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;" colspan="10">Top Spenders</th>`
    // }
    tableHead += `</tr>`
    $('#th-maTopSpendors-spending').html(tableHead);

    modifiedArr = [];
    var counter = 0;
    for(let name in list.topSpendors) {
      modifiedArr[counter] = {
        name : name,
        ou: []
      }
      for(let ouName in list.topSpendors[name]) {
        modifiedArr[counter]['ou'].push({
          name: ouName,
          value: list.topSpendors[name][ouName][tei.year.end]
        })
        modifiedArr[counter]['ou'].sort((a, b) => b.value - a.value);
      }
      counter++;
    }
    tableBody = '';
    modifiedArr.forEach((val)=> {
      tableBody += `<tr><td>${val.name}</td>`
      for(let i=0; i<10; i++) tableBody += `<td>${val['ou'][i]['name']}- $${val['ou'][i]['value']}</td>`
      tableBody += `<tr>`
    });
    $('#tb-maTopSpendors-spending').html(tableBody);
    
    //Expense Category Spending
    tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Expense Category</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-expenseCategory-spending').html(tableHead);

    modifiedArr = [
      {
        name:"Direct Project Activities",
        value:listEC.ec[tei.year.end]['activities'] ? displayValue(listEC.ec[tei.year.end]['activities']): ''
      },
      {
        name: 'Personnel',
        value: listEC.ec[tei.year.end]['personnel'] ? displayValue(listEC.ec[tei.year.end]['personnel']): ''
      },
      {
        name: 'Commodities',
        value: listEC.ec[tei.year.end]['commodities'] ? displayValue(listEC.ec[tei.year.end]['commodities']): ''
      },
      {
        name: 'Indirect/support costs',
        value: listEC.ec[tei.year.end]['cost'] ? displayValue(listEC.ec[tei.year.end]['cost']): ''
      }
    ];
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    tableBody += "</tr>"
    $('#tb-expenseCategory-spending').html(tableBody);



    //Project region Spending
    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Country Spending EC ${tei.year.end}</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `
      <th style="background:#276696;color:white;text-align:center;">Direct Project Activities</th>
      <th style="background:#276696;color:white;text-align:center;">Personnel</th>
      <th style="background:#276696;color:white;text-align:center;">Commodities</th>
      <th style="background:#276696;color:white;text-align:center;">Indirect/support costs</th>
      `
    // }
    tableHead += `</tr>`
    $('#th-countryExpenseCategory-spending').html(tableHead);

    var tableBody = '';
    for(let ou in listEC.ecCountry) {
      tableBody += `<tr><td>${ou}</td>`;
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${(listEC.ecCountry[ou][tei.year.end] && listEC.ecCountry[ou][tei.year.end]['activities']) ? displayValue(listEC.ecCountry[ou][tei.year.end]['activities']): ''}</td>`
        tableBody += `<td>${(listEC.ecCountry[ou][tei.year.end] && listEC.ecCountry[ou][tei.year.end]['personnel']) ? displayValue(listEC.ecCountry[ou][tei.year.end]['personnel']): ''}</td>`
        tableBody += `<td>${(listEC.ecCountry[ou][tei.year.end] && listEC.ecCountry[ou][tei.year.end]['commodities']) ? displayValue(listEC.ecCountry[ou][tei.year.end]['commodities']): ''}</td>`
        tableBody += `<td>${(listEC.ecCountry[ou][tei.year.end] && listEC.ecCountry[ou][tei.year.end]['cost']) ? displayValue(listEC.ecCountry[ou][tei.year.end]['cost']): ''}</td>`
      // }
      tableBody += "</tr>"
    }
    $('#tb-countryExpenseCategory-spending').html(tableBody);


    //total MA Revenue
    tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;" colspan="2">MI Revenue</th></tr>`
    $('#th-maTotalIncome-revenue').html(tableHead);

    tableBody = '';
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<tr><td>${tei.year.end}</td><td>${listTI.ti[tei.year.end] ? displayValue(listTI.ti[tei.year.end]): ''}</td></tr>`;
      // }
    
    $('#tb-maTotalIncome-revenue').html(tableBody);

    //Focus area CW list
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">Category Wise</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-cwTotalIncome-revenue').html(tableHead);

    modifiedArr = [];
    for(let name in listTI.cw) {
      modifiedArr.push({
        name: name,
        value:(listTI.cw[name] && listTI.cw[name][tei.year.end]) ? displayValue(listTI.cw[name][tei.year.end]) :""
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    $('#tb-cwTotalIncome-revenue').html(tableBody);

    //Focus area SCW list
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">Sub-Category Wise</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-scwTotalIncome-revenue').html(tableHead);

    modifiedArr = [];
    for(let name in listTI.scw) {
      modifiedArr.push({
        name: name,
        value:(listTI.scw[name] && listTI.scw[name][tei.year.end]) ? displayValue(listTI.scw[name][tei.year.end]) :""
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    $('#tb-scwTotalIncome-revenue').html(tableBody);
    
    //Project region Spending
    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Income Sub Category ${tei.year.end}</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `
      <th style="background:#276696;color:white;text-align:center;">Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)</th>
      <th style="background:#276696;color:white;text-align:center;">Client/Patient fees</th>
      <th style="background:#276696;color:white;text-align:center;">Training, education, professional services and rentals</th>
      <th style="background:#276696;color:white;text-align:center;">Local/national: government</th>
      <th style="background:#276696;color:white;text-align:center;">Local/national: non-government</th>
      <th style="background:#276696;color:white;text-align:center;">Membership fees</th>
      <th style="background:#276696;color:white;text-align:center;">Non-operational income</th>
      <th style="background:#276696;color:white;text-align:center;">Other national income</th>
     <th style="background:#276696;color:white;text-align:center;"> Multilateral Agencies and Organizations</th>
      <th style="background:#276696;color:white;text-align:center;">Foreign Governments</th>
      <th style="background:#276696;color:white;text-align:center;">International Trusts and Foundations / NGOs</th>
      <th style="background:#276696;color:white;text-align:center;">Corporate / Business Sector</th>
      <th style="background:#276696;color:white;text-align:center;">Other International Income</th>
      <th style="background:#276696;color:white;text-align:center;">IPPF Unrestricted Grant</th>
      <th style="background:#276696;color:white;text-align:center;">IPPF Restricted Grant</th>
      `
    // }
    tableHead += `</tr>`
    $('#th-incomeSubCategory-spending').html(tableHead);

    var tableBody = '';
    for(let ou in listTI.countrySCWise) {
      tableBody += `<tr><td>${ou}</td>`;
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Client/Patient fees']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Client/Patient fees']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Training, education, professional services and rentals']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Training, education, professional services and rentals']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Local/national: government']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Local/national: government']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Local/national: non-government']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Local/national: non-government']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Membership fees']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Membership fees']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Non-operational income']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Non-operational income']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Other national income']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Other national income']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Multilateral Agencies and Organizations']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Multilateral Agencies and Organizations']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Foreign Governments']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Foreign Governments']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['International Trusts and Foundations / NGOs']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['International Trusts and Foundations / NGOs']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Corporate / Business Sector']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Corporate / Business Sector']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['Other International Income']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['Other International Income']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['IPPF Unrestricted Grant']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['IPPF Unrestricted Grant']): ''}</td>`
        tableBody += `<td>${(listTI.countrySCWise[ou][tei.year.end] && listTI.countrySCWise[ou][tei.year.end]['IPPF Restricted Grant']) ? displayValue(listTI.countrySCWise[ou][tei.year.end]['IPPF Restricted Grant']): ''}</td>`
      // }
      tableBody += "</tr>"
    }
    $('#tb-incomeSubCategory-spending').html(tableBody);

    //Focus area CSC list
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">Social enterprise income</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-cscTotalIncome-revenue').html(tableHead);

    modifiedArr = [];
    for(let name in listTI.csc) {
      modifiedArr.push({
        name: name,
        value:(listTI.csc[name] && listTI.csc[name][tei.year.end]) ? displayValue(listTI.csc[name][tei.year.end]) :""
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    $('#tb-cscTotalIncome-revenue').html(tableBody);


    //total MA Revenue
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">MA Unrestricted</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-maUnrestricted-income').html(tableHead);

    modifiedArr = [];
    var categoryWise = {
      none: 0,
      '0-20': 0,
      '20-40': 0,
      '40-60':0,
      '60-80': 0,
      '80-100':0
    }
    for(let ou in listTI.ippfUI) {
      modifiedArr.push({
        name: ou,
        num:listTI.ippfUI[ou][tei.year.end] ? displayValue(listTI.ippfUI[ou][tei.year.end]) :"",
        deno: listTI.ouic[ou][tei.year.end] ? displayValue(listTI.ouic[ou][tei.year.end]) :"",
        res: (listTI.ippfUI[ou][tei.year.end]  &&  listTI.ouic[ou][tei.year.end]) ? displayValue((listTI.ippfUI[ou][tei.year.end]/listTI.ouic[ou][tei.year.end])*100 ): ''
      })
    }
    modifiedArr.forEach(arr => {
      if(arr.res>0 && arr.res <= 20) categoryWise['0-20'] += 1;
      else if(arr.res>20 && arr.res <= 40) categoryWise['20-40'] += 1;
      else if(arr.res>40 && arr.res <= 60) categoryWise['40-60'] += 1;
      else if(arr.res>60 && arr.res <= 80) categoryWise['60-80'] += 1;
      else if(arr.res>80 && arr.res <= 100) categoryWise['80-100'] += 1;
      else categoryWise['none'] += 1;
    })
    tableBody = `<tr><td>No Funding</td><td>${categoryWise['none']}</td></tr>
      <tr><td>0-20</td><td>${categoryWise['0-20']}</td></tr>
      <tr><td>20-40</td><td>${categoryWise['20-40']}</td></tr>
      <tr><td>40-60</td><td>${categoryWise['40-60']}</td></tr>
      <tr><td>60-80</td><td>${categoryWise['60-80']}</td></tr>
      <tr><td>80-100</td><td>${categoryWise['80-100']}</td></tr>`;

    $('#tb-maUnrestricted-income').html(tableBody);


    //total MA Revenue
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">MA Unrestricted</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `
      <th style="background:#276696;color:white;text-align:center;">num</th>
      <th style="background:#276696;color:white;text-align:center;">Deno</th>
      <th style="background:#276696;color:white;text-align:center;">result</th>
      `
    // }
    tableHead += `</tr>`
    $('#th-maOUUnrestricted-income').html(tableHead);

    modifiedArr = [];
    for(let ou in listTI.ippfUI) {
      modifiedArr.push({
        name: ou,
        num:listTI.ippfUI[ou][tei.year.end] ? displayValue(listTI.ippfUI[ou][tei.year.end]) :"",
        deno: listTI.ouic[ou][tei.year.end] ? displayValue(listTI.ouic[ou][tei.year.end]) :"",
        res: (listTI.ippfUI[ou][tei.year.end]  &&  listTI.ouic[ou][tei.year.end]) ? displayValue((listTI.ippfUI[ou][tei.year.end]/listTI.ouic[ou][tei.year.end])*100 ): ''
      })
    }
    tableBody="";
    modifiedArr.forEach(arr => {
      tableBody += `<tr><td>${arr.name}</td><td>${arr.num}</td><td>${arr.deno}</td><td>${arr.res}</td></tr>`;
    })

    $('#tb-maOUUnrestricted-income').html(tableBody);

    // Core grant Income details
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">Core grants Unlocked</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-country-income').html(tableHead);

    modifiedArr = [];
    for(let ou in listCF.id) {
      modifiedArr.push({
        name: ou,
        value:listCF.id[ou][tei.year.end] ? displayValue(listCF.id[ou][tei.year.end]) :""
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
    });
    $('#tb-country-income').html(tableBody);

    // Core grant Income details
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">MA Project Budget</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-project-budget').html(tableHead);

    modifiedArr = [];
    for(let ou in listPB.pbc) {
      modifiedArr.push({
        name: ou,
        value:listPB.pbc[ou][tei.year.end] ? displayValue(listPB.pbc[ou][tei.year.end]) :""
      })
    }
    modifiedArr.sort((a, b) => b.value - a.value);
    tableBody = '';
    var totalBudget = 0;
    modifiedArr.forEach(val=> {
      tableBody += `<tr><td>${val.name}</td><td>${val.value}</td></tr>`;
      totalBudget += Number(val.value);
    });

    tableBody += `<tr><td>Total</td><td>${totalBudget}</td></tr>`;
    $('#tb-project-budget').html(tableBody);
    
    $("#loader").empty();

          
    // Localize content
    $('body').localize();
  }

  function getPillarBudgetFA(dataValuesOU, level2OU) {
    const dvPillarYrs = {};
    const dvMAPillar = {};
    const dvFocusAreaYrs = {};
    const dvMAFocusAreas = {};

    const totalProjects = {};
    const assignedProjects = {};
    
    const totalBugetProject = {};

    const regionBudgetProject = {};
    const regionBudgetTotal = {};
    const topSpendors = {}

    dataElements.projectFocusAreaNew.forEach((pfa,index) => {
      pfa.focusAreas.forEach(fa => {
        dataValuesOU.forEach(item => {

          var region = ''
          level2OU.forEach(parent=> parent.children.forEach(ou => {
            if(ou.name==item.orgUnit) region= parent.name
          }))
          
          for(let year = tei.year.start; year <= tei.year.end; year++) {
            if(item.dataValuesFA[year] && item.dataValuesFA[year][fa] && item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
              const val = JSON.parse(item.dataValuesFA[year][fa]);
              if(val.budget) {
                if(!topSpendors[val.pillar]) topSpendors[val.pillar] = {};
                if(!topSpendors[val.pillar][item.orgUnit]) topSpendors[val.pillar][item.orgUnit]= {};
                if(!topSpendors[val.pillar][item.orgUnit][year]) topSpendors[val.pillar][item.orgUnit][year]= 0;
                topSpendors[val.pillar][item.orgUnit][year] += Number(val.budget);

                if(region) {
                  if(!regionBudgetProject[region]) regionBudgetProject[region] = {};
                  if(!regionBudgetProject[region][val.pillar]) regionBudgetProject[region][val.pillar] = {};
                  if(!regionBudgetProject[region][val.pillar][year]) regionBudgetProject[region][val.pillar][year] = 0;
                  regionBudgetProject[region][val.pillar][year] += Number(val.budget); 

                  if(!regionBudgetTotal[region]) regionBudgetTotal[region] = {};
                  if(!regionBudgetTotal[region][year]) regionBudgetTotal[region][year] = 0;
                  regionBudgetTotal[region][year] += Number(val.budget); 
                
                }

                if(!dvPillarYrs[val.pillar]) dvPillarYrs[val.pillar] = {};
                if(!dvPillarYrs[val.pillar][year]) dvPillarYrs[val.pillar][year] = 0;
                dvPillarYrs[val.pillar][year] += Number(val.budget); 

                if(!totalBugetProject[year]) totalBugetProject[year] = 0;
                totalBugetProject[year] += Number(val.budget); 

                if(!totalProjects[year]) totalProjects[year] = 0;
                totalProjects[year] += 1;
                
                if(!assignedProjects[val.pillar]) assignedProjects[val.pillar] = {};
                if(!assignedProjects[val.pillar][year]) assignedProjects[val.pillar][year] = 0;
                assignedProjects[val.pillar][year] += 1;  
                
                if(!dvFocusAreaYrs[val.area]) dvFocusAreaYrs[val.area] = {};
                if(!dvFocusAreaYrs[val.area][year]) dvFocusAreaYrs[val.area][year] = 0;
                dvFocusAreaYrs[val.area][year] += Number(val.budget);  


                if(!dvMAFocusAreas[val.area]) dvMAFocusAreas[val.area] = {};
                if(!dvMAFocusAreas[val.area][year]) dvMAFocusAreas[val.area][year] = {};
                if(!dvMAFocusAreas[val.area][year][item.orgUnit]) dvMAFocusAreas[val.area][year][item.orgUnit] = 0;
                dvMAFocusAreas[val.area][year][item.orgUnit] += Number(val.budget);


                if(!dvMAPillar[val.pillar]) dvMAPillar[val.pillar] = {};
                if(!dvMAPillar[val.pillar][year]) dvMAPillar[val.pillar][year] = {};
                if(!dvMAPillar[val.pillar][year][item.orgUnit]) dvMAPillar[val.pillar][year][item.orgUnit] = 0;
                dvMAPillar[val.pillar][year][item.orgUnit] += Number(val.budget);

                if(!dvMAPillar[val.pillar]) dvMAPillar[val.pillar] = {};
                if(!dvMAPillar[val.pillar][year]) dvMAPillar[val.pillar][year] = {};
                if(!dvMAPillar[val.pillar][year][item.orgUnit]) dvMAPillar[val.pillar][year][item.orgUnit] = 0;
              }
            }
          }
        })
      })
    })
    return {
      pillars: dvPillarYrs, 
      maPillars: dvMAPillar, 
      fa: dvFocusAreaYrs, 
      maFA: dvMAFocusAreas, 
      totalProjects: totalProjects, 
      assignedProjects: assignedProjects, 
      totalBugetProject: totalBugetProject,
      regionBudgetProject: regionBudgetProject,
      regionBudgetTotal: regionBudgetTotal,
      topSpendors: topSpendors,
    };
  }

  function getBudgetEC(dataValuesOU) {
    const dvExpenseCategoryYrs = {};
    const countryExpenseCategory = {};
    dataElements.projectExpenseCategory.forEach((ec,index) => {
        dataValuesOU.forEach(item => {
          for(let year = tei.year.start; year <= tei.year.end; year++) {
          if(item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
            if(!dvExpenseCategoryYrs[year]) dvExpenseCategoryYrs[year] = {};

            if(!countryExpenseCategory[item.orgUnit]) countryExpenseCategory[item.orgUnit] = {};
            if(!countryExpenseCategory[item.orgUnit][year]) countryExpenseCategory[item.orgUnit][year] = {};

            if(item.dataValuesEC[year] && item.dataValuesEC[year][ec.personnel]) {
              if(!dvExpenseCategoryYrs[year]['personnel']) dvExpenseCategoryYrs[year]['personnel'] = 0;
              dvExpenseCategoryYrs[year]['personnel'] += Number(item.dataValuesEC[year][ec.personnel]);
              if(!countryExpenseCategory[item.orgUnit][year]['personnel']) countryExpenseCategory[item.orgUnit][year]['personnel'] = 0;
              countryExpenseCategory[item.orgUnit][year]['personnel']  += Number(item.dataValuesEC[year][ec.personnel]);
            }
            if(item.dataValuesEC[year] && item.dataValuesEC[year][ec.activities]) {
              if(!dvExpenseCategoryYrs[year]['activities']) dvExpenseCategoryYrs[year]['activities'] = 0;
              dvExpenseCategoryYrs[year]['activities'] += Number(item.dataValuesEC[year][ec.activities]);
              if(!countryExpenseCategory[item.orgUnit][year]['activities']) countryExpenseCategory[item.orgUnit][year]['activities'] = 0;
              countryExpenseCategory[item.orgUnit][year]['activities']  += Number(item.dataValuesEC[year][ec.activities]);
            }
            if(item.dataValuesEC[year] && item.dataValuesEC[year][ec.commodities]) {
              if(!dvExpenseCategoryYrs[year]['commodities']) dvExpenseCategoryYrs[year]['commodities'] = 0;
              dvExpenseCategoryYrs[year]['commodities'] += Number(item.dataValuesEC[year][ec.commodities]);
              if(!countryExpenseCategory[item.orgUnit][year]['commodities']) countryExpenseCategory[item.orgUnit][year]['commodities'] = 0;
              countryExpenseCategory[item.orgUnit][year]['commodities']  += Number(item.dataValuesEC[year][ec.commodities]);
            }
            if(item.dataValuesEC[year] && item.dataValuesEC[year][ec.cost]) {
              if(!dvExpenseCategoryYrs[year]['cost']) dvExpenseCategoryYrs[year]['cost'] = 0;
              dvExpenseCategoryYrs[year]['cost'] += Number(item.dataValuesEC[year][ec.cost]);
              if(!countryExpenseCategory[item.orgUnit][year]['cost']) countryExpenseCategory[item.orgUnit][year]['cost'] = 0;
              countryExpenseCategory[item.orgUnit][year]['cost']  += Number(item.dataValuesEC[year][ec.cost]);
            }
          }
          }
        })
    })
    return { ec: dvExpenseCategoryYrs,ecCountry: countryExpenseCategory };
  }

  function getPillarBudgetTI(dataValuesOU) {
    const dvTotalIncomeYrs = {};
    const totalCategoryRevenue = {};
    const totalSubCategoryRevenue = {};
    const unrestrictedIncome = {};
    const ippfUnrestrictedIncome = {};
    const ouUrestrictedIncome = {};
    const countrySubCategory = {};
    const countrySubCategoryDissAgre = {};
    // const totalUnrestrictedIncome = {};
    dataElements.projectTotalIncome.forEach(ti => {
        dataValuesOU.forEach(item => {
          if(!unrestrictedIncome[item.orgUnit]) unrestrictedIncome[item.orgUnit] = {}
          if(!ippfUnrestrictedIncome[item.orgUnit]) ippfUnrestrictedIncome[item.orgUnit] = {}
          if(!ouUrestrictedIncome[item.orgUnit]) ouUrestrictedIncome[item.orgUnit] = {}

          for(let year = tei.year.start; year <= tei.year.end; year++) {
            if(!unrestrictedIncome[item.orgUnit][year]) unrestrictedIncome[item.orgUnit][year] = 0;
            if(!ippfUnrestrictedIncome[item.orgUnit][year]) ippfUnrestrictedIncome[item.orgUnit][year] = 0;
            if(!ouUrestrictedIncome[item.orgUnit][year]) ouUrestrictedIncome[item.orgUnit][year] = 0;

            if(!dvTotalIncomeYrs[year]) dvTotalIncomeYrs[year] = 0;
            
            if(item.dataValuesTI[year] && item.dataValuesTI[year][ti.category]) {

              if(item.dataValuesTI[year][ti.restricted]) {
                dvTotalIncomeYrs[year] += Number(item.dataValuesTI[year][ti.restricted]);
                ouUrestrictedIncome[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.restricted]);
              }
              if(item.dataValuesTI[year][ti.unrestricted]) {
                dvTotalIncomeYrs[year] += Number(item.dataValuesTI[year][ti.unrestricted]);
                ouUrestrictedIncome[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
                unrestrictedIncome[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
                
              }
              
              if(!totalCategoryRevenue[item.dataValuesTI[year][ti.category]]) totalCategoryRevenue[item.dataValuesTI[year][ti.category]] = {};
              if(!totalCategoryRevenue[item.dataValuesTI[year][ti.category]][year]) totalCategoryRevenue[item.dataValuesTI[year][ti.category]][year] = 0;
              if(item.dataValuesTI[year][ti.restricted]) totalCategoryRevenue[item.dataValuesTI[year][ti.category]][year] += Number(item.dataValuesTI[year][ti.restricted]);
              if(item.dataValuesTI[year][ti.unrestricted]) totalCategoryRevenue[item.dataValuesTI[year][ti.category]][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
            }

            if(item.dataValuesTI[year] && item.dataValuesTI[year][ti.subCategory]) {
              if(!countrySubCategoryDissAgre[item.orgUnit]) countrySubCategoryDissAgre[item.orgUnit] = {};
              if(!countrySubCategoryDissAgre[item.orgUnit][year]) countrySubCategoryDissAgre[item.orgUnit][year] = {};
              if(!countrySubCategoryDissAgre[item.orgUnit][year][item.dataValuesTI[year][ti.subCategory]]) countrySubCategoryDissAgre[item.orgUnit][year][item.dataValuesTI[year][ti.subCategory]] = 0;

              if(!countrySubCategory[item.orgUnit]) countrySubCategory[item.orgUnit] = {};
              if(!countrySubCategory[item.orgUnit][year]) countrySubCategory[item.orgUnit][year] = 0;


              if(!totalSubCategoryRevenue[item.dataValuesTI[year][ti.subCategory]]) totalSubCategoryRevenue[item.dataValuesTI[year][ti.subCategory]] = {};
              if(!totalSubCategoryRevenue[item.dataValuesTI[year][ti.subCategory]][year]) totalSubCategoryRevenue[item.dataValuesTI[year][ti.subCategory]][year] = 0;
              if(item.dataValuesTI[year][ti.restricted]) {
                totalSubCategoryRevenue[item.dataValuesTI[year][ti.subCategory]][year] += Number(item.dataValuesTI[year][ti.restricted]);
                countrySubCategoryDissAgre[item.orgUnit][year][item.dataValuesTI[year][ti.subCategory]] += Number(item.dataValuesTI[year][ti.restricted]);

                if(item.dataValuesTI[year][ti.subCategory]== 'Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)') countrySubCategory[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.restricted]);
                if(item.dataValuesTI[year][ti.subCategory]== 'Client/Patient fees') countrySubCategory[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.restricted]);
                if(item.dataValuesTI[year][ti.subCategory]== 'Training, education, professional services and rentals') countrySubCategory[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.restricted]);
                if(item.dataValuesTI[year][ti.subCategory]== 'Membership fees') countrySubCategory[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.restricted]);
              }
              if(item.dataValuesTI[year][ti.unrestricted]) {
                totalSubCategoryRevenue[item.dataValuesTI[year][ti.subCategory]][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
                countrySubCategoryDissAgre[item.orgUnit][year][item.dataValuesTI[year][ti.subCategory]] += Number(item.dataValuesTI[year][ti.unrestricted]);
                
                if(item.dataValuesTI[year][ti.subCategory]== 'IPPF Unrestricted Grant') ippfUnrestrictedIncome[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
                if(item.dataValuesTI[year][ti.subCategory]== 'Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)') countrySubCategory[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
                if(item.dataValuesTI[year][ti.subCategory]== 'Client/Patient fees') countrySubCategory[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
                if(item.dataValuesTI[year][ti.subCategory]== 'Training, education, professional services and rentals') countrySubCategory[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
                if(item.dataValuesTI[year][ti.subCategory]== 'Membership fees') countrySubCategory[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
              }

            }
          }
        })
    })
    return { ti: dvTotalIncomeYrs,  cw: totalCategoryRevenue, scw: totalSubCategoryRevenue, csc: countrySubCategory, countrySCWise: countrySubCategoryDissAgre, ui: unrestrictedIncome, ippfUI:ippfUnrestrictedIncome,  ouic: ouUrestrictedIncome};
  }

  function getPillarBudgetCF(dataValuesOU) {
    const totalCoreFunding = {};
    
    dataElements.valuesCoreFunding.donors.forEach(ti => {
        dataValuesOU.forEach(item => {
        if(!totalCoreFunding[item.orgUnit]) totalCoreFunding[item.orgUnit] = {};
          for(let year = tei.year.start; year <= tei.year.end; year++) {
          if(item.dataValuesCF[year] && item.dataValuesCF[year][ti.amountLocked]) {
            if(!totalCoreFunding[item.orgUnit][year]) totalCoreFunding[item.orgUnit][year] = 0;
            totalCoreFunding[item.orgUnit][year] += Number(item.dataValuesCF[year][ti.amountLocked]);
          }
        }
      })
    })
    return {id: totalCoreFunding};
  }

  function getPillarBudgetPB(dataValuesOU) {
    const totalProjectBudgetCountry = {};
    
    dataElements.projectBudget.forEach((pb,index) => {
        dataValuesOU.forEach(item => {
        if(!totalProjectBudgetCountry[item.orgUnit]) totalProjectBudgetCountry[item.orgUnit] = {};
          for(let year = tei.year.start; year <= tei.year.end; year++) {
          if(item.dataValuesPB[year] && item.dataValuesPB[year][pb.budget] && item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
            if(!totalProjectBudgetCountry[item.orgUnit][year]) totalProjectBudgetCountry[item.orgUnit][year] = 0;
            totalProjectBudgetCountry[item.orgUnit][year] += Number(item.dataValuesPB[year][pb.budget]);
          }
        }
      })
    })
    return {pbc: totalProjectBudgetCountry};
  }


  fetchOrganizationUnitUid();
});


function displayValue(input) {
 let num = typeof input === "string" ? parseFloat(input) : input;

 if (isNaN(num)) {
     return "";
 }

 if (num % 1 === 0) {
    return num.toString();
 } else {
    return num.toFixed(2);
 }
}

function colorCode(num) {
  if(Number(num) == 0) return ''
  else return 'red'
}
