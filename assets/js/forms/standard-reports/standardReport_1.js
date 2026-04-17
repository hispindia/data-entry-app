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
  async function renderTable() {
    const tableHead = document.querySelector("#reportTable thead");
    const tableBody = document.querySelector("#reportTable tbody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const headers = [
      "BPCountry", 
      "Core_Grant_Receiving", 
      "DHIS2_Code Verified", 
      "ACCountry", 
      "ACEntity", 
      "ACEntityEnglish",
      "AffiliationStatus",
      "CurrentStatus",
      "Inactivity_Details",
      "ACCountry_1",
      "Institutions",
      "ENGCountry"
      
    ];

    const headRow = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.innerText = h;
      headRow.appendChild(th);
    });
    tableHead.appendChild(headRow);

    tableBody.innerHTML = "<tr><td colspan='6'>Loading report data...</td></tr>";

    try {
      const [orgUnitResponse, teiResponse] = await Promise.all([
        BaseApi({
          url: "29/organisationUnitGroups/nDrAezMbLFS.json?fields=id,name,organisationUnits[id,name,code,children[id,name]]",
          method: "GET"
        }),
        BaseApi({
          url: "tracker/trackedEntities.json?paging=false&program=w6sqrDv2VK8&ouMode=ACCESSIBLE&fields=trackedEntity,orgUnit,enrollments[events[dataValues[dataElement,value]]]",
          method: "GET"
        })
      ]);
      
      if (!orgUnitResponse.ok || !teiResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const reportData = await orgUnitResponse.json();
      const orgUnits = reportData.organisationUnits || [];

      const teiData = await teiResponse.json();
      const trackedEntities = teiData.trackedEntities || teiData.instances || [];

      const trackerDataMap = {};
      trackedEntities.forEach(tei => {
        let affiliationStatus = "";
        let affiliationType = "";

        const enrollments = tei.enrollments || [];
        enrollments.forEach(en => {
          const events = en.events || [];
        //   events.forEach(ev => {
        //     const dataValues = ev.dataValues || [];
        //     dataValues.forEach(dv => {
        //       // Affiliation Status
        //       if (dv.dataElement === "qg4tyJoHEiS" && dv.value) {
        //         affiliationStatus = dv.value;
        //         console.log("affilaition status------", affiliationStatus);
        //       }
        //       // Affiliation Type (maps to CurrentStatus column)
        //       if (dv.dataElement === "gDI26Sq88pk" && dv.value) {
        //         affiliationType = dv.value;
        //         console.log("affilatin type---", affiliationType);
        //       }
        //     });
        //   });
        let affiliationStatus = "";
        let affiliationType = "";

            const latestEvent = (en.events || []).sort(
            (a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)
            )[0];

            if (latestEvent) {
            latestEvent.dataValues.forEach(dv => {
                if (dv.dataElement === "qg4tyJoHEiS") {
                affiliationStatus = dv.value;
                }
                if (dv.dataElement === "gDI26Sq88pk") {
                affiliationType = dv.value;
                }
            });
            }   
    
    });

        if (tei.orgUnit) {
          if (!trackerDataMap[tei.orgUnit]) {
            trackerDataMap[tei.orgUnit] = { affiliationStatus: "", affiliationType: "" };
          }
          
         
          if (affiliationStatus) trackerDataMap[tei.orgUnit].affiliationStatus = affiliationStatus;
          if (affiliationType) trackerDataMap[tei.orgUnit].affiliationType = affiliationType;
        }
      });

      // Clear loading state
      tableBody.innerHTML = "";

      orgUnits.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      orgUnits.forEach(ou => {
        if (ou.children && ou.children.length > 0) {
          // If country has children (affiliates), render a row for EACH child
          ou.children.forEach(child => {
            const trackerData = trackerDataMap[ou.id] || {};
            const affiliationStatus = trackerData.affiliationStatus || "";
            const currentStatus = trackerData.affiliationType || "";

            const tr = document.createElement("tr");

            tr.innerHTML = `
              <td>${ou.name || ""}</td>
              <td>Member</td>
              <td>${ou.code || ""}</td>
              <td>${ou.name || ""}</td>
              <td>${child.name || ""}</td>
              <td>${child.name || ""}</td>
              <td>${affiliationStatus}</td>
              <td>${currentStatus}</td>
              <td></td>
              <td>${ou.name || ""}</td>
              <td>IPPF</td>
              <td>${ou.name || ""}</td>
            `;

            tableBody.appendChild(tr);
          });
        } else {
          // If no children, render just the country row
          const trackerData = trackerDataMap[ou.id] || {};
          const affiliationStatus = trackerData.affiliationStatus || "";
          const currentStatus = trackerData.affiliationType || "";

          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${ou.name || ""}</td>
            <td>Member</td>
            <td>${ou.code || ""}</td>
            <td>${ou.name || ""}</td>
            <td></td>
            <td></td>
            <td>${currentStatus}</td>
            <td>${affiliationStatus}</td>
            <td></td>
            <td>${ou.name || ""}</td>
            <td>IPPF</td>
            <td>${ou.name || ""}</td>
          `;

          tableBody.appendChild(tr);
        }
      });
      
      if (orgUnits.length === 0) {
         tableBody.innerHTML = "<tr><td colspan='6'>No data available.</td></tr>";
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      tableBody.innerHTML = "<tr><td colspan='6'>Error loading report data. Please try again later.</td></tr>";
    }
  }

  document.getElementById("downloadExcel")
    .addEventListener("click", () => {
      if (typeof window.downloadTablesAsExcel === "function") {
        window.downloadTablesAsExcel(["UIN Master Report"], "UIN_Master_Report");
      } else {
        console.error("downloadTablesAsExcel function is not globally available.");
      }
    });

});