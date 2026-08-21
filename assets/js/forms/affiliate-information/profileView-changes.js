import { dataApi } from "../../api/DataApi.js"
import { optionSetApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { dataSet } from "../../api/dataSet.js"
import { attributes, dataElements, optionSet, programRules, programSection, programStage, programs, stageSections, tei, trackedEntityType } from "../../constant.js";
import { convert, fetchValueType, configureRules, ruleCallback, populateOptions } from "../metadata.js";
import { getUserConfig } from "../config.js";
import { isGmailOrYahoo, toast } from "../utils.js";


document.addEventListener("DOMContentLoaded", async function () {
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

  const userConfig = await getUserConfig();
  if (userConfig) {
    userConfig.user.forEach(user => {
      $(`.${user}`).each(function () {
        this.style.setProperty('display', 'none', 'important');
      });
    });
  }

  const TABS = {
    'affiliate-details': {
      prev: {
        label: 'Back to View and Update',
        link: '/2.1-view-and-update-profile.html',
        value: true,
      },
      saveAsDraft: {
        label: 'Save As Draft',
        value: userConfig.user.includes('kyc') ? true : false,
      },
      next: {
        label: 'Next',
        tabId: 'bank-details',
        value: userConfig.user.includes('kyc') ? false : true,
      }
    },
    'bank-details': {
      prev: {
        label: 'Back to View and Update',
        tabId: 'affiliate-details',
        value: true,
      },
      saveAsDraft: {
        label: 'Save As Draft',
        value: false,
      },
      next: {
        label: 'Next',
        tabId: 'core-completion',
        value: userConfig.user.includes('tpo') ? false : true
      }
    },
    'core-completion': {
      prev: {
        label: 'Back to 2. Acuity Bank Details (For TPOs)',
        tabId: 'bank-details',
        value: true,
      },
      saveAsDraft: {
        label: 'Save As Draft',
        value: false,
      },
      next: {
        label: 'Next',
        tabId: 'affiliation-type',
        value: true
      }
    },
    'affiliation-type': {
      prev: {
        label: 'Back to 3. Core Completion Checklist',
        tabId: 'core-completion',
        value: true,
      },
      saveAsDraft: {
        label: 'Save As Draft',
        value: false,
      },
      next: { label: 'Next', value: false }
    },
  }

  $('.profile-tab').on('click', function () {
    tei.tabId = this.id;
    updateMetadataAndRender(); 
  });

  $('.profile-tab-content').on('change', async function (e) {
    if (e.target.matches("input, select, textarea")) {
      const { id, checked, value, type } = e.target;
      
      if (type === "file") {
        if (e.target.files.length > 0) {
          tei.values[id] = e.target.files[0];
          tei.values[`${id}-modified`] = true;
        }
        const blobUrl = URL.createObjectURL(e.target.files[0]);
            const fileLink = document.getElementById(`${id}-link`);
            if(fileLink){
                fileLink.href = blobUrl;
                fileLink.textContent = e.target.files[0].name;
                fileLink.style.display = 'inline-block';
                fileLink.target = '_blank';
            }
        
        let errorEl = document.getElementById(`error-${id}`);
        if (errorEl)  errorEl.innerHTML = '';
        renderTabSection();
        return;
      }

      tei.values[id] = type == 'checkbox' ? (checked ? 'true' : '') : value;
      const errorEl = document.getElementById(`error-${id}`);
      if (errorEl) errorEl.innerHTML = '';
      renderTabSection();
    }
  });

  $('.profile-tab-buttons').on('click', 'button', async function () {
    const buttonId = $(this).attr('id');
    debugger;
    const checkMandatory = () => {
      if (tei.mandatoryList) {
        let empty = false;
        for (const id of tei.mandatoryList) {
          const mandatoryError = document.querySelector(`#error-${id}`);
          if (!tei.values[id]) {
            empty = true;
            mandatoryError.innerHTML = "This field is required";
            mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
            mandatoryError.focus({ preventScroll: true });
          } else if (tei.metadata[id].valueType === 'EMAIL' && !isGmailOrYahoo(tei.values[id])) {
            empty = true;
            mandatoryError.innerHTML = "Only valid email addresses are allowed.";
            mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
            mandatoryError.focus({ preventScroll: true });
          } else if (tei.metadata[id].valueType === "FILE_RESOURCE" && (tei.values[id] instanceof File)
            && !['.pdf', ',image/jpeg', '.jpg', '.jpeg'].some(ext => tei.values[id].name.toLowerCase().endsWith(ext))
          ) {
            empty = true;
            mandatoryError.innerHTML = "Only valid File Formats are allowed.";
            mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
            mandatoryError.focus({ preventScroll: true });

          } else {
            mandatoryError.innerHTML = "";
          }
        }
        if (empty) return true;
        
        return false;
      }
    };

    switch (buttonId) {
      case 'prev-button': {
        const prev = TABS[tei.tabId].prev;
        if (prev.tabId) {
          tei.tabId = prev.tabId;
          updateMetadataAndRender();
        } else if (prev.link) {
          window.location.href =  window.location.pathname.replace(/\/[^/]+$/, '') + prev.link;
        }
      }
        break;
      case 'next-button': {
        const next = TABS[tei.tabId].next;
        if (next.tabId) {
          tei.tabId = next.tabId;
          updateMetadataAndRender();
        }
      }
        break;
      case 'submit-button': 
      case 'save-as-draft-button': {
        if(buttonId == 'submit-button') {
          if(checkMandatory()) {
            toast({ status: 'INFO', message: 'Please fill mandatory fields!' });
            return;
          }
        }

        const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program == programs.UINControlMaster)?.orgUnit;
        const enrollment = tei.affiliate.enrollments.find(e => e.program === programs.UINControlMaster);
        if (!orgUnitId || !enrollment) return;

        if (tei.tabId == 'core-completion' || tei.tabId == 'affiliation-type') {
          showLoader();
          const eventPayload = createPayload.event({
            tei, 
            orgUnit: orgUnitId,
            program: programs.UINControlMaster,
            programStage: programStage.completionCheckList,
            enrollment: enrollment.enrollment,
            event:''
          })
          await dataApi.update(eventPayload);
          toast({ status: "SUCCESS", message: "Draft Saved Successfully", position: "center"});
          await fetchAffiliate();
          hideLoader();
          } else if(tei.tabId == 'bank-details') {
            showLoader();
            const fileInputs = document.querySelectorAll(".file-upload");
            for(const input of fileInputs) {
                if (!tei.values[`${input.id}-modified`])  continue;
                const file = tei.values[input.id];
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
                    hideLoader();
                    return;
                }
            }

            tei.dataElements = tei.stageSection
              .filter(section => section.programStage == programStage.UINControlMaster)
              .flatMap(section => section.items)
              .map(item => item .id);

            const eventPayload1 = createPayload.event({
              tei, 
              orgUnit: orgUnitId,
              program: programs.UINControlMaster,
              programStage: programStage.UINControlMaster,
              enrollment: enrollment.enrollment,
              event:tei.values[programStage.UINControlMaster]
            })
            await dataApi.update(eventPayload1);

            tei.dataElements = tei.stageSection
              .filter(section => section.programStage == programStage.completionCheckList)
              .flatMap(section => section.items)
              .map(item => item .id);

            const eventPayload2 = createPayload.event({
              tei, 
              orgUnit: orgUnitId,
              program: programs.UINControlMaster,
              programStage: programStage.completionCheckList,
              enrollment: enrollment.enrollment,
              event: ''
            })
            await dataApi.update(eventPayload2);
            toast({ status: "SUCCESS", message: "Draft Saved Successfully", position: "center"});
            fetchAffiliate();
            hideLoader();
          } else if(tei.tabId == 'affiliate-details') {
          if(buttonId == 'save-as-draft-button' && tei.values[dataElements.disclaimer] === 'true') tei.values[dataElements.disclaimer]  = null;
          if(tei.values[dataElements.disclaimer] !== 'true' && tei.tabId == 'affiliate-details' && buttonId == 'submit-button') {
            toast({ status: "ERROR", message: " Please accept the disclaimer.", position: "center"});
            return;
          }
          showLoader('Uploading files!');
          const fileInputs = document.querySelectorAll(".file-upload");
          for(const input of fileInputs) {
              if (!tei.values[`${input.id}-modified`])  continue;
              const file = tei.values[input.id];
              try {
                  const formData = new FormData();
                  formData.append('file', file);  
                  const res = await dataApi.uploadFile(formData);
                  if(res.status == 'OK') {
                  tei.values[input.id] = res.response.fileResource.id;
                  } else {
                      toast({status: 'ERROR', message: `File generation error`});
                      tei.values[input.id] = null;
                  }
              } catch (error) {
                  toast({status: 'ERROR', message: `Error uploading file: ${error}`});
                  return;
              }
          }
          showLoader('Uploading Profile!');
          if(buttonId == 'submit-button') tei.values[attributes.acuityCheck] = 'In Progress';
          const attributePayload = createPayload.attribute({
            tei, 
            orgUnit: orgUnitId,
            program: programs.UINControlMaster,
          });
          const eventPayload = createPayload.event({
            tei, 
            orgUnit: orgUnitId,
            program: programs.UINControlMaster,
            programStage: programStage.UINControlMaster,
            enrollment: enrollment.enrollment,
            event:tei.values[programStage.UINControlMaster]
          })
          await dataApi.update(attributePayload);
          await dataApi.update(eventPayload);
          toast({ status: "SUCCESS", message: "Draft Saved Successfully", position: "center"});
          await fetchAffiliate();
          await renderTabSection();
          hideLoader();
        }
        break;
      }
    }
  });

  const resCountryOptions = await optionSetApi.get(optionSet.country);
  const countryNameAndCodes = {};
  resCountryOptions.options?.forEach(({ value, label }) => {
    countryNameAndCodes[value] = label;
  });

  const programMetadata = await programsApi.get(programs.UINControlMaster);

  const resUINControlStage = await programStageApi.get(programStage.UINControlMaster);
  const resCompletionCheckList = await programStageApi.get(programStage.completionCheckList);

  const resRules = await programsApi.rules(programs.UINControlMaster);
  const resRuleVariables = await programsApi.ruleVariables(programs.UINControlMaster);
  const resOptionGroups = await optionSetApi.getOptionGroups();
  tei.programRules = configureRules(resRuleVariables.programRuleVariables, resRules.programRules, resOptionGroups.optionGroups);

  const programAttributes = convert.attributes({ program: programMetadata, disabled: false });
  const uinStage = convert.stage({ programStage: resUINControlStage, disabled: false });
  const completionCheckList = convert.stage({ programStage: resCompletionCheckList, disabled: false });
  tei.attributeSection = programAttributes.sections;
  tei.attributes =  programAttributes.sections.flatMap(section => section.items).map(attr => attr.id);
  tei.stageSection = [...programAttributes.sections, ...uinStage.sections, ...completionCheckList.sections];
  tei.values = { ...programAttributes.values, ...uinStage.values, ...completionCheckList.values };
  tei.fileType = new Set([...uinStage.fileType, ...completionCheckList.fileType]);
  tei.tabId = 'affiliate-details';
  
  await fetchAffiliate();
  updateMetadataAndRender();

  async function fetchAffiliate() {
    const params = new URLSearchParams(window.location.search);
    const affiliate = params.get('affiliate');

    if (affiliate) {
      try {
        const resAffiliate = await dataApi.getTrackedEntity(affiliate);
        if (!resAffiliate.trackedEntities) {
          const errorBody = await resAffiliate.json();
          throw new Error(errorBody.message || 'Request failed');
        }
        tei.affiliate = resAffiliate.trackedEntities[0];

        const dataValues = convert.trackedEntity(tei.affiliate, tei.fileType);
        for(let id of tei.fileType) {
          dataValues[`${id}-modified`] = false;
          if(dataValues[id]) {
            dataValues[`${id}-href`] = `../../events/files?eventUid=${dataValues[`${id}-event`]}&dataElementUid=${id}`
            dataValues[`${id}-file`] = await dataApi.getFile(dataValues[id]);
          }
        }
        
        tei.values = {...tei.values, ...dataValues};

        //Display countryi n the header
        const countryName = countryNameAndCodes[tei.values[attributes.countryRegistration]];
        document.getElementById('country').innerHTML = countryName ? `(${countryName})` : '';

        if (tei.values[dataElements.disclaimer] === "true" && tei.tabId=='affiliate-details')  tei.disabled = true;
        else tei.disabled = false;
            
      }
      catch (err) {
        iziToast.info({
          message: "Affiliate Not found!",
          timeout: 1500,
        })
        return;
      }
    }
  }
  
  function updateMetadataAndRender() {
  if (tei.values[dataElements.disclaimer] === "true" && tei.tabId=='affiliate-details')  tei.disabled = true;
  else tei.disabled = false;
            
    tei.tabSection = tei.stageSection.filter(section => section.description == tei.tabId);
    tei.metadata = Object.fromEntries(
      tei.tabSection.flatMap(section => section.items).map(item => [item.id, item])
    );

    if(tei.tabId == 'affiliate-details') {
      tei.dataElements = tei.stageSection
      .filter(section => section.programStage == programStage.UINControlMaster)
      .flatMap(section => section.items)
      .map(item => item .id);
      tei.dataElements.push(dataElements.disclaimer);
      tei.attributes.push(attributes.acuityCheck);
    }
    else if(tei.tabId == 'bank-details') {
      const bankIds = []
      tei.tabSection.forEach(section => {
        if(section.id == programSection.bank || section.id == programSection.bank2 || section.id == programSection.bank3) {
          section.items.forEach(item => {
            item.disabled = true;
            bankIds.push(item.id);
          });
        }
        section.items.forEach(item => {
          if(bankIds.includes(item.id)) item.disabled = true;
        })
      })
    }
    else if(tei.tabId == 'core-completion')  {
      tei.dataElements = tei.stageSection
      .filter(section => section.programStage == programStage.completionCheckList)
      .flatMap(section => section.items)
      .map(item => item .id);
      for(let id in tei.metadata)  {
        if(id != dataElements.dueDiligence && id != dataElements.bankingDetails) {
          tei.metadata[id].disabled = true;
          tei.values[id] = 'true';
        }
      }
    }
    renderTabSection();
  }

  async function renderTabSection() {
    $('.profile-tab').removeClass('active');
    $(`#${tei.tabId}`).addClass('active');
    
    if(tei.values[attributes.countryRegistration] != tei.values['qwmiJR8KAYb']) {
      const dataSetValues = await populateCountryIncomeStatus(tei.values[attributes.countryRegistration]);
      if(dataSetValues?.['qwmiJR8KAYb']) {
        tei.values[dataElements.countryIncomeStatus] = dataSetValues['qwmiJR8KAYb'];
        tei.values['qwmiJR8KAYb'] = tei.values[attributes.countryRegistration] ;
      }
      else tei.values['qwmiJR8KAYb'] = 'N/A'
      if(dataSetValues?.['HdIYcsycBXP']) tei.values[dataElements.oecdDACEligible] = dataSetValues['HdIYcsycBXP'];
    }
    ruleCallback(tei.programRules, tei.tabSection, tei.mandatoryList, tei.metadata, tei.values);
    
    tei.mandatoryList = tei.tabSection.flatMap(section => section.items.filter(item => tei.metadata[item.id].mandatory).map(item => item.id));
    
    const sectionDisplay = renderSections(tei.tabSection, tei.disabled);
    const disclaimerCheck = `
              <div class="card mb-3" style="border-radius: 0.5rem; background-color: white; border: 1px solid #e3e6f0;">
                <div class="card-body d-flex align-items-start">
                  <div class="form-check mr-3">
                    <input class="form-check-input" type="checkbox" id="${dataElements.disclaimer}" ${tei.values[dataElements.disclaimer] ? 'checked' : ''}  >
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
              </div>`
    document.querySelector('.profile-tab-content').innerHTML = `${sectionDisplay}${tei.tabId == 'affiliate-details' ? disclaimerCheck : ''}`

    var buttonHtml = '';
    if (TABS[tei.tabId].prev.value) {
      buttonHtml += `<div class="col-4 mb-2">
        <button type="button" class="btn btn-lg btn-block" id="prev-button"  
          style="background-color: #6a6a6a; color: white;">${TABS[tei.tabId].prev.label}</button>
      </div>`;
    }
    if (TABS[tei.tabId].saveAsDraft.value) {
      buttonHtml += `<div class="col-4 mb-2">
        <button type="button" class="btn btn-lg btn-block" id="save-as-draft-button"  
          style="background-color: rgb(211, 211, 211); color: black;">${TABS[tei.tabId].saveAsDraft.label}</button>
      </div>`;
    }
    buttonHtml += `<div class="col-4 mb-2">
        <button type="button" class="btn btn-lg btn-block" id="submit-button"
          style="background-color: rgb(235, 51, 0); color: white;" ${tei.disabled ? 'disabled' : ''}>Submit</button>
      </div>`;
    if (TABS[tei.tabId].next.value) {
      buttonHtml += `<div class="col-4 mb-2">
        <button type="button" class="btn btn-lg btn-block" id="next-button" 
          style="background-color: rgb(235, 51, 0); color: white;">${TABS[tei.tabId].next.label}</button>
        </div>`;
    }
    document.querySelector('.profile-tab-buttons').innerHTML = buttonHtml;
  }

  function renderSections(sections, forceDisabled = false) {
    let container = "";

    for (const section of sections) {
      const elements = section.items.filter(item => !item.hidden)
      if (!elements.length) continue;
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "card mb-4 p-3";
      sectionDiv.style.backgroundColor = "white";
      sectionDiv.style.borderRadius = "8px";
      sectionDiv.innerHTML = `<h5 style="color:#3b71ca;font-weight:bold;">${section.name}</h5>`;

      const rowDiv = document.createElement("div");
      rowDiv.className = "row";
      sectionDiv.appendChild(rowDiv);

      for (const el of section.items) {
        if (el.hidden) continue;
        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "form-group col-md-4 mb-2";
        const isDisabled = forceDisabled || el.disabled;
        fieldWrapper.innerHTML = `
                <label>
                    ${el.name}
                    ${el.mandatory ? '<span class="text-danger">*</span>' : ''}
                </label>
                ${fetchValueType({ id: el.code, valueType: el.valueType, valueSet: el.valueSet }, tei.values[el.code], { href: (tei?.values[`${el.code}-href`] || ""), file: (tei?.values[`${el.code}-file`] || "") }, (isDisabled))}

                <div id="error-${el.code}" style="color: red"></div>
            `;
        rowDiv.appendChild(fieldWrapper);
      }
      container += sectionDiv.outerHTML;
    }
    return container;
  }
  async function populateCountryIncomeStatus(countryCode) {
     if (!countryCode) return;
     try {
      const resOrgUnit = await orgUnitsApi.get({filter: countryCode});
      const countryOrgUnit = resOrgUnit.organisationUnits?.[0].id;

      if (!countryOrgUnit) return;
      const dataSetValues = await dataSet.getValues();
      const elementValues = dataSetValues?.dataValues.filter(
        dv => dv.orgUnit === countryOrgUnit
       );
      const incomeStatusDV = Object.fromEntries(
        elementValues.map(({ dataElement, value }) => [dataElement, value])
      );
      return incomeStatusDV;
     } catch (err) {
        console.error("Failed to load country dataset values", err);
     }
   }

function showLoader(message = "Uploading") {
  let loader = document.getElementById("global-loader");

  // If loader already exists, just update its message
  if (loader) {
    loader.querySelector(".loader-message").textContent = message;
    return;
  }

  loader = document.createElement("div");
  loader.id = "global-loader";

  loader.innerHTML = `
    <div style="
      position: fixed;
      top:0; left:0;
      width:100%; height:100%;
      background: rgba(0,0,0,0.5);
      display:flex;
      justify-content:center;
      align-items:center;
      z-index:9999;
    ">
      <div style="
        background:white;
        padding:30px 40px;
        border-radius:10px;
        text-align:center;
        box-shadow:0 4px 20px rgba(0,0,0,0.2);
      ">
        <div class="spinner" style="
          border:5px solid #eee;
          border-top:5px solid #15803d;
          border-radius:50%;
          width:40px;
          height:40px;
          margin:0 auto 15px;
          animation: spin 1s linear infinite;
        "></div>

        <p class="loader-message" style="font-weight:500;">
          ${message}
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(loader);

  if (!document.getElementById("loader-style")) {
    const style = document.createElement("style");
    style.id = "loader-style";
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

  function hideLoader() {
    const loader = document.getElementById("global-loader");
    if (loader) loader.remove();
  }
})