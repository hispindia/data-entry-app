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

    // 1. Create the Top Row (Group Headers)
    const topRowHtml = `
      <tr style="background-color: #134b82; color: white; text-align: center;">
        <th rowspan="2" style="vertical-align: middle; background-color: #1e558e; color: #fff">S.No</th>
        <th colspan="12" style="background-color: #1e558e; color: #fff">AFFILIATE / ORGANISATION INFO</th>
        <th colspan="8" style="background-color: #2e7e3c; color: #fff">BOARD MEMBER – PRESIDENT / CHAIRPERSON</th>
        <th colspan="8" style="background-color: #1e558e; color: #fff">BOARD MEMBER – VICE PRESIDENT / VICE CHAIRPERSON</th>
        <th colspan="8" style="background-color: #006f60; color: #fff">BOARD MEMBER – SECRETARY</th>
        <th colspan="8" style="background-color: #6f2c91; color: #fff">BOARD MEMBER – TREASURER</th>
        <th colspan="8" style="background-color: #e35205; color: #fff">BOARD MEMBER – YOUTH</th>
        <th colspan="8" style="background-color: #4b5e65; color: #fff">SENIOR MANAGEMENT – EXECUTIVE DIRECTOR / CEO / DIRECTOR GENERAL</th>
        <th colspan="8" style="background-color: #1e558e; color: #fff">SENIOR MANAGEMENT – DIRECTOR OF FINANCE / CHIEF FINANCE OFFICER</th>
        <th colspan="4" style="background-color: #2e7e3c; color: #fff">SENIOR MANAGEMENT – DIRECTOR OF PROGRAMS</th>
        <th colspan="8" style="background-color: #006f60; color: #fff">SENIOR MANAGEMENT – DIRECTOR OF HR</th>
        <th colspan="4"  style="background-color: #6f2c91; color: #fff">SENIOR MANAGEMENT – DIRECTOR OF ORGANISATION, LEARNING AND EVALUATION</th>
         
      </tr>
    `;

    const childHeaders = [
      { name: "Region", color: "#1e558e", id: attributes.region},
      { name: "Country of Registration", color: "#1e558e", id: attributes.countryRegistration}, //not found
      { name: "Legal Name", color: "#1e558e", id: attributes.legalName}, 
      { name: "Organisation Type", color: "#1e558e", id: attributes.organisationType}, //option set
      { name: "Registration Number", color: "#1e558e", id: attributes.registrationNum}, 
      { name: "Registered Address", color: "#1e558e", id: attributes.RegisteredAddress}, 
      { name: "Contact Email", color: "#1e558e", id: attributes.contactEmail},
      { name: "Website", color: "#1e558e", id: "gYzmXPZ88UI"},
      { name: "Contact Number", color: "#1e558e",id: "QBtd98I0wfS"},
      { name: "Country Code", color: "#1e558e", id: "xrbFQJaSOjc"},
      { name: "Country Income Status", color: "#1e558e", id: "uA6aKCAdLYK"},
      { name: "SOI-OAC Eligible", color: "#1e558e", id: ""}, //not exist
      { name: "Board Member (President/Chairperson) – Designation", color: "#2e7e3c", id: "ar5OGNeliYf"},
      { name: "Board Member (President/Chairperson) – Full Name", color: "#2e7e3c", id: "daG91uRV8pi"},
      { name: "Board Member (President/Chairperson) – Email", color: "#2e7e3c", id: "g4NwCcUEd9l"},
      { name: "Board Member (President/Chairperson) – Country Code", color: "#2e7e3c", id: "jHQLBkoqgt2"},
      { name: "Board Member (President/Chairperson) – Nationality", color: "#2e7e3c",id: "FisnLiX71jG"},
      { name: "Board Member (President/Chairperson) – Contact Number", color: "#2e7e3c", id: "D0fTmsUmrKR"},
      { name: "Board Member (President/Chairperson) – Date of Birth", color: "#2e7e3c", id: "Xq5fIRzEb5K"},
      { name: "Board Member (President/Chairperson) – UIN / Tax ID / National ID", color: "#2e7e3c", id: "vcR9TS21A05"},
      { name: "Board Member (Vice President/Vice Chairperson) – Designation", color: "#1e558e", id: "QU7pSBf1O68"},
      { name: "Board Member (Vice President/Vice Chairperson) – Full Name", color: "#1e558e", id: "uT1NdSet4eo"},
      { name: "Board Member { name: (Vice President/Vice Chairperson) – Email", color: "#1e558e", id: "IXu4ddpiYNs"},
      { name: "Board Member (Vice President/Vice Chairperson) – Country Code", color: "#1e558e", id: "KFWXOk5COr5"},
      { name: "Board Member (Vice President/Vice Chairperson) – Nationality", color: "#1e558e",id: "gmCNhtm5PgH"}, 
      { name: "Board Member (Vice President/Vice Chairperson) – Contact Number", color: "#1e558e", id: "D0fTmsUmrKR"},
      { name: "Board Member (Vice President/Vice Chairperson) – Date of Birth", color: "#1e558e", id: "Xq5fIRzEb5K"},
      { name: "Board Member (Vice President/Vice Chairperson) – UIN / Tax ID / National ID", color: "#1e558e",id: "LGaOnTyfRJ2"},
      { name: "Board Member (Secretary) – Relevant Position Available", color: "#006f60", id: "Wgjth0NslKe"},
      { name: "Board Member (Secretary) – Full Name", color: "#006f60", id: "DMJOfwrOwo8"},
      { name: "Board Member (Secretary) – Email", color: "#006f60", id: "NWijMwHpgfl"},
      { name: "Board Member (Secretary) – Country Code", color: "#006f60", id: "rPtqdD1kEks",},
      { name: "Board Member (Secretary) – Nationality", color: "#006f60", id: "F33Zmt6KMAE"},
      { name: "Board Member (Secretary) – Contact Number", color: "#006f60", id: "zIpXuDpL1Sf"},
      { name: "Board Member (Secretary) – Date of Birth", color: "#006f60", id: "gyvjaCqILkw"},
      { name: "Board Member (Secretary) – UIN / Tax ID / National ID", color: "#006f60", id: "kezRO5k8bYy"},
      { name: "Board Member (Treasurer) – Relevant Position Available?", color: "#6f2c91", id: "sE4nGLQH24Y"}, //Not found
      { name: "Board Member (Treasurer) – Full Name", color: "#6f2c91", id: "fKFIKK33FRc"},
      { name: "Board Member (Treasurer) – Email", color: "#6f2c91", id: "svxvNSIY1Lx"},
      { name: "Board Member (Treasurer) – Country Code", color: "#6f2c91", id: "UVpC8sK6B7v"},
      { name: "Board Member (Treasurer) – Nationality", color: "#6f2c91", id: "C7eZyNAJgu2"},
      { name: "Board Member (Treasurer) – Contact Number", color: "#6f2c91", id: "TGbkPE00NDD"},
      { name: "Board Member (Treasurer) – Date of Birth", color: "#6f2c91", id: "go3NkopSFOE"},
      { name: "Board Member (Treasurer) – UIN / Tax ID / National ID", color: "#6f2c91", id: "ZqxEuYK8vUB"},
      { name: "Board Member (Youth) – Full Name", color: "#e35205",id: "xCJOBTvagP9"},
      { name: "Board Member (Youth) – Email", color: "#e35205",  id: "NWijMwHpgfl"},
      { name: "Board Member (Youth) – Country Code", color: "#e35205", id: "G5lBBlc5oiW"},
      { name : "Board Member (Youth) – Nationality", color: "#e35205", id: "RXJVSBN4LJb"},
      { name : "Board Member (Youth) – Contact Number", color: "#e35205", id: "ezGbAw31sJm"},
      { name : "Board Member (Youth) – Date of Birth", color: "#e35205", id: "s1rGnBoGlAx"},
      { name : "Board Member (Youth) – UIN / Tax ID / National ID", color: "#e35205", id: "NHoDQ5DC1jY"},
      { name : "Senior Management (ED/CEO/Director General) – Designation", color: "#4b5e65", id: "BFlTIibR06y"},
      {name: "Senior Management (ED/CEO/Director General) – Full Name", color: "#4b5e65", id: "RA5zVHd7pVO"},
      { name: "Senior Management (ED/CEO/Director General) – Email", color: "#4b5e65", id: "rmEopjZaUfq"},
      { name: "Senior Management (ED/CEO/Director General) – Country Code", color: "#4b5e65", id: "jBIzhCPitnX"},
      { name: "Senior Management (ED/CEO/Director General) – Nationality", color: "#4b5e65", id: "sRFwuhoFONa"},
      { name: "Senior Management (ED/CEO/Director General) – Contact Number", color: "#4b5e65", id: "jsOWlru7Csr"},
      { name: "Senior Management (ED/CEO/Director General) – Date of Birth", color: "#4b5e65", id: "ehBoygsLFmB"},
      { name: "Senior Management (ED/CEO/Director General) – UIN / Tax ID / National ID", color: "#4b5e65", id: "VWdVRyHFlBh"},
      { name: "Senior Management (Director of Finance/Chief Finance Officer) – Designation", color: "#1e558e", id: "K85qxLxWARA"},
      { name: "Senior Management (Director of Finance/Chief Finance Officer) – Full Name", color: "#1e558e", id: "glFVJpRaGWK"},
      { name: "Senior Management (Director of Finance/Chief Finance Officer) – Email", color: "#1e558e", id: "oRmRvZcwYLC"},
      { name: "Senior Management (Director of Finance/Chief Finance Officer) – Country Code", color: "#1e558e", id: "Ftjpbnl3OgG"},
      { name: "Senior Management (Director of Finance/Chief Finance Officer) – Nationality", color: "#1e558e", id: "RUqcSMnw7r6"},
      { name: "Senior Management (Director of Finance/Chief Finance Officer) – Contact Number", color: "#1e558e", id: "w9fZHZNLW3J"},
      { name: "Senior Management (Director of Finance/Chief Finance Officer) – Date of Birth", color: "#1e558e", id: "LtXqGVt0PXf"},
      { name: "Senior Management (Director of Finance/Chief Finance Officer) – UIN / Tax ID / National ID", color: "#1e558e", id: "vcR9TS21A05"},
      { name: "Senior Management (Director of Programs) – Relevant Position Available?", color: "#2e7e3c", id: "SZaSgAJI9tG"},
      { name: "Senior Management (Director of Programs) – Full Name", color: "#2e7e3c", id: "U4OSVfrlPxQ"},
      { name: "Senior Management (Director of Programs) – UIN / Tax ID / National ID", color: "#2e7e3c", id: "A46ZGJLezyc"},
      { name: "Senior Management (Director of Programs) – Justification for Vacant Position", color: "#2e7e3c", id: "N8AGfQL9Zxp"},
      { name: "Senior Management (Director of HR) – Relevant Position Available?", color: "#006f60", id: "mNDB9RIQH2C"},
      { name: "Senior Management (Director of HR) – Full Name", color: "#006f60", id:"YjmSPK8DMOZ"},
      { name: "Senior Management (Director of HR) – Email", color: "#006f60", id: "YfjsFIq5SkX"},
      { name: "Senior Management (Director of HR) – Country Code", color: "#006f60", id: "CNYYyqwc7U7"},
      { name: "Senior Management (Director of HR) – Nationality", color: "#006f60", id: "Ro1Ns5Yf1On"},
      { name: "Senior Management (Director of HR) – Contact Number", color: "#006f60", id: "zIpXuDpL1Sf"},
      { name: "Senior Management (Director of HR) – Date of Birth", color: "#006f60", id: "eiAMvBLBE2B"},
      { name: "Senior Management (Director of HR) – UIN / Tax ID / National ID", color: "#006f60", id: "nY0g2hnfnUB"},
      { name: "Senior Management (Director of Organisation, Learning and Evaluation) – Relevant Position Available?", color: "#6f2c91"},
      { name: "Senior Management (Director of Organisation, Learning and Evaluation) – Full Name", color: "#6f2c91", id: "TfCXfVv6j2O", id: "TfCXfVv6j2O"},
      { name: "Senior Management (Director of Organisation, Learning and Evaluation) – UIN / Tax ID / National ID", color: "#6f2c91", id: "WY7Aao5rT82"},
      { name: "Senior Management (Director of Organisation, Learning and Evaluation) – Justification for Vacant Position", color: "#6f2c91", id: ""} //not found
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
          url: "organisationUnitGroups/nDrAezMbLFS.json?fields=id,name,organisationUnits[id,name,code,children[id,name]]",
          method: "GET"
        }),
        BaseApi({
          url: "tracker/trackedEntities.json?paging=false&program=w6sqrDv2VK8&ouMode=ACCESSIBLE&fields=trackedEntity,orgUnit,attributes[attribute,value],enrollments[events[programStage,occurredAt,dataValues[dataElement,value]]]",
          method: "GET"
        }),
        BaseApi({
          url: "programStages/HsKUiY7RyeO.json?fields=id,name,programStageDataElements[compulsory,dataElement[id,name,formName,valueType,optionSetValue,optionSet[options[id,name,code]]]],programStageSections[id,name,dataElements[id,formName,valueType,optionSetValue,optionSet[options[id,name,code]]]]",
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