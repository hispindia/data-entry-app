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
        if(data.id !== "M5zQapPyTZI") return;

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
          );
            
          let dataValuesFA = getProgramStageEvents(filteredPrograms, programStage.auProjectFocusArea, program.auProjectFocusArea ,dataElements.year.id) //data values year wise
          let dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory ,dataElements.year.id) //data values year wise
          let dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails ,dataElements.year.id) //data values year wise
          let dataValuesID = getProgramStageEvents(filteredPrograms, programStage.auIncomeByDonor, program.auIncomeDetails ,dataElements.year.id) //data values year wise
            
          dataValuesOU.push({
            orgUnit: ou.name,
            ouId: ou.id,
            dataValuesFA: dataValuesFA,
            dataValuesEC: dataValuesEC,
            dataValuesTI: dataValuesTI,
            dataValuesID: dataValuesID
          })          
        }
      }
    }
    
    populateProgramEvents(level2OU,dataValuesOU);
    
  }

  // Function to populate program events data
  function populateProgramEvents(level2OU,dataValuesOU) {
    const list = getPillarBudgetFA(dataValuesOU,level2OU);
    const listEC = getBudgetEC(dataValuesOU);
    const listTI = getPillarBudgetTI(dataValuesOU);
    const listID = getPillarBudgetID(dataValuesOU);

    //Pillar Spending
    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Pillar</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-pillar-spending').html(tableHead);

    var arr = [];
    for(let name in list.pillars) {
      arr.push({
        name: name,
        value: list.pillars[name][tei.year.end] ? list.pillars[name][tei.year.end]: ''
      })
    }
    arr.sort((a, b) => a.value - b.value);
    var tableBody = '';
    for(let name in list.pillars) {
      tableBody += `<tr><td>${name}</td>`;

      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${(list.pillars[name] && list.pillars[name][tei.year.end]) ?  displayValue(list.pillars[name][tei.year.end]) :""}</td>`
      // }
      tableBody += "</tr>"
    }
    $('#tb-pillar-spending').html(tableBody);

    //Pillar Project Spending
    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Project Pillar</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-project-spending').html(tableHead);

    var tableBody = '';
    for(let name in list.assignedProjects) {
      tableBody += `<tr><td>${name}</td>`;
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${(list.assignedProjects[name] && list.assignedProjects[name][tei.year.end] && list.totalProjects[tei.year.end]) ?  displayValue((list.assignedProjects[name][tei.year.end]/list.totalProjects[tei.year.end])*100) :""}</td>`
      // }
      tableBody += "</tr>"
    }
    $('#tb-project-spending').html(tableBody);

    //Project Pillar Spending
    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Pillar Spending</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-projectPercent-spending').html(tableHead);

    var tableBody = '';
    for(let name in list.pillars) {
      tableBody += `<tr><td>${name}</td>`;
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${(list.pillars[name] && list.pillars[name][tei.year.end] && list.totalBugetProject[tei.year.end]) ?   displayValue((list.pillars[name][tei.year.end]/list.totalBugetProject[tei.year.end])*100):""}</td>`
      // }
      tableBody += "</tr>"
    }
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

    tableBody = '';
    for(let name in list.fa) {
      tableBody += `<tr><td>${name}</td>`;
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${(list.fa[name] && list.fa[name][tei.year.end]) ?  displayValue(list.fa[name][tei.year.end]) :""}</td>`
      // }
      tableBody += "</tr>"
    }
    $('#tb-focusArea-spending').html(tableBody);

    //Focus area Ma list
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">MA FocusArea</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-maFocusArea-spending').html(tableHead);

    tableBody = '';
    for(let name in list.maFA) {
      tableBody += `<tr><td>${name}</td>`;      
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${(list.maFA[name] && list.maFA[name][tei.year.end]) ?  Object.keys(list.maFA[name][tei.year.end]).length :""}</td>`
      // }
      tableBody += `</tr>`
    }
    $('#tb-maFocusArea-spending').html(tableBody);

    //Expense Category Spending
    tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">Expense Category</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-expenseCategory-spending').html(tableHead);

    tableBody = '';
    tableBody += `<tr><td>Direct Project Activities</td>`;
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        if(listEC.ec[tei.year.end]['activities']) tableBody += `<td>${displayValue(listEC.ec[tei.year.end]['activities'])}</td>`
        else tableBody += "<td></td>"
      // }
    tableBody += "</tr><tr><td>Personnel</td>";
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        if(listEC.ec[tei.year.end]['personnel']) tableBody += `<td>${displayValue(listEC.ec[tei.year.end]['personnel'])}</td>`
        else tableBody += "<td></td>"
      // }
    tableBody += "</tr><tr><td>Commodities</td>";
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        if(listEC.ec[tei.year.end]['commodities']) tableBody += `<td>${displayValue(listEC.ec[tei.year.end]['commodities'])}</td>`
        else tableBody += "<td></td>"
      // }
    tableBody += "</tr><tr><td>Indirect/support costs</td>";
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        if(listEC.ec[tei.year.end]['cost']) tableBody += `<td>${displayValue(listEC.ec[tei.year.end]['cost'])}</td>`
        else tableBody += "<td></td>"
      // }
    tableBody += "</tr>"
    $('#tb-expenseCategory-spending').html(tableBody);


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

    tableBody = '';
    for(let name in listTI.cw) {
      tableBody += `<tr><td>${name}</td>`;      
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${(listTI.cw[name] && listTI.cw[name][tei.year.end]) ? displayValue(listTI.cw[name][tei.year.end]) :""}</td>`
      // }
      tableBody += `</tr>`
    }
    $('#tb-cwTotalIncome-revenue').html(tableBody);

    //total MA Revenue
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">MA Unrestricted</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-maUnrestricted-income').html(tableHead);

    tableBody = '';
    for(let ou in listTI.ui) {
      tableBody += `<tr><td>${ou}</td>`;      
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${listTI.ui[ou][tei.year.end] ? displayValue(listTI.ui[ou][tei.year.end]) :""}</td>`
      // }
      tableBody += `</tr>`
    }
    $('#tb-maUnrestricted-income').html(tableBody);

    // Core grant Income details
    tableHead = `<tr><th style="background:#276696;color:white;text-align:center;">Core grants Unlocked</th>`
    // for(let year = tei.year.start; year <=tei.year.end;year++) {
      tableHead += `<th style="background:#276696;color:white;text-align:center;">${tei.year.end}</th>`
    // }
    tableHead += `</tr>`
    $('#th-country-income').html(tableHead);

    tableBody = '';
    for(let ou in listID.id) {
      tableBody += `<tr><td>${ou}</td>`;      
      // for(let year = tei.year.start; year <=tei.year.end; year++) {
        tableBody += `<td>${listID.id[ou][tei.year.end] ? displayValue(listID.id[ou][tei.year.end]) :""}</td>`
      // }
      tableBody += `</tr>`
    }
    $('#tb-country-income').html(tableBody);
    
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

    dataElements.projectFocusAreaNew.forEach(pfa => {
      pfa.focusAreas.forEach(fa => {
        dataValuesOU.forEach(item => {
          var region = ''
          level2OU.forEach(parent=> parent.children.forEach(ou => {
            if(ou.name==item.orgUnit) region= parent.name
          }))
          
          for(let year = tei.year.start; year <= tei.year.end; year++) {
            if(item.dataValuesFA[year]&& item.dataValuesFA[year][fa]) {
              const val = JSON.parse(item.dataValuesFA[year][fa]);
              if(val.budget) {
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

                if(!dvMAPillar[val.area]) dvMAPillar[val.area] = {};
                if(!dvMAPillar[val.area][year]) dvMAPillar[val.area][year] = {};
                dvMAPillar[val.area][year][item.orgUnit] = true;


                if(!dvMAFocusAreas[val.area]) dvMAFocusAreas[val.area] = {};
                if(!dvMAFocusAreas[val.area][year]) dvMAFocusAreas[val.area][year] = {};
                dvMAFocusAreas[val.area][year][item.orgUnit] = true;
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
      regionBudgetTotal: regionBudgetTotal
    };
  }

  function getBudgetEC(dataValuesOU) {
    const dvExpenseCategoryYrs = {};
    dataElements.projectExpenseCategory.forEach(ec => {
        dataValuesOU.forEach(item => {
          for(let year = tei.year.start; year <= tei.year.end; year++) {
            if(!dvExpenseCategoryYrs[year]) dvExpenseCategoryYrs[year] = {}
            if(item.dataValuesEC[year] && item.dataValuesEC[year][ec.personnel]) {
              if(!dvExpenseCategoryYrs[year]['personnel']) dvExpenseCategoryYrs[year]['personnel'] = 0;
              dvExpenseCategoryYrs[year]['personnel'] += Number(item.dataValuesEC[year][ec.personnel]);
            }
            if(item.dataValuesEC[year] && item.dataValuesEC[year][ec.activities]) {
              if(!dvExpenseCategoryYrs[year]['activities']) dvExpenseCategoryYrs[year]['activities'] = 0;
              dvExpenseCategoryYrs[year]['activities'] += Number(item.dataValuesEC[year][ec.activities]);
            }
            if(item.dataValuesEC[year] && item.dataValuesEC[year][ec.commodities]) {
              if(!dvExpenseCategoryYrs[year]['commodities']) dvExpenseCategoryYrs[year]['commodities'] = 0;
              dvExpenseCategoryYrs[year]['commodities'] += Number(item.dataValuesEC[year][ec.commodities]);
            }
            if(item.dataValuesEC[year] && item.dataValuesEC[year][ec.cost]) {
              if(!dvExpenseCategoryYrs[year]['cost']) dvExpenseCategoryYrs[year]['cost'] = 0;
              dvExpenseCategoryYrs[year]['cost'] += Number(item.dataValuesEC[year][ec.cost]);
            }
           
          }
        })
    })
    return { ec: dvExpenseCategoryYrs};
  }

  function getPillarBudgetTI(dataValuesOU) {
    const dvTotalIncomeYrs = {};
    const totalCategoryRevenue = {};
    const unrestrictedIncome = {};
    // const totalUnrestrictedIncome = {};
    dataElements.projectTotalIncome.forEach(ti => {
        dataValuesOU.forEach(item => {
          if(!unrestrictedIncome[item.orgUnit]) unrestrictedIncome[item.orgUnit] = {}
          // if(!totalUnrestrictedIncome[item.orgUnit]) totalUnrestrictedIncome[item.orgUnit] = {}

          for(let year = tei.year.start; year <= tei.year.end; year++) {
            if(!unrestrictedIncome[item.orgUnit][year]) unrestrictedIncome[item.orgUnit][year] = 0;

            if(!dvTotalIncomeYrs[year]) dvTotalIncomeYrs[year] = 0;
            if(item.dataValuesTI[year][ti.restricted]) dvTotalIncomeYrs[year] += Number(item.dataValuesTI[year][ti.restricted]);
            if(item.dataValuesTI[year][ti.unrestricted]) {
              dvTotalIncomeYrs[year] += Number(item.dataValuesTI[year][ti.unrestricted]);
              unrestrictedIncome[item.orgUnit][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
              // totalUnrestrictedIncome
            }
            
            if(item.dataValuesTI[year][ti.category]) {
              if(!totalCategoryRevenue[item.dataValuesTI[year][ti.category]]) totalCategoryRevenue[item.dataValuesTI[year][ti.category]] = {};
              if(!totalCategoryRevenue[item.dataValuesTI[year][ti.category]][year]) totalCategoryRevenue[item.dataValuesTI[year][ti.category]][year] = 0;
              if(item.dataValuesTI[year][ti.restricted]) totalCategoryRevenue[item.dataValuesTI[year][ti.category]][year] += Number(item.dataValuesTI[year][ti.restricted]);
              if(item.dataValuesTI[year][ti.unrestricted]) totalCategoryRevenue[item.dataValuesTI[year][ti.category]][year] += Number(item.dataValuesTI[year][ti.unrestricted]);
            }
          }
        })
    })
    return { ti: dvTotalIncomeYrs, cw: totalCategoryRevenue, ui: unrestrictedIncome};
  }

  function getPillarBudgetID(dataValuesOU) {
    const totalIncomeCountry = {};
    
    dataElements.incomeByDonor.forEach(ti => {
        dataValuesOU.forEach(item => {
        if(!totalIncomeCountry[item.orgUnit]) totalIncomeCountry[item.orgUnit] = {};
          for(let year = tei.year.start; year <= tei.year.end; year++) {
          if(item.dataValuesID[year][ti.income]) {
            if(!totalIncomeCountry[item.orgUnit][year]) totalIncomeCountry[item.orgUnit][year] = 0;
            totalIncomeCountry[item.orgUnit][year] += Number(item.dataValuesID[year][ti.income]);
          }
        }
      })
    })
    return {id: totalIncomeCountry};
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
