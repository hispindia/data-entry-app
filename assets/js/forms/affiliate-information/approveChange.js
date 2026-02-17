import { getUserConfig } from "../config.js";
import { dataApi } from "../../api/DataApi.js";
import { programs, programStage, dataElements, attributes, orgUnit, tei, } from "../../constant.js";
import { programStageApi } from "../../api/metaDataApi.js";
import { convert } from "../metadata.js";

const STAGE_MAPPING = {
  chairperson: programStage.ChairPerson,
  viceChairperson: programStage.viceChairperson,
  secretary: programStage.Secretary,
  treasurer: programStage.Treasurer,
  youth: programStage.Youth,
  seniorManagementCEO: programStage.seniorManagement,
  seniorManagementFinance: programStage.seniorManagementFinance,
  seniorManagementPrograms: programStage.seniorManagementPrograms,
  bank: programStage.bank
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
        const response = await dataApi.get(
            orgUnit.id,
            programs.UINControlMaster,
            ""
        );
        
        const requests = [];
        cachedRequests = [];
        
        if (response && response.trackedEntities) {
            response.trackedEntities.forEach(tei => {
                const legalNameAttr = tei.attributes.find(a => a.attribute === attributes.legalName);
                const legalName = legalNameAttr ? legalNameAttr.value : "N/A";
                
                tei.enrollments.forEach(enrollment => {
                    enrollment.events?.forEach(event => {
                        const statusDv = event.dataValues.find(dv => dv.dataElement === dataElements.presidentAcuityStatus);
                        console.log("Actual stored value:", statusDv?.value);
                        if(!statusDv || statusDv.value != "In-Progress") return;

                        const createdBy = event.createdBy ? event.createdBy.username : 'System';
                        requests.push({
                            legalName,
                            memberSelected: createdBy,
                            requestedBy: createdBy,
                            requestDate: event.occurredAt,
                            status: "Pending",
                            teiId: tei.trackedEntity, 
                            eventId: event.event,
                            dataValues: event.dataValues
                        });
                    })
                })

                
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
                  <td>1 members(s)</td>
                  <td>${req.requestedBy}</td>
                  <td>${req.requestDate.split('T')[0]}</td>
                  <td><span class="badge badge-warning">${req.status}</span></td>
                    <td style="text-align: center;" colspan="2">
                        <div class="actions" style="display: flex; justify-content: center; gap: 10px;">
                            <button class="btn-icon blue"
                            title="View Details"
                            style="cursor: pointer; background: none; border: none;"
                            onclick="viewRequest('${req.teiId}', '${req.eventId}')">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>

                            <button class="btn-icon green"
                            title="Approve"
                            style="cursor: pointer; background: none; border: none;"
                            onclick="openApproveModal('${req.teiId}', '${req.eventId}')">
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

//   Show Full Section (Even If Only 1 Field Changed)

  window.viewRequest = async function(teiId, eventId) {
    console.log("viewRequest called with:", teiId, eventId);

    const modal = ensureDetailModal();
    const contentDiv = document.getElementById("detailModalContent");

    contentDiv.innerHTML = `
        <div class="p-4 text-center">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2">Loading...</p>
        </div>
    `;
    modal.style.display = "flex";

    try {
        const reqData = cachedRequests.find(
            r => r.teiId === teiId && r.eventId === eventId
        );

        if (!reqData) throw new Error("Request not found");

        // Convert event dataValues → map
        const dataMap = {};
        reqData.dataValues.forEach(dv => {
            dataMap[dv.dataElement] = dv.value;
        });

      
        if (dataMap[dataElements.presidentAcuityStatus] !== "In-Progress") {
            throw new Error("Not a valid President change request");
        }

        // Get metadata for President section
        const stageRes = await programStageApi.get(programStage.UINControlMaster);
        const stage = convert.stage({ programStage: stageRes });

        const presidentSection = stage.sections.find(
            s => s.id === programStage.ChairPerson
        );

        if (!presidentSection) {
            throw new Error("President section not found");
        }

      
        const fieldsHtml = presidentSection.items.map(item => {
            const value = dataMap[item.code] || "-";
            return `
                <div class="col-md-6 mb-3">
                    <small class="text-muted">${item.name}</small>
                    <div class="font-weight-bold">${value}</div>
                </div>
            `;
        }).join("");

        contentDiv.innerHTML = `
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title text-white">President Change Request</h5>
                <button type="button" class="close text-white"
                    onclick="document.getElementById('detailModal').style.display='none'">
                    &times;
                </button>
            </div>

            <div class="modal-body bg-light">
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
                                <small class="text-muted">Requested By</small>
                                <div class="h6">${reqData.requestDate}</div>
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
                        <h6 class="mb-0 text-primary">President Details</h6>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            ${fieldsHtml}
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary"
                    onclick="document.getElementById('detailModal').style.display='none'">
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


  window.openApproveModal = function(teiId, eventId) {
    const modal = ensureApproveModal();
    const contentDiv = document.getElementById("approveModalContent");
    
    contentDiv.innerHTML = `
      <div class="modal-header bg-success text-white">
        <h5 class="modal-title text-white">Approve Request</h5>
        <button type="button" class="close text-white" onclick="document.getElementById('approveModal').style.display='none'">&times;</button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to approve this change request?</p>
      </div>
      <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('approveModal').style.display='none'">Cancel</button>
          <button class="btn btn-success" id="confirmApproveBtn">Approve</button>
      </div>
    `;

    document.getElementById("confirmApproveBtn").onclick = async function() {
        try {
            document.getElementById('approveModal').style.display='none';
            fetchChangeRequests();
            
        } catch (e) {
            console.error(e);
            alert("Error approving request");
        }
    };

    modal.style.display = "flex";
  };

  function ensureDetailModal() {
    let modal = document.getElementById("detailModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "detailModal";
        modal.className = "modal";
        modal.style.backgroundColor = "rgba(0,0,0,0.5)";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.zIndex = "1050";
        modal.style.display = "none";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        document.body.appendChild(modal);
    }

    // Ensure the inner structure exists (fix for "modal not opening" if content div is missing)
    if (!document.getElementById("detailModalContent")) {
        modal.innerHTML = `
          <div class="modal-dialog modal-lg" style="max-width: 800px; width: 90%; margin: 20px;">
              <div class="modal-content" id="detailModalContent" style="background: #fff; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; overflow-y: auto;">
              </div>
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
        modal.className = "modal";
        modal.style.backgroundColor = "rgba(0,0,0,0.5)";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.zIndex = "1050";
        modal.style.display = "none";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        document.body.appendChild(modal);
    }

    if (!document.getElementById("approveModalContent")) {
        modal.innerHTML = `
          <div class="modal-dialog" style="max-width: 500px; width: 90%; margin: 20px;">
              <div class="modal-content" id="approveModalContent" style="background: #fff; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
              </div>
          </div>
        `;
    }
    return modal;
  }
  
})