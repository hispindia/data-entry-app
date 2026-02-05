import { dataApi } from "../../api/DataApi.js";
import { meApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, programStage, programs, tei} from "../../constant.js";
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
    
    document.getElementById('thead-affiliate-approved').innerHTML = `${theadAffiliateRow}<th class="py-3 px-4 font-weight-bold border-0 text-center" colspan="3">Actions</th>`;
    
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
        data-id="view-uin"
        class="btn btn-sm row-btn" style="background-color: #15803d; color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 16px; transition: background-color 0.2s ease-in-out;"
        onmouseover="this.style.backgroundColor='#8FE0B8' "onmouseout="this.style.backgroundColor='#15803d'">
        View Details
      </button>
      </td>
      <td class="text-center">  
      <button 
        data-affiliate="${affiliate.id}" 
        data-id="generate-uin"
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
      const { id, affiliate } = button.dataset;
      if(id == "view-uin") window.location.href = `./1.3.1-generate-uin.html?affiliate=${affiliate}`;
      else if(id == "generate-uin") {
        const resAffiliate = await dataApi.getTrackedEntity(affiliate);
        tei.affiliate = resAffiliate.trackedEntities[0];

        const resAffiliateStage = await programStageApi.get(programStage.affiliateKyc);
        const resDueDiligence = await programStageApi.get(programStage.dueDiligence);

        const affiliateStage = convert.stage({ programStage: resAffiliateStage});
        const dueDiligence = convert.stage({ programStage: resDueDiligence});    

        tei.fileType = new Set([...affiliateStage.fileType, ...dueDiligence.fileType]);

        const dataValues = {};
        tei.affiliate.attributes.forEach(attr => dataValues[attr.attribute]=attr.value);
        tei.affiliate.enrollments.forEach(enroll => {
          enroll.events.forEach(event => {
            event.dataValues.forEach(dv => {
              if(tei.fileType.has(dv.dataElement)) dataValues[`${dv.dataElement}-event`] = event.event;
              dataValues[dv.dataElement]=dv.value
            });
          })
        });

        for(let id of tei.fileType) {
          if(dataValues[id]) {
            dataValues[`${id}-href`] = `../../events/files?eventUid=${dataValues[`${id}-event`]}&dataElementUid=${id}`
            dataValues[`${id}-file`] = await dataApi.getFile(dataValues[id]);
            const file = dataValues[`${id}-file`];
            try {
              const formData = new FormData();
              formData.append('file', file);
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
        if(tei.affiliate) {
          const countryRegistration = tei.affiliate.attributes.find(attr => attr.attribute == attributes.countryRegistration);
          const orgUnit = await orgUnitsApi.get({filter:countryRegistration.value});
          const nextNum = getNextCode(orgUnit.organisationUnits[0].children.filter(obj => obj.code !== undefined).map(obj => obj.code));
          const nextOUCode = `${orgUnit.organisationUnits[0].parent.code}-${orgUnit.organisationUnits[0].code}-${nextNum}`;
          const payloadOrgUnit = createPayload.orgUnit(orgUnit.organisationUnits[0].id, tei.affiliate.attributes, nextOUCode);
          const neworgUnit = await orgUnitsApi.post(payloadOrgUnit);
          if(neworgUnit.httpStatus == "OK" && neworgUnit.response.typeReports) {
            const orgUnitId = neworgUnit.response.typeReports[0].objectReports[0].uid;
            await programsApi.postOU({orgUnit:orgUnitId, program: programs.UINControlMaster});
            const payloadEvent =  createPayload.exchangeEvent(tei.affiliate, orgUnitId, programs.UINControlMaster);
            await dataApi.enroll(payloadEvent);
            toast({status: 'SUCCESS', message: `UIN Generated Successfully!\nUIN No: ${nextOUCode}`});
          }
        }
      }
    })
  }
})