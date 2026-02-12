import { getUserConfig } from "../config.js";
import { dataApi } from "../../api/DataApi.js";
import { programs, programStage, dataElements, attributes, orgUnit, } from "../../constant.js";

const ROLE_LABELS = {
  chairperson: "Chairperson",
  viceChairperson: "Vice Chairperson",
  secretary: "Secretary",
  treasurer: "Treasurer",
  youth: "Youth",
  seniorManagementCEO: "Chief Executive Officer",
  seniorManagementFinance: "Director of Finance",
  seniorManagementPrograms: "Director of Programs",
  bank: "Bank Details"
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

  fetchChangeRequests();

  async function fetchChangeRequests() {
    try {
        const response = await dataApi.get(
            orgUnit.id,
            programs.UINControlMaster,
            ""
        );
        
        const requests = [];
        
        if (response && response.trackedEntities) {
            response.trackedEntities.forEach(tei => {
                const legalNameAttr = tei.attributes.find(a => a.attribute === attributes.legalName);
                const legalName = legalNameAttr ? legalNameAttr.value : "N/A";
                
                tei.enrollments.forEach(enrollment => {
                    enrollment.events?.forEach(event => {
                        // console.log("---- EVENT START ----");
                        // console.log("Event ID:", event.event);
                        // console.log("Program Stage:", event.programStage);
                        // console.log("All dataValues:", event.dataValues);
                        // console.log("Expected Status DE ID:", dataElements.changeRequestStatus);
                        // const statusDv = event.dataValues.find(dv => dv.dataElement === dataElements.changeRequestStatus);
                        // console.log("-------------------------------------High Profile check----------------------------");
                        // console.log("----Program Stage-----:", event.programStage);
                        // console.log("--------Control Stage Constant-----------:", programStage.UINControlMaster);
                        
                        if(!statusDv || statusDv.value != "In Progress") return;

                        if(!event.createdBy) return;
                        requests.push({
                            legalName,
                            memberSelected: event.createdBy.displayName || event.createdBy.username,
                            requestedBy: event.createdBy.displayName || event.createdBy.username,
                            requestDate: event.occurredAt,
                            status: "Pending",
                            teiId: tei.trackedEntity, 
                            eventId: event.event 
                        });
                    })
                })

                
            });
        }
        
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
                  <td>${req.memberSelected}</td>
                  <td>${req.requestedBy}</td>
                  <td>${req.requestDate.split('T')[0]}</td>
                  <td><span class="badge badge-warning">${req.status}</span></td>
                  <td>
                      <button class="btn btn-primary btn-sm" onclick="viewRequest('${req.teiId}', '${req.eventId}')">View</button>
                  </td>
              </tr>
          `;
          tableBody.innerHTML += row;
      });
  }

  window.viewRequest = function(teiId, eventId) {
      console.log("View request", teiId, eventId);
  };
})