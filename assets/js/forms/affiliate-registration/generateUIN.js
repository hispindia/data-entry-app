import { dataApi } from "../../api/DataApi.js";
import { optionSetApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, optionSet, programStage, programs, tei } from "../../constant.js";
import { getNextCode } from "../func.js";
import { convert, fetchValueType } from "../metadata.js";
import { applyAccessControl } from "../accessControl.js";

document.addEventListener("DOMContentLoaded", function () {
  applyAccessControl();
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault(); 
      var targetPage = event.currentTarget.getAttribute("data-target") || event.currentTarget.parentElement.getAttribute("data-target");
      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });

  document.getElementById('generateUIN').addEventListener('click', async function() { 
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
          iziToast.info({
            message: `UIN Generated Successfully!\nUIN No: ${nextOUCode}`,
            timeout: 1500
          })
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
    }
    catch(err) {
      iziToast.info({
        message: "Affiliate Not found",
        timeout: 1500,
      })
      return;
    }
  }

  const resAffiliateStage = await programStageApi.get(programStage.affiliateKyc);
  const resDueDiligence = await programStageApi.get(programStage.dueDiligence);

  const affiliateStage = convert.stage({ programStage: resAffiliateStage, disabled: true });
  const dueDiligence = convert.stage({ programStage: resDueDiligence, disabled: true });    

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
      dataValues[`${id}-href`] = `../../events/files?eventUid=${dataValues[`${id}-event`]}&dataElementUid=${dataValues[id]}`
      dataValues[id] = await dataApi.getFile(dataValues[id]);
    }
  }

  tei.values = dataValues;

  const countryNameAndCodes = {};
  const country = await optionSetApi.get(optionSet.country);
  if(country.options){
    country.options.forEach(opt => {
      countryNameAndCodes[opt.value] = opt.label;
    })
  }
  document.getElementById('country').innerHTML = countryNameAndCodes[dataValues[attributes.countryRegistration]] ? `(${countryNameAndCodes[dataValues[attributes.countryRegistration]]})`  : ''

  const dueDiligenceDiv = renderSections(dueDiligence.sections);
  const affiliateKYCDiv = renderSections(affiliateStage.sections);

  document.getElementById("dueDiligence").innerHTML = `${affiliateKYCDiv}${dueDiligenceDiv}`
  }

    function renderSections(sections) {
    let container = "";

    for (const section of sections) {
        if(section.hidden) continue;
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "card mb-4 p-3";
        sectionDiv.style.backgroundColor = "white";
        sectionDiv.style.borderRadius = "8px";
        sectionDiv.innerHTML = `<h5 style="color:#3b71ca;font-weight:bold;">${section.name}</h5>`;
   
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        sectionDiv.appendChild(rowDiv);

        for (const el of section.items) {
            if(el.hidden) continue;
            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "form-group col-md-4 mb-2";

            fieldWrapper.innerHTML = `
                <label>
                    ${el.name}
                    ${el.mandatory ? '<span class="text-danger">*</span>' : ''}
                </label>
                ${fetchValueType({id: el.code, valueType: el.valueType, valueSet: el.valueSet}, (tei?.values[el.code] || ""), (tei?.values[`${el.code}-href`] || ""), el.disabled)}
                <div id="error-${el.code}" style="color: red"></div>
            `;
            rowDiv.appendChild(fieldWrapper);
        }
        container += sectionDiv.outerHTML;
    }
    return container;
    }
})
