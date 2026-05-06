import { dataApi } from "../../api/DataApi.js";
import { dataElementsApi, programStageApi } from "../../api/metaDataApi.js";
import { programs, programStage, dataElements, attributes, orgUnit, tei, ROLE_ACUITY_DE, programSection } from "../../constant.js";
import { getUserConfig } from "../config.js";
import { convert } from "../metadata.js";
import { toast } from "../utils.js";

let deCodeMap = {}; 
let cachedRequests = [];

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
                                  dv => dv.dataElement === deId && dv.value === "Review"
                              )
                          );
  
                          if (!isPending) return;
  
                          const createdBy = event.createdBy?.username || "System";
  
                          const eventDataMap = {};
                          event.dataValues?.forEach(dv => { eventDataMap[dv.dataElement] = dv.value; });
  
                          for (const [key, deId] of Object.entries(ROLE_ACUITY_DE)) {
                              if (eventDataMap[deId] === "Review") {
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
                              status: "Review",
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
              throw new Error("Not a valid change request or status is not 'Review'.");
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

  async function performApprovalFlow(teiId, eventId, roleKey, contentDiv) {
    contentDiv.innerHTML = `
      <div class="modal-header">
          <h5 class="modal-title">Loading Risk Data</h5>
      </div>
      <div class="modal-body" style="padding:40px; text-align:center;">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2 text-muted" id="loadingMsg">Fetching saved risk assessment...</p>
      </div>
    `;

    try {
        const reqData = cachedRequests.find(r => r.teiId === teiId && r.eventId === eventId && r.roleKey === roleKey);
        if (!reqData) throw new Error("Request data not found.");

        const deId = ROLE_ACUITY_DE[roleKey];
        const nameDeId = roleKey === 'bank' ? dataElements.bankName : ROLE_PERSON_DE[roleKey]?.name;

        const teData = await dataApi.getTrackedEntity(teiId);
        const teInfo = teData.trackedEntities[0];
        const ucmEnrollment = teInfo.enrollments.find(e => e.program === programs.UINControlMaster);
         const existingEvent = ucmEnrollment?.events?.find(e => e.programStage === programStage.acuityStatusAndReport);

        const dataValues = existingEvent?.dataValues || [];
        
        const riskDecisions = {};

        RISK_COLUMNS.forEach(risk => {
            const riskCodeStr = `${risk.code}-${nameDeId}`;
            const riskDeId = deCodeMap[riskCodeStr];
            const riskDv = dataValues.find(dv => dv.dataElement === riskDeId);

            if (riskDv && riskDv.value === "true") {
                const statusCode = `${risk.code}-Status-${nameDeId}`;
                const justificationCode = `${risk.code}-Justification-${nameDeId}`;
                const descriptionCode = `${risk.code}-Description-${nameDeId}`;

                const desc = dataValues.find(dv => dv.dataElement === deCodeMap[descriptionCode])?.value || "";
                const dec = dataValues.find(dv => dv.dataElement === deCodeMap[statusCode])?.value || "";
                const comments = dataValues.find(dv => dv.dataElement === deCodeMap[justificationCode])?.value || "";

                riskDecisions[risk.name] = { decision: dec, comments, description: desc, code: risk.code };
            }
        });

        // Always show the risk table, bypassing auto-approve
        showRiskTable(teiId, eventId, contentDiv, riskDecisions, reqData, deId);

    } catch (e) {
        console.error(e);
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

  function showRiskTable(teiId, eventId, contentDiv, riskDecisions, reqData, deId) {
    const flaggedRiskNames = Object.keys(riskDecisions);
    const manualRisks = RISK_COLUMNS.filter(r => flaggedRiskNames.includes(r.name) && r.code !== 'PEP' && r.code !== 'EN');

    const renderTable = () => {
        const riskCells = RISK_COLUMNS.map(risk => {
            if (!flaggedRiskNames.includes(risk.name)) {
                return `<td class="text-center" style="background-color:rgb(240,253,244);border-color:rgb(134,239,172);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2"><path d="M20 6 9 17l-5-5"></path></svg>
                </td>`;
            }

            const rData = riskDecisions[risk.name];

            if (risk.code === 'PEP' || risk.code === 'EN') {
                return `<td class="text-center" style="cursor:pointer;background-color:rgb(255,251,235);border-color:rgb(252,211,77);"
                    data-risk="${risk.code}" id="risk-td-${risk.code}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2"><path d="M20 6 9 17l-5-5"></path></svg>
                </td>`;
            }

            let bg = 'rgb(254,242,242)';
            let border = 'rgb(252,165,165)';
            let stroke = 'red';
            let svg = `<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>`; 
            
            if (rData.decision === 'Approve') {
                bg = 'rgb(255,251,235)'; border = 'rgb(252,211,77)'; stroke = '#D97706';
                svg = `<path d="M20 6 9 17l-5-5"></path>`;
            } else if (rData.decision === 'Reject') {
                bg = 'rgb(255,251,235)'; border = 'rgb(252,211,77)'; stroke = '#D97706';
                svg = `<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>`; 
            }

            return `<td class="text-center" style="cursor:pointer;background-color:${bg};border-color:${border};"
                data-risk="${risk.code}"
                id="risk-td-${risk.code}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2">${svg}</svg>
            </td>`;
        }).join('');

        contentDiv.innerHTML = `
            <div class="modal-header">
                <h5 class="modal-title">Review Saved Risk Assessment</h5>
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
                            <td>${reqData.legalName || '-'}</td>
                            <td>${reqData.roleKey.replace(/([A-Z])/g, " $1").toUpperCase()}</td>
                            ${riskCells}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer d-flex justify-content-between align-items-center">
                <small class="text-danger" id="riskErrorMsg" style="display:none;"></small>
                <div>
                    <button class="btn bg-transparent border rounded-xl" onclick="document.getElementById('approveModal').classList.remove('show')">Cancel</button>
                    <button class="btn" style="background-color:#E93300; border-color:#E93300; color: #fff" id="submitRiskBtn">Update Decisions</button>
                </div>
            </div>
        `;

        RISK_COLUMNS.forEach(risk => {
            if (flaggedRiskNames.includes(risk.name)) {
                const td = document.getElementById(`risk-td-${risk.code}`);
                if(td) {
                    td.onclick = () => showRiskDecisionModal(risk.name, risk.code, riskDecisions, contentDiv, renderTable);
                }
            }
        });

        document.getElementById('submitRiskBtn').onclick = async function() {
            const isRejected = manualRisks.some(r => riskDecisions[r.name]?.decision === 'Reject');
            const hasBlanks = manualRisks.some(r => !riskDecisions[r.name]?.decision);
            let finalStatus = 'Review';
            
            if (!hasBlanks) {
                finalStatus = isRejected ? 'Failed' : 'Approved';
            }

            const btn = this;
            btn.disabled = true;
            btn.innerText = "Saving...";
            
            await saveRiskDecisions(teiId, eventId, reqData, riskDecisions, finalStatus, deId);
        };
    };

    renderTable();
  }

  function showRiskDecisionModal(riskName, riskCode, riskDecisions, contentDiv, returnCallback) {
    const riskData = riskDecisions[riskName];
    const isReadOnly = (riskCode === 'PEP' || riskCode === 'EN');

    contentDiv.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">${riskName} - Decision</h5>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Description from Acuity</label>
                <textarea class="form-control" rows="4" readonly style="background-color:#f8f9fa;">${riskData.description}</textarea>
            </div>
            
            ${isReadOnly ? `
                <div class="alert alert-warning p-2">
                    <small><i class="fas fa-info-circle"></i> This risk type is automatically set to Approve and cannot be changed.</small>
                </div>
            ` : `
                  <div class="form-group">
                    <label>Decision <span class="text-danger">*</span></label>
                      <select class="form-control" id="riskDecisionSelect">
                        <option value="">Select decision</option>
                        <option value="Approve" ${riskData.decision === 'Approve' ? 'selected' : ''}>Approve</option>
                        <option value="Reject" ${riskData.decision === 'Reject' ? 'selected' : ''}>Reject</option>
                      </select>
                  </div>
                  <div class="form-group">
                    <label>Comments / Justification <span class="text-danger">*</span></label>
                    <textarea class="form-control" id="riskCommentsInput" rows="3" placeholder="Provide justification...">${riskData.comments}</textarea>
                    <small class="text-danger" id="riskCommentsError" style="display:none;">Comments are mandatory for the decision.</small>
                  </div>
            `}
        </div>
          <div class="modal-footer">
            <button class="btn" style="background-color:#E93300; border-color:#E93300; color: #fff" id="saveDecisionBtn">Back</button>
          </div>
    `;

    document.getElementById('saveDecisionBtn').onclick = () => {
        if (!isReadOnly) {
            const decisionSelect = document.getElementById('riskDecisionSelect');
            const commentsInput = document.getElementById('riskCommentsInput');
            
            if ((decisionSelect.value === 'Approve' || decisionSelect.value === 'Reject') && !commentsInput.value.trim()) {
                document.getElementById('riskCommentsError').style.display = 'block';
                return;
            }

            riskDecisions[riskName] = {
                decision: decisionSelect.value,
                comments: commentsInput.value.trim(),
                description: riskData.description,
                code: riskCode
            };
        }
        returnCallback();
    };
  }

  async function saveRiskDecisions(teiId, eventId, reqData, riskDecisions, overallStatus, deId) {
    try {
        const teData = await dataApi.getTrackedEntity(teiId);
        const teInfo = teData.trackedEntities[0];
        const ucmEnrollment = teInfo.enrollments.find(e => e.program === programs.UINControlMaster);
        const existingEvent = ucmEnrollment?.events?.find(e => e.programStage === programStage.acuityStatusAndReport);
        const existingEventId = existingEvent?.event || null;

        const { roleKey } = reqData;
        const nameDeId = roleKey === 'bank' ? dataElements.bankName : ROLE_PERSON_DE[roleKey]?.name;

        const dataValues = [];
        Object.entries(riskDecisions).forEach(([riskName, { decision, comments, description, code }]) => {
            const statusCode = `${code}-Status-${nameDeId}`;
            const justificationCode = `${code}-Justification-${nameDeId}`;
            const descriptionCode = `${code}-Description-${nameDeId}`;
            const riskCodeStr = `${code}-${nameDeId}`;

            const statusDeId = deCodeMap[statusCode];          
            const justificationDeId = deCodeMap[justificationCode]; 
            const descriptionDeId = deCodeMap[descriptionCode];
            const riskDeId = deCodeMap[riskCodeStr];

            if (statusDeId) dataValues.push({ dataElement: statusDeId, value: decision || "" });
            if (justificationDeId) dataValues.push({ dataElement: justificationDeId, value: comments || "" });
            if (descriptionDeId) dataValues.push({ dataElement: descriptionDeId, value: description || "" });
            if (riskDeId) dataValues.push({dataElement: riskDeId, value: true});
        });

        const eventPayload = {
            orgUnit: reqData.orgUnit,
            program: programs.UINControlMaster,
            programStage: programStage.acuityStatusAndReport,
            enrollment: reqData.enrollment,
            trackedEntity: teiId,
            occurredAt: new Date().toISOString(),
            status: "COMPLETED",
            dataValues: dataValues
        };

        if (existingEventId) {
            eventPayload.event = existingEventId;
            await dataApi.update({
                events: [eventPayload]
            });
        } else {
            await dataApi.save({
                events: [eventPayload]
            });
        }

        if (deId) {
            await dataApi.update({
                events: [{
                    event: eventId,
                    orgUnit: reqData.orgUnit,
                    program: programs.UINControlMaster,
                    programStage: reqData.programStage,
                    enrollment: reqData.enrollment,
                    occurredAt: reqData.requestDate,
                    dataValues: [{ dataElement: deId, value: overallStatus}]
                }]
            });
        }

        await fetchChangeRequests();
        document.getElementById('approveModal').classList.remove('show');
        toast({ status: 'SUCCESS', message: 'Risk Decisions Updated Successfully!' });

    } catch (e) {
        console.error(e);
        toast({ status: 'ERROR', message: 'Failed to save risk decisions' });
        const btn = document.getElementById('submitRiskBtn');
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Update Decisions";
        }
    }
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

})