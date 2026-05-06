import { getUserConfig } from "../config.js";
import { dataApi } from "../../api/DataApi.js";
import { programs, programStage, dataElements, attributes, orgUnit, tei, ROLE_ACUITY_DE, programSection, } from "../../constant.js";
import { programStageApi, dataElementsApi} from "../../api/metaDataApi.js";
import { convert } from "../metadata.js";
import { toast } from "../utils.js";
const PERSON_API_URL = "https://default56af9532501a404c995d80633a35c0.ac.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/659d9a7a7b404fbfa426dfa84e486992/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5VaBmHuGhyAYYnAumUf0eqdXPwOpue0aPICvxPgfthQ";
const BANK_API_URL = "https://default56af9532501a404c995d80633a35c0.ac.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/1b806d85e0c3424984a2033ab269967a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4YFvKxncVyxpWlgVmBVd96icBe-JT4X6AjUhrGbWaFI";
let deCodeMap = {}; 
const STAGE_MAPPING = {
  chairperson: programSection.ChairPerson,
  viceChairperson: programSection.viceChairperson,
  secretary: programSection.Secretary,
  treasurer: programSection.Treasurer,
  youth: programSection.Youth,
  seniorManagementCEO: programSection.seniorManagement,
  seniorManagementFinance: programSection.seniorManagementFinance,
  seniorManagementPrograms: programSection.seniorManagementPrograms,
  bank: programSection.bank
};
const ROLE_PERSON_DE = {
    chairperson:              { name: dataElements.chairPersonName,                      uin: dataElements.chairPersonIdNumber },
    viceChairperson:          { name: dataElements.viceChairPersonName,                  uin: dataElements.viceChairPersonIdNumber },
    secretary:                { name: dataElements.secretaryName,                        uin: dataElements.secretaryIdNumber },
    treasurer:                { name: dataElements.treasurerName,                        uin: dataElements.treasurerIdNumber },
    youth:                    { name: dataElements.youthName,                            uin: dataElements.youthIdNumber },
    seniorManagementCEO:      { name: dataElements.seniorManagementCEOName,              uin: dataElements.seniorManagementCEOIdNumber },
    seniorManagementFinance:  { name: dataElements.seniorManagementDirectorFinanceName,  uin: dataElements.seniorManagementDirectorFinanceIdNumber },
    seniorManagementPrograms: { name: dataElements.SeniorManagementDirectorProgramsName, uin: dataElements.SeniorManagementDirectorProgramsIdNumber },
};
// Risk configuration - matching waiverForm.js pattern
const RISK_COLUMNS = [
  { name: 'Arms Trafficking & WMD', code: "AT"},
  { name: 'Terrorism', code: "TWIf"},
  { name: 'Money Laundering', code: "ML"},
  { name: 'Drug Trafficking', code: "DT"},
  { name: 'Fraud', code: "FR"},
  { name: 'Wanted Individuals', code: "WL"},
  { name: 'Global Sanction', code: 'GSL'},
  { name: 'PEP', code: "PEP"},
  { name: 'Enforcement', code: "EN"}
];

const RISK_CODE_MAP = {
  'Arms Trafficking & WMD': 'AT',
  'Terrorism': 'TWIf',
  'Money Laundering': 'ML',
  'Drug Trafficking': 'DT',
  'Fraud': 'FR',
  'Wanted Individuals': 'WL',
  'Global Sanction List': 'GSL',
  'PEP': 'PEP',
  'Enforcement': 'EN'
};

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
  
  let cachedRequests = [];

  fetchChangeRequests();

 async function fetchChangeRequests() {
    try {
        
        const deResponse = await dataElementsApi.get({param: ['filter=code:!null', 'fields=id,name,code']});
        deResponse.dataElements.forEach(de => {
            tei.dataElementcode[de.code] = de.id;  
            tei.dataElementcode[de.id] = de.code;
            deCodeMap[de.code] = de.id;  
            deCodeMap[de.id] = de.code;
        });
        // console.log("--------DeCodeMap---------",deCodeMap);

        const response = await dataApi.get(
            orgUnit.id,
            programs.UINControlMaster,
        );

        const requests = [];
        cachedRequests = [];

        if (response && response.trackedEntities) {
            response.trackedEntities.forEach(entity => {

                const legalNameAttr = entity.attributes.find(
                    a => a.attribute === attributes.legalName
                );
                const legalName = legalNameAttr ? legalNameAttr.value : " ";

                entity.enrollments?.forEach(enrollment => {

                    const sortedEvents = [...enrollment.events].sort(
                        (a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)
                    );
                    
                    const processedEvents = new Set();
                    sortedEvents.forEach(event => {
                        const isPending = Object.values(ROLE_ACUITY_DE).some(deId =>
                            event.dataValues?.some(
                                dv => dv.dataElement === deId && dv.value === "In-Progress"
                            )
                        );

                        if (!isPending) return;

                        const createdBy = event.createdBy?.username || "System";

                        const eventDataMap = {};
                        event.dataValues?.forEach(dv => { eventDataMap[dv.dataElement] = dv.value; });

                        for (const [key, deId] of Object.entries(ROLE_ACUITY_DE)) {
                            if (eventDataMap[deId] === "In-Progress") {
                                if (processedEvents.has(key)) continue;
                                processedEvents.add(key);

                        let personName = "";
                        let personUIN = "";

                            if (key === 'bank') {
                            personName = eventDataMap[dataElements.bankName] || "";
                        } else {
                                    const roleDE = ROLE_PERSON_DE[key];
                            personName = roleDE ? (eventDataMap[roleDE.name] || "") : "";
                            personUIN = roleDE ? (eventDataMap[roleDE.uin] || "") : "";
                        }

                        requests.push({
                            legalName,
                            memberSelected: createdBy,
                            requestedBy: createdBy,
                            requestDate: event.occurredAt,
                            status: "Pending",
                            teiId: entity.trackedEntity,
                            eventId: event.event,
                            orgUnit: enrollment.orgUnit,
                            programStage: event.programStage,
                            enrollment: enrollment.enrollment,
                            dataValues: event.dataValues,
                            personName,
                            personUIN,
                            roleKey: key
                        });
                            }
                        }
                    });
                });
            });
        }

        cachedRequests = requests;
        populateTable(requests);
    } catch (error) {
        console.error("Error fetching change requests:", error);
    }
}

  function populateTable(requests) {
      const tableBody = document.getElementById("tbody-requests");
      if (!tableBody) return;

      tableBody.innerHTML = "";
      
      if (requests.length === 0) {
          tableBody.innerHTML = "<tr><td colspan='7' class='text-center'>No pending requests found</td></tr>";
          return;
      }

      requests.forEach((req, index) => {
          const row = `
                <tr>
                  <td>${index + 1}</td>
                  <td>${req.legalName}</td>
                  <td>${getRoleDisplayName(req.roleKey)}</td>
                  <td>${req.requestedBy}</td>
                  <td>${req.requestDate.split('T')[0]}</td>
                  <td><span class="badge badge-warning">${req.status}</span></td>
                    <td style="text-align: center;" colspan="2">
                        <div class="actions" style="display: flex; justify-content: center; gap: 10px;">
                            <button class="btn-icon blue"
                            title="View Details"
                            style="cursor: pointer; background: none; border: none;"
                            onclick="viewRequest('${req.teiId}', '${req.eventId}', '${req.roleKey}')">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>

                            <button class="btn-icon green"
                            title="Approve"
                            style="cursor: pointer; background: none; border: none;"
                            onclick="openApproveModal('${req.teiId}', '${req.eventId}', '${req.roleKey}')">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </td>

                 </tr>
          `;
          tableBody.innerHTML += row;
      });
  }

  function getRoleDisplayName(roleKey) {
    const result = roleKey.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  window.viewRequest = async function(teiId, eventId, roleKey) {
    const modal = ensureDetailModal();
    const contentDiv = document.getElementById("detailModalContent");

    contentDiv.innerHTML = `
        <div class="p-4 text-center">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Loading...</p>
        </div>
    `;
    modal.classList.add("show");

    try {
        const reqData = cachedRequests.find(
            r => r.teiId === teiId && r.eventId === eventId && r.roleKey === roleKey
        );

        if (!reqData) throw new Error("Request not found");

        const dataMap = {};
        reqData.dataValues.forEach(dv => {
            dataMap[dv.dataElement] = dv.value;
        });

        if (!roleKey) {
            throw new Error("Not a valid change request or status is not 'In-Progress'.");
        }

        const stageId = STAGE_MAPPING[roleKey];
        if (!stageId) {
            throw new Error(`No stage mapping found for role: ${roleKey}`);
        }

        const roleDisplayName = getRoleDisplayName(roleKey);

        // Get metadata for the section
        const stageRes = await programStageApi.get(programStage.UINControlMaster);
        const stage = convert.stage({ programStage: stageRes });

        const roleSection = stage.sections.find(
            s => s.id === stageId
        );

        const fieldsHtml = roleSection.items.map(item => {
            const value = dataMap[item.code] || "-";
            return `
                <div class="col-md-6 mb-3">
                    <small class="text-muted">${item.name}</small>
                    <div class="font-weight-bold">${value}</div>
                </div>
            `;
        }).join("");

        contentDiv.innerHTML = `
            <div class="custom-modal-header">
                <h5 class="modal-title">${roleDisplayName} Change Request</h5>
                <button type="button" class="close"
                    onclick="document.getElementById('detailModal').classList.remove('show')">
                    &times;
                </button>
            </div>

            <div class="custom-modal-body">
                <div class="card shadow-sm mb-3">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <small class="text-muted">Organisation</small>
                                <div class="h6">${reqData.legalName}</div>
                            </div>
                            <div class="col-md-6">
                                <small class="text-muted">Requested By</small>
                                <div class="h6">${reqData.requestedBy}</div>
                            </div>
                            <div class="col-md-6">
                                <small class="text-muted">Request Date</small>
                                <div class="h6">${reqData.requestDate.split('T')[0]}</div>
                            </div>
                            <div class="col-md-6">
                                <small class="text-muted">Status</small>
                                <div><span class="badge badge-warning">${reqData.status}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card border">
                    <div class="card-header bg-white">
                        <h6 class="mb-0 text-primary">${roleDisplayName} Details</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            ${fieldsHtml}
                        </div>
                    </div>
                </div>
            </div>

            <div class="custom-modal-footer">
                <button class="btn" style="background-color:#E93300; border-color:#E93300; color: #ffff"
                    onclick="document.getElementById('detailModal').classList.remove('show')">
                    Close
                </button>
            </div>
        `;

    } catch (error) {
        console.error(error);
        contentDiv.innerHTML = `
            <div class="p-4 text-danger text-center">
                ${error.message}
            </div>
        `;
    }
};

  window.openApproveModal = function(teiId, eventId, roleKey) {
    const modal = ensureApproveModal();
    const contentDiv = document.getElementById("approveModalContent");
    
    contentDiv.innerHTML = `
      <div class="modal-header">
        <h5 class="modal-title">Approve Request</h5>
        <button type="button" class="close text-white" onclick="document.getElementById('approveModal').classList.remove('show')">&times;</button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to verify this change request?</p>
      </div>
      <div class="modal-footer">
          <button class="btn bg-transparent border rounded-xl" onclick="document.getElementById('approveModal').classList.remove('show')">Cancel</button>
          <button class="btn" style="background-color:#E93300; border-color:#E93300; color: #fff" id="confirmApproveBtn">Approve</button>
      </div>
    `;

    document.getElementById("confirmApproveBtn").onclick = async function() {
      await performApprovalFlow(teiId, eventId, roleKey, contentDiv);
    };

    modal.classList.add("show");
  };

  async function runAcuityPerson( {personName, personUIN}) {
    try {
            const payload = {
                "eventUid": "abc123",
                "action": "complete",
                "orgUnit": "OU_01",
                "program": "Prog_01",
                "PresidentName": `${personName} ${personUIN}`.trim(),
                // "PresidentName": "Aivars Lembergs",
                // "PresidentName": "sonu singh AXWPS8419G",

            }
            
            const response = await (await fetch(PERSON_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })).json();
            // console.log("raw Page Text", response?.rawPageText);
            if(response?.rawPageText) {
                const pageText = ['Names', 'Country/Region', 'Class'].some(val => response.rawPageText.includes(val));
                if(!pageText) response.rawPageText = "No Records Found";
            }
            if(!response.rawPageText) {
                return await runAcuityPerson({ personName, personUIN});
            }
           return response;

        } catch(error) {
        console.error("Error running Acuity Person:", error);
    }

  }

  async function runAcuityBank( {bankName}) {
    try {
            const payload = {
            "eventUid": "abc123",
            "action": "complete",
            "orgUnit": "OU_01",
            "program": "Prog_01",
            "EntityType": "Organization",
            "OrganizationName": `${bankName}`
            // "OrganizationName": "Republic Bank (EC) Limited"
        };
            // console.log("raw Page Text", response?.rawPageText);

            const response = await (await fetch(BANK_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })).json();

            if(response?.rawPageText) {
                const pageText = ['Names', 'Country/Region', 'Class'].some(val => response.rawPageText.includes(val));
                if(!pageText) response.rawPageText = "No Records Found";
            }
            if(!response.rawPageText) {
                return await runAcuityBank({ bankName });
            }
           return response;

        } catch(error) {
        console.error("Error running Acuity bank:", error);
    }

  }
 async function performApprovalFlow(teiId, eventId, roleKey, contentDiv) {
    contentDiv.innerHTML = `
      <div class="modal-header">
          <h5 class="modal-title">Verify Request</h5>
      </div>
      <div class="modal-body" style="padding:40px; text-align:center;">
          <div class="progress mb-3" style="height: 6px;">
              <div class="progress-bar progress-bar-striped progress-bar-animated w-100" 
                  style="background-color:#E93300;">
              </div>
          </div>
          <p class="text-muted" id="loadingMsg">Connecting to verification service...</p>
      </div>
      <div class="modal-footer">
          <button class="btn" style="background-color:#E93300;color:#fff" 
              onClick="document.getElementById('approveModal').classList.remove('show')">Close</button>
      </div>
    `;

    const messages = [
        "Connecting to verification service...",
        "Fetching records from sanctions list...",
        "Cross-checking PEP database...",
        "Analysing risk data...",
        "Verifying enforcement records...",
        "Almost there..."
    ];

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        const el = document.getElementById('loadingMsg');
        if (el) el.innerText = messages[msgIndex];
    }, 3000);

    try {
        const reqData = cachedRequests.find(r => r.teiId === teiId && r.eventId === eventId && r.roleKey === roleKey);
        if (!reqData) throw new Error("Request data not found.");

        const { personName, personUIN } = reqData;
        const isBank = roleKey === 'bank';

        let flowResult;
        if (isBank) {
            flowResult = await runAcuityBank({ bankName: personName });
        } else {
            flowResult = await runAcuityPerson({ personName, personUIN });
        }

        clearInterval(msgInterval);
        const { rawPageText } = flowResult; 
        // const rawPageText = [
        //     "Names",
        //     "Country/Region",
        //     "Class",
        //     "1KMAivars Lembergs Latvia Former Chair of City Council .PEP",
        //     "2KMTest Company Latvia Suspicious transactions .Fraud",
        //     "3KMTest Person Latvia Wanted for crimes .Enforcement"
        // ].join("\r\n");

        const deId = ROLE_ACUITY_DE[roleKey];

        const isEmpty = !rawPageText || rawPageText.trim() === '' || rawPageText.toLowerCase().includes("no records found");

        if (isEmpty) {
            if (deId) {
                await dataApi.update({
                    events: [{
                        event: eventId,
                        orgUnit: reqData.orgUnit,
                        program: programs.UINControlMaster,
                        programStage: reqData.programStage,
                        enrollment: reqData.enrollment,
                        occurredAt: reqData.requestDate,
                        dataValues: [{ dataElement: deId, value: "Approved", }]
                    }]
                });
            }
            await fetchChangeRequests();
            document.getElementById('approveModal').classList.remove('show');
            toast({ status: 'SUCCESS', message: 'Request Approved Successfully!' });
        } else {
            showRiskTable(teiId, eventId, contentDiv, rawPageText, reqData, deId);
        }

    } catch (e) {
        console.error(e);
        clearInterval(msgInterval);
        contentDiv.innerHTML = `
            <div class="modal-header">
                <h5 class="modal-title">Error</h5>
            </div>
            <div class="modal-body">
                <p class="text-danger">${e.message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn bg-transparent border" 
                    onclick="document.getElementById('approveModal').classList.remove('show')">
                    Close
                </button>
            </div>
        `;
    }
}

 function showRiskTable(teiId, eventId, contentDiv, rawPageText, reqData, deId) {

    const riskDecisions = {};

    const flaggedRisks = RISK_COLUMNS.filter(risk =>
        rawPageText.split(/\r\n/).some(row => row.trim().endsWith(risk.name))
    );

    const riskCells = RISK_COLUMNS.map(risk => {
        const isFlagged = rawPageText.split(/\r\n/).some(row => row.trim().endsWith(risk.name));

        if(!isFlagged) {
            return `<td class="text-center" style="background-color:rgb(240,253,244);border-color:rgb(134,239,172);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2"><path d="M20 6 9 17l-5-5"></path></svg>
            </td>`;
        }
        const riskDesc = rawPageText.split(/\r\n/)
                    .filter(row => row.trim().endsWith(risk.name))
                    .map(row =>  row 
                    .replace(new RegExp(`\\.?${risk.name}$`, "i"), "")
                    .replace(/^\d+KM/, "")
                    .trim()
                    ).join('\n');

        if(risk.code === 'PEP' || risk.code === 'EN') {
            riskDecisions[risk.name] = { decision: 'Approve', comments: '', description: riskDesc};
            return `<td class="text-center" style="cursor:pointer;background-color:rgb(255,251,235);border-color:rgb(252,211,77);"
                data-risk="${risk.code}"
                id="risk-td-${risk.code}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M20 6 9 17l-5-5"></path></svg>
            </td>`;
        }

        riskDecisions[risk.name] = { decision: '', comments: '', description: riskDesc};

        return `<td class="text-center" style="cursor:pointer;background-color:rgb(254,242,242);border-color:rgb(252,165,165);"
            data-risk="${risk.code}"
            id="risk-td-${risk.code}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </td>`;
    }).join('');

    const manualRisks = flaggedRisks.filter(r => r.code !== 'PEP' && r.code !== 'EN');

    contentDiv.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Risk Assessment</h5>
            <button type="button" class="close text-white" onclick="document.getElementById('approveModal').classList.remove('show')">&times;</button>
        </div>
        <div class="modal-body" style="overflow-x:auto;">
            <div class="mb-3">
                <strong>Legend:</strong>
                <div class="d-flex align-items-center mt-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2"><path d="M20 6 9 17l-5-5"></path></svg>
                    <span class="ml-2">No flag found by Acuity</span>
                </div>
                <div class="d-flex align-items-center mt-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    <span class="ml-2">Flag has been found by Acuity</span>
                </div>
                <div class="d-flex align-items-center mt-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M20 6 9 17l-5-5"></path></svg>
                    <span class="ml-2">Waiver has been approved</span>
                </div>
                <div class="d-flex align-items-center mt-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    <span class="ml-2">Waiver has been rejected</span>
                </div>
                <small class="text-muted mt-2 d-block">Click on each "X" to review details, decide on waiver (if applicable), and provide justification before submission.</small>
            </div>

            <table class="table table-striped table-hover table-bordered" style="font-size:0.85rem; width:100%;">
                <thead>
                    <tr style="background-color:rgba(68,114,196,0.15);">
                        <td>Organization</td>
                        <td>Designation</td>
                        ${RISK_COLUMNS.map(r => `<td class="text-center">${r.name}</td>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${reqData.legalName}</td>
                        <td>NA</td>
                        ${riskCells}
                    </tr>
                </tbody>
            </table>
            <div id="risk-modal-content" style="display:none; margin-top:20px;"></div>
        </div>
        <div class="modal-footer">
            <button class="btn bg-transparent border" onclick="document.getElementById('approveModal').classList.remove('show')">Cancel</button>
            <button class="btn" id="submitAllRisksBtn" style="background:#28a745;color:#fff;">
                Submit
            </button>
        </div>
    `;

    contentDiv.querySelectorAll('td[data-risk]').forEach(td => {
        td.addEventListener('click', () => {
            const riskCode = td.getAttribute('data-risk');
            const risk = RISK_COLUMNS.find(r => r.code === riskCode);
            const modalContent = document.getElementById('risk-modal-content');
            if(modalContent) {
                modalContent.style.display = 'block';
                modalContent.scrollIntoView({ behavior: 'smooth' });
            }
            showRiskDecisionModal(risk, riskDecisions, rawPageText, reqData, teiId, flaggedRisks);
        });
    });

    document.getElementById('submitAllRisksBtn').addEventListener('click', async () => {
        let overallStatus = "Approved";
        let hasReview = false;
        let hasReject = false;

        let missingComments = false;

        manualRisks.forEach(r => {
            const d = riskDecisions[r.name];
            if (!d || !d.decision) {
                hasReview = true;
            } else {
                if (d.decision === 'Reject') {
                    hasReject = true;
                }
                if (!d.comments || d.comments.trim() === '') {
                    missingComments = true;
                }
            }
        });

        if (missingComments) {
            toast({ status: 'ERROR', message: 'Please provide justification comments for your decisions.' });
            return;
        }

        if (hasReview) {
            overallStatus = "Review";
        } else if (hasReject) {
            overallStatus = "Failed";
        }

        await saveRiskDecisions(teiId, eventId, reqData, riskDecisions, overallStatus, deId);
        await fetchChangeRequests();
        document.getElementById('approveModal').classList.remove('show');

        if(overallStatus === 'Approved') {
            toast({ status: 'SUCCESS', message: 'All risks approved! Request updated.' });
        } else if (overallStatus === 'Failed') {
            toast({ status: 'ERROR', message: 'Risk rejected. Request failed.' });
        } else {
            toast({ status: 'SUCCESS', message: 'Risk Approved! Request updated.' });
        }
    });
}

 function showRiskDecisionModal(risk, riskDecisions, rawPageText, reqData, teiId, flaggedRisks) {
    const riskModalContent = document.getElementById('risk-modal-content');

    const riskDesc = rawPageText.split(/\r\n/)
        .filter(row => row.trim().endsWith(risk.name))
        .map(row => row
            .replace(new RegExp(`\\.?${risk.name}$`, "i"), "")
            .replace(/^\d+KM/, "")
            .trim()
        ).join('\n');

    const existing = riskDecisions[risk.name] || {};
    const isReadOnly = risk.code === 'PEP' || risk.code === 'EN';
    const currentDecision = isReadOnly ? 'Approve' : existing.decision || '';


    riskModalContent.innerHTML = `
        <div class="card border-danger">
            <div class="card-header bg-light">
                <h6 class="mb-0">${risk.name} - Risk Details</h6>
            </div>
            <div class="card-body">
                <h6 class="font-weight-bold mb-2">Flag Details:</h6>
                <p class="alert alert-danger mb-4">${riskDesc || 'No description available'}</p>

                <h6 class="font-weight-bold mb-2">Decision:</h6>
                <select class="form-control mb-3" id="risk-decision-select" ${isReadOnly ? 'disabled' : ''}>
                    <option value="" ${currentDecision === '' ? 'selected' : ''}>Select</option>
                    <option value="Approve" ${currentDecision === 'Approve' ? 'selected' : ''}>Approve</option>
                    <option value="Reject" ${currentDecision === 'Reject' ? 'selected' : ''}>Reject</option>
                </select>

                <label class="font-weight-bold mb-2">Comments:</label>
                <textarea class="form-control mb-3" id="risk-comments-textarea" rows="3" ${isReadOnly ? 'disabled' : ''}>${existing.comments || ''}</textarea>

            </div>
        </div>
    `;

    if(isReadOnly) return; 

    const decisionSelect = document.getElementById('risk-decision-select');
    const commentsTextarea = document.getElementById('risk-comments-textarea');

    const updateDecision = () => {
        const decision = decisionSelect.value;
        const comments = commentsTextarea.value;

        riskDecisions[risk.name] = { decision, comments, riskDesc };

        const td = document.getElementById(`risk-td-${risk.code}`);
        if(td) {
            if(decision === 'Approve') {
                td.style.backgroundColor = 'rgb(240,253,244)';
                td.style.borderColor = 'rgb(134,239,172)';
                td.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2"><path d="M20 6 9 17l-5-5"></path></svg>`;
            } else {
                td.style.backgroundColor = 'rgb(254,242,242)';
                td.style.borderColor = 'rgb(252,165,165)';
                td.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`;
            }
        }
    };

    decisionSelect.addEventListener('change', updateDecision);
    commentsTextarea.addEventListener('input', updateDecision);
}

  async function saveRiskDecisions(teiId, eventId, reqData, riskDecisions, overallStatus, deId) {
    try {
        const teData = await dataApi.getTrackedEntity(teiId);
        const teInfo = teData.trackedEntities[0];
        const ucmEnrollment = teInfo.enrollments.find(e => e.program === programs.UINControlMaster);
        const existingEvent = ucmEnrollment?.events?.find(e => e.programStage === programStage.acuityStatusAndReport);
        const existingEventId = existingEvent?.event || null;

        const { roleKey } = reqData;
        const nameDeId = roleKey === 'bank' 
            ? dataElements.bankName 
            : ROLE_PERSON_DE[roleKey]?.name;

        const dataValues = [];
        Object.entries(riskDecisions).forEach(([riskName, { decision, comments, description }]) => {
            const code = RISK_CODE_MAP[riskName];
            if (!code) return;

            const statusCode = `${code}-Status-${nameDeId}`;
            const justificationCode = `${code}-Justification-${nameDeId}`;
            const descriptionCode = `${code}-Description-${nameDeId}`;
            const riskCode = `${code}-${nameDeId}`;

            const statusDeId = deCodeMap[statusCode];          
            const justificationDeId = deCodeMap[justificationCode]; 
            const descriptionDeId = deCodeMap[descriptionCode];
            const riskDeId = deCodeMap[riskCode];

            if (statusDeId) dataValues.push({ dataElement: statusDeId, value: decision || "" });
            if (justificationDeId) dataValues.push({ dataElement: justificationDeId, value: comments || "" });
            if (descriptionDeId) dataValues.push({ dataElement: descriptionDeId, value: description || "" });
            if (riskDeId) dataValues.push({dataElement: riskDeId, value: true});

        });


        // Save to acuity waiver event
        if (existingEventId) {
            await dataApi.update({
                events: [{
                    event: existingEventId,
                    orgUnit: reqData.orgUnit,
                    program: programs.UINControlMaster,
                    programStage: programStage.acuityStatusAndReport,
                    enrollment: reqData.enrollment,
                    trackedEntity: teiId,
                    occurredAt: new Date().toISOString(),
                    status: "ACTIVE",
                    dataValues
                }]
            });
        } else {
            await dataApi.enroll({
                events: [{
                    orgUnit: reqData.orgUnit,
                    program: programs.UINControlMaster,
                    programStage: programStage.acuityStatusAndReportExistingEvent,
                    enrollment: reqData.enrollment,
                    trackedEntity: teiId,
                    occurredAt: new Date().toISOString(),
                    status: "ACTIVE",
                    dataValues
                }]
            });
        }

        // Update main request status
        if (deId) {
            await dataApi.update({
                events: [{
                    event: eventId,
                    orgUnit: reqData.orgUnit,
                    program: programs.UINControlMaster,
                    programStage: reqData.programStage,
                    enrollment: reqData.enrollment,
                    occurredAt: new Date().toISOString(),
                    dataValues: [{ dataElement: deId, value: overallStatus }]
                }]
            });
        }



    } catch (err) {
        console.error('Error saving risk decisions:', err);
        throw err;
    }
}

  function ensureDetailModal() {
    let modal = document.getElementById("detailModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "detailModal";
      modal.className = "custom-modal";
      document.body.appendChild(modal);
    }

    if (!document.getElementById("detailModalContent")) {
      modal.innerHTML = `
        <div class="custom-modal-card">
          <div id="detailModalContent"></div>
        </div>
      `;
    }

    return modal;
  }

  function ensureApproveModal() {
    let modal = document.getElementById("approveModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "approveModal";
      modal.className = "custom-modal";
      document.body.appendChild(modal);
    }

    if (!document.getElementById("approveModalContent")) {
      modal.innerHTML = `
        <div class="custom-modal-card" style="width: 90vw; max-width: 900px; max-height: 90vh; overflow-y: auto;">
          <div id="approveModalContent"></div>
        </div>
      `;
    }

    return modal;
  }
});