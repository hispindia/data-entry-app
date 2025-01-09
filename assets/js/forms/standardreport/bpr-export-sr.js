
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
               enroll.program == program.auProjectFocusArea
            || enroll.program == program.auProjectExpenseCategory
            || enroll.program == program.auProjectBudget
            || enroll.program == program.auProjectDescription
            || enroll.program == program.auOrganisationDetails
            || enroll.program == program.reportFeedback
            || enroll.program == program.auIncomeDetails
            || enroll.program == program.auCommodities
          );
          
          let dataValuesPB = getProgramStageEvents(filteredPrograms, programStage.auProjectBudget, program.auProjectBudget,dataElements.year.id) //data values year wise
          let dataValuesFA = getProgramStageEvents(filteredPrograms, programStage.auProjectFocusArea, program.auProjectFocusArea, dataElements.year.id) //data values year wise
          let dataValuesRO = getProgramStageEvents(filteredPrograms, programStage.auROTRTFeedback, program.reportFeedback, dataElements.year.id) //data values year wise
          let dataValuesOD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, dataElements.year.id) //data values year wise
          let dataValuesPD = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, dataElements.year.id) //data values year wise
          let dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, dataElements.year.id) //data values year wise
          let dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, dataElements.year.id) //data values year wise
          let dataValuesVC = getProgramStageEvents(filteredPrograms, programStage.auValueAddCoreFunding, program.auIncomeDetails, dataElements.year.id) //data values year wise
          let dataValuesOC = getProgramStageEvents(filteredPrograms, programStage.auCommoditiesOrder, program.auCommodities, dataElements.year.id) //data values year wise
          let dataValuesCS = getProgramStageEvents(filteredPrograms, programStage.auCommoditiesSource, program.auCommodities, dataElements.year.id) //data values year wise
          

          dataValuesOU.push({
            orgUnit: ou.name,
            ouId: ou.id,
            attributes,
            dataValuesOD,
            dataValuesPD,
            dataValuesPB,
            dataValuesFA,
            dataValuesEC,
            dataValuesRO,
            dataValuesTI,
            dataValuesVC,
            dataValuesOC,
            dataValuesCS,
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

      values['expBudget'] = item.dataValuesPB[year] && item.dataValuesPB[year]['zGn5c7EZLr0']?displayValue(item.dataValuesPB[year]['zGn5c7EZLr0']): '';

      dataElements.projectFocusAreaNew.forEach((pfa, index) => {
        pfa.focusAreas.forEach(fa => {
          if (item.dataValuesFA[year] && item.dataValuesFA[year][fa] && item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
            const val = JSON.parse(item.dataValuesFA[year][fa]);
            
            if (val.area == '1. Care: Static Clinic') values['focusArea1'] += Number(val.budget);
            if (val.area == '2. Care: Outreach, mobile clinic, Community-based, delivery') values['focusArea2'] += Number(val.budget);
            if (val.area == '3. Care: Other Services, enabled or referred (associated clinics)') values['focusArea3'] += Number(val.budget);
            if (val.area == '4. Care: Social Marketing Services') values['focusArea4'] += Number(val.budget);
            if (val.area == '5. Care: Digital Health Intervention and Selfcare') values['focusArea5'] += Number(val.budget);
            if (val.area == '6. Advocacy') values['focusArea6'] += Number(val.budget);
            if (val.area == '7. CSE') values['focusArea7'] += Number(val.budget);
            if (val.area == '8. CSE Online, including social media') values['focusArea8'] += Number(val.budget);
            if (val.area == '9. Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting') values['focusArea9'] += Number(val.budget);
            if (val.area == '10. Knowledge, research, evidence, innovation, and publishing, including peer-review articles') values['focusArea10'] += Number(val.budget);
            if (val.area == '11. Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures') values['focusArea11'] += Number(val.budget);

            if (val.pillar == '1. Center Care on People') values['pillar1'] += Number(val.budget);
            else if (val.pillar == '2. Move the Sexuality Agenda')values['pillar2'] += Number(val.budget);
            else if (val.pillar == '3. Solidarity for Change') values['pillar3'] += Number(val.budget);
            else if (val.pillar == '4. Nurture Our Federation') values['pillar4'] += Number(val.budget);

          }
        })
      })

      dataElements.projectExpenseCategory.forEach((pec, index) => {
        if(item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
          if(item.dataValuesEC[year] && item.dataValuesEC[year][pec.personnel]) values['personnel'] +=  Number(item.dataValuesEC[year][pec.personnel]);
          if(item.dataValuesEC[year] && item.dataValuesEC[year][pec.activities]) values['activities'] +=  Number(item.dataValuesEC[year][pec.activities]);
          if(item.dataValuesEC[year] && item.dataValuesEC[year][pec.commodities]) values['commodities'] +=  Number(item.dataValuesEC[year][pec.commodities]);
          if(item.dataValuesEC[year] && item.dataValuesEC[year][pec.cost]) values['cost'] +=  Number(item.dataValuesEC[year][pec.cost]);
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
        else  tableRow += `<td style="${de.style}">${values[de.id] ? displayValue(values[de.id]): ''}</td>`
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
      id: 'commoditySale',
      code: 'Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)',
      name: 'COMMODITY SALES',
      style: 'background:#0f9ed5;'
    },{
      id: 'clientFees',
      code: 'Client/Patient fees',
      name: 'CLIENT/ PATIENT FEES',
      style: 'background:#0f9ed5;'
    },{
      id: 'servicesRental',
      code: 'Training, education, professional services and rentals',
      name: 'TRAINING, EDUCATION, PROFESSIONAL SERVICES AND RENTALS',
      style: 'background:#0f9ed5;'
    },{
      id: 'localGovernment',
      code: 'Local/national: government',
      name: 'LOCAL / NATIONAL : GOVERNMENT',
      style: 'background:#0f9ed5;'
    },{
      id: 'localNongovernment',
      code: 'Local/national: non-government',
      name: 'LOCAL / NATIONAL : NON-GOVERNMENT',
      style: 'background:#0f9ed5;'
    },{
      id: 'membershipFees',
      code: 'Membership fees',
      name: 'MEMBERSHIP FEES',
      style: 'background:#0f9ed5;'
    },{
      id: 'nonOperationIncome',
      code: 'Non-operational income',
      name: 'NON-OPERATIONAL INCOME',
      style: 'background:#0f9ed5;'
    },{
      id: 'otherIncome',
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
      id: 'multilateralAgencies',
      code: 'Multilateral Agencies and Organizations',
      name: 'MULTILATERAL AGENCIES AND ORGANIZATIONS',
      style: 'background:#4ea72e;'
    },{
      id: 'foriegnGovernments',
      code: 'Foreign Governments',
      name: 'FOREIGN GOVERNMENTS',
      style: 'background:#4ea72e;'
    },{
      id: 'internationTrusts',
      code: 'International Trusts and Foundations / NGOs',
      name: 'INTERNATIONAL TRUSTS AND FOUNDATIONS / NGOS',
      style: 'background:#4ea72e;'
    },{
      id: 'corporateSector',
      code: 'Corporate / Business Sector',
      name: 'CORPORATE / BUSINESS SECTOR',
      style: 'background:#4ea72e;'
    },{
      id: 'otherInternationalIncome',
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
      id: 'ippfUnrestricted',
      code: 'IPPF Unrestricted Grant',
      name: 'IPPF UNRESTRICTED GRANT',
      style: 'background:#c00000;'
    },{
      id: 'ippfRestricted',
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
      name: 'Total Income(Control) ',
      style: 'background:#2596be;'
    },{
      id: 'totalIncomePer',
      code: '',
      name: 'Total Income as percentage (Control) ',
      style: 'background:#2596be;'
    },{
      id: 'amountUnlocked',
      code: '',
      name: 'Total value add of IPPf Unrestricted',
      style: 'background:#7030a0;'
    },{
      id: 'amountUnlockedPer',
      code: '',
      name: 'As percentage of total income',
      style: 'background:#7030a0;'
    },{
      id: 'EEH1KdXxA68',
      name: 'IPPF Unrestricted (Either procurred directly from IPPF or purchased locally using the Unrestricted grant) '
    },{
      id: 'internationalDonors',
      code: '',
      name: 'International donors'
    },{
      id: 'localIncome',
      code: '',
      name: 'Local Income'
    },{
      id: 'inkindDonations',
      code: '',
      name: 'In-kind donations'
    },{
      id: 'otherincome',
      code: '',
      name: 'Other'
    },{
      id: 'totalCommodities',
      code: '',
      name: 'Total value Commodities donations'
    },{
      id: 'percentTotalCommodities',
      code: '',
      name: 'As percentage of total income'
    }
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
      deList.forEach((de) => {
        if(de.code && item.dataValuesTI[year] && de.code==item.dataValuesTI[year][pti.subCategory]) {
          if(item.dataValuesTI[year][pti.restricted]) values[de.id] += Number(item.dataValuesTI[year][pti.restricted]);
          if(item.dataValuesTI[year][pti.unrestricted]) values[de.id] += Number(item.dataValuesTI[year][pti.unrestricted]);
          
        }
      })
      if(item.dataValuesTI[year] && item.dataValuesTI[year][pti.category]) {
        if(item.dataValuesTI[year] && item.dataValuesTI[year][pti.restricted]) {
          values['totalIncome'] += Number(item.dataValuesTI[year][pti.restricted]);
        }
        if(item.dataValuesTI[year] && item.dataValuesTI[year][pti.unrestricted]) {
          values['totalIncome'] += Number(item.dataValuesTI[year][pti.unrestricted]);
          values['ippfCore'] += Number(item.dataValuesTI[year][pti.unrestricted]);
        }
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
    
  if(item.dataValuesOC[year] && item.dataValuesOC[year][dataElements.orderCommoditiesCV['totalCost']]) {
    values['EEH1KdXxA68'] = Math.round(item.dataValuesOC[year][dataElements.orderCommoditiesCV['totalCost']]);
  }
  if(item.dataValuesCS[year]) {
     if(item.dataValuesCS[year][dataElements.sourceCommodities['international']]) values['internationalDonors'] += Number(item.dataValuesCS[year][dataElements.sourceCommodities['international']]);
     if(item.dataValuesCS[year][dataElements.sourceCommodities['local']]) values['localIncome'] += Number(item.dataValuesCS[year][dataElements.sourceCommodities['local']]);
     if(item.dataValuesCS[year][dataElements.sourceCommodities['inkind']]) values['inkindDonations'] += Number(item.dataValuesCS[year][dataElements.sourceCommodities['inkind']]);
     if(item.dataValuesCS[year][dataElements.sourceCommodities['other']]) values['otherincome'] += Number(item.dataValuesCS[year][dataElements.sourceCommodities['other']]);
    }
    values['totalCommodities'] = Number(values['internationalDonors']) + Number(values['localIncome']) + Number(values['inkindDonations']) + Number(values['otherincome']);
    if(values['totalCommodities'] && values['totalIncome']) values['percentTotalCommodities'] = (values['totalCommodities'] && values['totalIncome'] && values['totalCommodities']/values['totalIncome']) ? (( values['totalCommodities']/values['totalIncome'])*100).toFixed(2): '';
    var yearIndex = -1;
    for(let i = tei.year.start; i<=tei.year.end; i++) {
      yearIndex++;
      if(year==i) break;
    }
    if(item.dataValuesOD[year] && item.dataValuesOD[year][dataElements.yearlyAmount[yearIndex]]) {
      values['totalUnrestricted'] = Number(item.dataValuesOD[year][dataElements.yearlyAmount[yearIndex]]);
      values['ippfPercentage'] = values['totalIncome'] && (item.dataValuesOD[year][dataElements.yearlyAmount[yearIndex]]/values['totalIncome']) ? ((item.dataValuesOD[year][dataElements.yearlyAmount[yearIndex]]/values['totalIncome'])*100).toFixed(2): ''
    }

    if(values['ippfCore']) values['nonIppfCore'] = values['ippfCore'];
    if(values['totalUnrestricted']) values['nonIppfCore'] -= values['totalUnrestricted'];
    
    dataElements.projectExpenseCategory.forEach((pec, index) => {
      if(item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
        if(item.dataValuesEC[year] && item.dataValuesEC[year][pec.personnel]) values['expBudget']  +=  Number(item.dataValuesEC[year][pec.personnel]);
        if(item.dataValuesEC[year] && item.dataValuesEC[year][pec.activities]) values['expBudget'] +=  Number(item.dataValuesEC[year][pec.activities]);
        if(item.dataValuesEC[year] && item.dataValuesEC[year][pec.commodities]) values['expBudget']  +=  Number(item.dataValuesEC[year][pec.commodities]);
        if(item.dataValuesEC[year] && item.dataValuesEC[year][pec.cost]) values['expBudget']  +=  Number(item.dataValuesEC[year][pec.cost]);
      }      
    })
    
    // values['expBudget'] = item.dataValuesEC[year] && item.dataValuesEC[year]['zGn5c7EZLr0']?displayValue(item.dataValuesEC[year]['zGn5c7EZLr0']): '';

    if(values['totalIncome']) values['financialPosition'] = values['totalIncome'];
    if(values['expBudget']) values['financialPosition'] -= values['expBudget'];
    
    dataElements.valuesCoreFunding.donors.forEach((donor) => {
      if(item.dataValuesVC[year] && item.dataValuesVC[year][donor.amountLocked]) {
        values['amountUnlocked'] += Number(item.dataValuesVC[year][donor.amountLocked]);
      }
    })
    values['amountUnlockedPer'] = values['amountUnlocked'] && values['totalIncome'] && (values['amountUnlocked']/values['totalIncome']) ? ((values['amountUnlocked']/values['totalIncome'])*100).toFixed(2)  : '';


    deList.forEach((de,index) => {
      if(index<2) tableRow += `<td style="${de.style}">${values[de.id] ? values[de.id]: ''}</td>`
      else  tableRow += `<td style="${de.style}">${values[de.id] ? displayValue(values[de.id]): ''}</td>`
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
        style: ''
      },
      {
        id: 'Lv8wUjXV8fl',
        name: 'Affiliate Code',
        style: ''
      },
      {
        id: 'kovn3d3f6S3',
        name: '# of fixed staff'
      },
      {
        id: 'CblclJFFlfV',
        name: '# of volunteers'
      },
      {
        id: 'KfenFbGtZsj',
        name: 'Type of organisation'
      },
      {
        id: 'zdWqftJFqGA',
        name: 'Primary Focus Area'
      },
      {
        id: 'TKYN8eltlPO',
        name: 'Secondary Focus Area'
      },
      {
        id: 'dQgZIHO74q5',
        name: '# of youth volunteers'
      },
      {
        id: 'OvbPe9nCJOd',
        name: '# of branches '
      },
      {
        id: 'ruUgWVq48ke',
        name: 'Primary advocacy priority '
      },
      {
        id: 'AqNCKTl9iU9',
        name: 'Secondary advocacy priority '
      },
      {
        id: 'HrHPzD3Talq',
        name: 'Primary Contact person'
      },
      {
        id: 'MgoVYQLP3yT',
        name: 'Contact person email'
      },
      {
        id: 'eS8HHmy5krN',
        name: 'Address'
      },
      {
        id: 'Ctp6kmhwq86',
        name: 'ED Name'
      },
      {
        id: 'yGutLB1Spaa',
        name: 'ED Email'
      },
      {
        id: 'IuyGw22tqYj',
        name: 'President name'
      },
      {
        id: 'YTtJK3jqsnq',
        name: 'President email'
      },
      {
        id: 'aA5UkYBNvbl',
        name: 'Youth board member name'
      },
      {
        id: 'k86jH9sSXSq',
        name: 'Youth board member email'
      },
      {
        id: 'nME0H9rEBz4',
        name: 'Board Term start'
      },
      {
        id: 'leqtpPX6o97',
        name: 'Board Term End'
      },
      {
        id: 'bcrC5FlhCrh',
        name: 'Strategy term start'
      },
      {
        id: 'pJpPTx4wJcL',
        name: 'Strategy term end'
      },
      {
        id: 'projectTotal',
        name: 'Total number of projects'
      },
      {
        id: 'projectPillar1',
        name: '% of 1. Center Care on People'
      },
      {
        id: 'projectPillar2',
        name: '% of 2. Move the Sexuality Agenda'
      },
      {
        id: 'projectPillar3',
        name: '% of 3. Solidarity for Change'
      },
      {
        id: 'projectPillar4',
        name: '% of 4. Nurture Our Federation'
      },
    ]
    var tableHead = '<tr><td style="font-weight:bold">Region</td><td style="font-weight:bold">Affiliate Name</td>';
    deList.forEach(de => tableHead += `<td style="font-weight:bold">${de.name}</td>`)
    tableHead += '</tr>';

    const year = document.getElementById("year-update").value;

    dataValuesOU.forEach(item => {
      item.dataValuesOD[year] = {
        ...item.dataValuesOD[year],
        ...item.attributes
      }
      var region = '';
      level2OU.forEach(parent => parent.children.forEach(ou => {
        if (ou.name == item.orgUnit) region = parent.name
      }))
      tableRow += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;
      deList.forEach((de, index) => {
        if (index <= (deList.length - 6)) tableRow += `<td>${item.dataValuesOD[year] && item.dataValuesOD[year][de.id] ? item.dataValuesOD[year][de.id] : ''}</td>`;
      })
        var pdcount = 0;
        dataElements.projectDescription.forEach(pd => {
          if (item.dataValuesPD[year] && item.dataValuesPD[year][pd['name']]) {
            pdcount++;
          }
        })
        tableRow += `<td>${pdcount}</td>`;

        var pillar1 = 0;
        var pillar2 = 0;
        var pillar3 = 0;
        var pillar4 = 0;
        dataElements.projectFocusAreaNew.forEach((pfa, index) => {
          var hasValue1= false;
          var hasValue2= false;
          var hasValue3= false;
          var hasValue4= false;
          pfa.focusAreas.forEach(fa => {
            if (item.dataValuesFA[year] && item.dataValuesFA[year][fa] && item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
              const val = JSON.parse(item.dataValuesFA[year][fa]);
              if (val.pillar == '1. Center Care on People' && !hasValue1) {
                hasValue1 = true
                pillar1++;
              }
              else if (val.pillar == '2. Move the Sexuality Agenda'&& !hasValue2) {
                hasValue2 = true;
                pillar2++;
              }
              else if (val.pillar == '3. Solidarity for Change'&& !hasValue3) {
                hasValue3 = true;
                pillar3++;
              }
              else if (val.pillar == '4. Nurture Our Federation'&& !hasValue4) {
                hasValue4 = true;
                pillar4++;
              }
            }
          })
        })
        tableRow += `<td>${(pillar1/pdcount) && (pillar1/pdcount)!= "Infinity" ? ((pillar1/pdcount)*100).toFixed(2) : ''}</td><td>${(pillar2/pdcount) && (pillar2/pdcount)!= "Infinity" ? ((pillar2/pdcount)*100).toFixed(2) : ''}</td><td>${(pillar3/pdcount) && (pillar3/pdcount)!= "Infinity" ? ((pillar3/pdcount)*100).toFixed(2) : ''}</td><td>${(pillar4/pdcount) && (pillar4/pdcount)!= "Infinity" ? ((pillar4/pdcount)*100).toFixed(2) : ''}</td></tr>`;
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
        id: 'pfSeozgjfm6',
        name: 'Is the plan submitted in the correct format',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'Cinud8FN7XL',
        name: 'Is the plan done to the required standard: e.g. all answers and budget fields are completed and are understandable',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'eGsNqkEprfp',
        name: 'Is this BP substantially consistent with the plan that was approved by the TRT?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'G16AMDjPKzy',
        name: 'Does the BP incorporate the correct amount of core funding from IPPF? (as either core grant or commodities).',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'kbN3wLCczLX',
        name: "In your review of the Strategic Alignment (Screen 4), does the plan remain aligned with IPPF's Strategy 2028?",
        style: 'background:#0f9ed5;'
      },
      {
        id: 'RTdF2kjEgFk',
        name: 'Does the plan demonstrate youth invovlement in its delivery?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'BmVI6lpkoK9',
        name: 'Does the plan deliver similar or greater number of projects than the approved plan? (compare with 3-year plan)',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'Tk5Xp1Gogre',
        name: 'On Screen 3.1. does the annual budget balance? If no, does the MA indicate how it will fund the plan?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'CXmcgQFJtDu',
        name: 'Has the overall budget for the year remained the same or increased compared to the original business plan?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'Z6OVONwpGYD',
        name: 'Is the total yearly budget for personnel the same or less compared to the original business plan?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'gjVYCryVOGq',
        name: 'Has the overall income for the budget planning cycle remained the same or increased compared to the original business plan?',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'AO3vin9fPZ7',
        name: 'Any Other Major Risk Identified',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'er52foffbOy',
        name: 'Other Comments',
        style: 'background:#0f9ed5;'
      },
      {
        id: 'K6edbyuqMw9',
        name: 'P1: Abortion Care ',
        style: 'background:#4ea72e;'
      },
      {
        id: 'pyRER6QeMVt',
        name: 'P1: Infertility Care',
        style: 'background:#4ea72e;'
      },
      {
        id: 'FjW3G5cY04O',
        name: 'P1: HIV Integration Care',
        style: 'background:#4ea72e;'
      },
      {
        id: 'riXEdIudadq',
        name: 'P1: Marginalised Populations Care',
        style: 'background:#4ea72e;'
      },
      {
        id: 'doSEzDD0qR3',
        name: 'P1: Humanitarian Crisis Care',
        style: 'background:#4ea72e;'
      },
      {
        id: 'y1jp4VkL0EZ',
        name: 'P1: Digital and Self-care Care',
        style: 'background:#4ea72e;'
      },
      {
        id: 'K4Ftg10CPiu',
        name: 'P2: Harmful Laws and Norms',
        style: 'background:#4ea72e;'
      },
      {
        id: 'GcChpH7vrQX',
        name: 'P2: Youth Engagement and CSE Care',
        style: 'background:#4ea72e;'
      },
      {
        id: 'aN3Z1bWBPLo',
        name: 'P3: Partnerships Care',
        style: 'background:#4ea72e;'
      },
      {
        id: 'lnJL9RHB6Fh',
        name: 'P3: Research ',
        style: 'background:#4ea72e;'
      },
      {
        id: 'LHptGGWfKnx',
        name: 'P4: Sustainability ',
        style: 'background:#4ea72e;'
      },
      {
        id: 'hYDnGFx92aU',
        name: 'P4: Anti-discrimination and Inclusion',
        style: 'background:#4ea72e;'
      }
    ]
    var tableHead = `<tr><td style="font-weight:bold">Region</td><td style="font-weight:bold">Affiliate Name</td>`;
    deList.forEach(de => tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`)
    tableHead += '</tr>';

    const year = document.getElementById("year-update").value;

    dataValuesOU.forEach(item => {

      item.dataValuesRO[year] = {
        ...item.dataValuesRO[year],
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
         if(item.dataValuesRO[year]) color = selectedRatings(item.dataValuesRO[year]);
         tableRow += `<td class="${color}"> </td>`
        } else {
          if(item.dataValuesRO[year] && item.dataValuesRO[year][de.id]) value=item.dataValuesRO[year][de.id];
        
          if(value=='true') tableRow += `<td >Yes</td>`;
          else if(value=='false') tableRow += `<td >No</td>`;
          else if(value=="Addressed") tableRow += `<td class="color-green">Addressed</td>`;
          else if(value=="Not Addressed") tableRow += `<td class="color-red">Not Addressed</td>`;
          else if(value=="Not Addressed but Justified") tableRow += `<td class="color-pink">Not Addressed but Justified</td>`;
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
  var color = '';
  const ratings = {
    yesCount: 0,
    noCount: 0
  };
  var seriousRisk =false;
  const generalAssessment = [ 'eGsNqkEprfp', 'kbN3wLCczLX'];
  const overallAssessment = [ 'pfSeozgjfm6', 'Cinud8FN7XL', 'eGsNqkEprfp', 'G16AMDjPKzy','kbN3wLCczLX', 'RTdF2kjEgFk', 'BmVI6lpkoK9', 'Tk5Xp1Gogre', 'CXmcgQFJtDu', 'Z6OVONwpGYD', 'gjVYCryVOGq']
  const seriousRiskId = ['AO3vin9fPZ7']

  seriousRiskId.forEach((risk) => {
    if(dataValues[risk]) seriousRisk = true;
  })
  if(seriousRisk) {
    color = "bg-red";
    return color
  }

  generalAssessment.forEach(requirement => {
    if(dataValues[requirement] && dataValues[requirement]=="true") ratings['yesCount']++;
  })
  overallAssessment.forEach(requirement => {
    if(dataValues[requirement] && dataValues[requirement]=="false") ratings['noCount']++;
  })
  if(ratings['yesCount']==2 && ratings['noCount'] < 4) {
    color = "bg-green";
  } else {
    color = "bg-red";
  }
  return color;
}

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
  if (Number(num) == 0) return ''
  else return 'red'
}
