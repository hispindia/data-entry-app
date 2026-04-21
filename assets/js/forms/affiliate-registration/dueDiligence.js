import { dataApi } from "../../api/DataApi.js";
import { optionSetApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, dataElements, optionSet, programStage, programs, tei, trackedEntityType } from "../../constant.js";
import { configureRules, convert, fetchValueType, ruleCallback } from "../metadata.js";
import { getUserConfig } from "../config.js";
import { toast } from "../utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const profileTabs = document.querySelectorAll('.profile-tab');
  const profilePanels = document.querySelectorAll('.profile-tab-panel');

  const tabButtonConfig = {
    'tab-affiliate': {
      next: true,
      submit: false
    },
    'tab-bank': {
      next: true,
      submit: true
    },
    'tab-completion': {
      next: true,
      submit: true
    },
    'tab-affiliation': {
      next: false,
      submit: true
    },
  }
  
  const userConfig = await getUserConfig();
  if (userConfig) {
      userConfig.user.forEach(user => {
        $(`.${user}`).each(function() {
          this.style.setProperty('display', 'none', 'important');
        });
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
  
  // if(userConfig?.user?.includes('aoc')){
  //   document.getElementById("submitBtn").classList.remove('d-none');
  //   document.getElementById('submit').addEventListener('click', async function() { 
  //   if(tei.affiliate) {
  //     if(tei.mandatoryList) {
  //       let empty = false;
  //       for(const id of tei.mandatoryList) {
  //         const mandatoryError = document.querySelector(`#error-${id}`);
  //         if(!tei.values[id]) {
  //           empty = true;
  //           mandatoryError.innerHTML = "This field is required";
  //           mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
  //           mandatoryError.focus({ preventScroll: true });
  //         }
  //         else if(tei.metadata[id].valueType === 'EMAIL' && !isGmailOrYahoo(tei.values[id])){
  //             empty = true;
  //             mandatoryError.innerHTML = "Only valid email addresses are allowed.";
  //             mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
  //             mandatoryError.focus({ preventScroll: true });
  //         }
  //         else mandatoryError.innerHTML = "";

  //       }
  //       if(empty) {
  //         toast({status: 'INFO', message: 'Please fill mandatory fields!', position: 'center'});
  //         return;
  //       }
  //     }

  //     const completionChecklistSection = tei.programStages.find(s => s.name === 'Completion Checklist');
  //     if (completionChecklistSection) {
  //       for (const item of completionChecklistSection.items) {
  //         if (item.valueType === 'BOOLEAN') {
  //           if (tei.values[item.code] !== 'true') {
  //             toast({ status: 'INFO', message: 'Please ensure all items in the Completion Checklist are "Yes" to submit.' });
  //             return;
  //           }
  //         }
  //       }
  //     }
      
  //     const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.orgUnit;
  //     const enrollment = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.enrollment;
       
  //     if(!orgUnitId || !enrollment) return;
  //     tei.values[dataElements.submitKYC] = true;

  //     const fileInputs = document.querySelectorAll(".file-upload");
  //     for(const input of fileInputs) {
  //       const file = tei.values[input.id];
  //       if (!file || typeof file === "string")  continue;
  //       try {
  //         const formData = new FormData();
  //         formData.append('file', file);
  //         const res = await dataApi.uploadFile(formData);
  //         if(res.status == 'OK') {
  //         tei.values[input.id] = res.response.fileResource.id;
  //         } else {
  //         toast({status: 'ERROR', message: `File generation error`});
  //         }
  //       } catch (error) {
  //         toast({status: 'ERROR', message: `Error uploading file: ${error}`});
  //         return;
  //       }
  //     }
      
  //     await dataApi.postAttribute({trackedEntities: [{
  //       trackedEntity: tei.affiliate.trackedEntity,
  //       orgUnit: tei.affiliate.orgUnit,
  //       trackedEntityType: trackedEntityType,
  //       attributes: [{attribute: attributes.submitted, value: true}]
  //       }]
  //     })

  //     const payloadDueDiligence = createPayload.event({tei, orgUnit: orgUnitId, enrollment, program: programs.affiliateKyc, programStage: programStage.dueDiligence, status: "COMPLETED"});
  //     await dataApi.enroll(payloadDueDiligence);
  //     toast({status: 'SUCCESS', message: 'Checklist submitted Successfully.'});
  //     window.location.href = './1.2-eligibility-check-and-manage-waivers.html'
  //   }
  // })
  // }


  fetchAffiliateList();
  async function fetchAffiliateList() {
  tei.mandatoryList = [];
  tei.disabled = false;
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
      const generateBtn = document.getElementById('submit');
      if (generateBtn) generateBtn.disabled = false;
    } else {
      const generateBtn = document.getElementById('submit');
      if (generateBtn) generateBtn.disabled = false;
    }
    }
    catch(err) {
      toast({status: 'INFO', message: 'Affiliate Not found'});
      return;
    }
  }

  if(tei.affiliate) {
    tei.affiliate.enrollments.forEach(enroll => {
      enroll.events.forEach(event => {
        if(event.programStage == programStage.dueDiligence && event.status == "COMPLETED") {
          tei.disabled = true;
        }
      })
    })
  }

  if(tei.disabled) document.getElementById('submit').disabled = true;

  const resRules = await programsApi.rules(programs.affiliateKyc);
  const resRuleVariables = await programsApi.ruleVariables(programs.affiliateKyc);
  const resOptionGroups = await optionSetApi.getOptionGroups();
  tei.programRules = configureRules(resRuleVariables.programRuleVariables, resRules.programRules, resOptionGroups.optionGroups);

  const programMetadata = await programsApi.get(programs.affiliateKyc);
  const programAttributes = convert.attributes({ program: programMetadata, disabled: true });
  
  const resAffiliateStage = await programStageApi.get(programStage.affiliateKyc);
  const resDueDiligence = await programStageApi.get(programStage.dueDiligence);

  const affiliateStage = convert.stage({ programStage: resAffiliateStage, disabled: true });
  const dueDiligence = convert.stage({ programStage: resDueDiligence, disabled: tei.disabled});

  tei.fileType = new Set(affiliateStage.fileType);

  const dataValues = {};
  tei.affiliate.attributes.forEach(attr => dataValues[attr.attribute]=attr.value);
  tei.affiliate.enrollments.forEach(enroll => {
    enroll.events.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
    enroll.events.forEach(event => {
    const sortedEvents = [...enroll.events]
    .sort((a, b) => new Date(a.occurredAt) - new Date(b.occurredAt));

    sortedEvents.forEach(event => {
      event.dataValues?.forEach(dv => {
        dataValues[dv.dataElement] = dv.value;
        
        if (tei.fileType.has(dv.dataElement)) {
          dataValues[`${dv.dataElement}-event`] = event.event;
        }
      })
    })
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
  
  tei.dueDiligenceDEs = dueDiligence.dataElements;
  tei.affiliateStageDataElements = affiliateStage;
  tei.programStages =  [...programAttributes.sections, ...affiliateStage.sections, ...dueDiligence.sections];
  tei.values = {...programAttributes.values, ...affiliateStage.values, ...dueDiligence.values, ...dataValues};
  tei.dataElements = dueDiligence.dataElements;
  tei.metadata = {...programAttributes.metadata, ...dueDiligence.metadata, ...affiliateStage.metadata};
  tei.mandatoryList = [...programAttributes.mandatoryList, ...affiliateStage.mandatoryList, ...dueDiligence.mandatoryList];
  tei.values = {...dueDiligence.values, ...dataValues};
  tei.values[dataElements.affiliationStatus] = 'Active';

  dueDiligence.sections.forEach(section => {
    section.items.forEach(element => {
      if(element.name === "Affiliation Type" || !tei.values[element.code]) {
          element.disabled = false;
      }
    })
  })
  ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);

  // ruleCallback(tei.programRules, [...dueDiligence.sections, ...affiliateStage.sections], tei.mandatoryList, tei.metadata, tei.values);
    
  const dueDiligenceDiv = renderSections(dueDiligence.sections);
  const affiliateKYCDiv = renderSections(affiliateStage.sections);
  flatpickr(".flatpickr-date-input", { dateFormat: "Y-m-d" });

   // --- Tab categorization helpers ---
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

  affiliateStage.sections.forEach(section => {
    const cat = categorizeSection(section);
    if (cat === 'bank') bankStageSections.push(section);
    else if (cat === 'affiliation') affiliationStageSections.push(section);
    else affiliateStageSections.push(section);
  });
  
  // Render into tab panels
  document.getElementById("basicInformation").innerHTML = renderSections(programAttributes.sections);
  const completionBankSections = [];
  const completionAffiliationSections = [];
  const completionOnlySections = [];

   dueDiligence.sections.forEach(section => {
    const cat = categorizeSection(section);
    if (cat === 'bank') completionBankSections.push(section);
    else if (cat === 'affiliation') completionAffiliationSections.push(section);
    else completionOnlySections.push(section);
  });
  
  [...bankStageSections, ...completionBankSections].forEach(section => {
    section.items.forEach(element => {
      if(!tei.values[element.code] || tei.values[element.code] === '') {
        element.disabled = false;
      }
    })
  })
  completionOnlySections.forEach(section => {
  section.items.forEach(element => {
    if (tei.values[element.code] && tei.values[element.code] !== '')  element.disabled = true;  
  });
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

  document.querySelector("#tab-bank").addEventListener('change', function(e) {
    if (e.target.matches("input, select, textarea")) {
      let value = e.target.type === 'checkbox' ? (e.target.checked ? 'true' : 'false') : e.target.value;
      tei.values[e.target.id] = value;
      let errorEl = document.getElementById(`error-${e.target.id}`);
      if (errorEl) errorEl.innerHTML = '';
      ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
      document.getElementById("bankStage").innerHTML = renderSections([...bankStageSections, ...completionBankSections]);
      flatpickr(".flatpickr-date-input", { dateFormat: "Y-m-d" });
    }
  });

    profileTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        switchTab(this.getAttribute('data-tab'));
      });
    });
    switchTab('tab-affiliate');
  }
  
  function switchTab(tabId) {

    profilePanels.forEach(panel => panel.style.display = 'none');
    profileTabs.forEach(tab => tab.classList.remove('active'));

    //selected panel
    document.getElementById(tabId).style.display = 'block';
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    let backButtonHtml = '';
    let redButtonHtml = '';

    backButtonHtml += `
      <div class="col-4 mb-2">
        <button type="button" class="btn btn-lg btn-block" id="searchButton" 
          style="background-color: #6a6a6a; color: white;">1.2 Eligibility Check & Manage Waivers</button>
      </div>
    `;

    if (tabId == 'tab-affiliate') {
      redButtonHtml = `
        <div class="col-4 mb-2">
          <button type="button" class="btn btn-lg btn-block" id="nextButton"
            style="background-color: rgb(235, 51, 0); color: white;">
            Next
          </button>
        </div>
      `;
    } else if (tabId == 'tab-bank' || tabId == 'tab-completion') {
      redButtonHtml = `
        <div class="col-4 mb-2">
          <button type="button" class="btn btn-lg btn-block" id="saveButton"
            style="background-color: rgb(235, 51, 0); color: white;">
            Save
          </button>
        </div>
      `;
    }  else if (tabId == 'tab-affiliation') {
      redButtonHtml = `
        <div class="col-4 mb-2">
          <button type="button" class="btn btn-lg btn-block" id="submitButton"
            style="background-color: rgb(235, 51, 0); color: white;">
            Submit
          </button>
        </div>
      `;
    }

  document.getElementById('buttonContainer').innerHTML = redButtonHtml + backButtonHtml;  
  
  const newNextButton = document.getElementById('nextButton');
  if (newNextButton) {
    newNextButton.addEventListener('click', function() {
      const activeTab = document.querySelector('.profile-tab.active');
      let nextTabElement = activeTab.nextElementSibling;
      while (nextTabElement && nextTabElement.style.display === 'none') {
        nextTabElement = nextTabElement.nextElementSibling;
      }
      if (nextTabElement && nextTabElement.classList.contains('profile-tab')) {
        switchTab(nextTabElement.getAttribute('data-tab'));
      }
    });
  }

  const submitBtn = document.getElementById('submitButton'); 
  const saveBtn = document.getElementById('saveButton');

     if (submitBtn) {
      submitBtn.addEventListener('click', async function() {
      const activeTab = document.querySelector('.profile-tab.active').getAttribute('data-tab');
      let programStageToUpdate;
      let dataElementToUpdate;

     if (activeTab === 'tab-affiliation') {
        programStageToUpdate = programStage.dueDiligence;
        dataElementToUpdate = tei.dueDiligenceDEs;
      }
    await upsertEvent({ programStageToUpdate, dataElementToUpdate })
    // Update Tracked Entity attribute to mark as submitted (removes from Approved list)
    await dataApi.postAttribute({
      trackedEntities: [{
        trackedEntity: tei.affiliate.trackedEntity,
        orgUnit: tei.affiliate.orgUnit,
        trackedEntityType: trackedEntityType,
        attributes: [{ attribute: attributes.submitted, value: "true" }]
      }]
    });
      iziToast.success({
            status: 'SUCCESS',
            message: "Details Submitted Successfully",
            position: "center",
      });
      window.location.href = './1.2-eligibility-check-and-manage-waivers.html';

    });
    }

    if (saveBtn) {
    saveBtn.addEventListener('click', async function() {
      const activeTab = document.querySelector('.profile-tab.active').getAttribute('data-tab');
      
      if (activeTab === 'tab-completion') {
        const completionChecklistSection = tei.programStages.find(s => s.name === 'Completion Checklist');
        if (completionChecklistSection) {
          for (const item of completionChecklistSection.items) {
            if (item.valueType === 'BOOLEAN') {
              const el = document.getElementById(item.code);
              let val = el ? (el.type === 'checkbox' ? (el.checked ? 'true' : 'false') : el.value) : tei.values[item.code];
              
              if (String(val) !== 'true') {
                iziToast.info({ message: 'Please ensure all items in the Completion Checklist are "Yes" to save.', position: "center" });
                return;
              }
            }
          }
        }
      }

      let programStageToUpdate;
      let dataElementToUpdate;

     if (activeTab == 'tab-bank' || activeTab === 'tab-completion') {
        programStageToUpdate = programStage.dueDiligence;
        dataElementToUpdate = tei.dueDiligenceDEs;
      }
      await upsertEvent({ programStageToUpdate, dataElementToUpdate })
    
      iziToast.success({
            status: 'SUCCESS',
            message: "Details Submitted Successfully",
            position: "center",
        });
        window.location.href = './1.2-eligibility-check-and-manage-waivers.html';
    });
    }


  document.getElementById('searchButton').addEventListener('click', function() {
      window.location.href = './1.2-eligibility-check-and-manage-waivers.html';
  });

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

  //for handling submit or save button 
  async function handleAction(type) {
    const activeTab = document.querySelector('.profile-tab.active').getAttribute('data-tab');

    let programStageToUpdate;
    let dataElementToUpdate;

    if (activeTab === 'tab-bank') {
      programStageToUpdate = programStage.affiliateKyc;
      dataElementToUpdate = tei.affiliateStageDataElements;
    } else {
      programStageToUpdate = programStage.dueDiligence;
      dataElementToUpdate = tei.dueDiligenceDEs;
    }

    await upsertEvent({ programStageToUpdate, dataElementToUpdate });

    if (type === "submit") {
      iziToast.success({
        message: "Submitted successfully",
        position: "center"
      });

      window.location.href = './1.2-eligibility-check-and-manage-waivers.html';
    } else {
      iziToast.success({
        message: "Saved successfully",
        position: "center"
      });
    }
  }

    //for event create or update 
    async function upsertEvent({ programStageToUpdate, dataElementToUpdate }) {

      dataElementToUpdate.forEach(deUid => {
      const el = document.getElementById(deUid);
      if (!el) {
          if (tei.values[deUid] === undefined) {
              console.warn("Missing element:", deUid);
          }
          return;
      }

        if (el.type === "file") {
          if (el.files.length > 0) tei.values[deUid] = el.files[0];
        } else if (el.type === "checkbox") {
          tei.values[deUid] = el.checked;
        } else {
          tei.values[deUid] = el.value;
        }
      });

      const orgUnitId = tei.affiliate.enrollments.find(
        enroll => enroll.program == programs.affiliateKyc
      )?.orgUnit;

      const enrollment = tei.affiliate.enrollments.find(
        enroll => enroll.program == programs.affiliateKyc
      )?.enrollment;

      if (!orgUnitId || !enrollment) return;

      const existingEvent = tei.affiliate.enrollments
        .find(enroll => enroll.program == programs.affiliateKyc)
        ?.events
        .filter(event => event.programStage == programStageToUpdate && !event.deleted)
        .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt))[0];

      const existingValues = {};
      if (existingEvent?.dataValues) {
        existingEvent.dataValues.forEach(dv => {
          existingValues[dv.dataElement] = dv.value;
        });
      }

      const changedDEs = dataElementToUpdate.filter(deUid => {
        const newVal = tei.values[deUid] || "";
        const oldVal = existingValues[deUid] || "";
        // return newVal.toString() !== oldVal.toString(); 
        return String(newVal ?? "") !== String(oldVal ?? "");
      });

      if (changedDEs.length === 0) {
        iziToast.info({ message: "No changes to submit", position: "center" });
        return;
      }

      const originalDEs = tei.dataElements;
      tei.dataElements = changedDEs;

      const payload = createPayload.event({
        tei,
        event: existingEvent?.event, 
        orgUnit: orgUnitId,
        enrollment,
        program: programs.affiliateKyc,
        programStage: programStageToUpdate,
      });

      await dataApi.enroll(payload);

      tei.dataElements = originalDEs;
    }
})
