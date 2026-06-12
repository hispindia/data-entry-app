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

  async function renderTable() {
    const tableHead = document.querySelector("#reportTable thead");
    const tableBody = document.querySelector("#reportTable tbody");

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    const headers = [
      "Region",
      "Country of Registration",
      "Legal Name",
      "Organisation Type",
      "Registered Address",
      "Contact Email",
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


      const orgUnits = (await orgUnitResponse.json()).organisationUnits || [];
      const trackedEntities = (await teiResponse.json()).trackedEntities || [];

      // ---- Tracker Map ----
      const trackerDataMap = {};

      trackedEntities.forEach(tei => {
        let affiliationStatus = "";
        let affiliationType = "";

        const attrMap = Object.fromEntries(
          tei?.attributes?.map(a => [a.attribute, a.value])
        );
        
        const region = attrMap[attributes.region] || "";
        const countryOfRegistration = attrMap[attributes.countryRegistration] || "";
        const legalName = attrMap[attributes.legalName] || "";
        const organisationType = attrMap[attributes.organisationType] || "";
        const registeredAddress = attrMap[attributes.RegisteredAddress] || "";
        const contactEmail = attrMap[attributes.contactEmail] || "";
        const uinCode = attrMap[attributes.uinCode] || "";
        const dhis2CodeVerified = attrMap[attributes.dhis2CodeVerified] || "";
       
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
            region,
            countryOfRegistration,
            legalName,
            organisationType,
            registeredAddress,
            contactEmail
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
            const affiliationStatus = trackerData.affiliationStatus;
            const currentStatus = trackerData.affiliationType || " ";
            const uin = trackerData.uinCode || "--";
            const dhisCode = trackerData.dhis2CodeVerified || ou.code; // Use attribute, fallback to ou.code

            const region = trackerData.region || "";                            
            const countryOfRegistration = trackerData.countryOfRegistration || "";
            const legalName = trackerData.legalName || "";
            const organisationType = trackerData.organisationType || "";
            const registeredAddress = trackerData.registeredAddress || "";
            const contactEmail = trackerData.contactEmail || "";


            const tr = document.createElement("tr");

            tr.innerHTML = `
              <td>${region}</td>
              <td>${ou.name}</td>
              <td>${legalName}</td>
              <td>${organisationType}</td>
              <td>${registeredAddress}</td>
              <td>${contactEmail}</td>
              <td>${ou.name}</td>
              <td>Member</td>
              <td>${dhisCode}</td>
              <td>${uin}</td>
              <td>${ou.name}</td>
              <td>${child.name}</td>
              <td>${child.name}</td>
              <td>
              ${ affiliationStatus == null || affiliationStatus === "" ? " " :
                affiliationStatus === "Active" ? "Active" : "Inactive"
              }
              </td>
              <td>${currentStatus}</td>
              <td>
               ${ affiliationStatus == null || affiliationStatus === "" ? " " :
                affiliationStatus === "Active" ? " " : affiliationStatus
              }
              </td>
              <td>${ou.name}</td>
              <td>IPPF</td>
              <td>${ou.name}</td>
            `;

            tableBody.appendChild(tr);
          });
        } else {
          const trackerData = trackerDataMap[ou.id] || {};
          const affiliationStatus = trackerData.affiliationStatus;
          const currentStatus = trackerData.affiliationType;
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
            <td>
            ${ affiliationStatus == null || affiliationStatus === "" ? " " :
                affiliationStatus === "Active" ? "Active" : "Inactive"
              }
            </td>
            <td>${currentStatus}</td>
            <td></td>
              <td>
               ${ affiliationStatus == null || affiliationStatus === "" ? " " :
                affiliationStatus === "Active" ? " " : affiliationStatus
              }
              </td>
            <td>IPPF</td>
            <td>${ou.name}</td>
          `;

          tableBody.appendChild(tr);
        }
      });

    } catch (error) {
      console.error("Error:", error);
      tableBody.innerHTML = "<tr><td colspan='13'>Error loading data</td></tr>";
    } finally {
      hideLoader(); 
    }
  }

  document.getElementById("downloadExcel")
    .addEventListener("click", () => {
      window.downloadTablesAsExcel(["UIN-IPPF Partnership Register"], "UIN-IPPF Partnership Register");
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