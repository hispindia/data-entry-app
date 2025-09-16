import { getMeData, getOrganisationUnits } from "./api/func.js";
import { tei } from "./constant.js";
import { userGroupConfig } from "./forms/config.js";

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

  document.getElementById('region').addEventListener("change", function (ev) {
    const {value} = ev.target
    setMembersAssociation([{id: value}])
  })

  async function fetchOrganizationUnitUid() {
    try {

      const data = await getMeData();
      const resOUGroup = await getOrganisationUnits("mwQWyy8TGZv");

      orgUnitGroup = resOUGroup.organisationUnits;

      const userConfig = userGroupConfig(data);
      tei.disabled = userConfig.disabled;
      window.localStorage.setItem('userDisabled', userConfig.disabled);
      window.localStorage.setItem('hideReporting', userConfig.disabledValues);
    
    if(userConfig.disabledValues.includes('aoc') || userConfig.disabledValues.includes('trt')) {
      $(`.aoc-users`).show();
    } else $(`.aoc-users`).hide();
    
    if(userConfig.disabledValues.includes('core')) {
      $('.core-users').show();
      $('.maintenance').removeClass('d-none').addClass("d-block")
    }
    if(userConfig.disabledValues.includes('ma')) {
      $('.ma-users').show();
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

