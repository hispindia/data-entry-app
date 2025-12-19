import { dataApi } from "../../api/DataApi.js";
import { meApi, orgUnitsApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, programStage, programs, tei } from "../../constant.js";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault(); 
      var targetPage = event.currentTarget.getAttribute("data-target");
      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });

  fetchAffiliateList();
  async function fetchAffiliateList() {
    const user = await meApi.get();
    const level2OU = await orgUnitsApi.get(2);
    const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);

    const userOrgUnit = user.dataViewOrganisationUnits.map(ou => ou.id).join(';');
    const resAffiliateList = await dataApi.get(userOrgUnit, programs.affiliateKyc);

    tei.orgUnits = level2OU.organisationUnits;
    tei.affiliates = resAffiliateList.trackedEntities;
    const affilitateAttrList = resAffiliateList.trackedEntities.map(trackedEntity => {
      const attributes = {
        id: trackedEntity.trackedEntity
      };
      trackedEntity.attributes.forEach(attr => attributes[attr.attribute] = attr.value);
      return attributes;
    })
    //filter affiliate list based on the status:
    const approvedList = affilitateAttrList.filter(trackedEntity => trackedEntity[attributes.acuityCheck]=="Passed");
    const failedList = affilitateAttrList.filter(trackedEntity => trackedEntity[attributes.acuityCheck]=="Failed");
    const inProgressList = affilitateAttrList.filter(trackedEntity => trackedEntity[attributes.acuityCheck]=="In Progress");

    document.getElementById('approvedCount').innerHTML = approvedList.length;
    document.getElementById('failedCount').innerHTML = failedList.length;
    document.getElementById('inProgressCount').innerHTML = inProgressList.length;  
  
    const headerList = programAffiliateKyc.programTrackedEntityAttributes
    .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
    .map(attr => ({id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name}));

    var theadAffiliateRow = "";
    headerList.forEach(item => theadAffiliateRow+= `<th class="py-3 px-4 font-weight-bold border-0 text-center">${item.name}</th>`);
    
    document.getElementById('thead-affiliate-failed').innerHTML = theadAffiliateRow;
    document.getElementById('thead-affiliate-inProgress').innerHTML = theadAffiliateRow;
    document.getElementById('thead-affiliate-approved').innerHTML = `${theadAffiliateRow}<th class="py-3 px-4 font-weight-bold border-0 text-center">Actions</th>`;

    var tbodyAffiliateApprovedRow = "";
    approvedList.forEach(affiliate => {
      tbodyAffiliateApprovedRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
      headerList.forEach(attr => {
        if(attr.id == attributes.acuityCheck) {
          tbodyAffiliateApprovedRow += `<td class="text-center" >
          ${(affiliate[attr.id] ? `<span style="background-color: #bbf7d0; color: #15803d; font-weight: 500; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem;">Approved</span>`: '')}
          </td>`
        }
        else tbodyAffiliateApprovedRow += `<td class="text-center" >${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`
      });
      tbodyAffiliateApprovedRow += `
      <td class="text-center">  
      <button 
        data-affiliate="${affiliate.id}" 
        class="btn btn-sm row-btn" style="background-color: #3b71ca; color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 16px; transition: background-color 0.2s ease-in-out;"
        onmouseover="this.style.backgroundColor='#265bbf' "onmouseout="this.style.backgroundColor='#3b71ca'">Process UIN Generation
      </button>
      </td>
      </tr>`
    })
    
    const tbodyApproved = document.getElementById('tbody-affiliate-approved')
    tbodyApproved.innerHTML = tbodyAffiliateApprovedRow;
    tbodyApproved.addEventListener('click', async (e)=> {
      const button = e.target.closest('.row-btn');
      if(!button) return;
      const affiliate = button.dataset.affiliate;
      window.location.href = `./1.2-1-due-diligence.html?affiliate=${affiliate}`;
    })

    tbodyAffiliateApprovedRow = "";
    failedList.forEach(affiliate => {
      tbodyAffiliateApprovedRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
      headerList.forEach(attr => {
        if(attr.id == attributes.acuityCheck) {
          tbodyAffiliateApprovedRow += `<td class="text-center" >
          ${(affiliate[attr.id] ? `<span style="background-color: rgb(254, 202, 202); color: rgb(153, 27, 27); font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem;">Failed</span>`: '')}
          </td>`
        }
        else tbodyAffiliateApprovedRow += `<td class="text-center" >${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`
      });
     
      tbodyAffiliateApprovedRow += `</tr>`
    })
    document.getElementById('tbody-affiliate-failed').innerHTML = tbodyAffiliateApprovedRow;


    tbodyAffiliateApprovedRow = "";
    inProgressList.forEach(affiliate => {
      tbodyAffiliateApprovedRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
       headerList.forEach(attr => {
        if(attr.id == attributes.acuityCheck) {
          tbodyAffiliateApprovedRow += `<td class="text-center" >
          ${(affiliate[attr.id] ? `<span class="badge" style="background-color: #dce6fd; color: #3366cc; font-weight: 500; padding: 6px 12px; border-radius: 6px;">Under Review</span>`: '')}
          </td>`
        }
        else tbodyAffiliateApprovedRow += `<td class="text-center" >${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`
      });
      tbodyAffiliateApprovedRow += `</tr>`
    })
    document.getElementById('tbody-affiliate-inProgress').innerHTML = tbodyAffiliateApprovedRow;


  }
})