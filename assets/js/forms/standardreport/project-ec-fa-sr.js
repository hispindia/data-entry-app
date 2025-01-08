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
          const filteredPrograms = event.trackedEntityInstances[0].enrollments.filter((enroll) => 
          enroll.program == program.auProjectFocusArea
          || enroll.program == program.auProjectDescription
          );
            
          let dataValuesPD = getProgramStageEvents(filteredPrograms, programStage.auProjectDescription, program.auProjectDescription, dataElements.year.id) //data values year wise
          
          let dataValuesFA = getProgramStageEvents(filteredPrograms, programStage.auProjectFocusArea, program.auProjectFocusArea, dataElements.year.id) //data values year wise
        
          dataValuesOU.push({
            orgUnit: ou.name,
            ouId: ou.id,
            dataValuesPD: dataValuesPD,
            dataValuesFA: dataValuesFA,
          })          
        }
      }
    }
    
    populateProgramEvents(level2OU,dataValuesOU);
    
  }

  // Function to populate program events data
  function populateProgramEvents(level2OU,dataValuesOU) {
    const listFA = getPillarBudgetFA(dataValuesOU,level2OU);

    //Pillar Spending
    var tableHead = `<tr>
    <th style="background:#276696;color:white;text-align:center;">OrgUnit 2025</th>
    <th style="background:#276696;color:white;text-align:center;">Area</th>
    <th style="background:#276696;color:white;text-align:center;">Pillar</th>
    <th style="background:#276696;color:white;text-align:center;">Budget</th>
    </tr>`
    $('#th-area-spending').html(tableHead);

    var tableBody = ''
    if(listFA[tei.year.end]) {
      level2OU.forEach(headOU => {
        headOU.children.sort((a, b) => a.name.localeCompare(b.name));
        headOU.children.forEach(ou=> {
          if(listFA[tei.year.end][ou.id]) {
            listFA[tei.year.end][ou.id].forEach((fa,index) => {
              if(index ==0) tableBody += `<tr><td rowspan="${listFA[tei.year.end][ou.id].length}">${ou.name}`
              else  tableBody += `<tr>`;

              tableBody += `<td>${fa['area']}</td>
              <td>${fa['pillar']}</td>
              <td>${fa['budget']}</td>
            </tr>  `
            })
          }
      });
    })  
  }
    $('#tb-area-spending').html(tableBody);

    
    $("#loader").empty();

          
    // Localize content
    $('body').localize();
  }

  function getPillarBudgetFA(dataValuesOU, level2OU) {
    const dvOUFocusArea = {};

    dataElements.projectFocusAreaNew.forEach((pfa,index) => {
      pfa.focusAreas.forEach(fa => {
        dataValuesOU.forEach(item => {

          for(let year = tei.year.start; year <= tei.year.end; year++) {
            if(item.dataValuesFA[year] && item.dataValuesFA[year][fa] && item.dataValuesPD[year] && item.dataValuesPD[year][dataElements.projectDescription[index]['name']]) {
              const val = JSON.parse(item.dataValuesFA[year][fa]);
              if(val.budget) {
                if(!dvOUFocusArea[year]) dvOUFocusArea[year] = {};
                if(!dvOUFocusArea[year][item.ouId]) dvOUFocusArea[year][item.ouId] = [];
                dvOUFocusArea[year][item.ouId].push({
                  area: val.area,
                  pillar: val.pillar,
                  budget: val.budget
                })
               }
            }
          }
        })
      })
    })
    return dvOUFocusArea;
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
