import { dataApi } from "../../api/DataApi.js";
import { meApi, optionSetApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload, pushPayloadInDhis2 } from "../../api/payload.js";
import { attributes, dataElements, optionSet, programStage, programs, tei } from "../../constant.js";
import { getNextCode } from "../func.js";
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
     if(tei.mandatoryList) {
            let empty = false;
            for(const id of tei.mandatoryList) {
                const value = document.getElementById(id).value;
                const mandatoryError = document.querySelector(`#error-${id}`);
                if(!value) {
                    empty = true;
                    if(mandatoryError) {
                        mandatoryError.innerHTML = "This field is required";
                        mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
                        mandatoryError.focus({ preventScroll: true });
                    }

                } else {
                    mandatoryError.innerHTML = "";
               }
            }
            if(empty) {
                alert('Please fill mandatory fields!');
                return;
            }
        }
    if(tei.affiliate) {
        const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.orgUnit;
        const enrollment = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.enrollment;
        const countryRegistration = tei.affiliate.attributes.find(attr => attr.attribute == attributes.countryRegistration);
        if(!orgUnitId || !enrollment) return;
        // debugger;
        // await dataApi.postAttribute({
        // })
        const payloadDueDiligence = createPayload.event(tei, orgUnitId, enrollment, tei.affiliate.trackedEntity, programs.affiliateKyc, programStage.dueDiligence);
        await dataApi.enroll(payloadDueDiligence);
        const orgUnit = await orgUnitsApi.get({filter:countryRegistration.value});
        const nextNum = getNextCode(orgUnit.organisationUnits[0].children.filter(obj => obj.code !== undefined).map(obj => obj.code));
        const nextOUCode = `${orgUnit.organisationUnits[0].parent.code}-${orgUnit.organisationUnits[0].code}-${nextNum}`;
        const payloadOrgUnit = createPayload.orgUnit(orgUnit.organisationUnits[0].id, tei.affiliate.attributes, nextOUCode);
        const neworgUnit = await orgUnitsApi.post(payloadOrgUnit);
        if(neworgUnit.httpStatus == "OK" && neworgUnit.response.typeReports) {
          const orgUnitId = neworgUnit.response.typeReports[0].objectReports[0].uid;
          await programsApi.postOU({orgUnit:orgUnitId, program: programs.UINControlMaster})
          const payloadEvent =  createPayload.modifyEvent(tei.affiliate, orgUnitId, programs.UINControlMaster, programStage.UINControlMaster, programStage.affiliateKyc);
          await dataApi.enroll(payloadEvent);
          alert(`UIN Generated Successfully!\nUIN No: ${nextOUCode}`);
          window.location.href = './1.2-eligibility-check-and-manage-waivers.html'
        }
    }
  })

  fetchAffiliateList();
  async function fetchAffiliateList() {
    tei.mandatoryList = []
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

  const dataValues = {};
  tei.affiliate.attributes.forEach(attr => dataValues[attr.attribute]=attr.value);
  tei.affiliate.enrollments.forEach(enroll => {
    enroll.events.forEach(event => {
      event.dataValues.forEach(dv =>dataValues[dv.dataElement]=dv.value);
    })
  });
  const countryNameAndCodes = {};
  const country = await optionSetApi.get(optionSet.country);
  if(country.options){
    country.options.forEach(opt => {
      countryNameAndCodes[opt.code] = `(${opt.name})`;
    })
  }
  document.getElementById('country').innerHTML = countryNameAndCodes[dataValues[attributes.countryRegistration]] ? countryNameAndCodes[dataValues[attributes.countryRegistration]]  : ''

  const affilateStage = await programStageApi.get(programStage.affiliateKyc);
  const dueDiligence = await programStageApi.get(programStage.dueDiligence);

    let compulsoryDataElements = {};
    if(dueDiligence.programStageDataElements){
        dueDiligence.programStageDataElements.forEach(element => {
          compulsoryDataElements[element.dataElement.id] = element.compulsory;
        })
    }
    dataElements.affiliateKYCOther.forEach(section => {
      section.dataElements.forEach(element => {
          compulsoryDataElements[element.id] = element.compulsory;
        })
    })
    for(let element in compulsoryDataElements)   {
      if(compulsoryDataElements[element]) tei.mandatoryList.push(element);
    }

    tei.programStage = dueDiligence.programStageDataElements.flatMap(element => element.dataElement.id);
    const dueDiligenceDiv = renderSections(dueDiligence.programStageSections, compulsoryDataElements, false);
    const affiliateKYCDiv = renderSections(affilateStage.programStageSections, {}, dataValues, true);
    const affiliateOtherDiv = renderSections(dataElements.affiliateKYCOther, compulsoryDataElements, false);
    document.getElementById("dueDiligence").innerHTML = `${affiliateKYCDiv} 
    <h4 class="mt-3" style="color: black;">Due Dilligence</h4>
    ${dueDiligenceDiv}
    ${affiliateOtherDiv}`
  }
})

  function renderSections(sections, compulsoryDataElements, dataValues, disabled) {
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

            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "form-group col-12 col-md-4 mb-2";

            const mandatoryFields = compulsoryDataElements[el.id] ? '<span class="text-danger">*</span>' : '';
            fieldWrapper.innerHTML = `
                <label>${el.formName}${mandatoryFields}</label>
                ${fetchValueType({valueType: el.valueType,optionSetValue: el.optionSetValue, optionSet: el.optionSet?.options, id: el?.id, value:(dataValues[el.id]?dataValues[el.id]:''), disabled: disabled})}
                <div id="error-${el.id}" style="color: red"></div>
            `;

            rowDiv.appendChild(fieldWrapper);
        }

        container += sectionDiv.outerHTML;
    }

    return container;
  }