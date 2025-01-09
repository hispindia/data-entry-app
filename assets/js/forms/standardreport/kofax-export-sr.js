
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
            || enroll.program == program.auOrganisationDetails
            || enroll.program == program.auIncomeDetails
            || enroll.program == program.auProjectDescription
          );

          let dataValuesFA = getProgramStageEvents(filteredPrograms, programStage.auProjectFocusArea, program.auProjectFocusArea, dataElements.year.id) //data values year wise
          let dataValuesOD = getProgramStageEvents(filteredPrograms, programStage.auMembershipDetails, program.auOrganisationDetails, dataElements.year.id) //data values year wise
          let dataValuesEC = getProgramStageEvents(filteredPrograms, programStage.auProjectExpenseCategory, program.auProjectExpenseCategory, dataElements.year.id) //data values year wise
          let dataValuesTI = getProgramStageEvents(filteredPrograms, programStage.auTotalIncome, program.auIncomeDetails, dataElements.year.id) //data values year wise
          let dataValuesVC = getProgramStageEvents(filteredPrograms, programStage.auValueAddCoreFunding, program.auIncomeDetails, dataElements.year.id) //data values year wise
          let dataValuesPD = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, dataElements.year.id) //data values year wise

          dataValuesOU.push({
            orgUnit: ou.name,
            ouId: ou.id,
            attributes,
            dataValuesOD,
            dataValuesFA,
            dataValuesEC,
            dataValuesTI,
            dataValuesVC,
            dataValuesPD
          })
        }
      }
    }

    populateProgramEvents(level2OU, dataValuesOU);

  }

  // Function to populate program events data
  function populateProgramEvents(level2OU, dataValuesOU) {
    // const list = getPillarBudgetFA(dataValuesOU, level2OU);

    const kofaxExport = getExpenseBudget(dataValuesOU, level2OU);
    document.getElementById('th-kofax-export').innerHTML = kofaxExport.tableHead;
    document.getElementById('tb-kofax-export').innerHTML = kofaxExport.tableRow;
    $("#loader").empty();


    // Localize content
    $('body').localize();
  }

  function getExpenseBudget(dataValuesOU, level2OU) {

    const year = document.getElementById("year-update").value;

    const deList = [
      {
        id: '',
        name: 'Date of Original Agreement',
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: 'Date of First Revision',
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `Date of Second Revision`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `Date of Third Revision`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `Date of Fourth Revision`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'OgPuoRimaat',
        name: `Country`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'DBj5Ni1e1mP',
        name: `Income Category`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'region',
        name: `Region`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'country',
        name: `MA Name`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'eS8HHmy5krN',
        name: `Address`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'IuyGw22tqYj',
        name: `Name of President of the MA`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'YTtJK3jqsnq',
        name: `Email of the President of the MA`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'Ctp6kmhwq86',
        name: `Name of ED/CEO of MA`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'yGutLB1Spaa',
        name: `Email of ED/CEO of MA`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'oKUWFXjXyN6',
        name: `Regional Director`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'Oneiy7DEo8l',
        name: `Email of the Regional Director`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `Total Unrestricted Grant`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `Estimated Commodities Portion (incl. Estimated Freight Cost)`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `Cash Grant Portion`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `Voucher Allocation`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `Youth Movement`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `Rapid Grant`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `1/3 of total of Column T (Cash Grant)`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `1/3 of total of Column T (Cash Grant)`,
        style: 'background:#f0ecec;'
      },
      {
        id: '',
        name: `1/3 of total of Column T (Cash Grant)`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'fkHkH5jcJV0',
        name: `Year 1 Total Allocations`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'dhaMzFTSGrd',
        name: `Year 2 Total Allocations`,
        style: 'background:#f0ecec;'
      },
      {
        id: 'personnel',
        name: `Salaries`,
        style: 'background:#70ad47;'
      },
      {
        id: 'activities',
        name: `Direct Project Expenditure`,
        style: 'background:#70ad47;'
      },
      {
        id: 'cost',
        name: `Indirect/ Support cost`,
        style: 'background:#70ad47;'
      },
      {
        id: 'commodities',
        name: `Commodities`,
        style: 'background:#70ad47;'
      },
      {
        id: 'totalExp',
        name: `Total`,
        style: 'background:#70ad47;'
      },
      {
        id: 'ippfUnrestricted',
        code: 'IPPF Unrestricted Grant',
        name: `IPPF Unrestricted`,
        style: 'background:#f2cfee;'
      },
      {
        id: 'ippfRestricted',
        code: 'IPPF Restricted Grant',
        name: `IPPF Restricted Funding`,
        style: 'background:#f2cfee;'
      },
      {
        id: 'commoditySale',
        code: 'Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)',
        name: 'Commodity sales (including contraceptive, other SRH and non-SRH supplies/products)',
        style: 'background:#fbe3d4;'
      }, {
        id: 'clientFees',
        code: 'Client/Patient fees',
        name: 'Client/Patient fee',
        style: 'background:#fbe3d4;'
      }, {
        id: 'servicesRental',
        code: 'Training, education, professional services and rentals',
        name: 'Training, education, professional services and rentals',
        style: 'background:#fbe3d4;'
      }, {
        id: 'localGovernment',
        code: 'Local/national: government',
        name: 'Local/national: government',
        style: 'background:#fbe3d4;'
      }, {
        id: 'localNongovernment',
        code: 'Local/national: non-government',
        name: 'Local/national: non-government',
        style: 'background:#fbe3d4;'
      }, {
        id: 'membershipFees',
        code: 'Membership fees',
        name: 'Membership fees',
        style: 'background:#fbe3d4;'
      }, {
        id: 'nonOperationIncome',
        code: 'Non-operational income',
        name: 'Non-operational income',
        style: 'background:#fbe3d4;'
      }, {
        id: 'otherIncome',
        code: 'Other national income',
        name: 'Other national income',
        style: 'background:#fbe3d4;'
      }, {
        id: 'multilateralAgencies',
        code: 'Multilateral Agencies and Organizations',
        name: 'Multilateral Agencies and Organizations',
        style: 'background:#c1e6f4;'
      }, {
        id: 'foriegnGovernments',
        code: 'Foreign Governments',
        name: 'Foreign Governments',
        style: 'background:#c1e6f4;'
      }, {
        id: 'internationTrusts',
        code: 'International Trusts and Foundations / NGOs',
        name: 'International Trusts and Foundations / NGOs',
        style: 'background:#c1e6f4;'
      }, {
        id: 'corporateSector',
        code: 'Corporate / Business Sector',
        name: 'Corporate / Business Sector',
        style: 'background:#c1e6f4;'
      }, {
        id: 'otherInternationalIncome',
        code: 'Other International Income',
        name: 'Other International Income',
        style: 'background:#c1e6f4;'
      },
      {
        id: 'totalIncome',
        name: `Total`,
        style: 'background:#fee799;'
      }, 
      {
        id: 'focusArea6',
        name: 'Advocacy',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea1',
        name: 'Care: Static Clinic',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea2',
        name: 'Care: Outreach, mobile clinic, Community-based, delivery',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea3',
        name: 'Care: Other Services, enabled or referred (associated clinics)',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea4',
        name: 'Care: Social Marketing Services',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea5',
        name: 'Care: Digital Health Intervention and Selfcare',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea7',
        name: 'CSE',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea8',
        name: 'CSE Online, including social media',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea9',
        name: 'Partnerships and Movements: capacity-sharing, amplifying messages, and sub-granting',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea10',
        name: 'Knowledge, research, evidence, innovation, and publishing, including peer-review articles',
        style: 'background:#95ddf8;'
      },
      {
        id: 'focusArea11',
        name: 'Internal MA infrastructure, Organisational Development, Capacity Development, values, processes, and procedures',
        style: 'background:#95ddf8;'
      }, {
        id: 'pillar1',
        name: '1. Center Care on People ($)',
        style: 'background:#82e38e;'
      },
      {
        id: 'pillar2',
        name: '2. Move the Sexuality Agenda ($)',
        style: 'background:#82e38e;'
      },
      {
        id: 'pillar3',
        name: '3. Solidarity for Change ($)',
        style: 'background:#82e38e;'
      },
      {
        id: 'pillar4',
        name: '4. Nurture our Federation ($)',
        style: 'background:#82e38e;'
      },
      {
        id: 'totalPillar',
        name: `Total`,
        style: 'background:#82e38e;'
      },
      {
        id: '',
        name: `Check for Total Budget = Total Allocation`,
        style: 'background:#bfbfbf;'
      },
      {
        id: '',
        name: `Remarks`,
        style: 'background:#cbecfb;'
      },
      {
        id: 'yTOe8Cca7u1',
        name: `Supplier`,
        style: 'background:#cbecfb;'
      },
      {
        id: '',
        name: `ID`,
        style: 'background:#cbecfb;'
      },
      {
        id: '',
        name: `UIN`,
        style: 'background:#cbecfb;'
      }
    ]
    var tableHead = `<tr>`;
    deList.forEach(de => {
      tableHead += `<td style="${de.style};font-weight:bold">${de.name}</td>`
  })
    tableHead += '</tr>';

    var tableRow = "";
    dataValuesOU.forEach(item => {

      var values = {};

      deList.forEach(de => {
        values[de.id]= 0
      })

      values = {
        ...values,
        ...item.attributes
      };
      
      if(item.dataValuesOD[year]) values = {
        ...values,
        ...item.dataValuesOD[year]
      }

      values['country'] = item.orgUnit;

      level2OU.forEach(parent => parent.children.forEach(ou => {
        if (ou.name == item.orgUnit) values['region'] = parent.name
      }))
      tableRow += `<tr>`;


      dataElements.projectTotalIncome.forEach(pti => {
        deList.forEach((de) => {
          if(de.code && item.dataValuesTI[year] && de.code==item.dataValuesTI[year][pti.subCategory]) {
            if(de.code == "IPPF Unrestricted Grant") {
              if(item.dataValuesTI[year][pti.unrestricted]) values[de.id] += Number(item.dataValuesTI[year][pti.unrestricted]);
             
            } else if(de.code == "IPPF Restricted Grant") {
              if(item.dataValuesTI[year][pti.restricted]) values[de.id] += Number(item.dataValuesTI[year][pti.restricted]);
             
            } else {
              if(item.dataValuesTI[year][pti.restricted]) values[de.id] += Number(item.dataValuesTI[year][pti.restricted]);
              if(item.dataValuesTI[year][pti.unrestricted]) values[de.id] += Number(item.dataValuesTI[year][pti.unrestricted]);
             
            }
          }
        })
        if(item.dataValuesTI[year] && item.dataValuesTI[year][pti.category]) {
          if(item.dataValuesTI[year] && item.dataValuesTI[year][pti.restricted]) {
            values['totalIncome'] += Number(item.dataValuesTI[year][pti.restricted]);
          }
          if(item.dataValuesTI[year] && item.dataValuesTI[year][pti.unrestricted]) {
            values['totalIncome'] += Number(item.dataValuesTI[year][pti.unrestricted]);
            // values['ippfCore'] += Number(item.dataValuesTI[year][pti.unrestricted]);
          }
        }
      })


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
            else if (val.pillar == '2. Move the Sexuality Agenda') values['pillar2'] += Number(val.budget);
            else if (val.pillar == '3. Solidarity for Change') values['pillar3'] += Number(val.budget);
            else if (val.pillar == '4. Nurture Our Federation') values['pillar4'] += Number(val.budget);

          }
        })
      })

      dataElements.projectExpenseCategory.forEach((pec, index) => {
        if (item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
          if (item.dataValuesEC[year] && item.dataValuesEC[year][pec.personnel]) values['personnel'] += Number(item.dataValuesEC[year][pec.personnel]);
          if (item.dataValuesEC[year] && item.dataValuesEC[year][pec.activities]) values['activities'] += Number(item.dataValuesEC[year][pec.activities]);
          if (item.dataValuesEC[year] && item.dataValuesEC[year][pec.commodities]) values['commodities'] += Number(item.dataValuesEC[year][pec.commodities]);
          if (item.dataValuesEC[year] && item.dataValuesEC[year][pec.cost]) values['cost'] += Number(item.dataValuesEC[year][pec.cost]);
        }
      })

      values['totalExp'] = Number(values['personnel']) + Number(values['activities']) + Number(values['commodities']) + Number(values['cost']);


      for (let i = 1; i <= 4; i++) {
        values['totalPillar'] += Number(values[`pillar${i}`]);
      }

      deList.forEach((de, index) => {
        if(index<16) tableRow += `<td style="${de.style}">${values[de.id] ? values[de.id]: ''}</td>`
        else if(de.id=='yTOe8Cca7u1')  tableRow += `<td style="${de.style}">${values[de.id] ? values[de.id]: ''}</td>`
        else  tableRow += `<td style="${de.style}">${values[de.id] ? displayValue(values[de.id]): ''}</td>`
      })
      tableRow += "</tr>";
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
