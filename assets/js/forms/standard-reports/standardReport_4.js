import { getUserConfig } from "../config.js";
import BaseApi from "../../api/BaseApi.js";
import { attributes, tei } from "../../constant.js";

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

    const topRowHtml = `
      <tr style="background-color: #134b82; color: white; text-align: center;">
        <th rowspan="2" style="vertical-align: middle; background-color: #1e558e; color: #fff">S.No</th>
        <th colspan="12" style="background-color: #1e558e; color: #fff">Bank Details - Account 1</th>
        <th colspan="8" style="background-color: #2e7e3c; color: #fff">Bank Details - Account 2</th>
        <th colspan="8" style="background-color: #1e558e; color: #fff">Bank Details - Account 3</th>
      </tr>
    `;

    const childHeaders = [
      { name: "SUP - ID", color: "#1e558e", id: "juH6EvVHjW8"},
      { name: "Legal Name", color: "#1e558e", id: "UkQI1dWzZOv"}, 

      { name: "Bank Name - Bank Account 1", color: "#1e558e", id: "cvI0Tq2uPjC"},
      { name: "Bank Address", color: "#1e558e", id: "HTnwbE6NjXT"}, 
      { name: "Bank Account Number", color: "#1e558e", id: "zB27tS5QtT0"},
      { name:  "Type", color: "#1e558e", id: "LZK61Z8lv5J"},
      { name: "Bank Number", color: "#1e558e", id: "R0LtN7mKlFp"},
      { name: "BIC/Swift Code", color: "#1e558e", id: "ACstTNRg27W"},  
      { name: "IBAN", color: "#1e558e",id: "z7sYWdtwtZo"}, 
      { name: "BBAN", color: "#1e558e", id: "FVRbOko0Lnf"},
      // bank 2
      { name: "Bank Name - Bank Account 2", color: "#2e7e3c", id: "CkulnRpyanv"},
      { name: "Bank Address", color: "#2e7e3c", id: "APTLXMxA1cm"},
      { name: "Bank Account Number", color: "#2e7e3c", id: "Y3leCd2J2zI"},
      { name:  "Type", color: "#2e7e3c", id: "vObNw2Z5dmW"},
      { name: "Bank Number", color: "#2e7e3c", id: "Uey8cQZ7Hnc"},
      { name: "BIC/Swift Code", color: "#2e7e3c", id: "fJUzYvak2Gg"},
      { name: "IBAN", color: "#2e7e3c", id: "WRmtb175yV9"},
      { name: "BBAN", color: "#2e7e3c",  id: "LC3EOifVBFe"},
      // bank 3
      { name: "Bank Name - Bank Account 3", color: "#6f2c91", id: "OHPBCB8PgSo"},
      { name: "Bank Address", color: "#6f2c91", id: "jcGWLrmhrZx"}, 
      { name: "Bank Account Number", color: "#6f2c91", id: "aeWIoe8xqwj"},
      { name:  "Type", color: "#6f2c91", id: "WtU54cCOwlw"},
      { name: "Bank Number", color: "#6f2c91", id: "xfVxj9xw3BP"},
      { name: "BIC/Swift Code", color: "#6f2c91", id: "GiP09GH9Cde"},
      { name: "IBAN", color: "#6f2c91", id: "u5SxFrBVsEX"},
      { name: "BBAN", color: "#6f2c91",  id: "M6wwKtFTPai"},

    ];


    const bottomRowHtml = `
      <tr style="background-color: #134b82; color: white; text-align: center;">
        ${childHeaders.map(h => `<th style="background-color: ${h.color}; min-width: 220px; padding: 10px; color: #fff;">${h.name}</th>`).join("")}
      </tr>
    `;

    // Inject both rows directly into the DOM
    tableHead.innerHTML = topRowHtml + bottomRowHtml;

    try {
      const [orgUnitResponse, teiResponse, uinMasterResponse] = await Promise.all([
        BaseApi({
          url: "29/organisationUnitGroups/nDrAezMbLFS.json?fields=id,name,organisationUnits[id,name,code,children[id,name]]",
          method: "GET"
        }),
        BaseApi({
          url: "tracker/trackedEntities.json?paging=false&program=w6sqrDv2VK8&ouMode=ACCESSIBLE&fields=trackedEntity,orgUnit,attributes[attribute,value],enrollments[events[programStage,occurredAt,dataValues[dataElement,value]]]",
          method: "GET"
        }),
        BaseApi({
          url: "/programStages/HsKUiY7RyeO.json?fields=id,name,programStageDataElements[compulsory,dataElement[id,name,formName,valueType,optionSetValue,optionSet[options[id,name,code]]]],programStageSections[id,name,dataElements[id,formName,valueType,optionSetValue,optionSet[options[id,name,code]]]]",
          method: "GET"
        })
      ]);

      const orgUnits = (await orgUnitResponse.json()).organisationUnits || [];
      const trackedEntities = (await teiResponse.json()).trackedEntities || [];
      const uinStage = (await uinMasterResponse.json()).programStageSections || [];
      // console.log("uin stage", uinStage);
      const DATA_ELEMENT_MAP = {};
      uinStage.forEach(section => {
         if(section.dataElements) {
             section.dataElements.forEach(de => {
                 if (de.formName) DATA_ELEMENT_MAP[de.formName.trim()] = de.id;
                 if (de.name) DATA_ELEMENT_MAP[de.name.trim()] = de.id;
             });
         }
      });

      const trackerDataMap = {};
      trackedEntities.forEach(tei => {
        let eventDataValues = [];
        if(tei.enrollments && tei.enrollments.length > 0) {
           const latestEvent = (tei.enrollments[0].events || []).filter((event) => event.programStage === "HsKUiY7RyeO").sort(
            (a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)
           )[0];

           if (latestEvent) eventDataValues = latestEvent.dataValues || [];

          const attrMap = {};
          tei.attributes?.forEach(attr => {
            attrMap[attr.attribute] = attr.value;
          });
        
          const dataMap = {};
          eventDataValues?.forEach(d => {
            dataMap[d.dataElement] = d.value;
          });

          trackerDataMap[tei.orgUnit] = {
            attrMap,
            dataMap
          };
        }
      });

      tableBody.innerHTML = "";
      let serialNo = 1;
      
      orgUnits.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      orgUnits.forEach(ou => {
         if(ou.children && ou.children.length > 0) {
            
            ou.children.forEach(child => {
              if (!trackerDataMap[child.id]) return;
              
              const trackerData = trackerDataMap[child.id] || { attributes: [], dataValues: [] };

              const tr = document.createElement("tr");
              const tdSNo = document.createElement("td");
              tdSNo.innerText = serialNo++;
              tr.appendChild(tdSNo);

              childHeaders.forEach(header => {
                const td = document.createElement("td");

                if (header.name == "Country of Registration") {
                  td.innerText = ou.name || "--No Data --";
                } else if (!header.id) {
                  td.innerText = "";
                } 
                else {
                   const trackerData = trackerDataMap[child.id] || {
                    attrMap: {},
                    dataMap: {}
                  };

              const value =
                trackerData.attrMap[header.id] ??
                trackerData.dataMap[header.id] ??
                "";

              td.innerText = value;
                }
                tr.appendChild(td);
              });
              tableBody.appendChild(tr);
            }); 
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
      window.downloadTablesAsExcel(["UIN Master Report"], "UIN Master Report");
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