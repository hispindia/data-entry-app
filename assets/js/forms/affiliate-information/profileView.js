import { dataApi } from "../../api/DataApi.js"
import { optionSetApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, optionSet, programStage, programs, tei } from "../../constant.js";
import { convert, fetchValueType, configureRules, ruleCallback } from "../metadata.js";
import { getUserConfig } from "../config.js";
import { getNextCode } from "../utils.js";

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

  document.getElementById('generateUIN').addEventListener('click', async function() { 
    if(tei.affiliate) {
        const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program == programs.UINControlMaster)?.orgUnit;
        const enrollment = tei.affiliate.enrollments.find(enroll => enroll.program == programs.UINControlMaster)?.enrollment;
        if(!orgUnitId || !enrollment) return;
        
        tei.dataElements = tei.completionCheckListDEs;
        const payloadCompletionCheckList = createPayload.event({tei, orgUnit: orgUnitId, enrollment, program: programs.UINControlMaster, programStage: programStage.completionCheckList});
        await dataApi.enroll(payloadCompletionCheckList);
        iziToast.success({
            status: 'SUCCESS',
            message: "Details Submitted Successfully",
            position: "center",
        });
          window.location.href = './2.1-view-and-update-profile.html';
        }
    });

  fetchAffiliateList();
  async function fetchAffiliateList() {
  tei.mandatoryList = []
  const params = new URLSearchParams(window.location.search);
  const affiliate = params.get('affiliate');
  const userConfig = await getUserConfig();
  const hasWriteAccess = !userConfig?.hideSideBar?.includes('generate-and-approve');

  if (!hasWriteAccess) {
    document.querySelectorAll('.generate-and-approve').forEach(el => el.style.display = 'none');
  }

  if(affiliate) {
    try {
    const resAffiliate = await dataApi.getTrackedEntity(affiliate);
    
    if (!resAffiliate.trackedEntities) {
      const errorBody = await resAffiliate.json();
      throw new Error(errorBody.message || 'Request failed');
    }

    tei.affiliate = resAffiliate.trackedEntities[0];
    if(hasWriteAccess) {
      document.getElementById('generateUIN').disabled = false;
    } else {
      document.getElementById('generateUIN').style.display = 'none';
    }
    }
    catch(err) {
      iziToast.info({
        message: "Affiliate Not found",
        timeout: 1500,
      })
      return;
    }
  }

  const dataValues = {};
  tei.affiliate.attributes.forEach(attr => dataValues[attr.attribute]=attr.value);
  tei.affiliate.enrollments.forEach(enroll => {
    enroll.events.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
    enroll.events.forEach(event => {
      event.dataValues.forEach(dv => {
        if (!dataValues.hasOwnProperty(dv.dataElement)) {
          dataValues[dv.dataElement] = dv.value;
        }
      });
    });
  });
  const countryNameAndCodes = {};
  const country = await optionSetApi.get(optionSet.country);
  if(country.options){
    country.options.forEach(opt => {
      countryNameAndCodes[opt.value] = opt.label;
    })
  }
  document.getElementById('country').innerHTML = countryNameAndCodes[dataValues[attributes.countryRegistration]] ? `(${countryNameAndCodes[dataValues[attributes.countryRegistration]]})`  : ''

  const resRules = await programsApi.rules(programs.UINControlMaster);
  const resRuleVariables = await programsApi.ruleVariables(programs.UINControlMaster);
  const resOptionGroups = await optionSetApi.getOptionGroups();
  tei.programRules = configureRules(resRuleVariables.programRuleVariables, resRules.programRules, resOptionGroups.optionGroups);

  const programMetadata = await programsApi.get(programs.UINControlMaster);
  const programAttributes = convert.attributes({ program: programMetadata, disabled: true });
  
  const resUINControlStage = await programStageApi.get(programStage.UINControlMaster);
  const resCompletionCheckList = await programStageApi.get(programStage.completionCheckList);

  const uinStage = convert.stage({ programStage: resUINControlStage, disabled: true });
  const completionCheckList = convert.stage({ programStage: resCompletionCheckList, disabled: true});
  //saving for later use
  tei.completionCheckListDEs = completionCheckList.dataElements;
  completionCheckList.sections.forEach(section => {
    section.items.forEach(element => {
      if(element.name === "Affiliation Type" || element.name === "Affiliation Status") {
          element.disabled = false;
      }
    })
  })
  
  tei.programStages = [...programAttributes.sections, ...uinStage.sections, ...completionCheckList.sections];
  tei.values = {...programAttributes.values, ...uinStage.values, ...completionCheckList.values, ...dataValues};
  tei.metadata = {...programAttributes.metadata, ...uinStage.metadata, ...completionCheckList.metadata};
  tei.mandatoryList = [...programAttributes.mandatoryList, ...uinStage.mandatoryList, ...completionCheckList.mandatoryList];

  ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);

  document.getElementById("basicInformation").innerHTML = renderSections(programAttributes.sections);
  
  const renderDueDiligence = () => {
      const completionCheckListDiv = renderSections(completionCheckList.sections);
      const uinStageDiv = renderSections(uinStage.sections);
      let dueDiligenceHtml = `${uinStageDiv}`;
      if(hasWriteAccess) {
        dueDiligenceHtml += `${completionCheckListDiv}`
      }
      document.getElementById("dueDiligence").innerHTML = dueDiligenceHtml;
      flatpickr(".flatpickr-date-input", { dateFormat: "Y-m-d" });
  }
  renderDueDiligence();

  document.getElementById("dueDiligence").addEventListener('change', function(e) {
      if (e.target.matches("input, select, textarea")) {
          tei.values[e.target.id] = e.target.value;
          document.getElementById(`error-${e.target.id}`).innerHTML = '';
          ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
          renderDueDiligence();
        }
  });
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
                ${fetchValueType({id: el.code, valueType: el.valueType, valueSet: el.valueSet}, (tei?.values[el.code] || ""), {}, el.disabled)}
                <div id="error-${el.code}" style="color: red"></div>
            `;
            rowDiv.appendChild(fieldWrapper);
        }
        container += sectionDiv.outerHTML;
    }
    return container;
    }
})