import { dataApi } from "../../api/DataApi.js";
import { optionSetApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { attributes, optionSet, programStage, programs, tei } from "../../constant.js";
import { toast } from "../utils.js";
import { configureRules, convert, fetchValueType, ruleCallback } from "../metadata.js";
import { getUserConfig } from "../config.js";

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
      toast({status: 'INFO', message: 'Affiliate Not found!'});
      return;
    }
  }

  const resRules = await programsApi.rules(programs.affiliateKyc);
  const resRuleVariables = await programsApi.ruleVariables(programs.affiliateKyc);
  const resOptionGroups = await optionSetApi.getOptionGroups();
  tei.programRules = configureRules(resRuleVariables.programRuleVariables, resRules.programRules, resOptionGroups.optionGroups);

  const resAffiliateStage = await programStageApi.get(programStage.affiliateKyc);
  const resDueDiligence = await programStageApi.get(programStage.dueDiligence);

  const affiliateStage = convert.stage({ programStage: resAffiliateStage, disabled: true });
  const dueDiligence = convert.stage({ programStage: resDueDiligence, disabled: true });    

  tei.fileType = new Set([...affiliateStage.fileType, ...dueDiligence.fileType]);

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

  tei.values = dataValues;
  tei.metadata = {...affiliateStage.metadata, ...dueDiligence.metadata};
  tei.programStages = [...affiliateStage.sections, ...dueDiligence.sections];

  ruleCallback(tei.programRules, tei.programStages, [], tei.metadata, tei.values);

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
  flatpickr(".flatpickr-date-input", { dateFormat: "Y-m-d" });
  }

    function renderSections(sections) {
    let container = "";

    for (const section of sections) {
        const elements = section.items.filter(item => !item.hidden)
        if(!elements.length) continue;
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
