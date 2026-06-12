import { getUserConfig } from "../config.js";
import BaseApi from "../../api/BaseApi.js";
import { attributes } from "../../constant.js";


document.addEventListener("DOMContentLoaded", async function () {
  showLoader();
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
      "Region",
      "Country of Registration",
      "Legal Name",
      "UIN Code",
      "Organisation Type",
      "Registered Address",
      "Contact Email",
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

      trackedEntities.forEach(entity => {
        const row = document.createElement("tr");
        const attrMap = Object.fromEntries(
          entity.attributes?.map(a => [a.attribute, a.value])
        );

        const region = attrMap[attributes.region] || "";
        const countryOfRegistration = attrMap[attributes.countryRegistration] || "";
        const legalName = attrMap[attributes.legalName] || "";
        const uinCode = attrMap[attributes.uinCode] || "";
        const organisationType = attrMap[attributes.organisationType] || "";
        const registeredAddress = attrMap[attributes.RegisteredAddress] || "";
        const contactEmail = attrMap[attributes.contactEmail] || "";

        let country = "";
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

        const values = [
          region,
          countryOfRegistration,
          legalName,
          uinCode,
          organisationType,
          registeredAddress,
          contactEmail
        ]

        row.innerHTML = values.map(v => `<td>${v}</td>`).join(" ");


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
    } finally {
      hideLoader();
    }
  }

  document.getElementById("downloadExcel")
    .addEventListener("click", () => {
      window.downloadTablesAsExcel(["UIN Document CheckList Report"], "UIN Document CheckList Report");
    });

});

  function showLoader(message = "Please wait, generating report...") {

    const container = document.querySelector("#mainHeading");
    container.style.position = "relative";

    const loader = document.createElement("div");
    loader.id = "global-loader";

    loader.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      min-height: 500px;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    `;

    loader.innerHTML = `
      <div style="
        background:white;
        padding:30px 40px;
        border-radius:10px;
        text-align:center;
        box-shadow:0 4px 20px rgba(0,0,0,0.15);
      ">
        <div class="spinner" style="
          border:5px solid #eee;
          border-top:5px solid #15803d;
          border-radius:50%;
          width:40px;
          height:40px;
          margin:0 auto 15px;
          animation: spin 1s linear infinite;
        "></div>

        <p style="font-weight:500;margin:0;">
          ${message}
        </p>
      </div>
    `;
    container.appendChild(loader);

    if (!document.getElementById("loader-style")) {

      const style = document.createElement("style");

      style.id = "loader-style";

      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  function hideLoader() {
    const loader = document.getElementById("global-loader");
    if (loader) loader.remove();
  }