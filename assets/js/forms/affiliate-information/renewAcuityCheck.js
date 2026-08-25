import { dataApi } from "../../api/DataApi.js";
import { dataElementsApi, meApi, programsApi } from "../../api/metaDataApi.js";
import { attributes, orgUnit, programs, trackedEntityType} from "../../constant.js";
import { getUserConfig } from "../config.js";
import { toast } from "../utils.js";

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
   
  fetchAffiliateList();
  async function fetchAffiliateList() {
    const user = await meApi.get();
    const programAffiliateKyc = await programsApi.get(programs.UINControlMaster);
    const resDataElement =  await dataElementsApi.get({
      param: ['filter=code:!null', 'fields=id,name,code']
    })
    const dataElements = {
      "UkQI1dWzZOv_qsASQ0NRTVA": false //attributes organisation check
    }; 

    resDataElement.dataElements.forEach(de => {
      if(de.code.includes('::')) {
        dataElements[de.code.split('::').join('_')] = false;
      }
    });

    const userOrgUnit = user?.organisationUnits.map(ou => ou.id);
    const userOUCode = user?.organisationUnits.map(ou => ou.code)?.filter(ou => ou);
    const resAffiliateList = await dataApi.get(userOrgUnit.join(';'), programs.UINControlMaster, `filter=${attributes.countryRegistration}:in:${userOUCode.join(';')}`);
    const resDataStore = await dataApi.dataStore(`accuityResponse`);
    if (resDataStore.includes(attributes.id)) attributes.store = true;
    
    const affilitateAttrList = resAffiliateList.trackedEntities.map(trackedEntity => {
      const attributes = {
        id: trackedEntity.trackedEntity,
        orgUnit: trackedEntity.orgUnit,
      };
      trackedEntity.attributes.forEach(attr => attributes[attr.attribute] = attr.value);
      if(resDataStore.includes(attributes.id)) attributes['store'] = true;

      return attributes;
    })
    try {
      const availableAcuityData = affilitateAttrList.filter(list => list.store && list[attributes.acuityCheck]== "In Progress").map(list => dataApi.dataStore(`accuityResponse/${list.id}`).then(data => ({ ...list, status: "", data })));

      const affiliates = await Promise.all(availableAcuityData);
      
      affiliates.forEach(affiliate => {
        const checkAffiliate = {...dataElements};
        for(let data of affiliate.data) {
          if(data[data.id]) {
            if(data[data.id] == "No Records Found" || data[data.id] == "No Data Found in Source") {
              checkAffiliate[data.id] = true;
              continue;
            }
            const riskNames = ['Arms Trafficking & WMD', 'Terrorism', 'Money Laundering', 'Drug Trafficking', 'Fraud', 'Wanted Individuals', 'Global Sanction List', 'Associated Entity'];
            const hasRisk = riskNames.some(name => data[data.id].includes(`.${name}`));
            if(hasRisk) {
              affiliate.status = "Failed";
              break;
            } else checkAffiliate[data.id] = true;
          }
          else {
            affiliate.status = "";
            break;
          }
        }
        if(affiliate.status !='Failed') {
          const hasPassed = Object.values(checkAffiliate).every(val => val === true);
          if(hasPassed) affiliate.status = "Passed";
        }
        affiliates.forEach(affiliate => {
          if(affiliate.status == "Passed") affiliate[attributes.acuityCheck] = "Passed";
          if(affiliate.status == "Failed") affiliate[attributes.acuityCheck] = "Failed";
        });
      })

      const affiliatePayload = [];
      const affiliateStatus = {};
      affiliates.filter(affiliate => affiliate.status).forEach(affiliate => {
        affiliateStatus[affiliate.id] = affiliate.status;
        affiliatePayload.push({
          trackedEntity: affiliate.id,
          orgUnit: affiliate.orgUnit,
          trackedEntityType: trackedEntityType,
          attributes: [{
            attribute: attributes.acuityCheck,
            value: affiliate.status
          }]
        })
      })

      affilitateAttrList.forEach(affiliate=> {
        if(affiliateStatus[affiliate.id]) affiliate[attributes.acuityCheck] = affiliateStatus[affiliate.id];
      })
      
      if(affiliatePayload.length) await dataApi.update({trackedEntities: affiliatePayload});
    }
    catch(e) {
        console.log(e);
    }

    //filter affiliate list based on the status:
    const approvedList = affilitateAttrList.filter(trackedEntity => trackedEntity[attributes.acuityCheck]=="Passed" && !trackedEntity[attributes.submitted]);
    const failedList = affilitateAttrList.filter(trackedEntity => trackedEntity[attributes.acuityCheck]=="Failed");
    const inProgressList = affilitateAttrList.filter(trackedEntity => trackedEntity[attributes.acuityCheck]=="In Progress");

    document.getElementById('approvedCount').innerHTML = approvedList.length;
    document.getElementById('failedCount').innerHTML = failedList.length;
    document.getElementById('inProgressCount').innerHTML = inProgressList.length;  
  
    const headerList = programAffiliateKyc.programTrackedEntityAttributes
    .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
    .map(attr => ({id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name}));

    var theadAffiliateRow = "";
    headerList.forEach(item => theadAffiliateRow+= `<th class="py-3 px-4 font-weight-bold border-0 text-center" style="color: rgb(0, 49, 60)">${item.name}</th>`);
    
    document.getElementById('thead-affiliate-inProgress').innerHTML = theadAffiliateRow;
    document.getElementById('thead-affiliate-approved').innerHTML = `${theadAffiliateRow}<th class="py-3 px-4 font-weight-bold border-0 text-center" colspan="2">Actions</th>`;
    document.getElementById('thead-affiliate-failed').innerHTML = `${theadAffiliateRow}<th class="py-3 px-4 font-weight-bold border-0 text-center" colspan="2">Actions</th>`;
    
    var tbodyAffiliateRow = "";
    approvedList.forEach(affiliate => {
        const hasUIN = affiliate[attributes.uinCode];
        
      tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
      headerList.forEach(attr => {
        if(attr.id == attributes.acuityCheck) {
          tbodyAffiliateRow += `<td class="text-center" >
          ${(affiliate[attr.id] ? `<span style="background-color: #bbf7d0; color: #15803d; font-weight: 500; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem;">Approved</span>`: '')}
          </td>`
        }
        else tbodyAffiliateRow += `<td class="text-center" >${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`
      });
      tbodyAffiliateRow += `
      <td class="text-center">  
      <button 
        data-affiliate="${affiliate.id}-waiver" data-store="${affiliate.store}" 
        class="btn btn-sm row-btn" style="background-color: rgb(153, 27, 27); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 16px; transition: background-color 0.2s ease-in-out;"
        onmouseover="this.style.backgroundColor='#a2161b' "onmouseout="this.style.backgroundColor='rgb(153, 27, 27)'"
        > Generate Report
      </button>
      </td>
    <td class="text-center">
        <button 
        data-affiliate="${affiliate.id}" 
        data-region="${affiliate[attributes.region] || ''}"
        data-name="${affiliate[attributes.legalName] || ''}"
        data-uin="${affiliate[attributes.uinCode] || ''}"
        data-id="sync-uin"
        id="sync-uin-btn-${affiliate.id}"
        class="btn btn-sm row-btn open-popup-btn" 
        style="background-color: rgb(235, 51, 0); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 9px; white-space: nowrap;">
        Sync UIN
        </button>
   </td>
      </tr>`
    })
    
    const tbodyApproved = document.getElementById('tbody-affiliate-approved')
    tbodyApproved.innerHTML = tbodyAffiliateRow;
    tbodyApproved.addEventListener('click', async (e)=> {
      const button = e.target.closest('.row-btn');
      if(!button) return;
      const { id } = button.dataset;
      const affiliate = button.dataset.affiliate.split("-");
      const hasStore = button.dataset.store === "true";
      if (!hasStore) {
        console.log("hello ji");
        toast({status:"INFO", message:"Acuity data is not available.", position: "center"});
        return;
      }
      if(affiliate[1]=="waiver")  window.open(`../../../dhis-web-reports/index.html#/standard-report/view/W7AMqIhCqY6?affiliate=${affiliate[0]}`,'_blank');
      else if(affiliate[1]=="dueDiligence") window.location.href = `./1.2-1-due-diligence.html?affiliate=${affiliate[0]}`;

      if (id == "sync-uin") {
        const uinCode = button.getAttribute("data-uin");
         console.log("data-teiid:", button.getAttribute("data-teiid"));
    
        const selectedAffiliateData = {
          regionCode: button.getAttribute("data-region"),
          legalName: button.getAttribute("data-name"),
          uinCode: uinCode,
          teiUId: button.getAttribute("data-affiliate"),
        };

        const checkboxOptions = [
        { label: "Business Planning and Reporting Portal", api: "http://stage.hispindia.org:8000/orgunit-bpr" },
        { label: "IPPF DHIS2", api: "http://stage.hispindia.org:8000/orgunit-pro"},];

        const html = checkboxOptions.map((option, index) => `
        <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input dynamic-checkbox" id="checkbox-${index}" data-api="${option.api}">
        <label class="custom-control-label font-weight-bold fs-6" for="checkbox-${index}">
          ${option.label}
        </label>
       </div>
        ` ).join("");

        $("#checkboxContainer").html(html);
        $("#submitActions").prop("disabled", true);
        $("#actionModal").modal("show");

        $(document).off("change", ".dynamic-checkbox").on("change", ".dynamic-checkbox", function () {
        const checked = $(".dynamic-checkbox:checked").length;
        $("#submitActions").prop("disabled", checked === 0);
        });

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

          await fetch(api, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tei_uid: selectedAffiliateData.teiUId,
                uin_code: selectedAffiliateData.uinCode,
                legal_name: selectedAffiliateData.legalName,
                region_code: selectedAffiliateData.regionCode,
            }),
          })
        }
        toast({status: "SUCCESS", message: "UIN synced Successfully", position: "topCenter"});
        $("#actionModal").modal("hide");
    } catch (error) {
        toast({status: 'ERROR', message: "Something went wrong", position: "topCenter"})
    }
    })
      }
    })

    tbodyAffiliateRow = "";
    failedList.forEach(affiliate => {
      tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
      headerList.forEach(attr => {
        if(attr.id == attributes.acuityCheck) {
          tbodyAffiliateRow += `<td class="text-center" >
          ${(affiliate[attr.id] ? `<span style="background-color: rgb(254, 202, 202); color: rgb(153, 27, 27); font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem;">Failed</span>`: '')}
          </td>`
        }
        else tbodyAffiliateRow += `<td class="text-center" >${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`
      });
     
      tbodyAffiliateRow += `
      <td class="text-center">  
      <button 
        data-affiliate="${affiliate.id}-waiver" 
        class="btn btn-sm row-btn" style="background-color: rgb(153, 27, 27); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 16px; transition: background-color 0.2s ease-in-out;"
        onmouseover="this.style.backgroundColor='#a2161b' "onmouseout="this.style.backgroundColor='rgb(153, 27, 27)'"
        >
        Generate Report
      </button>
      </td>
      <td class="text-center">
      <button 
        data-affiliate="${affiliate.id}-form" 
        class="btn btn-sm row-btn" style="background-color: rgb(153, 27, 27); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 16px; transition: background-color 0.2s ease-in-out;"
        onmouseover="this.style.backgroundColor='#a2161b' "onmouseout="this.style.backgroundColor='rgb(153, 27, 27)'"
        ${userConfig.blockWaiver ? 'disabled' : ''}>Add Waiver
      </button>
      </td>
      </tr>`
    })
    const tbodyFailed = document.getElementById('tbody-affiliate-failed')
    tbodyFailed.innerHTML = tbodyAffiliateRow;
    tbodyFailed.addEventListener('click', async (e)=> {
      const button = e.target.closest('.row-btn');
      if(!button) return;
      const affiliate = button.dataset.affiliate.split("-");
      if(affiliate[1]=="waiver")  window.open(`../../../dhis-web-reports/index.html#/standard-report/view/W7AMqIhCqY6?affiliate=${affiliate[0]}`, '_blank');
      else if(affiliate[1]=="form") window.location.href = `./1.2-1-waiver-form.html?affiliate=${affiliate[0]}`;
    })



    tbodyAffiliateRow = "";
    inProgressList.forEach(affiliate => {
      tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
       headerList.forEach(attr => {
        if(attr.id == attributes.acuityCheck) {
          tbodyAffiliateRow += `<td class="text-center" >
          ${(affiliate[attr.id] ? `<span class="badge" style="background-color: #dce6fd; color: #3366cc; font-weight: 500; padding: 6px 12px; border-radius: 6px;">Under Review</span>`: '')}
          </td>`
        }
        else tbodyAffiliateRow += `<td class="text-center" >${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`
      });
      tbodyAffiliateRow += `</tr>`
    })
    document.getElementById('tbody-affiliate-inProgress').innerHTML = tbodyAffiliateRow;
  }
})