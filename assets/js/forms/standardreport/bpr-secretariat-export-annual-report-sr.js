
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
        $('.aoc-users').show();
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
          if (orgUnits.level == 1) {
            level2OU = orgUnits.children;
          } else if (orgUnits.level == 2) {
            level2OU.push(orgUnits);
          } else if (orgUnits.parent) {
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
    
    const year = document.getElementById("year-update").value;
    dataElements.periodicity.value = document.getElementById("reporting-periodicity").value;

    var dataValuesOU = [];
    for (let headOU of level2OU) {
      regionMA[headOU] = {
        totalBudget: 0
      }
      headOU.children.sort((a, b) => a.name.localeCompare(b.name));
      for (let ou of headOU.children) {
        $("#loader").html(`<div><h5 class="text-center">Loading</h5> <h5 class="text-center">${ou.name}</h5></div>`);

        const event = await events.get(ou.id);

        var attributes = {};
        if (event.trackedEntityInstances.length && event.trackedEntityInstances[0].attributes) {
          event.trackedEntityInstances[0].attributes.forEach(attr => attributes[attr.attribute] = attr.value);
        }

        if (event.trackedEntityInstances.length) {
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) =>
               enroll.program == program.arProjectFocusArea
            || enroll.program == program.arProjectExpenseCategory
            || enroll.program == program.auProjectDescription
            || enroll.program == program.arOrganisationDetails
            || enroll.program == program.reportFeedback
            || enroll.program == program.auIncomeDetails
            || enroll.program == program.arTotalIncome
            || enroll.program == program.auCommodities
          );
          
          let dataValuesFA = getProgramStagePeriodicity(filteredPrograms, program.arProjectFocusArea, programStage.arProjectFocusArea, { id: dataElements.year.id, value: year }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value });//data values year wise
          let dataValuesRO = getProgramStagePeriodicity(filteredPrograms, program.reportFeedback, programStage.arROFeedback, { id: dataElements.year.id, value: year }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value });//data values year wise
          let dataValuesOD = getProgramStagePeriodicity(filteredPrograms, program.arOrganisationDetails, programStage.arMembershipDetails, { id: dataElements.year.id, value: year }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value });//data values year wise
          let dataValuesPD = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, dataElements.year.id) //data values year wise
          let dataValuesEC = getProgramStagePeriodicity(filteredPrograms, program.arProjectExpenseCategory, programStage.arProjectExpenseCategory, { id: dataElements.year.id, value: year }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value }); //data values year wise
          let dataValuesTI = getProgramStagePeriodicity(filteredPrograms, program.arTotalIncome, programStage.arTotalIncome, { id: dataElements.year.id, value: year }, { id: dataElements.periodicity.id, value: dataElements.periodicity.value });//data values year wise
          let dataValuesID = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, dataElements.year.id) //data values year wise
         
          dataValuesOU.push({
            orgUnit: ou.name,
            ouId: ou.id,
            attributes,
            dataValuesOD,
            dataValuesPD,
            dataValuesID,
            dataValuesFA,
            dataValuesEC,
            dataValuesRO,
            dataValuesTI,
          })
        }
      }
    }

    populateProgramEvents(level2OU, dataValuesOU);

  }

  // Function to populate program events data
  function populateProgramEvents(level2OU, dataValuesOU) {
    // const list = getPillarBudgetFA(dataValuesOU, level2OU);

    const listOD = getOrganisationDetails(dataValuesOU, level2OU);
    document.getElementById('th-project-organisationDetails').innerHTML = listOD.tableHead;
    document.getElementById('tb-project-organisationDetails').innerHTML = listOD.tableRow;

    const listEB = getExpenseBudget(dataValuesOU, level2OU);
    document.getElementById('th-project-expBudget').innerHTML = listEB.tableHead;
    document.getElementById('tb-project-expBudget').innerHTML = listEB.tableRow;

    const listTI = getTotalIncome(dataValuesOU, level2OU);
    document.getElementById('th-project-totalIncome').innerHTML = listTI.tableHead;
    document.getElementById('tb-project-totalIncome').innerHTML = listTI.tableRow;

    const listAOC = getAOCReport(dataValuesOU, level2OU);
    document.getElementById('th-project-aocReport').innerHTML = listAOC.tableHead;
    document.getElementById('tb-project-aocReport').innerHTML = listAOC.tableRow;
    $("#loader").empty();


    // Localize content
    $('body').localize();
  }

  function getExpenseBudget(dataValuesOU, level2OU) {

    const year = document.getElementById("year-update").value;

    const deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
        style: ''
      },
      {
        id: 'Lv8wUjXV8fl',
        name: 'Affiliate Code',
        style: ''
      },
      {
        id: 'expBudget',
        name: `2.2. Total ${year} Expense budget`,
        style: 'background:#4ea72e;'
      },
      {
        id: 'focusArea1',
        name: '1. Care: Static Clinic',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea2',
        name: '2. Care: Outreach, mobile clinic, Community-based, delivery',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea3',
        name: '3. Care: Other Services, enabled or referred (associated clinics)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea4',
        name: '4. Care: Social Marketing Services',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea5',
        name: '5. Care: Digital Health Intervention and Selfcare',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea6',
        name: '6. Advocacy',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea7',
        name: '7. CSE',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea8',
        name: '8. CSE Online, including social media',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea9',
        name: '9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea10',
        name: '10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea11',
        name: '11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'totalFocusArea',
        name: 'Total in $ (Control)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea1Per',
        name: '1. Care: Static Clinic as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea2Per',
        name: '2. Care: Outreach, mobile clinic, Community-based, delivery as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea3Per',
        name: '3. Care: Other Services, enabled or referred (associated clinics) as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea4Per',
        name: '4. Care: Social Marketing Services as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea5Per',
        name: '5. Care: Digital Health Intervention and Selfcare as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea6Per',
        name: '6. Advocacy as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea7Per',
        name: '7. CSE as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea8Per',
        name: '8. CSE Online, including social media as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea9Per',
        name: '9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea10Per',
        name: '10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'focusArea11Per',
        name: '11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures as percentage',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'totalFocusAreaPer',
        name: 'Total percentage (control)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'pillar1',
        name: '1. Center Care on People',
        style: 'background:#61cbf3;'
      },
      {
        id: 'pillar1Per',
        name: '1. Center Care on People as percentage',
        style: 'background:#61cbf3;'
      },
      {
        id: 'pillar2',
        name: '2. Move the Sexuality Agenda',
        style: 'background:#61cbf3;'
      },
      {
        id: 'pillar2Per',
        name: '2. Move the Sexuality Agenda as percentage',
        style: 'background:#61cbf3;'
      },
      {
        id: 'pillar3',
        name: '3. Solidarity for Change',
        style: 'background:#61cbf3;'
      },
      {
        id: 'pillar3Per',
        name: '3. Solidarity for Change as percentage',
        style: 'background:#61cbf3;'
      },
      {
        id: 'pillar4',
        name: '4. Nurture Our Federation',
        style: 'background:#61cbf3;'
      },
      {
        id: 'pillar4Per',
        name: '4. Nurture Our Federation as percentage',
        style: 'background:#61cbf3;'
      },
      {
        id: 'totalPillarPer',
        name: 'Total percentage (control)',
        style: 'background:#61cbf3;'
      },
      {
        id: 'totalFocusArea',
        name: 'Total in $ (control)',
        style: 'background:#61cbf3;'
      },
      {
        id: 'personnel',
        name: '2.4. Total Personnel',
        style: 'background:#e97132;'
      },
      {
        id: 'personnelPer',
        name: '2.4. Total Personnel as percentage',
        style: 'background:#e97132;'
      },
      {
        id: 'activities',
        name: '2.4. Total Direct Project Activites',
        style: 'background:#e97132;'
      },
      {
        id: 'activitiesPer',
        name: '2.4. Total Direct Project Activites as percentage',
        style: 'background:#e97132;'
      },
      {
        id: 'commodities',
        name: '2.4. Total Commodities',
        style: 'background:#e97132;'
      },
      {
        id: 'commoditiesPer',
        name: '2.4. Total Commodities as percentage',
        style: 'background:#e97132;'
      },
      {
        id: 'cost',
        name: '2.4. Total Indirect / Support cost',
        style: 'background:#e97132;'
      },
      {
        id: 'costPer',
        name: '2.4. Total Indirect / Support cost as percentage',
        style: 'background:#e97132;'
      },
      {
        id: 'expPer',
        name: 'Total percentage (control)',
        style: 'background:#e97132;'
      },
      {
        id: 'totalExp',
        name: 'Total in $ (control)',
        style: 'background:#e97132;'
      },
    ]
    var tableHead = `<tr><td style="font-weight:bold">Region</td><td style="font-weight:bold">Affiliate Name</td>`;
    deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
    tableHead += '</tr>';

    var tableRow = "";
    dataValuesOU.forEach(item => {
      level2OU.forEach(parent => parent.children.forEach(ou => {
        if (ou.name == item.orgUnit) region = parent.name
      }))
      tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;

      var values = {
        ...item.attributes
      };

      for(let i = 1; i <=11; i++) {
        values[`focusArea${i}`] = 0;
        values[`focusArea${i}Per`] = 0;
        values[`pillar${i}`] = 0;
        values[`pillar${i}Per`] = 0;
      }

      values['totalFocusArea'] = 0;
      values['totalFocusAreaPer'] = 0;
      values['totalPillar'] = 0;
      values['totalPillarPer'] = 0;
      values['expBudget'] = 0;
      
      values['personnel'] = 0;
      values['personnelPer'] = 0;
      values['activities'] = 0;
      values['activitiesPer'] = 0;
      values['commodities'] = 0;
      values['commoditiesPer'] = 0;
      values['cost'] = 0;
      values['costPer'] = 0;
      values['expPer'] = 0;
      values['totalExp'] = 0;

      values['expBudget'] = item.dataValuesEC['zGn5c7EZLr0']?displayValue(item.dataValuesEC['zGn5c7EZLr0']): '';

      dataElements.projectFocusAreaNew.forEach((pfa, index) => {
        pfa.focusAreas.forEach(fa => {
          if (item.dataValuesFA[fa] && item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
            const val = JSON.parse(item.dataValuesFA[fa]);
            if(val.expense) {
            if (val.area == '1. Care: Static Clinic') values['focusArea1'] += Number(val.expense);
            if (val.area == '2. Care: Outreach, mobile clinic, Community-based, delivery') values['focusArea2'] += Number(val.expense);
            if (val.area == '3. Care: Other Services, enabled or referred (associated clinics)') values['focusArea3'] += Number(val.expense);
            if (val.area == '4. Care: Social Marketing Services') values['focusArea4'] += Number(val.expense);
            if (val.area == '5. Care: Digital Health Intervention and Selfcare') values['focusArea5'] += Number(val.expense);
            if (val.area == '6. Advocacy') values['focusArea6'] += Number(val.expense);
            if (val.area == '7. CSE') values['focusArea7'] += Number(val.expense);
            if (val.area == '8. CSE Online, including social media') values['focusArea8'] += Number(val.expense);
            if (val.area == '9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting') values['focusArea9'] += Number(val.expense);
            if (val.area == '10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles') values['focusArea10'] += Number(val.expense);
            if (val.area == '11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures') values['focusArea11'] += Number(val.expense);

            if (val.pillar == '1. Center Care on People') values['pillar1'] += Number(val.expense);
            else if (val.pillar == '2. Move the Sexuality Agenda')values['pillar2'] += Number(val.expense);
            else if (val.pillar == '3. Solidarity for Change') values['pillar3'] += Number(val.expense);
            else if (val.pillar == '4. Nurture Our Federation') values['pillar4'] += Number(val.expense);

            }
          }
        })
      })

      dataElements.arProjectExpenseCategory.forEach((pec, index) => {
        if(item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
          if( item.dataValuesEC[pec.actualExpense.personnel]) values['personnel'] +=  Number(item.dataValuesEC[pec.actualExpense.personnel]);
          if( item.dataValuesEC[pec.actualExpense.activities]) values['activities'] +=  Number(item.dataValuesEC[pec.actualExpense.activities]);
          if( item.dataValuesEC[pec.actualExpense.commodities]) values['commodities'] +=  Number(item.dataValuesEC[pec.actualExpense.commodities]);
          if( item.dataValuesEC[pec.actualExpense.cost]) values['cost'] +=  Number(item.dataValuesEC[pec.actualExpense.cost]);
        }      
      })

      values['personnelPer'] = (values['expBudget'] && values['personnel'] && values['personnel']/values['expBudget'] != "Infinity") ? (values['personnel']/values['expBudget']*100).toFixed(2): '';
      values['activitiesPer'] = (values['expBudget'] && values['activities'] && values['activities']/values['expBudget'] != "Infinity") ? (values['activities']/values['expBudget']*100).toFixed(2): '';
      values['commoditiesPer'] = (values['expBudget'] && values['commodities'] && values['commodities']/values['expBudget'] != "Infinity") ? (values['commodities']/values['expBudget']*100).toFixed(2): '';
      values['costPer'] = (values['expBudget'] && values['cost'] && values['cost']/values['expBudget'] != "Infinity") ? (values['cost']/values['expBudget']*100).toFixed(2): '';
      values['expPer'] = Math.round(Number(values['personnelPer']) + Number(values['activitiesPer']) + Number(values['commoditiesPer']) + Number(values['costPer']));
      values['totalExp'] = Number(values['personnel']) + Number(values['activities']) + Number(values['commodities']) + Number(values['cost']);

      values['focusArea1Per'] = (values['expBudget'] && values['focusArea1'] && values['focusArea1']/values['expBudget'] != "Infinity") ? (values['focusArea1']/values['expBudget']*100).toFixed(2): '';
      values['focusArea2Per'] = (values['expBudget'] && values['focusArea2'] && values['focusArea2']/values['expBudget'] != "Infinity") ? (values['focusArea2']/values['expBudget']*100).toFixed(2): '';
      values['focusArea3Per'] = (values['expBudget'] && values['focusArea3'] && values['focusArea3']/values['expBudget'] != "Infinity") ? (values['focusArea3']/values['expBudget']*100).toFixed(2): '';
      values['focusArea4Per'] = (values['expBudget'] && values['focusArea4'] && values['focusArea4']/values['expBudget'] != "Infinity") ? (values['focusArea4']/values['expBudget']*100).toFixed(2): '';
      values['focusArea5Per'] = (values['expBudget'] && values['focusArea5'] && values['focusArea5']/values['expBudget'] != "Infinity") ? (values['focusArea5']/values['expBudget']*100).toFixed(2): '';
      values['focusArea6Per'] = (values['expBudget'] && values['focusArea6'] && values['focusArea6']/values['expBudget'] != "Infinity") ? (values['focusArea6']/values['expBudget']*100).toFixed(2): '';
      values['focusArea7Per'] = (values['expBudget'] && values['focusArea7'] && values['focusArea7']/values['expBudget'] != "Infinity") ? (values['focusArea7']/values['expBudget']*100).toFixed(2): '';
      values['focusArea8Per'] = (values['expBudget'] && values['focusArea8'] && values['focusArea8']/values['expBudget'] != "Infinity") ? (values['focusArea8']/values['expBudget']*100).toFixed(2): '';
      values['focusArea9Per'] = (values['expBudget'] && values['focusArea9'] && values['focusArea9']/values['expBudget'] != "Infinity") ? (values['focusArea9']/values['expBudget']*100).toFixed(2): '';
      values['focusArea10Per'] = (values['expBudget'] && values['focusArea10'] && values['focusArea10']/values['expBudget'] != "Infinity") ? (values['focusArea10']/values['expBudget']*100).toFixed(2): '';
      values['focusArea11Per'] = (values['expBudget'] && values['focusArea11'] && values['focusArea11']/values['expBudget'] != "Infinity") ? (values['focusArea11']/values['expBudget']*100).toFixed(2): '';
      

      values['pillar1Per'] = (values['expBudget'] && values['pillar1'] && values['pillar1']/values['expBudget'] != "Infinity") ? (values['pillar1']/values['expBudget']*100).toFixed(2): '';
      values['pillar2Per'] = (values['expBudget'] && values['pillar2'] && values['pillar2']/values['expBudget'] != "Infinity") ? (values['pillar2']/values['expBudget']*100).toFixed(2): '';
      values['pillar3Per'] = (values['expBudget'] && values['pillar3'] && values['pillar3']/values['expBudget'] != "Infinity") ? (values['pillar3']/values['expBudget']*100).toFixed(2): '';
      values['pillar4Per'] = (values['expBudget'] && values['pillar4'] && values['pillar4']/values['expBudget'] != "Infinity") ? (values['pillar4']/values['expBudget']*100).toFixed(2): '';
      
      for(let i=1; i<=11; i++) {
        values['totalFocusArea'] += Number(values[`focusArea${i}`]);
        values['totalFocusAreaPer'] += Number(values[`focusArea${i}Per`]);
        values['totalPillar'] += Number(values[`pillar${i}`]);
        values['totalPillarPer'] += Number(values[`pillar${i}Per`]);
      }
      values['totalFocusAreaPer'] = Math.round(values['totalFocusAreaPer']);
      values['totalPillarPer'] = Math.round(values['totalPillarPer']);
      
      deList.forEach((de,index) => {
        if(index<2) tableRow += `<td style="${de.style}">${values[de.id] ? values[de.id]: ''}</td>`
        else  tableRow += `<td style="${de.style}">${values[de.id] ? formatNumberInput(displayValue(values[de.id])): ''}</td>`
      })
    tableRow += "</tr>";
    })

    return {
      tableHead,
      tableRow
    }
  }
  function getTotalIncome(dataValuesOU, level2OU){
    const year = document.getElementById("year-update").value;
    var deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
        style: ''
      },
    {
      id: 'Lv8wUjXV8fl',
      name: 'Affiliate Code',
      style: ''
    },
    {
      id: 'budgetedIncome',
      name: `Budgeted income ${year}`,
      style: 'background:#e97132;'
    },
    {
      id: 'totalIncome',
      name: `Total ${year} Income`,
      style: 'background:#e97132;'
    },
    {
      id: 'totalUnrestricted',
      name: 'Total IPPF Unrestricted income',
      style: 'background:#e97132;'
    },
    {
      id: 'ippfPercentage',
      name: 'IPPF Unrestricted as percentage of total ',
      style: 'background:#e97132;'
    },
    {
      id: 'ippfCore',
      name: `Total ${year} Unrestricted including IPPF`,
      style: 'background:#e97132;'
    },
    {
      id: 'ippfCorePer',
      name: `Total ${year} Unrestricted as percentage of total income`,
      style: 'background:#e97132;'
    },
    {
      id: 'nonIppfCore',
      name: `Total non-IPPF Unrestricted`,
      style: 'background:#e97132;'
    },
    {
      id: 'financialPosition',
      name: `Financial position`,
      style: 'background:#e97132;'
    },
    {
      id: 'qrdiDKqQotg',
      code: 'Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)',
      name: 'COMMODITY SALES',
      style: 'background:#0f9ed5;'
    },{
      id: 'L89RPS2xzNl',
      code: 'Client/Patient fees',
      name: 'CLIENT/ PATIENT FEES',
      style: 'background:#0f9ed5;'
    },{
      id: 'mHacTCqp5St',
      code: 'Training, education, professional services and rentals',
      name: 'TRAINING, EDUCATION, PROFESSIONAL SERVICES AND RENTALS',
      style: 'background:#0f9ed5;'
    },{
      id: 'tK20oVQDvjE',
      code: 'Local/national: government',
      name: 'LOCAL / NATIONAL : GOVERNMENT',
      style: 'background:#0f9ed5;'
    },{
      id: 'VJC9jDYrilT',
      code: 'Local/national: non-government',
      name: 'LOCAL / NATIONAL : NON-GOVERNMENT',
      style: 'background:#0f9ed5;'
    },{
      id: 'IOf1cgEwUVt',
      code: 'Membership fees',
      name: 'MEMBERSHIP FEES',
      style: 'background:#0f9ed5;'
    },{
      id: 'eF1Du2rscoA',
      code: 'Non-operational income',
      name: 'NON-OPERATIONAL INCOME',
      style: 'background:#0f9ed5;'
    },{
      id: 'Yn7LiC5Zinj',
      code: 'Other national income',
      name: 'OTHER NATIONAL INCOME',
      style: 'background:#0f9ed5;'
    },{
      id: 'totalLocallyGenerated',
      code: '',
      name: 'Total Locally Generated',
      style: 'background:#0f9ed5;'
    },{
      id: 'percentLocallyGenerated',
      code: '',
      name: 'As percentage of total income',
      style: 'background:#0f9ed5;'
    },{
      id: 'gcErTbOLAjF',
      code: 'Multilateral Agencies and Organizations',
      name: 'MULTILATERAL AGENCIES AND ORGANIZATIONS',
      style: 'background:#4ea72e;'
    },{
      id: 'n3IO1nKmHYf',
      code: 'Foreign Governments',
      name: 'FOREIGN GOVERNMENTS',
      style: 'background:#4ea72e;'
    },{
      id: 'QGWY8yLtmhk',
      code: 'International Trusts and Foundations / NGOs',
      name: 'INTERNATIONAL TRUSTS AND FOUNDATIONS / NGOS',
      style: 'background:#4ea72e;'
    },{
      id: 'uBN3PJRnDRJ',
      code: 'Corporate / Business Sector',
      name: 'CORPORATE / BUSINESS SECTOR',
      style: 'background:#4ea72e;'
    },{
      id: 'zxRotHuBZ1U',
      code: 'Other International Income',
      name: 'OTHER INTERNATIONAL INCOME',
      style: 'background:#4ea72e;'
    },{
      id: 'totalInternational',
      code: '',
      name: 'Total International (non-IPPF)',
      style: 'background:#4ea72e;'
    },{
      id: 'percentInternational',
      code: '',
      name: 'As percentage of total income',
      style: 'background:#4ea72e;'
    },{
      id: 'HrH4reost9F',
      code: 'IPPF Unrestricted Grant',
      name: 'IPPF UNRESTRICTED GRANT',
      style: 'background:#c00000;'
    },{
      id: 'T8nVKg8gGUf',
      code: 'IPPF Restricted Grant',
      name: 'IPPF RESTRICTED GRANT',
      style: 'background:#c00000;'
    },{
      id: 'totalIppf',
      code: '',
      name: 'Total IPPF-sourced',
      style: 'background:#c00000;'
    },{
      id: 'percentIppf',
      code: '',
      name: 'As percentage of total income',
      style: 'background:#c00000;'
    },{
      id: 'totalIncomeControl',
      code: '',
      name: 'Total Income(Control)',
      style: 'background:#2596be;'
    },{
      id: 'totalIncomePer',
      code: '',
      name: 'Total Income as percentage (Control)',
      style: 'background:#2596be;'
    },{
      id: 'totalIncomeRestricted',
      code: '',
      name: 'Total Restricted Income',
      style: 'background:#2596be;'
    },{
      id: 'totalIncomeUnrestricted',
      code: '',
      name: 'Total Unrestricted Income',
      style: 'background:#2596be;'
    },
  ]

  var tableHead = `<tr><td style="font-weight:bold">Region</td><td style="font-weight:bold">Affiliate Name</td>`;
  deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
  tableHead += '</tr>';

  
  var tableRow = ''
  dataValuesOU.forEach(item => {

    var values = {}
    deList.forEach(de => {
      values[de.id] = 0;
    })
    values = {
      ...values,
      ...item.attributes,
      totalIncome: 0,
      expBudget: 0,
    }

    var region = '';
    level2OU.forEach(parent => parent.children.forEach(ou => {
      if (ou.name == item.orgUnit) region = parent.name
    }))

    tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;

    dataElements.projectTotalIncome.forEach(pti => {
      
        if(item.dataValuesTI && item.dataValuesTI[pti.restricted]) {
          values[pti.category] += Number(item.dataValuesTI[pti.restricted]);
          values['totalIncome'] += Number(item.dataValuesTI[pti.restricted]);
        }
        if(item.dataValuesTI && item.dataValuesTI[pti.unrestricted]) {
          values[pti.category] += Number(item.dataValuesTI[pti.unrestricted]);
          values['totalIncome'] += Number(item.dataValuesTI[pti.unrestricted]);
          values['ippfCore'] += Number(item.dataValuesTI[pti.unrestricted]);
        }

        if(item.dataValuesID[year] && item.dataValuesID[year][pti.restricted]) {
          values['totalIncomeRestricted'] += Number(item.dataValuesID[year][pti.restricted]);
          values['budgetedIncome'] += Number(item.dataValuesID[year][pti.restricted]);
        }
        if(item.dataValuesID[year] && item.dataValuesID[year][pti.unrestricted]) {
          values['totalIncomeUnrestricted'] += Number(item.dataValuesID[year][pti.unrestricted]);
          values['budgetedIncome'] += Number(item.dataValuesID[year][pti.unrestricted]);
        }
      

      
    })

    values['ippfCorePer'] = values['ippfCore'] && values['totalIncome'] && (values['ippfCore']/values['totalIncome']) ? ((values['ippfCore']/values['totalIncome'])*100).toFixed(2)  : '';
    
    deList.forEach((de,index) => {
      if(index>=9 && index<=16) {
        values['totalLocallyGenerated'] += values[de.id];
        values['totalIncomeControl'] += values[de.id];
      }
      if(index>=19 && index<=23) {
        values['totalInternational'] += values[de.id];
        values['totalIncomeControl'] += values[de.id];
      }
      if(index==26 || index==27) {
        values['totalIppf'] += values[de.id];
        values['totalIncomeControl'] += values[de.id];
      }
    })

    values['percentLocallyGenerated'] = values['totalLocallyGenerated'] && values['totalIncome'] && (values['totalLocallyGenerated']/values['totalIncome']) ? ((values['totalLocallyGenerated']/values['totalIncome'])*100).toFixed(2) : '';
    values['percentInternational'] = values['totalInternational'] && values['totalIncome'] && (values['totalInternational']/values['totalIncome']) ? ((values['totalLocallyGenerated']/values['totalIncome'])*100).toFixed(2)  : '';
    values['percentIppf'] = values['totalIppf'] && values['totalIncome'] && (values['totalIppf']/values['totalIncome']) ? ((values['totalIppf']/values['totalIncome'])*100).toFixed(2)  : '';
    values['totalIncomePer'] = values['totalIncome'] && values['totalIncomeControl'] && (values['totalIncomeControl']/values['totalIncome']) ? ((values['totalIncomeControl']/values['totalIncome'])*100).toFixed(2)  : '';
    
    values['totalCommodities'] = Number(values['internationalDonors']) + Number(values['localIncome']) + Number(values['inkindDonations']) + Number(values['otherincome']);
    if(values['totalCommodities'] && values['totalIncome']) values['percentTotalCommodities'] = (values['totalCommodities'] && values['totalIncome'] && values['totalCommodities']/values['totalIncome']) ? (( values['totalCommodities']/values['totalIncome'])*100).toFixed(2): '';
    var yearIndex = -1;
    for(let i = tei.year.start; i<=tei.year.end; i++) {
      yearIndex++;
      if(year==i) break;
    }
    if(item.dataValuesOD && item.dataValuesOD[dataElements.yearlyAmount[yearIndex]]) {
      values['totalUnrestricted'] = Number(item.dataValuesOD[dataElements.yearlyAmount[yearIndex]]);
      values['ippfPercentage'] = values['totalIncome'] && (item.dataValuesOD[dataElements.yearlyAmount[yearIndex]]/values['totalIncome']) ? ((item.dataValuesOD[dataElements.yearlyAmount[yearIndex]]/values['totalIncome'])*100).toFixed(2): ''
    }

    if(values['ippfCore']) values['nonIppfCore'] = values['ippfCore'];
    if(values['totalUnrestricted']) values['nonIppfCore'] -= values['totalUnrestricted'];
    
    dataElements.arProjectExpenseCategory.forEach((pec, index) => {
      if(item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
        if( item.dataValuesEC[pec.actualExpense.personnel]) values['expBudget']  +=  Number(item.dataValuesEC[pec.actualExpense.personnel]);
        if( item.dataValuesEC[pec.actualExpense.activities]) values['expBudget'] +=  Number(item.dataValuesEC[pec.actualExpense.activities]);
        if( item.dataValuesEC[pec.actualExpense.commodities]) values['expBudget']  +=  Number(item.dataValuesEC[pec.actualExpense.commodities]);
        if( item.dataValuesEC[pec.actualExpense.cost]) values['expBudget']  +=  Number(item.dataValuesEC[pec.actualExpense.cost]);
      }      
    })
    
    // values['expBudget'] =  item.dataValuesEC['zGn5c7EZLr0']?displayValue(item.dataValuesEC['zGn5c7EZLr0']): '';

    if(values['totalIncome']) values['financialPosition'] = values['totalIncome'];
    if(values['expBudget']) values['financialPosition'] -= values['expBudget'];
    

    deList.forEach((de,index) => {
      if(index<2) tableRow += `<td style="${de.style}">${values[de.id] ? values[de.id]: ''}</td>`
      else  tableRow += `<td style="${de.style}">${values[de.id] ? formatNumberInput(displayValue(values[de.id])): ''}</td>`
    })
    tableRow += '</tr>'
    })


  return {
    tableHead,
    tableRow
  }
  }
  function getOrganisationDetails(dataValuesOU, level2OU) {

    var tableRow = "";
    const deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
         style: 'background:#276696;'
      },
      {
        id: 'Lv8wUjXV8fl',
        name: 'Affiliate Code',
         style: 'background:#276696;'
      },
      {
        id: 'rTDJjf4crQ8',
        name: 'Primary Contact person',
         style: 'background:#276696;'
      },
      {
        id: 'I27jsFBwUnt',
        name: 'Contact person email',
         style: 'background:#276696;'
      },
      {
        id: 'eS8HHmy5krN',
        name: 'Address',
         style: 'background:#276696;'
      },
      {
        id: 'Ctp6kmhwq86',
        name: 'ED Name',
         style: 'background:#276696;'
      },
      {
        id: 'yGutLB1Spaa',
        name: 'ED Email',
         style: 'background:#276696;'
      },
      {
        id: 'woWgpD819lF',
        name: 'ED Contact Phone',
        style: 'background:#276696;'
      },
      {
        id: 'IuyGw22tqYj',
        name: 'President Name',
         style: 'background:#276696;'
      },
      {
        id: 'YTtJK3jqsnq',
        name: 'President Email',
         style: 'background:#276696;'
      },
      {
        id: 'CFF42nxFPgB',
        name: 'President Contact Phone',
         style: 'background:#276696;'
      },
      {
        id: 'BycCbaxB1Pu',
        name: 'Officer of the board Name 1',
         style: 'background:#276696;'
      },
      {
        id: 'tt9p7BLGhT0',
        name: 'Officer of the board Email 1',
         style: 'background:#276696;'
      },
      {
        id: 'Mzn08vVVZVt',
        name: 'Officer of the board Contact Phone 1',
         style: 'background:#276696;'
      },
      {
        id: 'MeCYmsrREyS',
        name: 'Officer of the board Name 2',
         style: 'background:#276696;'
      },
      {
        id: 'qShxfRboswE',
        name: 'Officer of the board Email 2',
         style: 'background:#276696;'
      },
      {
        id: 'XmDKyaE5SbW',
        name: 'Officer of the board Contact Phone 2',
         style: 'background:#276696;'
      },
      {
        id: 'QgqjdnD1a24',
        name: 'Officer of the board Name 3',
         style: 'background:#276696;'
      },
      {
        id: 'QoFEoEFiPZd',
        name: 'Officer of the board Email 3',
         style: 'background:#276696;'
      },
      {
        id: 'H2t9gnU6JKb',
        name: 'Officer of the board Contact Phone 3',
         style: 'background:#276696;'
      },
      {
        id: 'aA5UkYBNvbl',
        name: 'Youth board member Name',
         style: 'background:#276696;'
      },
      {
        id: 'k86jH9sSXSq',
        name: 'Youth board member Email',
         style: 'background:#276696;'
      },
      {
        id: 'oYpc136YNgW',
        name: 'Youth board member Contact Phone',
         style: 'background:#276696;'
      },
      {
        id: 'HFyJ2WGQEda',
        name: 'Programmatic lead(s) Name 1',
         style: 'background:#276696;'
      },
      {
        id: 'qColDnIqDjT',
        name: 'Programmatic lead(s) Email 1',
         style: 'background:#276696;'
      },
      {
        id: 'vFhnYZHTxfr',
        name: 'Programmatic lead(s) Contact Phone 1',
         style: 'background:#276696;'
      },
      {
        id: 't9LCankavyt',
        name: 'Programmatic lead(s) Name 2',
         style: 'background:#276696;'
      },
      {
        id: 'sJpc63Pkpip',
        name: 'Programmatic lead(s) Email 2',
         style: 'background:#276696;'
      },
      {
        id: 'SDC9mqvdjhQ',
        name: 'Programmatic lead(s) Contact Phone 2',
         style: 'background:#276696;'
      },
      {
        id: 'ptHCVnzUXQl',
        name: 'Finance lead Name',
         style: 'background:#276696;'
      },
      {
        id: 'lea8lybuFI9',
        name: 'Finance lead Email',
         style: 'background:#276696;'
      },
      {
        id: 'PZswZ4XFTku',
        name: 'Finance lead Contact Phone',
         style: 'background:#276696;'
      },
      {
        id: 'nME0H9rEBz4',
        name: 'Board Term start',
         style: 'background:#276696;'
      },
      {
        id: 'leqtpPX6o97',
        name: 'Board Term End',
         style: 'background:#276696;'
      },
      {
        id: 'projectTotal',
        name: 'Total number of projects',
         style: 'background:#276696;'
      }
    ]
    var tableHead = '<tr><td style="background:#276696;color:white;text-align:center;border:1px solid black;">Region</td><td style="background:#276696;color:white;text-align:center;border:1px solid black;">Affiliate Name</td>';
    deList.forEach(de => tableHead += `<td  style="${de.style};color:white;text-align:center;border:1px solid black;">${de.name}</td>`)
    tableHead += '</tr>';

    const year = document.getElementById("year-update").value;

    dataValuesOU.forEach(item => {
      item.dataValuesOD = {
        ...item.dataValuesOD,
        ...item.attributes
      }
      var region = '';
      level2OU.forEach(parent => parent.children.forEach(ou => {
        if (ou.name == item.orgUnit) region = parent.name
      }))
      tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;
      deList.forEach((de, index) => {
        if (index < (deList.length - 1)) tableRow += `<td>${item.dataValuesOD[de.id] ? item.dataValuesOD[de.id] : ''}</td>`;
      })
        var pdcount = 0;
        dataElements.projectDescription.forEach(pd => {
          if (item.dataValuesPD[year] && item.dataValuesPD[year][pd['name']]) {
            pdcount++;
          }
        })
        tableRow += `<td>${pdcount}</td>`;
      })
    return {
      tableHead,
      tableRow
    }

  }
  
  function getAOCReport(dataValuesOU, level2OU) {

    var tableRow = "";
    const deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
        style:""
      },
      {
        id: 'Lv8wUjXV8fl',
        name: 'Affiliate Code',
        style:""
      },
      {
        id: 'flagRating',
        name: 'Flag rating (red or green)',
        style:""
      },
      {
        id: 'Tok83eP5gqa',
        name: '1. Process: was the report was submitted on time?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'UUlKQuQW1Xy',
        name: '1. Process: was the report was submitted on time? (Comments)',
        style: 'background:#0f9ed5;'
      }, 
      {
        id: 'bddU8SI1wLz',
        name: '2. Process: has the MA consulted with you, the AOC, during the development of the AR?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'hyBXZOHUy1k',
        name: '2. Process: has the MA consulted with you, the AOC, during the development of the AR? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'ua6hoN645RR',
        name: '3. Quality: is the report done to the required standard: e.g. all answers and budget fields are completed and are understandable?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'PdxpqvhsBtM',
        name: '3. Quality: is the report done to the required standard: e.g. all answers and budget fields are completed and are understandable? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'P7a9Jl3z8Xa',
        name: '4. Narrative Report: in Section 2, question 2, has the MA/CP reported tangible results in at least two of the four IPPF strategic pillars',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'K0oIfdP0JeR',
        name: '4. Narrative Report: in Section 2, question 2, has the MA/CP reported tangible results in at least two of the four IPPF strategic pillars (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'NaiRFWqjv9q',
        name: "5.  Narrative Report: in Section 2, question 3 to 6, has the MA/CP meaningfully reflected on challenges and learnings in the reporting period?",
        style: 'background:#0f9ed5;'
      },
      {
        id: 'hgpQDSZm9lK',
        name: "5.  Narrative Report: in Section 2, question 3 to 6, has the MA/CP meaningfully reflected on challenges and learnings in the reporting period?",
        style: 'background:#0f9ed5;'
      },
      {
        id: 'c4TpY3CTEQv',
        name: '6. Financial: is the total expense reported under Section 4 the same as the total reported in Section 5?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'xVfb0b8UtIq',
        name: '6. Financial: is the total expense reported under Section 4 the same as the total reported in Section 5? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'HOuFie6msc6',
        name: '7. Financial: What is the status of the audit report for the financial year?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'KGx5UkIS59t',
        name: '7. Financial: What is the status of the audit report for the financial year? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'vacCAltV8Pp',
        name: '8. Financial: in Section 6 “Actual Income”, is the overall financial status indicating a surplus or balanced budget (income minus expenses). In other words, it is showing green?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'RIltL5QmDEP',
        name: '8. Financial: in Section 6 “Actual Income”, is the overall financial status indicating a surplus or balanced budget (income minus expenses). In other words, it is showing green? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'aXjINT5ttfR',
        name: '9. In Section 5 “Budget vs Actuals by expense category”, are negative variances (in red) sufficiently explained for all of the individual projects? ',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'rrYJ6v2uI7X',
        name: '9. In Section 5 “Budget vs Actuals by expense category”, are negative variances (in red) sufficiently explained for all of the individual projects? (Comments)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'RjUbLBU2k8l',
        name: 'Any Other Major Risk Identified 1',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'gisGa5OLedD',
        name: 'Other Comments 1',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'S2ZTyifVF3P',
        name: 'Any Other Major Risk Identified 2',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'LitWNOXmHZc',
        name: 'Other Comments 2',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'e04OAehV9dD',
        name: 'Any Other Major Risk Identified 3',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'FiF3dtgnKjg',
        name: 'Other Comments 3',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'KvMjVwzQ1Au',
        name: 'Any Other Major Risk Identified 4',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'gNhV6F9rV5V',
        name: 'Other Comments 4',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'l6d486NvthX',
        name: 'Any Other Major Risk Identified 5',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'XKVkYCnlHYE',
        name: 'Other Comments 5',
        style: 'background:#0f9ed5;'
      },
    ]
    var tableHead = `<tr><td style="font-weight:bold">Region</td><td style="font-weight:bold">Affiliate Name</td>`;
    deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
    tableHead += '</tr>';

    dataValuesOU.forEach(item => {

      item.dataValuesRO = {
        ...item.dataValuesRO,
        ...item.attributes
      }
      var region = '';
      level2OU.forEach(parent => parent.children.forEach(ou => {
        if (ou.name == item.orgUnit) region = parent.name
      }))
      tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;
      deList.forEach((de,index) => {
        var value='';
        if(de.id=='flagRating') {
         var color = '';
         if(item.dataValuesRO) color = selectedRatings(item.dataValuesRO);
         tableRow += `<td class="${color}"> </td>`
        } else {
          if(item.dataValuesRO && item.dataValuesRO[de.id]) value=item.dataValuesRO[de.id];
          
          if(de.id=='HOuFie6msc6' && value=='true') tableRow += `<td style="color:#54ca68">Unqualified</td>`;
          else if(de.id=='HOuFie6msc6' && value=='false') tableRow += `<td style="color:#fc544b">Qualified</td>`;
          else if(value=='true') tableRow += `<td style="color:#54ca68">Yes</td>`;
          else if(value=='false') tableRow += `<td style="color:#fc544b">No</td>`;
          else tableRow += `<td>${value}</td>`
        }
      })
      tableRow += '</tr>'

    })
    return {
      tableHead,
      tableRow
    }

  }


  fetchOrganizationUnitUid();
});

    function selectedRatings(dataValues) {
      var color = ''
      const generalRatings = {
        yesCount: 0,
        noCount: 0
      };
      const criticalRatings = {
        yesCount: 0,
        noCount: 0
      };
      var seriousRisk =false;
      const generalRequirements = ['Tok83eP5gqa', 'bddU8SI1wLz', 'ua6hoN645RR', 'P7a9Jl3z8Xa', 'NaiRFWqjv9q', 'c4TpY3CTEQv'];
      
      var criticalRequirements = [];
      
      if(dataElements.periodicity.value == "Semi-Annual Reporting") {
        criticalRequirements = ['aXjINT5ttfR'];
      } else criticalRequirements = ['HOuFie6msc6', 'vacCAltV8Pp', 'aXjINT5ttfR'];
      

      ['RjUbLBU2k8l', 'S2ZTyifVF3P', 'e04OAehV9dD', 'KvMjVwzQ1Au', 'l6d486NvthX'].forEach((risk) => {
        if(dataValues[risk] && dataValues[risk].trim()) seriousRisk = true;
      })
      if(seriousRisk) {
        color='bg-red';
        return;
      }

      generalRequirements.forEach(requirement => {
          if(dataValues[requirement]=="true") generalRatings['yesCount']++;
          else if(dataValues[requirement]=="false") generalRatings['noCount']++;
      })
      criticalRequirements.forEach(requirement => {
          if(dataValues[requirement]=="true") criticalRatings['yesCount']++;
          else if(dataValues[requirement]=="false") criticalRatings['noCount']++;
      })

      if(generalRatings['yesCount'] >= 4 && criticalRatings['yesCount']==criticalRequirements.length) {
        color= 'bg-green';
      } else {
        color='bg-red';
      }
      return color;
    }

function displayValue(input) {
  if (input === null || input === undefined || input === '') {
    return "";
  }
  
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
  if (Number(num) == 0) return ''
  else return 'red'
}
