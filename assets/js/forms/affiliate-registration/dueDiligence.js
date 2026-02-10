import { dataApi } from "../../api/DataApi.js";
import { optionSetApi, programStageApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, dataElements, optionSet, programStage, programs, tei, trackedEntityType } from "../../constant.js";
import { convert, fetchValueType } from "../metadata.js";
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
  
  if(userConfig?.user?.includes('aoc')){
    document.getElementById("submitBtn").classList.remove('d-none');
    document.getElementById('submit').addEventListener('click', async function() { 
    if(tei.affiliate) {
      if(tei.mandatoryList) {
        let empty = false;
        for(const id of tei.mandatoryList) {
          const mandatoryError = document.querySelector(`#error-${id}`);
          if(!tei.values[id]) {
            empty = true;
            mandatoryError.innerHTML = "This field is required";
            mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
            mandatoryError.focus({ preventScroll: true });
            }
            if(tei.metadata[id].valueType === 'EMAIL' && !isGmailOrYahoo(tei.values[id])){
              empty = true;
              mandatoryError.innerHTML = "Only valid email addresses are allowed.";
              mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
              mandatoryError.focus({ preventScroll: true });
            }
            else mandatoryError.innerHTML = "";
          }
          if(empty) {
            toast({status: 'INFO', message: 'Please fill mandatory fields!'});
            return;
          }
      }

      const completionChecklistSection = tei.programStages.find(s => s.name === 'Completion Checklist');
      if (completionChecklistSection) {
        for (const item of completionChecklistSection.items) {
          if (item.valueType === 'BOOLEAN') {
            if (tei.values[item.code] !== 'true') {
              toast({ status: 'INFO', message: 'Please ensure all items in the Completion Checklist are "Yes" to submit.' });
              return;
            }
          }
        }
      }
      
      const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.orgUnit;
      const enrollment = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.enrollment;
       
      if(!orgUnitId || !enrollment) return;
      tei.values[dataElements.submitKYC] = true;

      const fileInputs = document.querySelectorAll(".file-upload");
      for(const input of fileInputs) {
        const file = tei.values[input.id];
        if (!file || typeof file === "string")  continue;
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await dataApi.uploadFile(formData);
          if(res.status == 'OK') {
          tei.values[input.id] = res.response.fileResource.id;
          } else {
          toast({status: 'ERROR', message: `File generation error`});
          }
        } catch (error) {
          toast({status: 'ERROR', message: `Error uploading file: ${error}`});
          return;
        }
      }
      
      await dataApi.postAttribute({trackedEntities: [{
        trackedEntity: tei.affiliate.trackedEntity,
        orgUnit: tei.affiliate.orgUnit,
        trackedEntityType: trackedEntityType,
        attributes: [{attribute: attributes.submitted, value: true}]
        }]
      })

      const payloadDueDiligence = createPayload.event(tei, orgUnitId, enrollment, programs.affiliateKyc, programStage.dueDiligence);
      await dataApi.enroll(payloadDueDiligence);
      toast({status: 'SUCCESS', message: 'Checklist submitted Successfully.'});
      window.location.href = './1.2-eligibility-check-and-manage-waivers.html'
    }
  })
  }

  document.getElementById("dueDiligence").addEventListener('change', function(e) {
    if (e.target.matches("input, select, textarea")) {
      tei.values[e.target.id] = e.target.value;
      document.getElementById(`error-${e.target.id}`).innerHTML = '';
    }
  });

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
      toast({status: 'INFO', message: 'Affiliate Not found'});
      return;
    }
  }

  const resAffiliateStage = await programStageApi.get(programStage.affiliateKyc);
  const resDueDiligence = await programStageApi.get(programStage.dueDiligence);

  const affiliateStage = convert.stage({ programStage: resAffiliateStage, disabled: true });
  const dueDiligence = convert.stage({ programStage: resDueDiligence });

  tei.fileType = new Set(affiliateStage.fileType);

  const dataValues = {};
  tei.affiliate.attributes.forEach(attr => dataValues[attr.attribute]=attr.value);
  tei.affiliate.enrollments.forEach(enroll => {
    enroll.events.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
    enroll.events.forEach(event => {
      event.dataValues.forEach(dv => {
        if (tei.fileType.has(dv.dataElement) && !dataValues.hasOwnProperty(`${dv.dataElement}-event`)) {
          dataValues[`${dv.dataElement}-event`] = event.event;
        }
        if (!dataValues.hasOwnProperty(dv.dataElement)) {
          dataValues[dv.dataElement] = dv.value;
        }
      });
    });
  });

  for(let id of tei.fileType) {
    if(dataValues[id]) {
      dataValues[`${id}-href`] = `../../events/files?eventUid=${dataValues[`${id}-event`]}&dataElementUid=${id}`
      dataValues[`${id}-file`] = await dataApi.getFile(dataValues[id]);
    }
  }

  const countryNameAndCodes = {};
  const country = await optionSetApi.get(optionSet.country);
  if(country.options){
    country.options.forEach(opt => {
      countryNameAndCodes[opt.value] = opt.label;
    })
  }
  document.getElementById('country').innerHTML = countryNameAndCodes[dataValues[attributes.countryRegistration]] ? `(${countryNameAndCodes[dataValues[attributes.countryRegistration]]})`  : ''
  
  tei.programStages = dueDiligence.sections;
  tei.dataElements = dueDiligence.dataElements;
  tei.metadata = dueDiligence.metadata;
  tei.mandatoryList = dueDiligence.mandatoryList;
  tei.values = {...dueDiligence.values, ...dataValues};
  tei.values[dataElements.affiliationStatus] = 'Active';
    
  const dueDiligenceDiv = renderSections(dueDiligence.sections);
  const affiliateKYCDiv = renderSections(affiliateStage.sections);

  document.getElementById("dueDiligence").innerHTML = `${affiliateKYCDiv} 
  ${dueDiligenceDiv}`
  flatpickr(".flatpickr-date-input", { dateFormat: "Y-m-d" });
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
                ${fetchValueType({id: el.code, valueType: el.valueType, valueSet: el.valueSet}, (tei?.values[el.code] || ""), {href:(tei?.values[`${el.code}-href`] || ""), file: (tei?.values[`${el.code}-file`] || "")}, el.disabled)}
                <div id="error-${el.code}" style="color: red"></div>
            `;
            rowDiv.appendChild(fieldWrapper);
        }
        container += sectionDiv.outerHTML;
    }
    return container;
    }
})
