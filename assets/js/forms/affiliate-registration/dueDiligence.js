import { dataApi } from "../../api/DataApi.js";
import { meApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload, pushPayloadInDhis2 } from "../../api/payload.js";
import { attributes, programStage, programs, tei } from "../../constant.js";
import { fetchValueType } from "./valueType.js";

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

  document.getElementById('generateUIN').addEventListener('click', async function() { 
    if(tei.affiliate) {
        const orgUnit = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.orgUnit;
        const enrollment = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.enrollment;
        if(!orgUnit || !enrollment) return;
        
        const payloadDueDiligence = createPayload.event(tei, orgUnit, enrollment, tei.affiliate.trackedEntity, programs.affiliateKyc, programStage.dueDiligence);
        await dataApi.enroll(payloadDueDiligence);
        // const payloadOrgUnit = createPayload.orgUnit(tei.orgUnits, availableAffiliate.attributes);
        // const neworgUnit = await orgUnitsApi.post(payloadOrgUnit);
        // if(neworgUnit.httpStatus == "OK" && neworgUnit.response.typeReports) {
        //   const orgUnitId = neworgUnit.response.typeReports[0].objectReports[0].uid;
        //   await programsApi.postOU({orgUnit:orgUnitId, program: programs.UINControlMaster})
        //   const payloadEvent =  createPayload.modifyEvent(availableAffiliate, orgUnitId, programs.UINControlMaster, programStage.UINControlMaster, programStage.affiliateKyc);
        //   await dataApi.enroll(payloadEvent);
        //   alert("Affiliate created successfully")
        // }
    }
  })

  fetchAffiliateList();
  async function fetchAffiliateList() {
  const params = new URLSearchParams(window.location.search);
  const affiliate = params.get('affiliate');
  if(affiliate) {
    try {
    const resAffiliate = await dataApi.getTrackedEntity(affiliate);
    
    if (!resAffiliate.trackedEntities) {
      const errorBody = await resAffiliate.json();
      throw new Error(errorBody.message || 'Request failed');
    }

    tei.affiliate = resAffiliate.trackedEntities[0];
    document.getElementById('generateUIN').disabled = false;
    }
    catch(err) {
      console.log('no affiliate found')
      alert('No affiliate found!', err)
      return;
    }
  }

  const dueDiligence = await programStageApi.get(programStage.dueDiligence);

    let compulsoryDataElements = {};
    if(dueDiligence.programStageDataElements){
        dueDiligence.programStageDataElements.forEach(element => {
          compulsoryDataElements[element.dataElement.id] = element.compulsory;
        })
    }
    document.getElementById("dueDiligence").innerHTML = renderSections(dueDiligence.programStageSections, compulsoryDataElements);
  }
})

  function renderSections(sections, compulsoryDataElements) {
    let container = "";

    for (const section of sections) {

        const sectionDiv = document.createElement("div");
        sectionDiv.className = "card mb-4 p-3";
        sectionDiv.style.backgroundColor = "white";
        sectionDiv.style.borderRadius = "8px";
        sectionDiv.innerHTML = `<h5 style="color:#3b71ca;font-weight:bold;">${section.name}</h5>`;
   
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        sectionDiv.appendChild(rowDiv);

        for (const el of section.dataElements) {

            if (el?.id) tei.programStage.push(el.id);

            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "form-group col-12 col-md-4 mb-2";

            const mandatoryFields = compulsoryDataElements[el.id] ? '<span class="text-danger">*</span>' : '';
            fieldWrapper.innerHTML = `
                <label>${el.formName}${mandatoryFields}</label>
                ${fetchValueType(el.valueType, el.optionSetValue, el.optionSet?.options, el?.id)}
            `;

            rowDiv.appendChild(fieldWrapper);
        }

        container += sectionDiv.outerHTML;
    }

    return container;
  }