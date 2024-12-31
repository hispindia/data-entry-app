
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
      if (data.id !== "M5zQapPyTZI") return;

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

    const listOD = getFocusArea(dataValuesOU, level2OU);
    document.getElementById('th-project-focusarea').innerHTML = listOD.tableHead;
    document.getElementById('tb-project-focusarea').innerHTML = listOD.tableRow;

    const listEB = getExpenseBudget(dataValuesOU, level2OU);
    document.getElementById('th-project-expBudget').innerHTML = listEB.tableHead;
    document.getElementById('tb-project-expBudget').innerHTML = listEB.tableRow;

    const listTI = getTotalIncome(dataValuesOU, level2OU);
    document.getElementById('th-project-totalIncome').innerHTML = listTI.tableHead;
    document.getElementById('tb-project-totalIncome').innerHTML = listTI.tableRow;

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
        name: 'Entity Code',
        style: ''
      },
      {
        id: 'HrHPzD3Talq',
        name: 'Primary point of contact for follow-up on business plan'
      },
      {
        id: 'MgoVYQLP3yT',
        name: 'Contact Email'
      },
      {
        id: '',
        name: 'Formula-generated proposed grant amount (Year 1) (USD)'
      },
      {
        id: '',
        name: 'PROVISIONAL formula- generated grant amount (Year 2) (USD)'
      },
      {
        id: '',
        name: 'PROVISIONAL formula- generated grant amount (Year 3) (USD)'
      },
      {
        id: 'year',
        name: 'Year'
      },
      {
        id: '',
        name: 'Project Name'
      },
      {
        id: '',
        name: 'Expense Category'
      },
      {
        id: '',
        name: 'Budget by "Expense Category" (Year 1)'
      },
      {
        id: '',
        name: 'Budget by "Expense Category" (Year 2)'
      },
      {
        id: '',
        name: 'Budget by "Expense Category" (Year 3)'
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
    const deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
        style: ''
      },
      {
        id: 'Lv8wUjXV8fl',
        name: 'Entity Code',
        style: ''
      },
      {
        id: 'HrHPzD3Talq',
        name: 'Primary point of contact for follow-up on business plan'
      },
      {
        id: 'MgoVYQLP3yT',
        name: 'Contact Email'
      },
      {
        id: '',
        name: 'Formula-generated proposed grant amount (Year 1) (USD)'
      },
      {
        id: '',
        name: 'PROVISIONAL formula- generated grant amount (Year 2) (USD)'
      },
      {
        id: '',
        name: 'PROVISIONAL formula- generated grant amount (Year 3) (USD)'
      },
      {
        id: 'year',
        name: 'Year'
      },
      {
        id: '',
        name: 'Income Category'
      },
      {
        id: '',
        name: 'Income (Year 1)'
      },
      {
        id: '',
        name: 'Income (Year 2)'
      },
      {
        id: '',
        name: 'Income (Year 3)'
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
      }
      if(index>=19 && index<=23) {
        values['totalInternational'] += values[de.id];
      }
      if(index==26 || index==27) {
        values['totalIppf'] += values[de.id];
      }
    })

    values['percentLocallyGenerated'] = values['totalLocallyGenerated'] && values['totalIncome'] && (values['totalLocallyGenerated']/values['totalIncome']) ? ((values['totalLocallyGenerated']/values['totalIncome'])*100).toFixed(2) : '';
    values['percentInternational'] = values['totalInternational'] && values['totalIncome'] && (values['totalInternational']/values['totalIncome']) ? ((values['totalLocallyGenerated']/values['totalIncome'])*100).toFixed(2)  : '';
    values['percentIppf'] = values['totalIppf'] && values['totalIncome'] && (values['totalIppf']/values['totalIncome']) ? ((values['totalIppf']/values['totalIncome'])*100).toFixed(2)  : '';
  
    
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
        
    values['expBudget'] = item.dataValuesPB[year] && item.dataValuesPB[year]['zGn5c7EZLr0']?displayValue(item.dataValuesPB[year]['zGn5c7EZLr0']): '';

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
  function getFocusArea(dataValuesOU, level2OU) {

    var rows = "";
    var tableRow = "";
    const deList = [
      {
        id: 'OgPuoRimaat',
        name: 'Country of Operation',
        style: ''
      },
      {
        id: 'Lv8wUjXV8fl',
        name: 'Entity Code',
        style: ''
      },
      {
        id: 'HrHPzD3Talq',
        name: 'Primary point of contact for follow-up on business plan'
      },
      {
        id: 'MgoVYQLP3yT',
        name: 'Contact Email'
      },
      {
        id: '',
        name: 'Formula-generated proposed grant amount (Year 1) (USD)'
      },
      {
        id: '',
        name: 'PROVISIONAL formula- generated grant amount (Year 2) (USD)'
      },
      {
        id: '',
        name: 'PROVISIONAL formula- generated grant amount (Year 3) (USD)'
      },
      {
        id: 'year',
        name: 'Year'
      },
      {
        id: '',
        name: 'Project Name'
      },
      {
        id: '',
        name: 'Project Focus Areas'
      },
      {
        id: '',
        name: 'Associated Strategic Pillar'
      },
      {
        id: '',
        name: 'Budget by "Project Focus Area" (Year 1)'
      },
      {
        id: '',
        name: 'Budget by "Project Focus Area" (Year 2)'
      },
      {
        id: '',
        name: 'Budget by "Project Focus Area" (Year 3)'
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
      rows += `<tr><td>${region}</td><td>${item.orgUnit}</td>`;
      deList.forEach((de, index) => {
        if (index <= (deList.length - 3)) rows += `<td>${item.dataValuesOD[year] && item.dataValuesOD[year][de.id] ? item.dataValuesOD[year][de.id] : ''}</td>`;
      })

        dataElements.projectFocusAreaNew.forEach((pfa, index) => {
          pfa.focusAreas.forEach(fa => {
            if (item.dataValuesFA[year] && item.dataValuesFA[year][fa] && item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
              const val = JSON.parse(item.dataValuesFA[year][fa]);
              tableRow += rows;
              tableRow += `<td>${val.area}</td><td>${val.pillar}</td></tr>`;
            }
          })
        })
      })
    return {
      tableHead,
      tableRow
    }

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
  if (Number(num) == 0) return ''
  else return 'red'
}
