import { dataApi } from "../../api/DataApi.js"
import { optionSetApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { dataSet } from "../../api/dataSet.js"
import { attributes, dataElements, optionSet, programRules, programStage, programs, stageSections, tei, trackedEntityType } from "../../constant.js";
import { convert, fetchValueType, configureRules, ruleCallback, populateOptions } from "../metadata.js";
import { getUserConfig } from "../config.js";
import { toast } from "../utils.js";


document.addEventListener("DOMContentLoaded", async function () {
  const profileTabs = document.querySelectorAll('.profile-tab');
  const profilePanels = document.querySelectorAll('.profile-tab-panel');

  const tabButtonConfig = {
    'tab-affiliate': {
      next: false,
      submit: true,
      back: true
    },
    'tab-bank': {
      next: true,
      submit: true,
      back: true
    },
    'tab-completion': {
      next: true,
      submit: true,
      back: true
    },
    'tab-affiliation': {
      next: false,
      submit: true,
      back: true
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
      const generateBtn = document.getElementById('generateUIN');
      if (generateBtn) generateBtn.disabled = false;
    } else {
      const generateBtn = document.getElementById('generateUIN');
      if (generateBtn) generateBtn.disabled = false;
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
          dataValues[`${dv.dataElement}-event`] = event.event; 
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
  const programAttributes = convert.attributes({ program: programMetadata, disabled: false });

  
  const resUINControlStage = await programStageApi.get(programStage.UINControlMaster);
  const resCompletionCheckList = await programStageApi.get(programStage.completionCheckList);

  const uinStage = convert.stage({ programStage: resUINControlStage, disabled: true });
  const completionCheckList = convert.stage({ programStage: resCompletionCheckList, disabled: true});
  //saving for later use
  tei.completionCheckListDEs = completionCheckList.dataElements;
  tei.uinStage = uinStage;
  tei.programAttributes = programAttributes;
  tei.programStages = [...programAttributes.sections, ...uinStage.sections, ...completionCheckList.sections];
  tei.values = {...programAttributes.values, ...uinStage.values, ...completionCheckList.values, ...dataValues};
  tei.completionCheckListDEs = completionCheckList.dataElements;
  tei.uinStageDataElements = uinStage.dataElements;  
  tei.metadata = {...programAttributes.metadata, ...uinStage.metadata, ...completionCheckList.metadata};

    tei.fileType = new Set();
    if (tei.values[dataElements.countryIncomeStatus] &&
    tei.metadata[dataElements.countryIncomeStatus]) {
    tei.metadata[dataElements.countryIncomeStatus].disabled = true;
  }
    [...uinStage.sections, ...completionCheckList.sections].forEach(section => {
      section.items.forEach(item => {
        if (item.valueType === "FILE_RESOURCE") {
          tei.fileType.add(item.code);
        }
      });
    });

    for (let id of tei.fileType) {
      if (tei.values[id]) {
        try {
          tei.values[`${id}-href`] = `../../events/files?eventUid=${tei.values[`${id}-event`]}&dataElementUid=${id}`;
          tei.values[`${id}-file`] = await dataApi.getFile(tei.values[id]);
        } catch (e) {
          console.error("Error loading file metadata", id, e);
        }
      }
    }
  programAttributes.sections.forEach(section => {
    section.items.forEach(element => {
      if (element.code === attributes.uinCode) {
          element.disabled = true;
      }
    })

  });

  completionCheckList.sections.forEach(section => {
    section.items.forEach(element => {
      if(element.name === "Affiliation Type" || element.name === "Affiliation Status" || !tei.values[element.code]) {
          element.disabled = false;
      }
    })
  }) //-- form enabled because of feedback
  tei.mandatoryList = [...programAttributes.mandatoryList, ...uinStage.mandatoryList, ...completionCheckList.mandatoryList];
    if (tei.values[dataElements.disclaimer] === "true") {
    tei.disabled = true;
  }
  ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
  // --- Tab categorization helpers ---
  const bankKeywords = [
    'bank detail', 'bank account', 'additional bank',
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
  tei.affiliateStageSections = [];
  const bankStageSections = [];
  const affiliationStageSections = [];

   

  uinStage.sections.forEach(section => {
    const cat = categorizeSection(section);
    if (cat === 'bank') bankStageSections.push(section);
    else if (cat === 'affiliation') affiliationStageSections.push(section);
    else tei.affiliateStageSections.push(section);
  });

  if (tei.affiliateStageSections.length) {
    tei.affiliateStageSections.forEach(section => {
      section.items.forEach(element => {
        element.disabled = false;
      })
    })
  }
    tei.affiliateStageSections.forEach(section => {
    section.items.forEach(element => {
      if (element.code === dataElements.countryIncomeStatus) {
        element.disabled = true;
      }
    });
  });
  
  // Render into tab panels
  ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
  document.getElementById("basicInformation").innerHTML = renderSections(programAttributes.sections);
  handleRegionCountryFilter(resOptionGroups, userConfig);

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
  tei.completionOnlySections = completionOnlySections;
  
  [...bankStageSections, ...completionBankSections].forEach(section => {
    const hasPaymentFileFormat = section.items.some(el => 
      el.code === dataElements.paymentFileFormatBa1 ||
      el.code === dataElements.paymentFileFormatBa2 ||
      el.code === dataElements.paymentFileFormatBa3
    );
    
    let passedPaymentFileFormat = false;
    
    section.items.forEach(element => {
      if (hasPaymentFileFormat) {
        if (
          element.code === dataElements.paymentFileFormatBa1 ||
          element.code === dataElements.paymentFileFormatBa2 ||
          element.code === dataElements.paymentFileFormatBa3
        ) {
          passedPaymentFileFormat = true;
        }

        if (passedPaymentFileFormat) {
          element.disabled = false;
        } else {
          element.disabled = true;
        }
      }
    })
  })

  const renderTabContent = () => {
    document.getElementById("affiliateStage").innerHTML = renderSections(tei.affiliateStageSections, tei.disabled);
    document.getElementById("bankStage").innerHTML = renderSections([...bankStageSections, ...completionBankSections], tei.disabled);

    // Show completion sections for users with write access OR "ma" users (for additional document submission)
    let completionHtml = '';
    if (hasWriteAccess || isMaUser) {
      completionHtml = renderSections(completionOnlySections);
    }
    document.getElementById("completionStage").innerHTML = completionHtml;
   ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
    document.getElementById("affiliationStage").innerHTML = renderSections(
      [...affiliationStageSections, ...completionAffiliationSections]
    );

    flatpickr(".flatpickr-date-input", { 
      dateFormat: "Y-m-d", 
        disable: [
          function(date) { 
              return (date.getFullYear() < 1924) ||  (date > new Date()); 
            }
          ] 
      });
    

    if (!document.getElementById('flatpickr-custom-style')) {
        const style = document.createElement('style');
        style.id = 'flatpickr-custom-style';
        style.innerHTML = `
            .flatpickr-current-month .numInputWrapper span.arrowUp,
            .flatpickr-current-month .numInputWrapper span.arrowDown {
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
            }
        `;
        document.head.appendChild(style);
    }
  };
  renderTabContent();

  document.querySelector("#tab-bank").addEventListener('change', function(e) {
    if (e.target.matches("input, select, textarea")) {
      let value = e.target.type === 'checkbox' ? (e.target.checked ? 'true' : 'false') : e.target.value;
      tei.values[e.target.id] = value;
      let errorEl = document.getElementById(`error-${e.target.id}`);
      if (errorEl) errorEl.innerHTML = '';
      ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
      renderTabContent();
      debugger;
    }
  });

  document.querySelector("#tab-affiliate").addEventListener('change', async function(e) {
     if (tei.disabled) return;
    if (e.target.matches("input, select, textarea")) {
        if (e.target.id === attributes.countryRegistration) {
          const countryCode = e.target.value;
            if (countryCode) {
                 try {
                    const orgUnitRes = await orgUnitsApi.get({ filter: countryCode });
                    const countryOrgUnit = orgUnitRes.organisationUnits?.[0]?.id;
                    const dataSetValues = await dataSet.getValues();
                      if (dataSetValues && dataSetValues.dataValues) {
                        const incomeStatusDV = dataSetValues.dataValues.find(dv => dv.orgUnit === countryOrgUnit);
                          if (incomeStatusDV) {
                            tei.values[dataElements.countryIncomeStatus] = incomeStatusDV.value;
                            if(tei.metadata[dataElements.countryIncomeStatus]) tei.metadata[dataElements.countryIncomeStatus].disabled = true;
                          }
                      }
                    } catch (err) {
                      console.error("Failed to load country dataset values", err);
                  }
            }
        }

      if (e.target.type === "file") {
        if (e.target.files.length > 0) {
          tei.values[e.target.id] = e.target.files[0];
        }
        const blobUrl = URL.createObjectURL(e.target.files[0]);
            const fileLink = document.getElementById(`${e.target.id}-link`);
            if(fileLink){
                fileLink.href = blobUrl;
                fileLink.textContent = e.target.files[0].name;
                fileLink.style.display = 'inline-block';
                fileLink.target = '_blank';
            }
        
        let errorEl = document.getElementById(`error-${e.target.id}`);
        if (errorEl)  errorEl.innerHTML = '';
        e.target.value = "";
        return;
      }

      let value = e.target.type === 'checkbox' ? (e.target.checked ? 'true' : 'false') : e.target.value;
      tei.values[e.target.id] = value;
      let errorEl = document.getElementById(`error-${e.target.id}`);
      if (errorEl) errorEl.innerHTML = '';
      ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
      renderTabContent();
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

    const config = tabButtonConfig[tabId];
    let buttonHtml = '';
    let backButtonLabel = 'Back to View and Update';
    let backButtonData = '';

    if (tabId == 'tab-affiliate') {
      backButtonData = 'external';
      if (userConfig?.user.includes('kyc') && tabId == 'tab-affiliate') {
        tabButtonConfig['tab-affiliate'].submit = false;
        tabButtonConfig['tab-affiliate'].back = false;
        renderKycActions();
        document.getElementById('disclaimerCheck').addEventListener('change', function(e) {
          if (tei.disabled) {
            e.target.checked = true;
            return;
          }
          const isChecked = e.target.checked;
          const isDuplicate = tei.isDuplicateLegalName;
          document.getElementById('submitBtn').disabled = !isChecked;
          document.getElementById('saveAsDraft').disabled = !isChecked;
        });
        document.getElementById('saveAsDraft').addEventListener('click', () => handleForm(false));
        document.getElementById('submitBtn').addEventListener('click', () => handleForm(true));
    }
    } else { 
       backButtonData = 'previous';
       const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
       let prevTabElement = activeTab.previousElementSibling;
       while (prevTabElement && prevTabElement.style.display === 'none') {
         prevTabElement = prevTabElement.previousElementSibling;
       }
        if (prevTabElement && prevTabElement.classList.contains('profile-tab')) {
          const prevTabName = prevTabElement.textContent.trim();
          backButtonLabel = `Back to ${prevTabName}`;
       }
    }
  
    if (config.back) {
      buttonHtml += `
        <div class="col-4 mb-2">
        <button type="button" class="btn btn-lg btn-block" id="searchButton" data-action="${backButtonData}"  
          style="background-color: #6a6a6a; color: white;">${backButtonLabel}</button>
      </div>
      `;
    }

    if (config.submit) {
      buttonHtml += `
      <div class="col-4 mb-2">
        <button type="button" class="btn btn-lg btn-block generate-uin-btn" id="generateUIN"
          style="background-color: rgb(235, 51, 0); color: white;" ${tei.disabled ? 'disabled' : ''}>Submit</button>
      </div>
    `;
    }
    if (config.next) {
      buttonHtml += `
        <div class="col-4 mb-2">
        <button type="button" class="btn btn-lg btn-block" id="nextButton" 
          style="background-color: rgb(235, 51, 0); color: white;">Next</button>
        </div>
      `;
    }
  
  document.getElementById('buttonContainer').innerHTML = buttonHtml;  
  
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

  const generateUIN = document.getElementById('generateUIN');  
   if (generateUIN) {
    generateUIN.addEventListener('click', async function() { 
    if(tei.affiliate) {
      const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program == programs.UINControlMaster)?.orgUnit;
      const enrollment = tei.affiliate.enrollments.find(enroll => enroll.program == programs.UINControlMaster)?.enrollment;
      if(!orgUnitId || !enrollment) return;

      // const activeTab = document.querySelector('.profile-tab.active').getAttribute('data-tab');
      const activeTab = getActiveTab();
      let programStageToUpdate;
      let dataElementToUpdate;

      if (activeTab === 'tab-affiliate') {
        programStageToUpdate = programStage.UINControlMaster;
        dataElementToUpdate = tei.uinStageDataElements;
      }
     else if (activeTab === 'tab-completion' || activeTab === 'tab-affiliation' || activeTab == 'tab-bank') {
        programStageToUpdate = programStage.completionCheckList;
        dataElementToUpdate = tei.completionCheckListDEs;
      }

      // for handling file error so that existing value will not collide with newly filled fields
      const fileUploads = {};
      const valuesToSend = { ...tei.values };

      for (const deUid of dataElementToUpdate) {
        const el = document.getElementById(deUid);
        if (!el) continue;

        if (el.type === "file") {
          if (el.files && el.files.length > 0) {
            fileUploads[deUid] = el.files[0];
          }
          continue;
        } 
        if (el.type === "checkbox") {
          valuesToSend[deUid] = el.checked;
        } 
        else {
          valuesToSend[deUid] = el.value;
        }
      }
      
      // for new file Upload
        for (const deUid in fileUploads) {
          const formData = new FormData();
          formData.append("file", fileUploads[deUid]);
          const res = await dataApi.uploadFile(formData);
          if (res.status !== "OK") {
            iziToast.error({ message: "File upload failed", position: "center" });
            return;
          } 
          valuesToSend[deUid] = res.response.fileResource.id;
       }

      const existingEvent = tei.affiliate.enrollments
      .find(enroll => enroll.program == programs.UINControlMaster)
      ?.events.filter(event => event.programStage == programStageToUpdate && !event.deleted)
      .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt))[0];

      const existingValues = {};
      if (existingEvent?.dataValues) {
        existingEvent.dataValues.forEach(dv => {
          existingValues[dv.dataElement] = dv.value;
        });
      }

      const changedDEs = dataElementToUpdate.filter(deUid => {
        const newVal = valuesToSend[deUid] || "";
        const oldVal = existingValues[deUid] || "";
         const el = document.getElementById(deUid);
        if (el?.type === "file") {
          return deUid in fileUploads;
        }
        return newVal.toString() !== oldVal.toString();
      });

      const originalDEs = tei.dataElements;
      tei.dataElements = changedDEs;
      tei.eventId = existingEvent?.event;

      const existingAttributeValues = {};
      tei.affiliate.attributes.forEach(attr => {
        existingAttributeValues[attr.attribute] = attr.value;
      });

      const attributeUIDs = tei.programAttributes.sections
      .flatMap(section => section.items)
      .map(item => item.code);

      const changedAttributes = attributeUIDs
      .filter(attrUid => {
        const newVal = valuesToSend[attrUid] || "";
        const oldVal = existingAttributeValues[attrUid] || "";
        return newVal.toString() !== oldVal.toString();
      })
      .map(attrUid => ({
        attribute: attrUid,
        value: valuesToSend[attrUid] || ""
      }));

      const changedDataValues = changedDEs.map(deUid => ({
        dataElement: deUid,
        value: valuesToSend[deUid] || ""
      }));

      const validationIds = getDraftMandatoryIdsForTab();
      const firstErrorEl = validateFields(validationIds, valuesToSend);
      if (firstErrorEl) {
        toast({ status: 'ERROR', message: 'Please fill all required fields!' });
        firstErrorEl.closest('.form-group')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (changedDEs.length === 0 && changedAttributes.length === 0) {
        iziToast.info({ message: "No changes to submit", position: "center" });
        return;
      }

      if (activeTab == 'tab-affiliate') {
        const payload = {
        trackedEntities: [
            {
              trackedEntity: tei.affiliate.trackedEntity,
              orgUnit: orgUnitId,
              trackedEntityType: trackedEntityType, 
              attributes: changedAttributes                       
            }
        ],
        events: [
          {
            event: tei.eventId,
            orgUnit: orgUnitId,
            program: programs.UINControlMaster,
            programStage: programStageToUpdate,
            enrollment: enrollment,
            trackedEntity: tei.affiliate.trackedEntity,
            occurredAt: new Date().toISOString(),
            status: "ACTIVE",
            dataValues: changedDataValues 
          }
        ]
      };
      await dataApi.update(payload);
    } else if (activeTab === 'tab-bank' || activeTab === 'tab-affiliation' || activeTab === 'tab-completion') {
      
      const existingDVMap = {};
      existingEvent?.dataValues?.forEach(dv => {
        existingDVMap[dv.dataElement] = dv.value;
      });
      changedDataValues.forEach(dv => {
        existingDVMap[dv.dataElement] = dv.value;
      });
      const mergedDataValues = Object.entries(existingDVMap).map(([dataElement, value]) => ({
        dataElement,
        value
      }));

      const payload = {
        trackedEntities: [{
          trackedEntity: tei.affiliate.trackedEntity,
          orgUnit: orgUnitId,
          trackedEntityType: trackedEntityType,
          attributes: changedAttributes
        }],
        events: [{
          dataValues: mergedDataValues,
          occurredAt: new Date().toISOString(),
          enrollment: enrollment,
          orgUnit: orgUnitId,
          program: programs.UINControlMaster,
          programStage: programStageToUpdate,
          trackedEntity: tei.affiliate.trackedEntity,
          status: "ACTIVE"
        }]
      };

      await dataApi.enroll(payload);
    }
      iziToast.success({
          status: 'SUCCESS',
          message: "Details Submitted Successfully",
          position: "center",
      });
        window.location.href = './2.1-view-and-update-profile.html';
    }
    });
   }

  document.getElementById('searchButton').addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      if (action == 'external') {
        window.location.href = './2.1-view-and-update-profile.html';
      } else if (action == 'previous') {
        const activeTab = document.querySelector('.profile-tab.active');
        let prevTabElement = activeTab.previousElementSibling;
        while (prevTabElement && prevTabElement.style.display === 'none') {
          prevTabElement = prevTabElement.previousElementSibling;
        }
        if (prevTabElement && prevTabElement.classList.contains('profile-tab')) {
          switchTab(prevTabElement.getAttribute('data-tab'));
        }
      }
  });

  }

    function renderSections(sections, forceDisbled=false) {
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
            const isDisabled = forceDisbled ? true : el.disabled;
            fieldWrapper.innerHTML = `
                <label>
                    ${el.name}
                    ${el.mandatory ? '<span class="text-danger">*</span>' : ''}
                </label>
                ${fetchValueType({id: el.code, valueType: el.valueType, valueSet: el.valueSet}, tei.values[el.code], {href:(tei?.values[`${el.code}-href`] || ""), file: (tei?.values[`${el.code}-file`] || "")}, (isDisabled))}

                <div id="error-${el.code}" style="color: red"></div>
            `;
            rowDiv.appendChild(fieldWrapper);
        }
        container += sectionDiv.outerHTML;
    }
    return container;
    }

    function handleRegionCountryFilter(resOptionGroups, userConfig) {
        const regionEl = document.getElementById(attributes.region);
        const countryEl = document.getElementById(attributes.countryRegistration);
         if (!regionEl) return;

        function displayCountries(regionValue) {

        const optionGroup = resOptionGroups.optionGroups.find(
            group => group.id == programRules.hideCountry[regionValue]
        );

        const sorted = optionGroup.options
          .map(opt => ({
              label: opt.name,
              value: opt.code
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
          

        return sorted;
}

        const currentRegion = regionEl.value;
          if (currentRegion) {
          const countries = displayCountries(currentRegion);

        countryEl.innerHTML = populateOptions(countries);
        const savedCountry = tei.values[attributes.countryRegistration];
        countryEl.value = savedCountry;

          regionEl.addEventListener("change", function(e) {
                const countries = displayCountries(e.target.value);
                countryEl.innerHTML = populateOptions(countries);
          });
        }
    }

    function renderKycActions() {
       document.getElementById('disclaimerCheckforKyc').innerHTML = `        
          <div class="card mb-3" style="border-radius: 0.5rem; background-color: white; border: 1px solid #e3e6f0;">
                <div class="card-body d-flex align-items-start">
                  <div class="form-check mr-3">
                    <input class="form-check-input" type="checkbox" id="disclaimerCheck">
                  </div>
                  <p class="mb-0 text-muted" style="font-size: 0.95rem; line-height: 1.5; color: #333;">
                    <strong style="color:black">Disclaimer:</strong> The information requested, which may include
                    sensitive personal and financial details,
                    is being collected for due diligence, compliance, and internal verification purposes only. IPPF
                    undertakes to process
                    such data in accordance with applicable data protection laws, confidentiality agreements, and
                    organizational policies.
                    Access to this data will be strictly limited to authorized personnel, and it will not be disclosed
                    to any third party
                    without explicit authorization or legal obligation. By providing this information, you acknowledge
                    and consent to its
                    processing for the purposes stated herein.
                  </p>
                </div>
              </div>
              <div class="d-flex justify-content-end align-items-center p-3"
                style="border-radius: 0.5rem;">
                <button type="button" class="btn mr-2" id="saveAsDraft" 
                  style="background-color: transparent; color: #333; border: 1px solid #d0d0d0; font-weight: 500; transition: 0.2s;" disabled>
                  Save as Draft
                </button>
                <button type="button" class="btn mr-2" id="submitBtn" style="background-color: #b768a7; color: #fff; font-weight: 500; transition: 0.2s;" disabled>
                  Submit
                </button>
                <button type="button" class="btn" id="sendToAcuityBtn" style="display:none; background-color: #E93300; color: #fff; font-weight: 500; transition: 0.2s;">
                  Send to Acuity
                </button>
              </div>
        `;
    }

    function getActiveTab() {
    return document.querySelector('.profile-tab.active')?.getAttribute('data-tab');
    }
  
    function getDraftMandatoryIdsForTab(tabId) {
      const ids = new Set();
      if (tabId === 'tab-affiliate') {
        tei.programAttributes.sections.forEach(section => section.items.forEach(item => ids.add(item.code)));
        tei.affiliateStageSections.forEach(section => section.items.forEach(item => ids.add(item.code)));
      } else if (tabId === 'tab-bank') {
        [...bankStageSections, ...completionBankSections].forEach(section => section.items.forEach(item => ids.add(item.code)));
      } else if (tabId === 'tab-affiliation') {
        [...affiliationStageSections, ...completionAffiliationSections].forEach(section => section.items.forEach(item => ids.add(item.code)));
      } else if (tabId === 'tab-completion') {
        completionOnlySections.forEach(section => section.items.forEach(item => ids.add(item.code)));
      }

      return [...ids].filter(id => !!tei.metadata[id] && tei.metadata[id].mandatory);
    }

    function validateFields(fieldIds, values) {
    let firstError = null;
      fieldIds.forEach(id => {
        const errorEl = document.getElementById(`error-${id}`);
        if (!errorEl) return;
        const value = values[id];
        const meta = tei.metadata[id];

        const filled = value != null && (meta?.valueType === 'FILE_RESOURCE' ? value instanceof File || (typeof value === 'string' && value.trim())
          : value.toString().trim());
        errorEl.textContent = filled ? '' : 'This field is required';

        if (!filled && !firstError) {
          firstError = errorEl;
        }
      });
      return firstError;
    }

    async function handleForm(isSubmit) {
    try {
    const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program == programs.UINControlMaster)?.orgUnit;
    const enrollment = tei.affiliate.enrollments.find(e => e.program === programs.UINControlMaster);
    if (!orgUnitId || !enrollment) return;

    const uinEvent = enrollment?.events.find(e => e.programStage === programStage.UINControlMaster);
    const completionEvent = enrollment?.events.find(e => e.programStage === programStage.completionCheckList);

    if (!uinEvent) {
      toast({ status: "ERROR", message: "Existing event not found" });
      return;
    }

    const uinExistingValues = {};
    uinEvent.dataValues?.forEach(dv => { uinExistingValues[dv.dataElement] = dv.value; });

    const completionExistingValues = {};
    completionEvent?.dataValues?.forEach(dv => { completionExistingValues[dv.dataElement] = dv.value; });

    const fileUploads = {};
    const valuesToSend = { ...tei.values };

    const allStageDataElements = [...tei.uinStageDataElements, ...tei.completionCheckListDEs];
   
    for (const deUid of allStageDataElements) {
      const el = document.getElementById(deUid);
      if (!el) continue;
      if (el.type === "file") {
      const storedFiles = tei.values[deUid];
      if (storedFiles instanceof File) {
        fileUploads[deUid] = storedFiles;
      } else {
        const existingVal = uinExistingValues[deUid] ?? completionExistingValues[deUid] ?? " ";
        valuesToSend[deUid] = existingVal;
      }
        continue;
      }
      
      if (el.type === "checkbox") {
        valuesToSend[deUid] = el.checked;
      } else {
        valuesToSend[deUid] = el.value;
      }
    } 
    
    const newlyUploadedFiles = new Set();
    for (const deUid in fileUploads) {
      const formData = new FormData();
      formData.append("file", fileUploads[deUid]);
      const res = await dataApi.uploadFile(formData);
      if (res.status !== "OK") {
        iziToast.error({ message: "File upload failed", position: "center" });
        return;
      }
      valuesToSend[deUid] = res.response.fileResource.id;
      newlyUploadedFiles.add(deUid);
    }
      const changedUinDataValues = tei.uinStageDataElements
      .filter(deUid => {
        const el = document.getElementById(deUid);
        if (el && el.type === "file") {
          return newlyUploadedFiles.has(deUid); 
        }
        const newVal = valuesToSend[deUid] || "";
        const oldVal = uinExistingValues[deUid] || "";
        return newVal.toString() !== oldVal.toString();
      })
      .map(deUid => ({ dataElement: deUid, value: valuesToSend[deUid] || "" }));

      const changedCompletionDataValues = tei.completionCheckListDEs
      .filter(deUid => {
        const el = document.getElementById(deUid);
        if (!el) return false;

        if (el.type === "file") {
          return newlyUploadedFiles.has(deUid); 
        }

        const newVal = valuesToSend[deUid] || "";
        const oldVal = completionExistingValues[deUid] || "";
        return newVal.toString() !== oldVal.toString();
      })
      .map(deUid => ({ dataElement: deUid, value: valuesToSend[deUid] || "" }));

    const existingAttributeValues = {};
    tei.affiliate.attributes.forEach(attr => { existingAttributeValues[attr.attribute] = attr.value; });

    const attributeUIDs = tei.programAttributes.sections.flatMap(s => s.items).map(i => i.code);
    const changedAttributes = attributeUIDs
      .filter(attrUid => {
        const newVal = valuesToSend[attrUid] || "";
        const oldVal = existingAttributeValues[attrUid] || "";
        return newVal.toString() !== oldVal.toString();
      })
      .map(attrUid => ({ attribute: attrUid, value: valuesToSend[attrUid] || "" }));

      const activeTab = getActiveTab();
      if (isSubmit) {
       const validationIds = getDraftMandatoryIdsForTab(activeTab);
      const firstErrorEl = validateFields(validationIds, valuesToSend);
      if (firstErrorEl) {
        toast({ status: "ERROR", message: "Please fill all required fields!" });
        firstErrorEl.closest('.form-group')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    
    const disclaimerChanged = isSubmit && uinExistingValues[dataElements.disclaimer] !== "true"; 
    if (!changedUinDataValues.length && !changedCompletionDataValues.length && !changedAttributes.length && !disclaimerChanged) {
      toast({ status: "INFO", message: "No changes to Submit", position: "center" });
      return;
    }

    const events = [{
      event: uinEvent.event,
      enrollment: enrollment.enrollment,
      trackedEntity: tei.affiliate.trackedEntity,
      orgUnit: uinEvent.orgUnit,
      program: programs.UINControlMaster,
      programStage: programStage.UINControlMaster,
      occurredAt: uinEvent.occurredAt,
      status: "ACTIVE",
      dataValues: [
        ...changedUinDataValues,
        ...(isSubmit ? [{ dataElement: dataElements.disclaimer, value: "true" }] : [])
      ]
    }];

    if (completionEvent && changedCompletionDataValues.length > 0) {
      events.push({
        event: completionEvent.event,
        enrollment: enrollment.enrollment,
        trackedEntity: tei.affiliate.trackedEntity,
        orgUnit: completionEvent.orgUnit,
        program: programs.UINControlMaster,
        programStage: programStage.completionCheckList,
        occurredAt: completionEvent.occurredAt,
        status: "ACTIVE",
        dataValues: changedCompletionDataValues
      });
    }

    const payload = {
      trackedEntities: [{
        trackedEntity: tei.affiliate.trackedEntity,
        orgUnit: orgUnitId,
        trackedEntityType: trackedEntityType,
        attributes: changedAttributes,
      }],
      events: events
    };

    await dataApi.update(payload);
    toast({ status: "SUCCESS", message: isSubmit ? "Affiliate updated successfully!" : "Draft Saved Successfully", position: "center"});
    const refreshed = await dataApi.getTrackedEntity(tei.affiliate.trackedEntity);
    if (refreshed.trackedEntities) {
      tei.affiliate = refreshed.trackedEntities[0];
    }

    if (isSubmit) {
      tei.disabled = true;
      document.getElementById("affiliateStage").innerHTML = renderSections(tei.affiliateStageSections, tei.disabled);
      document.getElementById("basicInformation").innerHTML = renderSections(tei.programAttributes.sections, tei.disabled);
      const saveBtn = document.getElementById('saveAsDraft');
      const submitBtn = document.getElementById('submitBtn');
      const disclaimerCheck = document.getElementById('disclaimerCheck');
      if (saveBtn) saveBtn.disabled = true;
      if (submitBtn) submitBtn.disabled = true;
      if (disclaimerCheck) disclaimerCheck.disabled = true;
      window.location.href = './2.1-view-and-update-profile.html';
    }
  } catch (e) {
    console.error(e);
    toast({ status: "ERROR", message: `Error occurred: ${e.message || e}` });
  }
}
})