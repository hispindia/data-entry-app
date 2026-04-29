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
      "UIN", 
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
      if (h == "UIN") {
        th.style.minWidth = "120px";
        th.style.whiteSpace = "nowrap";
      }
      headRow.appendChild(th);
    });
    tableHead.appendChild(headRow);

    tableBody.innerHTML = "<tr><td colspan='13'>Loading...</td></tr>";

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

      const ATTR_UIN_CODE = "qZcVhl6kfpc";
      const ATTR_DHIS2_CODE_VERIFIED = "ATmUT1JYobI";

      const orgUnits = (await orgUnitResponse.json()).organisationUnits || [];
      const trackedEntities = (await teiResponse.json()).trackedEntities || [];

      // ---- Tracker Map ----
      const trackerDataMap = {};

      trackedEntities.forEach(tei => {
        let affiliationStatus = "";
        let affiliationType = "";

        const uinAttributes = tei.attributes?.find(a => a.attribute === ATTR_UIN_CODE);
        const uinCode = uinAttributes ? uinAttributes.value : " ";

        const dhis2CodeAttr = tei.attributes?.find(codeAttr => codeAttr.attribute === ATTR_DHIS2_CODE_VERIFIED);
        const dhis2CodeVerified = dhis2CodeAttr ? dhis2CodeAttr.value : " ";
        tei.enrollments?.forEach(en => {
          const latestEvent = (en.events || []).sort(
            (a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)
          )[0];

          latestEvent?.dataValues?.forEach(dv => {
            if (dv.dataElement === "qg4tyJoHEiS") affiliationStatus = dv.value;
            if (dv.dataElement === "gDI26Sq88pk") affiliationType = dv.value;
          });
        });

        if (tei.orgUnit) {
          trackerDataMap[tei.orgUnit] = {
            affiliationStatus,
            affiliationType,
            uinCode,
            dhis2CodeVerified,
          };
        }
      });

      tableBody.innerHTML = "";

      orgUnits.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      orgUnits.forEach(ou => {
        if (ou.children && ou.children.length > 0) {
          ou.children.forEach(child => {
            // Find data using child.id only (do not fallback to parent so each member gets its own UIN)
            const trackerData = trackerDataMap[child.id] || {};
            const affiliationStatus = trackerData.affiliationStatus || "Active";
            const currentStatus = trackerData.affiliationType || "Active";
            const uin = trackerData.uinCode || "--";
            const dhisCode = trackerData.dhis2CodeVerified || ou.code; // Use attribute, fallback to ou.code

            const tr = document.createElement("tr");

            tr.innerHTML = `
              <td>${ou.name}</td>
              <td>Member</td>
              <td>${dhisCode}</td>
              <td>${uin}</td>
              <td>${ou.name}</td>
              <td>${child.name}</td>
              <td>${child.name}</td>
              <td>${affiliationStatus}</td>
              <td>${currentStatus}</td>
              <td></td>
              <td>${ou.name}</td>
              <td>IPPF</td>
              <td>${ou.name}</td>
            `;

            tableBody.appendChild(tr);
          });
        } else {
          const trackerData = trackerDataMap[ou.id] || {};
          const affiliationStatus = trackerData.affiliationStatus || "Active";
          const currentStatus = trackerData.affiliationType || "Active";
          const uin = trackerData.uinCode || "--";
          const dhisCode = trackerData.dhis2CodeVerified || ou.code; // Use attribute, fallback to ou.code

          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${ou.name}</td>
            <td>Member</td>
            <td>${dhisCode}</td>
            <td>${uin}</td>
            <td>${ou.name}</td>
            <td></td>
            <td></td>
            <td>${affiliationStatus}</td>
            <td>${currentStatus}</td>
            <td></td>
            <td>${ou.name}</td>
            <td>IPPF</td>
            <td>${ou.name}</td>
          `;

          tableBody.appendChild(tr);
        }
      });

    } catch (error) {
      console.error("Error:", error);
      tableBody.innerHTML = "<tr><td colspan='13'>Error loading data</td></tr>";
    }
  }

  document.getElementById("downloadExcel")
    .addEventListener("click", () => {
      window.downloadTablesAsExcel(["UIN-IPPF Partnership Register"], "UIN-IPPF Partnership Register");
    });

});