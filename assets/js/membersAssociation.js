var orgUnitGroup = [];

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

  async function fetchOrganizationUnitUid() {
    try {

      const response = await fetch(
        `../../me.json?fields=id,name,organisationUnits[id,name,level,children[id,name],parent[id,name]],userGroups[id,name]`,
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

      orgUnitGroup = resOUGroup.organisationUnits;

      const userConfig = userConfig()
      tei.disabled = userConfig.disabled;
      window.localStorage.setItem('hideReporting', userConfig.disabledValues);
    

    if(window.localStorage.getItem("hideReporting").includes('aoc')) {
      $('.aoc-reporting').hide();
    }
    if(window.localStorage.getItem("hideReporting").includes('trt')) {
      $('.trt-review').hide();
    }

      var level2OU = [];
      data.organisationUnits.forEach(orgUnits => {
        if(orgUnits.level == 1) { 
          level2OU = orgUnits.children;
        } else if(orgUnits.level == 2) { 
          level2OU.push(orgUnits);
        } else if(orgUnits.parent) {
          level2OU.push(orgUnits.parent);
        }
      });


      var masterOU = window.localStorage.getItem("masterOU");
      masterOU = JSON.parse(masterOU);
    
      var selectedParentOU = "";
      var regionOptions = '';
      level2OU.sort((a, b) => a.name.localeCompare(b.name))
      level2OU.forEach(ou => {
        if (masterOU && masterOU.parent.id == ou.id) {
          selectedParentOU = ou.id;
          regionOptions += `<option selected value='${ou.id}'>${ou.name}</option>`
        }
        else {
          if(!selectedParentOU) selectedParentOU = ou.id;
          regionOptions += `<option value='${ou.id}'>${ou.name}</option>`
        }
      })
      document.getElementById('region').innerHTML = regionOptions;

      setMembersAssociation(level2OU, selectedParentOU);
      
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  fetchOrganizationUnitUid();
});

function setMembersAssociation(level2OU, selectedParentOU) {
  var orgUnitList = [];
  orgUnitGroup.forEach(ou => {
    if(selectedParentOU) {
      if (ou.path.includes(selectedParentOU)) orgUnitList.push(ou);
    }
    else if (level2OU.some(mainOU => ou.path.includes(mainOU.id))) orgUnitList.push(ou);
  })

  var masterOU = window.localStorage.getItem("masterOU");
  masterOU = JSON.parse(masterOU);

  var orgUnitOptions = '';
  orgUnitList.sort((a, b) => a.name.localeCompare(b.name))
  orgUnitList.forEach(ou => {
    if (masterOU && masterOU.id == ou.id) orgUnitOptions += `<option selected value='${JSON.stringify(ou)}'>${ou.name}</option>`
    else orgUnitOptions += `<option value='${JSON.stringify(ou)}'>${ou.name}</option>`
  })
  if (!masterOU) window.localStorage.setItem("masterOU", JSON.stringify(orgUnitList[0]));
  
  document.getElementById('organisationUnits').innerHTML = orgUnitOptions;
}

