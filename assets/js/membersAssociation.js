import { getMeData, getOrganisationUnits } from "./api/func.js";
import { tei } from "./constant.js";
import { userGroupConfig } from "./forms/config.js";

var orgUnitGroup = [];
var userOrgUnit = {};

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

  document.getElementById('region').addEventListener("change", function (ev) {
    const {value} = ev.target
    setMembersAssociation([{id: value}])
  })

  async function fetchOrganizationUnitUid() {
    try {
      const data = await getMeData();
      const resOUGroup = await getOrganisationUnits("mwQWyy8TGZv");

      const userConfig = userGroupConfig(data);
      tei.disabled = userConfig.disabled;
      window.localStorage.setItem('userDisabled', userConfig.disabled);
      window.localStorage.setItem('hideReporting', userConfig.disabledValues);
    
      
    if(userConfig.disabledValues.includes('aoc')) {
      $(`.aoc-users`).show();
    } else $(`.aoc-users`).hide();

    if(userConfig.disabledValues.includes('trt')) {
      $(`.trt-users`).show();
    } else if(!userConfig.disabledValues.includes('trt') && !userConfig.disabledValues.includes('aoc')) $(`.trt-users`).hide();
      
    if(userConfig.disabledValues.includes('core')) {
      $('.core-users').show();
      $('.maintenance').removeClass('d-none').addClass("d-block")
    }
    
    if(userConfig.disabledValues.includes('ma')) {
      $('.ma-users').show();
    }
    
    orgUnitGroup = resOUGroup.organisationUnits;    
    data.organisationUnits.forEach(ou => userOrgUnit[ou.id] = true);

      var level2OU = [];
      var hasRegion = {};
      data.organisationUnits.forEach(orgUnits => {
        if(orgUnits.level == 1) { 
          level2OU = orgUnits.children;
          orgUnits.children.forEach(ou => {
             hasRegion[ou.id] = true;
          })
        } else if(orgUnits.level == 2) { 
          level2OU.push(orgUnits);
          hasRegion[orgUnits.id] = true;
        } else if(orgUnits.parent) {
          if(!hasRegion[orgUnits.parent.id]) {
            level2OU.push(orgUnits.parent);
            hasRegion[orgUnits.parent.id] = true;
          }
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
      
      if(data.organisationUnits.length==1 && data.organisationUnits[0].level == 3) {
        let orgUnitOptions = `<option value='${JSON.stringify(data.organisationUnits[0])}'>${data.organisationUnits[0].name}</option>`
        window.localStorage.setItem("masterOU", JSON.stringify(data.organisationUnits[0]));
        document.getElementById('organisationUnits').innerHTML = orgUnitOptions;
      }
      else setMembersAssociation(level2OU, selectedParentOU);
      
    } catch (error) {
      console.error("Error fetching organization unit:", error);
    }
  }

  fetchOrganizationUnitUid();
});

function setMembersAssociation(level2OU, selectedParentOU) {
  var orgUnitList = [];
  var someOrgUnit = [];
  var hasOrgunit = false;
  orgUnitGroup.forEach(ou => {
    if(selectedParentOU) {
      if (ou.path.includes(selectedParentOU)) {
      if(userOrgUnit[ou.id]) {
        hasOrgunit = true;
        orgUnitList.push(ou);
      }
      someOrgUnit.push(ou);
    }
      
    }
    else if (level2OU.some(mainOU => ou.path.includes(mainOU.id))) {
      if(userOrgUnit[ou.id]) {
        hasOrgunit = true;
        orgUnitList.push(ou);
      }
      someOrgUnit.push(ou);
    }
  })
  if(!hasOrgunit) orgUnitList = someOrgUnit;

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

