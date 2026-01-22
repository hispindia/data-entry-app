import { dataApi } from "../../api/DataApi.js";
import { meApi, programsApi } from "../../api/metaDataApi.js";
import { attributes, programs} from "../../constant.js";
import { getUserConfig } from "../config.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userConfig = await getUserConfig();
  if (userConfig) {
      userConfig.user.forEach(user => {
      $(`.${user}`).hide();
      });
  }
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault(); 
      var targetPage = event.currentTarget.getAttribute("data-target") || event.currentTarget.parentElement.getAttribute("data-target");
      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });

  fetchAffiliateList();
  async function fetchAffiliateList() {
    const user = await meApi.get();
    const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
    const userOrgUnit = user?.organisationUnits.map(ou => ou.id).join(';');
    const resAffiliateList = await dataApi.get(userOrgUnit, programs.affiliateKyc);

    const affilitateAttrList = resAffiliateList.trackedEntities.map(trackedEntity => {
      const attributes = {
        id: trackedEntity.trackedEntity
      };
      trackedEntity.attributes.forEach(attr => attributes[attr.attribute] = attr.value);
      return attributes;
    })
    //filter affiliate list based on the status:
    const approvedList = affilitateAttrList.filter(trackedEntity => trackedEntity[attributes.acuityCheck]=="Passed" && trackedEntity[attributes.submitted] && !trackedEntity[attributes.uinCode]);

    document.getElementById('approvedCount').innerHTML = approvedList.length;
  
    const headerList = programAffiliateKyc.programTrackedEntityAttributes
    .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
    .map(attr => ({id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name}));

    var theadAffiliateRow = "";
    headerList.forEach(item => theadAffiliateRow+= `<th class="py-3 px-4 font-weight-bold border-0 text-center">${item.name}</th>`);
    
    document.getElementById('thead-affiliate-approved').innerHTML = `<th class="py-3 px-4 font-weight-bold border-0 text-center">UIN</th>${theadAffiliateRow}<th class="py-3 px-4 font-weight-bold border-0 text-center">Actions</th>`;
    
    var tbodyAffiliateApprovedRow = "";
    approvedList.forEach(affiliate => {
          
      tbodyAffiliateApprovedRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
      tbodyAffiliateApprovedRow += `<td class="text-center">${affiliate[attributes.uinCode] || ''}</td>`
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
        onmouseover="this.style.backgroundColor='#265bbf' "onmouseout="this.style.backgroundColor='#3b71ca'">
        Generate UIN
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
      window.location.href = `./1.3.1-generate-uin.html?affiliate=${affiliate}`;
    })

  }
})