import { getUserConfig } from "../config.js";
import BaseApi from "../../api/BaseApi.js";

document.addEventListener("DOMContentLoaded", async function () {
  renderTable(); 

  try {
    const userConfig = await getUserConfig();
    if (userConfig) {
      userConfig.user.forEach(user => {
        $(`.${user}`).hide();
      });
    }
  } catch (error) {
    console.error("Config load error:", error);
  }

  $('.sidebar-menu').show();

  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault();
      const targetPage =
        event.currentTarget.getAttribute("data-target") ||
        event.currentTarget.parentElement.getAttribute("data-target");

      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });

  // -------- UIN HELPERS --------
  function getCountryCode(country) {
    return country
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 3)
      .toUpperCase();
  }

  async function renderTable() {
    const tableHead = document.querySelector("#reportTable thead");
    const tableBody = document.querySelector("#reportTable tbody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const headers = [
      "UIN Code",
      "Country",
      "Audited annual financial statement, auditor’s annual report and management letter (if available)", 
      "Accounting Manual (if available)", 
      "Procurement Manual/(policy and process) (if available)", 
      "Safeguarding Policy (if available)", 
      "Whistleblowing Policy (if available)"
    ];

    const headRow = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.innerText = h;
      if (h === "UIN Code") {
        th.style.minWidth = "180px";
        th.style.whiteSpace = "nowrap";
      }
      headRow.appendChild(th);
    });
    tableHead.appendChild(headRow);

    tableBody.innerHTML = "<tr><td colspan='19'><span style='color: black; margin-left: 45%; text-align: center;'>Loading Please Wait...</span></td></tr>";

    try {
      const [orgUnitResponse, teiResponse] = await Promise.all([
        BaseApi({
          url: "29/organisationUnitGroups/nDrAezMbLFS.json?fields=id,name,organisationUnits[id,name,code,children[id,name]]",
          method: "GET"
        }),
        BaseApi({
          url: "tracker/trackedEntities.json?paging=false&program=w6sqrDv2VK8&ouMode=ACCESSIBLE&fields=trackedEntity,orgUnit,attributes[attribute,value],enrollments[events[dataValues[dataElement,value,occurredAt]]]",
          method: "GET"
        })
      ]);

      const orgUnits = (await orgUnitResponse.json()).organisationUnits || [];
      const trackedEntities = (await teiResponse.json()).trackedEntities || [];
    
      tableBody.innerHTML = ""; 

      const DOCUMENT_DE_MAP = {
        "Audited annual financial statement, auditor’s annual report and management letter (if available)": "jlNsr7o6Oo4",
        "Accounting Manual (if available)": "BH1cuagl60O",
        "Procurement Manual/(policy and process) (if available)": "XRbabVVbvD3",
        "Safeguarding Policy (if available)": "RBnLWWXrsp9",
        "Whistleblowing Policy (if available)": "FzoA7Cvhu9t"
      };

      const ATTR_UIN_CODE = "qZcVhl6kfpc";
      const ATTR_COUNTRY = "LZacnHsQJRs";

      trackedEntities.forEach(entity => {
        const row = document.createElement("tr");

        // Extract Attributes
        const attributes = entity.attributes || [];
        const uinAttr = attributes.find(a => a.attribute === ATTR_UIN_CODE);
        const countryAttr = attributes.find(a => a.attribute === ATTR_COUNTRY);

        const uinCode = uinAttr ? uinAttr.value : " ";
        
        let country = countryAttr ? countryAttr.value : " ";

        // Mapping entity.orgUnit to country name using orgUnits list
        let parentOU = orgUnits.find(o => o.id === entity.orgUnit);
        if (parentOU) {
          country = parentOU.name;
        } else {
          for (const o of orgUnits) {
            if (o.children && o.children.some(child => child.id === entity.orgUnit)) {
              country = o.name;
              break;
            }
          }
        }

        // UIN Code Cell
        const tdUIN = document.createElement("td");
        tdUIN.innerText = uinCode;
        tdUIN.style.whiteSpace = "nowrap";
        row.appendChild(tdUIN);

        // Country Cell
        const tdCountry = document.createElement("td");
        tdCountry.innerText = country;
        row.appendChild(tdCountry);

        // Extract Data Elements from the most recent event
        let eventDataValues = [];
        if (entity.enrollments && entity.enrollments.length > 0) {
          const events = entity.enrollments[0].events;
          if (events && events.length > 0) {
            // You can sort by occurredAt to get the latest, or just use events[0]
            eventDataValues = events[0].dataValues || [];
          }
        }

        // Checklist cells
        const checklistKeys = [
          "Audited annual financial statement, auditor’s annual report and management letter (if available)",
          "Accounting Manual (if available)",
          "Procurement Manual/(policy and process) (if available)",
          "Safeguarding Policy (if available)",
          "Whistleblowing Policy (if available)"
        ];

        checklistKeys.forEach(key => {
          const dataElementId = DOCUMENT_DE_MAP[key];
          const dataValueObj = eventDataValues.find(dv => dv.dataElement === dataElementId);
          
          const td = document.createElement("td");
          if (dataValueObj && dataValueObj.value && dataValueObj.value.trim() !== "") {
            let val = dataValueObj.value.trim();
            if (val.toLowerCase() === "true" || val.toLowerCase() === "yes") {
              val = "Yes";
            } else if (val.toLowerCase() === "false" || val.toLowerCase() === "no") {
              val = "No";
            } else {
              // If it's a file UID or other data, it means the document is available
              val = "Yes";
            }
            td.innerText = val;
          } else {
            td.innerText = "No";
          }
          row.appendChild(td);
        });

        tableBody.appendChild(row);
      });

      if (trackedEntities.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='7' style='text-align: center;'>No data available</td></tr>";
      }

    } catch (error) {
      console.error("Error:", error);
      tableBody.innerHTML = "<tr><td colspan='7' style='text-align: center; color: red;'>Error loading data</td></tr>";
    }
  }

  document.getElementById("downloadExcel")
    .addEventListener("click", () => {
      window.downloadTablesAsExcel(["UIN Document CheckList Report"], "UIN Document CheckList Report");
    });

});