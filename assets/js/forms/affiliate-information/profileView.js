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

  // --- Tab categorization helpers ---
  const affiliateKeywords = [
    'uin form', 'affiliate detail', 'board member', 'additional board',
    'senior management', 'additional senior', 'youth'
  ];
  const bankKeywords = [
    'bank detail', 'bank account', 'additional document', 'additional bank',
    'netsuite'
  ];
  const completionKeywords = ['completion checklist'];
  const affiliationKeywords = ['affiliation'];

  function categorizeSection(section) {
    const name = (section.name || '').toLowerCase();
    if (affiliationKeywords.some(k => name.includes(k))) return 'affiliation';
    if (completionKeywords.some(k => name.includes(k))) return 'completion';
    if (bankKeywords.some(k => name.includes(k))) return 'bank';
    return 'affiliate'; // default
  }

  // Separate UIN stage sections into tab buckets
  const affiliateStageSections = [];
  const bankStageSections = [];
  const affiliationStageSections = [];

  // Debug: log all section names for categorization verification
  console.log('--- UIN Stage Sections ---');
  uinStage.sections.forEach(section => console.log(`  UIN: "${section.name}" → ${categorizeSection(section)}`));
  console.log('--- Completion Checklist Sections ---');
  completionCheckList.sections.forEach(section => console.log(`  CL: "${section.name}" → ${categorizeSection(section)}`));
  console.log('--- Program Attribute Sections ---');
  programAttributes.sections.forEach(section => console.log(`  PA: "${section.name}"`));

  uinStage.sections.forEach(section => {
    const cat = categorizeSection(section);
    if (cat === 'bank') bankStageSections.push(section);
    else if (cat === 'affiliation') affiliationStageSections.push(section);
    else affiliateStageSections.push(section);
  });

  // Render into tab panels
  document.getElementById("basicInformation").innerHTML = renderSections(programAttributes.sections);

  // Also categorize completion checklist sections into tab buckets
  const completionBankSections = [];
  const completionAffiliationSections = [];
  const completionOnlySections = [];

  completionCheckList.sections.forEach(section => {
    const cat = categorizeSection(section);
    if (cat === 'bank') completionBankSections.push(section);
    else if (cat === 'affiliation') completionAffiliationSections.push(section);
    else completionOnlySections.push(section);
  });

  const renderTabContent = () => {
    document.getElementById("affiliateStage").innerHTML = renderSections(affiliateStageSections);
    document.getElementById("bankStage").innerHTML = renderSections([...bankStageSections, ...completionBankSections]);

    let completionHtml = '';
    if (hasWriteAccess) {
      completionHtml = renderSections(completionOnlySections);
    }
    document.getElementById("completionStage").innerHTML = completionHtml;

    document.getElementById("affiliationStage").innerHTML = renderSections(
      [...affiliationStageSections, ...completionAffiliationSections]
    );

    flatpickr(".flatpickr-date-input", { dateFormat: "Y-m-d" });
  };
  renderTabContent();

  // --- Tab switching logic ---
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.profile-tab-panel').forEach(p => {
        p.style.display = 'none';
        p.classList.remove('active');
      });
      this.classList.add('active');
      const target = document.getElementById(this.getAttribute('data-tab'));
      if (target) {
        target.style.display = 'block';
        target.classList.add('active');
      }
    });
  });

  // Listen for form changes across all tab panels
  document.querySelector('.profile-tab-content').addEventListener('change', function(e) {
    if (e.target.matches("input, select, textarea")) {
      tei.values[e.target.id] = e.target.value;
      const errorEl = document.getElementById(`error-${e.target.id}`);
      if (errorEl) errorEl.innerHTML = '';

      // Store completion checklist data elements for submit
      completionCheckList.sections.forEach(section => {
        section.items.forEach(item => {
          if (tei.values[item.code] !== undefined) {
            if (!tei.completionCheckListDEs) tei.completionCheckListDEs = [];
          }
        });
      });

      ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
      renderTabContent();
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