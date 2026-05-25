import { dataApi } from "../../api/DataApi.js";
import { meApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, dataElements, programStage, programs, tei, trackedEntityType} from "../../constant.js";
import { getUserConfig } from "../config.js";
import { convert } from "../metadata.js";
import { getNextCode, toast } from "../utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userConfig = await getUserConfig();
  if (userConfig) {
      userConfig.user.forEach(user => {
      $(`.${user}`).hide();
      });
  }
  $('.sidebar-menu').show();
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault(); 
      var targetPage = event.currentTarget.getAttribute("data-target") || event.currentTarget.parentElement.getAttribute("data-target");
      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });
   const riskNames = [
        'Arms Trafficking & WMD',
        'Terrorism',
        'Money Laundering',
        'Drug Trafficking',
        'Fraud',
        'Wanted Individuals',
        'Global Sanction List',
        'PEP',
        'Enforcement'
      ];
    const checkboxOptions = [
    {
      label: "Business Planning and Reporting Portal",
      api: "http://stage.hispindia.org:8000/orgunit-bpr"
    },
    {
      label: "IPPF DHIS2",
      api: "http://stage.hispindia.org:8000/orgunit-pro"
    },
    {
      label: "Kofax Unrestricted Funding Agreement",
      api: ""
    },
    {
      label: "NetSuite",
      api: ""
    }

 ]
      const DE_ROLE_MAP = {
        'UkQI1dWzZOv': 'organisation',
        'daG91uRV8pi': 'President',
        'uT1NdSet4eo': 'Vice President',
        'DMJOfwrOwo8': 'Secretary',
        'fKFIKK33FRc': 'Treasurer',
        'xCJOBTvagP9': 'Youth Member',
        'RA5zVHd7pVO': 'Chief Executive Officer',
        'glFVJpRaGWK': 'Director of Finance',
        'YjmSPK8DMOZ': 'Director of HR',
        'U4OSVfrlPxQ': 'Director of Programs',
        'TfCXfVv6j2O': 'Bank Account',
      };

      let orgName = null;

  fetchAffiliateList();
  async function fetchAffiliateList() {
    const user = await meApi.get();
    const userOrgUnit = user?.organisationUnits.map(ou => ou.id).join(';');
    const resAffiliateList = await dataApi.get(userOrgUnit, programs.affiliateKyc);

    const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
    const programUINControl = await programsApi.get(programs.UINControlMaster);
    const resUINControl = await programStageApi.get(programStage.UINControlMaster);
    const resCompletionChecklist = await programStageApi.get(programStage.completionCheckList);
    const resAffiliateStage = await programStageApi.get(programStage.affiliateKyc);
    const resDueDiligence = await programStageApi.get(programStage.dueDiligence);

    const affiliateStage = convert.stage({ programStage: resAffiliateStage});
    const dueDiligence = convert.stage({ programStage: resDueDiligence});    
    const UINControlMaster = convert.stage({ programStage: resUINControl});    
    const completionCheckList = convert.stage({ programStage: resCompletionChecklist});   
    const programAttr = convert.attributes({ program: programUINControl });
    tei.attributes = programAttr.attributes; 
    tei.fileType = new Set([...affiliateStage.fileType, ...dueDiligence.fileType]);
    const UINStages = [UINControlMaster, completionCheckList];

    const affilitateAttrList = resAffiliateList.trackedEntities.map(trackedEntity => {
      const attributes = {
        id: trackedEntity.trackedEntity
      };
      trackedEntity.attributes.forEach(attr => attributes[attr.attribute] = attr.value);
      return attributes;
    })
    //filter affiliate list based on the status:
    const approvedList = affilitateAttrList.filter(trackedEntity => trackedEntity[attributes.acuityCheck]=="Passed" && trackedEntity[attributes.submitted] && !trackedEntity[attributes.uinCodeAffiliate]);

    document.getElementById('approvedCount').innerHTML = approvedList.length;
  
    const headerList = programAffiliateKyc.programTrackedEntityAttributes
    .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
    .map(attr => ({id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name}));

    var theadAffiliateRow = "";
    headerList.forEach(item => theadAffiliateRow+= `<th class="py-3 px-4 font-weight-bold border-0 text-center">${item.name}</th>`);
    
    document.getElementById('thead-affiliate-approved').innerHTML = `${theadAffiliateRow}<th class="py-3 px-4 font-weight-bold border-0 text-center" colspan="3">Actions</th>`;
    
    var tbodyAffiliateApprovedRow = "";
    approvedList.forEach(affiliate => {
          
      tbodyAffiliateApprovedRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
      headerList.forEach(attr => {
        if(attr.id == attributes.acuityCheck) {
          tbodyAffiliateApprovedRow += `<td class="text-center" >
          ${(affiliate[attr.id] ? `<span style="background-color: #bbf7d0color: #15803d; font-weight: 500; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem;">Approved</span>`: '')}
          </td>`
        }
        else tbodyAffiliateApprovedRow += `<td class="text-center" >${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`
      });
      tbodyAffiliateApprovedRow += `
      <td class="text-center">  
      <button 
        data-affiliate="${affiliate.id}" 
        data-id="view-uin"
        class="btn btn-sm row-btn" style="background-color: #15803d; color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 16px; transition: background-color 0.2s ease-in-out;"
        onmouseover="this.style.backgroundColor='#8FE0B8' "onmouseout="this.style.backgroundColor='#15803d'">
        View
      </button>
      </td>
      <td class="text-center">  
      <button 
        data-affiliate="${affiliate.id}" 
        data-id="generate-uin"
        class="btn btn-sm row-btn" style="background-color: rgb(235, 51, 0); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 10px;">
        Generate
      </button>
      </td>
      <td class="text-center">
      <button 
        data-affiliate="${affiliate.id}" 
        data-region="${affiliate[attributes.region] || ''}"
        data-name="${affiliate[attributes.legalName] || ''}"
        data-id="sync-uin"
        id="sync-uin-btn-${affiliate.id}"
        class="btn btn-sm row-btn open-popup-btn" style="background-color: rgb(235, 51, 0); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 9px; opacity: 0.6; cursor: not-allowed; white-space: nowrap;">
        Sync UIN
      </button>
      </td>
      </tr>`
    })
    
    const tbodyApproved = document.getElementById('tbody-affiliate-approved')
    tbodyApproved.innerHTML = tbodyAffiliateApprovedRow;
    tbodyApproved.addEventListener('click', async (e)=> {
      const button = e.target.closest('.row-btn');
      if(!button) return;
      const { id, affiliate } = button.dataset;
      if(id == "view-uin") window.location.href = `./1.3.1-generate-uin.html?affiliate=${affiliate}`;
      else if(id == "generate-uin") {
        
        showLoader("Please wait, generating report...");
        setTimeout(async () => {
        try {
        const resAffiliate = await dataApi.getTrackedEntity(affiliate);
        tei.affiliate = resAffiliate.trackedEntities[0];
    
        const dataValues = {};
        tei.affiliate.attributes.forEach(attr => dataValues[attr.attribute]=attr.value);
        tei.affiliate.enrollments.forEach(enroll => {
          enroll.events.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
          enroll.events.forEach(event => {
            event.dataValues.forEach(dv => {
              if (tei.fileType.has(dv.dataElement) && !dataValues.hasOwnProperty(`${dv.dataElement}-event`)) {
                dataValues[`${dv.dataElement}-event`] = event.event;
              }
              if (!dataValues.hasOwnProperty(dv.dataElement)) {
                dataValues[dv.dataElement] = dv.value;
              }
            });
          });
        });

        for(let id of tei.fileType) {
          if(dataValues[id]) {
            try {
              dataValues[`${id}-href`] = `../../events/files?eventUid=${dataValues[`${id}-event`]}&dataElementUid=${id}`
              dataValues[`${id}-file`] = await dataApi.getFile(dataValues[id]);
              const file =  await dataApi.getFileResources(dataValues[`${id}-event`], id);
              const formData = new FormData();
              formData.append('file', file,  dataValues[`${id}-file`].name)
              const res = await dataApi.uploadFile(formData);
              if(res.status == 'OK') {
              dataValues[id] = res.response.fileResource.id;
              } else {
              toast({status: 'ERROR', message: `File generation error`});
              }
            } catch (error) {
              toast({status: 'ERROR', message: `Error uploading file: ${error}`});
              return;
            }
          }
        }

        tei.values = dataValues;
        document.querySelector("#global-loader p").innerText = "Processing compliance data...";        

        const allRecords = await dataApi.dataStore(`accuityResponse/${affiliate}`);
        const processed = processAccuityData(allRecords?.data || allRecords);
        document.querySelector("#global-loader p").innerText = "Generating PDF...";
        const blob = await generatePdfBlob(processed);
        document.querySelector("#global-loader p").innerText = "Uploading report...";
        // const url = URL.createObjectURL(blob);
        // window.open(url);
        const fileResourceId = await uploadPdf(blob);
        tei.values[dataElements.uploadAccuity] = fileResourceId;
        document.querySelector("#global-loader p").innerText = "Generating UIN...";
        
        if(tei.affiliate) {
          const countryRegistration = tei.affiliate.attributes.find(attr => attr.attribute == attributes.countryRegistration);
          const orgUnit = await orgUnitsApi.get({filter:countryRegistration.value});
          const nextNum = getNextCode(orgUnit.organisationUnits[0].children.filter(obj => obj.code !== undefined).map(obj => obj.code));
          const nextOUCode = `${orgUnit.organisationUnits[0].parent.code}-${orgUnit.organisationUnits[0].code}-${nextNum}`;
          const payloadOrgUnit = createPayload.orgUnit(orgUnit.organisationUnits[0].id, tei.affiliate.attributes, nextOUCode);
          const neworgUnit = await orgUnitsApi.post(payloadOrgUnit);
          tei.values[attributes.uinCode] = nextOUCode;  
          if(neworgUnit.httpStatus == "OK" && neworgUnit.response.typeReports) {
            const orgUnitId = neworgUnit.response.typeReports[0].objectReports[0].uid;
            await programsApi.postOU({orgUnit:orgUnitId, program: programs.UINControlMaster});
            const payloadEvent = createPayload.exchangeEvent(tei.values, orgUnitId, programs.UINControlMaster, tei.attributes, UINStages);
           const teiId =  await dataApi.enroll(payloadEvent);
            await dataApi.postAttribute({
              "trackedEntities": [
                {
                  trackedEntity: tei.affiliate.trackedEntity,
                  program: programAffiliateKyc,
                  orgUnit: tei.affiliate.orgUnit,
                  trackedEntityType: trackedEntityType,
                  "attributes": [
                    {
                      "attribute": attributes.uinCodeAffiliate,
                      "value": nextOUCode
                    }
                  ]
                }
              ]
            })
            const syncBtn = document.getElementById(`sync-uin-btn-${tei.affiliate.trackedEntity}`);
            if (syncBtn) {
              syncBtn.setAttribute('data-uin', nextOUCode);
              syncBtn.setAttribute('data-teiid', teiId);
              syncBtn.style.opacity = '1';
              syncBtn.style.cursor = 'pointer';
            }
            button.dataset.generated = "true";
            button.style.opacity = "0.6";
            button.style.cursor = "not-allowed";
            hideLoader();
            toast({status: 'SUCCESS', message: `UIN Generated Successfully!\nUIN No: ${nextOUCode}`});
          }
        }                 
      } catch (error) {
            hideLoader();
            toast({ status: 'ERROR', message: error.message });

        }
        }, 0);
      }
      else if (id == "sync-uin") {
        const uinCode = button.getAttribute("data-uin");
        const newTeiId = button.getAttribute("data-teiid");

        const selectedAffiliateData = {
          regionCode: button.getAttribute("data-region"),
          legalName: button.getAttribute("data-name"),
          uinCode: uinCode,
          teiUId: newTeiId,
        };

        const html = checkboxOptions.map((option, index) => `
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input dynamic-checkbox" id="checkbox-${index}" data-api="${option.api}">
            <label class="custom-control-label font-weight-bold fs-6" for="checkbox-${index}">
              ${option.label}
            </label>
          </div>
        `).join("");

        $("#checkboxContainer").html(html);
        $("#submitActions").prop("disabled", true);
        $("#actionModal").modal("show");

        $(document).off("change", ".dynamic-checkbox").on("change", ".dynamic-checkbox", function () {
          const checked = $(".dynamic-checkbox:checked").length;
          $("#submitActions").prop("disabled", checked === 0);
        });

        $("#submitActions").off("click").on("click", async function () {
          const checkedBoxes = $(".dynamic-checkbox:checked");
          try {
            for (let checkbox of checkedBoxes) {
              const api = $(checkbox).data("api");
              if (!api) continue;
              
              const payload = {
                tei_uid: selectedAffiliateData.teiUId,
                uin_code: selectedAffiliateData.uinCode,
                region_code: selectedAffiliateData.regionCode,
                legal_name: selectedAffiliateData.legalName,
              };


              await fetch(api, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
              });
            }

            toast({ status: "SUCCESS", message: "UIN Synced Successfully", position:'topRight', nextOUCode: true});
            $("#actionModal").modal("hide");

          } catch (error) {
            toast({ status: "ERROR", message:"Something went wrong", position: 'topCenter'});
          }
        });
      }
    })

  }
    function formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }

    function processAccuityData(allRecords) {
      const personMap = new Map();
      let totalFlags = 0;

      for (const rec of allRecords) {
        const deUID = rec.id?.split('_')[0];
        const designation = DE_ROLE_MAP[deUID] || "--";
        const name = rec[deUID] || rec.value;
        if (!name || name.trim() === "") {
            continue;
        }
        const resultText = rec[rec.id];
        if (designation === 'Organisation') {
          orgName = name;
        }

        const key = `${rec.event_uid}_${deUID}_${rec.id}`;

        if (!personMap.has(key)) {
          personMap.set(key, {
            name,
            designation,
            date: rec.date ? formatDate(rec.date) : formatDate(new Date().toISOString()),
            flaggedCategories: new Set(),
            screeningResult: (resultText || 'No Records Found')
          });
        }

        const lower = (resultText || '').toLowerCase();
        riskNames.forEach(cat => {
          const keywordWithDot = `.${cat.toLowerCase()}`;
          if (lower.includes(keywordWithDot)) {
            personMap.get(key).flaggedCategories.add(cat);
          }
        });
      }

      const persons = [...personMap.values()];
      let individualOut = 0;

      persons.forEach(p => {
        const count = p.flaggedCategories.size;
        if (count > 0) individualOut++;
        totalFlags += count;
      });

      const summary = {
        total: persons.length,
        flags: totalFlags,
        individuals: individualOut
      };

      const tableRows = persons.map(p => ({
        name: p.name,
        designation: p.designation,
        cells: riskNames.map(cat => {
          const isFlagged = p.flaggedCategories.has(cat);
          const result = p.screeningResult?.toLowerCase() || '';

          if (!isFlagged) return "green";

          if (cat === 'PEP' || cat === 'Enforcement') return "orange";

          if (result.includes("approve")) return "green";

          if (result.includes("reject")) return "orange";

          return "red";
        })
      }));

      const flagDetails = persons
        .map(p => ({
          name: p.name,
          designation: p.designation,
          date: p.date,
          screeningResult: p.screeningResult
        }));

      return { summary, tableRows, flagDetails };
    }

    async function generatePdfBlob({ summary, tableRows, flagDetails }) {

      const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color:#222;">

        <div style="text-align:center;">
          <h2 style="color:#2b5d7d;">ORGANISATION COMPLIANCE REPORT CARD</h2>
          <h3 style="color:#2b7da3;"">Organisation: ${orgName || '—'}</h3>
          <p style="font-size:12px;">
            Generated: ${new Date().toLocaleString()}
          </p>
          <hr style="border-top:2px solid #2b7da3; width:80%; margin:auto;">
          <p style="font-size:11px; color:#888;">
            Source: Acuity Online Compliance System
          </p>
        </div>

        <div style="display:flex; justify-content:space-between; margin:20px 0;">
          <div><b>Total Checks:</b> ${summary.total}</div>
          <div><b>Flags:</b> ${summary.flags}</div>
          <div><b>Individuals Flagged:</b> ${summary.individuals}</div>
        </div>

        <h3 style="margin-top:10px;">Section 1: Compliance Screening Summary</h3>

        <table  style="width:100%; border-collapse:collapse; font-size:11px;"
        border="1" cellspacing="0" cellpadding="6">
          
          <thead style="background:#d9e6f2;">
            <tr style="page-break-inside: avoid";>
              <th>Name</th>
              <th>Designation</th>
              ${riskNames.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>

          <tbody>
            ${ tableRows.length ? 
              tableRows.map(row => `
              <tr style="page-break-inside: avoid;">
                <td>${row.name}</td>
                <td>${row.designation}</td>
                ${row.cells.map(cell => {
                let symbol = '';
                let color = '';

                if (cell === 'green') {
                  symbol = '✔';
                  color = '#2e7d32';
                } else if (cell === 'orange') {
                  symbol = '✔';
                  color = '#e65100';
                } else if (cell === 'red') {
                  symbol = '✖';
                  color = '#c62828';
                }
                return `<td style="text-align:center; color:${color}; font-weight:bold;">${symbol}</td>`;
              }).join('')}
              </tr>
            `).join('') : `
                <tr>
                <td colspan="${2 + riskNames.length}" style="text-align:center;">
                  No data available
                </td>
              </tr>            
            `
            }
          </tbody>
        </table>

        <p style="font-size: 11px; margin-top: 10px;">
        <b>Legend:</b>
        <span style="color:#2e7d32;">✔ Clear</span> |
        <span style="color:#e65100;">✔ Auto Cleared (PEP / Enforcement)</span> |
        <span style="color:#e65100;">✔ Waiver Approved</span> |
        <span style="color:#c62828;">✖ Waiver Required / Rejected</span>
      </p>
        
        <h3 style="margin-top:10px;">Section 2: Flag & Match Details</h3>
        ${
             flagDetails.map((f, i) => `
              <div style="margin-bottom:12px; page-break-inside:avoid">
                <b>Individual ${i + 1}</b><br/>
                <b>Name:</b> ${f.name}<br/>
                <b>Designation:</b> ${f.designation}<br/>
                <b>Date:</b> ${f.date}<br/>
                <b>Result:</b> ${f.screeningResult}
              </div>
            `).join('')
        }

        <div style="margin-top:30px;">
          <h3 style="color:#2b5d7d; page-break-inside:avoid;">Section 3: Data Source & Disclaimer</h3>

          <p style="font-size:12px;">
            All compliance screening data presented in this report has been
            retrieved from the Acuity Online Compliance System via an automated
            integration with the IPPF Unified Identification Number (UIN)
            system. The data retrieval was completed on
          </p>

          <h4 style="color: #2b7da3; margin-top: 15px">Disclaimer</h4>
          <ol
            style="
              font-size: 12px;
              color: #444;
              padding-left: 18px;
              text-align: justify;
            "
          >
            <li style="page-break-inside:avoid;">
              Acuity Online Compliance System is the primary source of all
              screening results, flag descriptions, and match data included in
              this report.
            </li>
            <li style="page-break-inside:avoid;">
              IPPF's Unified Identification Number (UIN) system functions solely
              as a storage and display platform for the data received from
              Acuity.
            </li>
            <li style="page-break-inside:avoid;">
              All flags and screening outcomes must be reviewed by an authorized
              compliance officer before any risk decision is made.
            </li>
            <li style="page-break-inside:avoid;">
              This report is confidential and intended only for authorized
              personnel within IPPF's compliance and governance functions.
            </li>
            <li style="page-break-inside:avoid;">
              Any decision taken based on the information in this report should
              be supported by independent verification where necessary.
            </li>
            <li style="page-break-inside:avoid;">
              This report reflects the dataset available at the time of report
              generation. As the source system is updated, this information may
              change.
            </li>
            <li style="page-break-inside:avoid;">
              Acuity remains the authoritative system of record for all
              underlying screening data.
            </li>
          </ol>
          <hr/>

          <p style="font-size:10px; text-align:center;">
            Report generated: ${new Date().toLocaleString()} |
            Source: Acuity |
            IPPF UIN System
          </p>
        </div>

      </div>`;

      const blob = await html2pdf()
        .set({
          margin: 10,
          html2canvas: { scale: 0.8, scrollY: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
          pagebreak: { mode: ['css', 'legacy'] }
        })
        .from(html)
        .output('blob');

      return blob;
    }


    async function uploadPdf(blob) {

      const formData = new FormData();
      formData.append("file", blob, "ORGANISATION-COMPLIANCE-REPORT-CARD.pdf");

      const res = await dataApi.uploadFile(formData);

      if (res.status === 'OK') {
        return res.response.fileResource.id;
      }

      throw new Error("File upload failed");

    }
  })
  function showLoader(message = "Please wait, generating report...") {
    const loader = document.createElement("div");
    loader.id = "global-loader";
    loader.innerHTML = `
      <div style="
        position: fixed;
        top:0; left:0;
        width:100%; height:100%;
        background: rgba(0,0,0,0.5);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:9999;
      ">
        <div style="
          background:white;
          padding:30px 40px;
          border-radius:10px;
          text-align:center;
          box-shadow:0 4px 20px rgba(0,0,0,0.2);
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
          <p style="font-weight:500;">${message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(loader);

    // inject animation once
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