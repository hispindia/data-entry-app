import { getUserConfig } from "../config.js";
import { dataApi } from "../../api/DataApi.js";
import { programs, programStage, dataElements, attributes, orgUnit, tei, ROLE_ACUITY_DE, } from "../../constant.js";
import { programStageApi } from "../../api/metaDataApi.js";
import { convert } from "../metadata.js";
import { toast } from "../utils.js";
import { createPayload } from "../../api/payload.js";

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
        );
        
        const requests = [];
        cachedRequests = [];
        
       if (response && response.trackedEntities) {
        response.trackedEntities.forEach(tei => {

        const legalNameAttr = tei.attributes.find(
        a => a.attribute === attributes.legalName
        );
        const legalName = legalNameAttr ? legalNameAttr.value : " ";

        tei.enrollments?.forEach(enrollment => {

            const sortedEvents = [...enrollment.events].sort(
                (a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)
            );
            
            sortedEvents.forEach(event => {
                const isPending = Object.values(ROLE_ACUITY_DE).some(deId =>
                event.dataValues?.some(
                    dv => dv.dataElement === deId && dv.value === "In-Progress"
                )
                );

             if (!isPending) return;

            const createdBy = event.createdBy?.username || "System";

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

  function getRoleDisplayName(roleKey) {
    const result = roleKey.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
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
    modal.classList.add("show");

    try {
        const reqData = cachedRequests.find(
            r => r.teiId === teiId && r.eventId === eventId
        );

        if (!reqData) throw new Error("Request not found");
        console.log("Request data:", reqData);

        const dataMap = {};
        reqData.dataValues.forEach(dv => {
            dataMap[dv.dataElement] = dv.value;
        });

        let roleKey = null;
        for (const [key, deId] of Object.entries(ROLE_ACUITY_DE)) {
            if (dataMap[deId] === "In-Progress") {
                roleKey = key;
                break;
            }
        }

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


  window.openApproveModal = function(teiId, eventId) {
    const modal = ensureApproveModal();
    const contentDiv = document.getElementById("approveModalContent");
    
    contentDiv.innerHTML = `
      <div class="modal-header">
        <h5 class="modal-title">Approve Request</h5>
        <button type="button" class="close text-white" onclick="document.getElementById('approveModal').classList.remove('show')">&times;</button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to approve this change request?</p>
      </div>
      <div class="modal-footer">
          <button class="btn bg-transparent border rounded-xl" onclick="document.getElementById('approveModal').classList.remove('show')">Cancel</button>
          <button class="btn" style="background-color:#E93300; border-color:#E93300; color: #ffff" id="confirmApproveBtn">Approve</button>
      </div>
    `;

    document.getElementById("confirmApproveBtn").onclick = async function() {
         const containerDiv = document.getElementById("approveModalContent");
        containerDiv.innerHTML = `
            <div class="modal-header">
                <h5 class="modal-title">Approve Result</h5>
            </div>
            <div class="modal-body" style="text-align:center; padding:40px;">
                <h6>Please wait while we process your request...</h6>
            </div>
            <div class="modal-footer">
                <button class="btn" style="background-color:#E93300; border-color:#E93300; color: #ffff"  onClick=" document.getElementById('approveModal').classList.remove('show')"> Close </button>
            </div>
            
            `;
        try {
          
            //flow api call 
            const flowResponse = await fetch("https://default56af9532501a404c995d80633a35c0.ac.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/659d9a7a7b404fbfa426dfa84e486992/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5VaBmHuGhyAYYnAumUf0eqdXPwOpue0aPICvxPgfthQ", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                   "eventUid": "abc123",
                    "action": "complete",
                    "orgUnit": "OU_01",
                    "program": "Prog_01",
                    "PresidentName": "sonu singh AXWPS8419G"
                })
            });
           
            const flowResult = await flowResponse.json();
            const { rawPageText } = flowResult;
            containerDiv.innerHTML = `
              <div class="modal-header">
                <h5 class="modal-title">Approve Result</h5>
              </div>
              <div class="modal-body" style="text-align:center;">
                 <p>${rawPageText.split(",")[1]?.trim() || "No! Record Found"}</p>
            </div>

             <div class="modal-footer">
                <button class="btn" style="background-color:#E93300; border-color:#E93300; color: #ffff"  onClick=" document.getElementById('approveModal').classList.remove('show')"> Close </button>
             </div>

            `;
            const isClean = rawPageText.toLowerCase().includes("No Record Found");
            const deId = ROLE_ACUITY_DE[roleKey];
            if(!deId) {
                console.log("Invalid Row", roleKey);
                return;
            }
            
            if (isClean) {
                await dataApi.update(eventId, {
                    eventId,
                    dataValues: [
                       {
                        dataElement: deId,
                        value: "Approved"
                       }
                    ]
                });
            }
            await fetchChangeRequests();
           
            toast({status: 'SUCCESS', message: 'Request Approved Successfully!', position: 'topRight'});
            
        } catch (e) {
            console.error(e);
        }
    };

    modal.classList.add("show");
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
        <div class="custom-modal-card sm">
            <div id="approveModalContent"></div>
        </div>
        `;
    }

    return modal;
    }


  
})