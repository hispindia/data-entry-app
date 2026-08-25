import {
  programs,
  programStage,
  dataElements,
  tei,
  optionSet,
  orgUnit,
  programRules,
  attributes,
  ROLE_ACUITY_DE,
  programSection,
  trackedEntityType,
} from "../../../constant.js";

import {
  meApi,
  optionSetApi,
  orgUnitsApi,
  programsApi,
  programStageApi,
} from "../../../api/metaDataApi.js";

import { populateOptions, convert, fetchValueType } from "../../metadata.js";
import { dataApi } from "../../../api/DataApi.js";
import { getUserConfig } from "../../config.js";
import { toast } from "../../utils.js";
import { createPayload } from "../../../api/payload.js";

const ROLE_DISPLAY_FIELDS = {
  chairperson: {
    label: "Chairperson",
    fields: [
      dataElements.chairPersonName,
      dataElements.chairPersonEmail,
      dataElements.chairPersonPhone,
      dataElements.chairPersonNationality,
      dataElements.chairPersonDob,
      dataElements.chairPersonIdNumber
    ]
  },
  viceChairperson: {
    label: "Vice Chairperson",
    fields: [
      dataElements.viceChairPersonName,
      dataElements.viceChairPersonEmail,
      dataElements.viceChairPersonPhone,
      dataElements.viceChairPersonNationality,
      dataElements.viceChairPersonDob,
      dataElements.viceChairPersonIdNumber
    ]
  },
  secretary: {
    label: "Secretary",
    fields: [
      dataElements.secretaryName,
      dataElements.secretaryEmail,
      dataElements.secretaryPhone,
      dataElements.secretaryNationality,
      dataElements.secretaryDob,
      dataElements.secretaryIdNumber
    ]
  },
  treasurer: {
    label: "Treasurer",
    fields: [
      dataElements.treasurerName,
      dataElements.treasurerEmail,
      dataElements.treasurerPhone,
      dataElements.tressurerNationality,
      dataElements.treasurerDob,
      dataElements.treasurerIdNumber
    ]
  },
  youth: {
    label: "Youth",
    fields: [
      dataElements.youthName,
      dataElements.youthEmail,
      dataElements.youthPhone,
      dataElements.youthNationality,
      dataElements.youthDob,
      dataElements.youthIdNumber
    ]
  },
  seniorManagementCEO: {
    label: "Chief Executive Officer",
    fields: [
      dataElements.seniorManagementCEOName,
      dataElements.seniorManagementCEOEmail,
      dataElements.seniorManagementCEOPhone,
      dataElements.seniorManagementCEONationality,
      dataElements.seniorManagementCEODob,
      dataElements.seniorManagementCEOIdNumber
    ]
  },
  seniorManagementFinance: {
    label: "Director of Finance",
    fields: [
      dataElements.seniorManagementDirectorFinanceName,
      dataElements.seniorManagementDirectorFinanceEmail,
      dataElements.seniorManagementDirectorFinancePhone,
      dataElements.seniorManagementDirectorFinanceNationality,
      dataElements.seniorManagementDirectorFinanceDob,
      dataElements.seniorManagementDirectorFinanceIdNumber
    ]
  },
  seniorManagementPrograms: {
    label: "Director of Programs",
    fields: [
      dataElements.SeniorManagementDirectorProgramsName,
      dataElements.SeniorManagementDirectorProgramsEmail,
      dataElements.SeniorManagementDirectorProgramsPhone,
      dataElements.SeniorManagementDirectorProgramsNationality,
      dataElements.SeniorManagementDirectorProgramsDob,
      dataElements.SeniorManagementDirectorProgramsIdNumber
    ]
  },
  bank: {
    label: "Bank Details",
    fields: [
      dataElements.bankName,
      dataElements.bankAddress,
      dataElements.bankAccountNumber,
      dataElements.bankAccountCurrency,
      dataElements.bankSwift,
      dataElements.bankIBAN
    ]
  },
  bank2: {
    label: "Bank Details 2",
    fields: [
      dataElements.bank2Name,
      dataElements.bank2Address,
      dataElements.bank2AccountNumber,
      dataElements.bank2AccountCurrency,
      dataElements.bank2Swift,
      dataElements.bank2IBAN
    ]
  },
  bank3: {
    label: "Bank Details 3",
    fields: [
      dataElements.bank3Name,
      dataElements.bank3Address,
      dataElements.bank3AccountNumber,
      dataElements.bank3AccountCurrency,
      dataElements.bank3Swift,
      dataElements.bank3IBAN
    ]
  },
};

const STAGE_MAPPING = {
  chairperson: programSection.ChairPerson,
  viceChairperson: programSection.viceChairperson,
  secretary: programSection.Secretary,
  treasurer: programSection.Treasurer,
  youth: programSection.Youth,
  seniorManagementCEO: programSection.seniorManagement,
  seniorManagementFinance: programSection.seniorManagementFinance,
  seniorManagementPrograms: programSection.seniorManagementPrograms,
  bank: programSection.bank,
  bank2: programSection.bank2,
  bank3: programSection.bank3,
};

 const handleAocRequestChange = async(userConfig) => {
  $("#requestChange").css("display", "block");

  ["affiliateModal", "detailModal", "approveModal"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  const stageRes = await programStageApi.get(programStage.UINControlMaster);
  const stage = convert.stage({ programStage: stageRes });

  tei.programStages = stage.sections;
  tei.dataElements = stage.dataElements;
  tei.metadata = stage.metadata;
  tei.fileType = new Set(stage.fileType);

  async function fetchAffiliateList() {

    document.getElementById("searchResults").style.display = "none";
    const programAffiliateKyc = await programsApi.get(programs.UINControlMaster);
    const regionValue = document.getElementById("Region").value;
    const countryValue = document.getElementById("Countries").value;
    const ouRes = await orgUnitsApi.get({level: 2, filter: countryValue});
    const matched = ouRes?.organisationUnits?.find(ou => ou.code === countryValue);    
    if(matched) orgUnit.id = matched.id;

    const name = document.getElementById("regName").value;
    const uin = document.getElementById("uin").value;
    let otherParam = "";
    if (name) otherParam += `&filter=${attributes.legalName}:LIKE:${name.trim()}`;
    if (!uin && !name && !regionValue) {
      toast({ status: 'INFO', message: 'Please Enter UIN or Name or select Region and Country to Search.', position: 'center' });
      return;
    }
    if (regionValue && !countryValue) {
      toast({ status: 'INFO', message: 'Please Select Country!' });
      return;
    }
    if (uin) otherParam += `&filter=${attributes.uinCode}:EQ:${uin.trim()}`; 
    if (regionValue) otherParam += `&filter=${attributes.region}:EQ:${regionValue}`;
    if (countryValue) otherParam += `&filter=${attributes.countryRegistration}:EQ:${countryValue}`;
     
      const affiliateList = await dataApi.get(
        orgUnit.id,
        programs.UINControlMaster,
        otherParam
      );
      
      if (!affiliateList?.trackedEntities || affiliateList.trackedEntities.length === 0) {
        toast({status: 'INFO', message: 'No affiliate found', position: "center"});
        return;
      }
      
      document.getElementById("searchResults").style.display = "block";
      const headerList = programAffiliateKyc.programTrackedEntityAttributes
        .filter((trackedEntityAttr) => trackedEntityAttr.displayInList)
        .map((attr) => ({
          id: attr.trackedEntityAttribute.id,
          name: attr.trackedEntityAttribute.name,
        }));

      const affilitateAttrList = affiliateList.trackedEntities.map(
        (trackedEntity) => {
          const attributes = {};
          trackedEntity.attributes.forEach(
            (attr) => (attributes[attr.attribute] = attr.value)
          );
          return attributes;
        }
      );

      var theadAffiliateRow = "";
      headerList.forEach(
        (item) => theadAffiliateRow += `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`
      );
      document.getElementById("thead-affiliate").innerHTML = `${theadAffiliateRow}<th style="padding: 12px 15px; font-weight: 600; text-align: center;">Action</th><th style="padding: 12px 15px; font-weight: 600; text-align: center;"><div style="display: flex; justify-content: center; align-items: center; gap: 8px;">Schedule Acuity Check
      <input type="checkbox" id="headerSelectAllBtn" class="beautiful-checkbox" title="Select All"></div></th>`;

      if (!document.getElementById('beautiful-checkbox-style')) {
        const style = document.createElement('style');
        style.id = 'beautiful-checkbox-style';
        style.innerHTML = `
            .beautiful-checkbox {
                appearance: none;
                background-color: #fff;
                margin: 0;
                font: inherit;
                color: currentColor;
                width: 22px;
                height: 22px;
                border: 2px solid #cbd5e1;
                border-radius: 6px;
                display: grid;
                place-content: center;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
            }
            .beautiful-checkbox::before {
                content: "";
                width: 12px;
                height: 12px;
                clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                transform: scale(0);
                transform-origin: bottom left;
                transition: 120ms transform ease-in-out;
                background-color: white;
            }
            .beautiful-checkbox:checked {
                background-color: #E93300;
                border-color: #E93300;
            }
            .beautiful-checkbox:checked::before {
                transform: scale(1);
            }
            .beautiful-checkbox:hover {
                border-color: #E93300;
                box-shadow: 0 0 0 3px rgba(233, 51, 0, 0.1);
            }
            .beautiful-checkbox:disabled {
               cursor: not-allowed;      
                opacity: 0.6;
                filter: grayscale(100%);
      }
        `;
        document.head.appendChild(style);
      }

      var tbodyAffiliateRow = "";
      affilitateAttrList.forEach((affiliate, index) => {
        const trackedEntityId = affiliateList.trackedEntities[index].trackedEntity;
        const orgUnitId = affiliateList.trackedEntities[index].orgUnit;
        const acuityInProgress = affiliate[attributes.acuityCheck] === "In Progress";
        tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`;
        headerList.forEach(

          (attr) => tbodyAffiliateRow += `<td style="padding: 15px;">${affiliate[attr.id] ? affiliate[attr.id] : ""}</td>`
        );
        tbodyAffiliateRow += `
          <td style="padding: 15px; text-align: center; vertical-align: middle;">
            <div class="actions" style="display: flex; justify-content: center;">
              <button class="btn-icon blue" style="cursor: pointer; border: none; background: transparent; color: #0056b3;" title="View Details" onclick="openAffiliateModal(null, '${trackedEntityId}')">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            </div>
          </td>
          <td style="padding: 15px; text-align: center; vertical-align: middle;">
            <div style="display: flex; justify-content: center;">
              <input type="checkbox" class="beautiful-checkbox" data-tei-id="${trackedEntityId}" data-org-unit="${orgUnitId}" title="Select for Acuity Check" ${acuityInProgress ? 'checked disabled' : ''}>
            </div>
          </td>
        </tr>`;
      });
      document.getElementById("tbody-affiliate").innerHTML = tbodyAffiliateRow;
      const headerSelectAllBtn = document.getElementById("headerSelectAllBtn");
      if (headerSelectAllBtn) {
      headerSelectAllBtn.addEventListener("change", (e) => {
        const bodyCheckboxes = document.querySelectorAll("#tbody-affiliate .beautiful-checkbox:not([disabled])");
        bodyCheckboxes.forEach(cb => {
          cb.checked = e.target.checked;
        });
      });
    }
  }

  const resRegion = await optionSetApi.get(optionSet.region);
  const resOptionGroups = await optionSetApi.getOptionGroups();


  const displayCountries = (value) => {
        const optionGroup = resOptionGroups.optionGroups.find(group => group.id == programRules.hideCountry[value]);
        if(optionGroup) {
            const countries = optionGroup.options;
            const UserCountry = userConfig.orgUnits
                                .filter(country => countries.some(c => c.code == country.code))
                                .map(option => ({label: option.name, value: option.code}))
            
            return UserCountry.sort((a, b) => a.label.localeCompare(b.label));
        }
        return [];
  }

  const userRegion = userConfig.attributeValues.find(attrValue => attrValue.attribute.id == "gfl4DSpDn3o");
  if(userRegion) {
        const region = resRegion.options.filter(region => region.id == userRegion.value);
                 
        document.getElementById("Region").innerHTML = `<option value='${region[0].value}' selected> ${region[0].label} </option>`;

        const countries = displayCountries(region[0].value);
        document.getElementById("Countries").innerHTML = populateOptions(countries);
  } else {
        const list = resRegion.options.sort((a, b) => a.label.localeCompare(b.label));
        document.getElementById("Region").innerHTML = populateOptions(list);
  }

    
  document.getElementById('Region').addEventListener('change', function (e) {
        const { value } = e.target;
        const countries = displayCountries(value);
        document.getElementById("Countries").innerHTML = populateOptions(countries);
  })

  document
    .getElementById("searchButton")
    .addEventListener("click", fetchAffiliateList);

  const selectAllBtn = document.getElementById("selectAllAcuityBtn");
  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(".beautiful-checkbox");
      if (checkboxes.length === 0) return;
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      checkboxes.forEach(cb => cb.checked = !allChecked);
    });
  }

  const submitAcuityBtn = document.getElementById("submitAcuityBtn");
  if (submitAcuityBtn) {
    submitAcuityBtn.addEventListener("click", async () => {
      const selectedCheckboxes = document.querySelectorAll(".beautiful-checkbox:checked");
      if (selectedCheckboxes.length === 0) {
        toast({ status: "INFO", message: "Please select at least one affiliate for Acuity Check", position: 'bottomRight' });
        return;
      }

      try {
        submitAcuityBtn.disabled = true;
        submitAcuityBtn.innerText = "Submitting...";
        const teiIds = Array.from(selectedCheckboxes).map(cb =>
        cb.getAttribute("data-tei-id")
      );
      await Promise.all(
        teiIds.map(async (teiId) => {
          try {
            await dataApi.dataStoreDelete("accuityResponse", teiIds);
          } catch (err) {
            if (err.status !== 404) {
              throw err;
            }
          }
        })
      );
        const trackedEntities = Array.from(selectedCheckboxes).map(cb => {
          return {
            trackedEntity: cb.getAttribute("data-tei-id"),
            orgUnit: cb.getAttribute("data-org-unit"),
            trackedEntityType: trackedEntityType,
            attributes: [{ attribute: attributes.acuityCheck, value: "In Progress" }]
          };
        });

        const payload = { trackedEntities };
        await dataApi.postAttribute(payload);

        toast({ status: "SUCCESS", message: "Request sent for Acuity check successfully", position: "bottomCenter" });
        selectedCheckboxes.forEach(cb => cb.checked = false);
        await fetchAffiliateList();
      } catch (err) {
        console.error("Failed to update acuity status:", err);
        toast({ status: "ERROR", message: "Failed to update Acuity status. Please try again." });
      } finally {
        submitAcuityBtn.disabled = false;
        submitAcuityBtn.innerText = "Submit Acuity";
      }
    });
  }


  // Modal and Tabs Logic
  const affiliateModal = document.getElementById('affiliateModal');
  if (affiliateModal) {
    const closeButtons = affiliateModal.querySelectorAll('#affiliateModalClose, #affiliateModalCloseFooter');
    closeButtons.forEach(btn => btn.addEventListener('click', () => {
        affiliateModal.style.display = 'none';
    }));

    const tabButtons = affiliateModal.querySelectorAll('.tab-btn');
    const tabPanels = affiliateModal.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            const activePanel = affiliateModal.querySelector(`#tab-${tabName}`);
            if (activePanel) activePanel.classList.add('active');
        });
    });
  }

  window.openAffiliateModal = async (mode, teiId) => {
    const modal = document.getElementById("affiliateModal");
    modal.style.display = "flex";
    showRoleLoaders();
    const res = await dataApi.getTrackedEntity(teiId);
    tei.affiliate = res.trackedEntities[0];

    const attrs = {};
    tei.affiliate.attributes.forEach(a => (attrs[a.attribute] = a.value));
    document.getElementById('affiliateModalSub').textContent = `UIN - ${attrs[attributes.uinCode] || ' '}`;
    document.getElementById('aff-name').textContent = attrs[attributes.legalName] || '';
    document.getElementById('aff-uin').textContent = attrs[attributes.uinCode] || '';
    document.getElementById('aff-country').textContent = attrs[attributes.countryRegistration] || '';
    document.getElementById('aff-region').textContent = attrs[attributes.region] || '';

    const dataValues = {};
    tei.affiliate.attributes.forEach(attr => dataValues[attr.attribute] = attr.value);
    tei.affiliate.enrollments.forEach(enroll => {

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
      for(let id of tei.fileType) {
          if(dataValues[id]) {
            try {
              dataValues[`${id}-href`] = `../../events/files?eventUid=${dataValues[`${id}-event`]}&dataElementUid=${id}`
              dataValues[`${id}-file`] = await dataApi.getFile(dataValues[id]);
              const file =  await dataApi.getFileResources(dataValues[`${id}-event`], id);
              const formData = new FormData();
              formData.append('file', file,  dataValues[`${id}-file`].name)
              const res = await dataApi.uploadFile(formData);
              if(res.status == 'OK') {
              dataValues[id] = res.response.fileResource.id;
              } else {
              toast({status: 'ERROR', message: `File generation error`});
              }
            } catch (error) {
              toast({status: 'ERROR', message: `Error uploading file: ${error}`});
              return;
            }
          }
        }
    

    tei.values = dataValues;

    renderRoleTables();
  };

  function renderRoleTables() {
    const board = document.getElementById("tbody-board");
    const senior = document.getElementById("tbody-senior");
    const bank = document.getElementById("tbody-bank");

    board.innerHTML = senior.innerHTML = bank.innerHTML = "";

    const addRow = (tbody, rolekey) => {
      const roleConfig = ROLE_DISPLAY_FIELDS[rolekey];
      if (!roleConfig) return;

      const { label, fields } = roleConfig;
      tbody.innerHTML += `
        <tr>
          <td>${label}</td>
          ${fields
            .map(fieldCode => `<td>${tei.values[fieldCode] || ""}</td>`)
            .join("")}
          <td>
            <div class="actions">
              <button class="btn-icon blue" style="cursor: pointer;" title="Request Change" onclick="openRequestChangeModal('${rolekey}')">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>`;
    };

    addRow(board, "chairperson");
    addRow(board, "viceChairperson");
    addRow(board, "secretary");
    addRow(board, "treasurer");
    addRow(board, "youth");

    addRow(senior, "seniorManagementCEO");
    addRow(senior, "seniorManagementFinance");
    addRow(senior, "seniorManagementPrograms");

    addRow(bank, "bank");
    addRow(bank, "bank2");
    addRow(bank, "bank3");
  }

  window.openRequestChangeModal = async roleKey => {
    const modal = ensureChangeModal();
    const body = modal.querySelector("#requestChangeModalBody");
    body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 150px;">
        <div class="section-loader"></div>
      </div>
    `;
    $(modal).modal("show");

    const stageId = programStage.UINControlMaster;
    let fieldsToRender = [];

    if (stageId) {
      try {
        const stageRes = await programStageApi.get(stageId);
        if (stageRes) {
          const stage = convert.stage({ programStage: stageRes });
          const roleStageId = STAGE_MAPPING[roleKey];
          const section = stage.sections.find(s => s.id === roleStageId);
          if (section) {
            fieldsToRender = section.items;
          }
        }
      } catch (e) {
        console.error("Failed to load stage details for Request Change", e);
        body.innerHTML = `<p class="text-danger">Could not load form details. Please try again later.</p>`;
        return;
      }
    }
   
    body.innerHTML = "";
    if (fieldsToRender.length === 0) {
      body.innerHTML = `<div class="alert alert-warning">No fields found for this role.</div>`;
      return;
    }

    const row = document.createElement("div");
    row.className = "row";

    let fieldsHtml = "";
    fieldsToRender.forEach(meta => {
      const metaWithId = { ...meta, id: meta.code };
      const fileMeta = {
        href: tei.values[`${meta.code}-href`] || "",
        file: tei.values[`${meta.code}-file`] || ""
      };
      fieldsHtml += `
        <div class="col-md-6 mb-2">
          <label>${meta.name} ${meta.mandatory ? '<span class="text-danger">*</span>' : ''}</label>
          ${fetchValueType(metaWithId, tei.values[meta.code] || "", fileMeta, false)}
        </div>`;
    });
    row.innerHTML = fieldsHtml;

    body.appendChild(row);

    const localFileSelections = {};
    fieldsToRender.forEach(meta => {
      const code = meta.code;
      const el = document.getElementById(code);
      if (!el || el.type !== "file") return;

      el.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        localFileSelections[code] = file;
        const blobUrl = URL.createObjectURL(file);
        let fileLink = document.getElementById(`${code}-link`);
        if (!fileLink) {
          fileLink = document.createElement("a");
          fileLink.id = `${code}-link`;
          fileLink.style.marginLeft = "8px";
          el.insertAdjacentElement("afterend", fileLink);
        }
        fileLink.href = blobUrl;
        fileLink.textContent = file.name;
        fileLink.target = "_blank";
        fileLink.style.display = "inline-block";
      });
    });
    
    if (window.flatpickr) {
        flatpickr(modal.querySelectorAll(".flatpickr-date-input"), { 
                dateFormat: "Y-m-d", 
                disable: [
                  function(date) { 
                      return (date.getFullYear() < 1924) ||  (date > new Date()); 
                    }
                ] 
          });
    }
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

  modal.querySelector("#requestChangeSubmit").onclick = async () => {
  try {

    const valuesToSend = { ...tei.values };
    const fileUploads = {};

    const existingEvent = tei?.affiliate?.enrollments?.[0]?.events.find(
      e => e.programStage === programStage.UINControlMaster
    );
    const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program === programs.UINControlMaster)?.orgUnit;
    const enrollment = tei.affiliate.enrollments.find(enroll => enroll.program === programs.UINControlMaster)?.enrollment;

    fieldsToRender.forEach(meta => {
      const code = meta.code;
      const el = document.getElementById(code);

      if (!el) return;

      if (el.type === "file") {
       if (localFileSelections[code]) {
        fileUploads[code] = localFileSelections[code];
       }
      } else if (el.matches("select, textarea, input")) {
      valuesToSend[code] = el.value;
      }
    });

    for (const [code, file] of Object.entries(fileUploads)) {
      const formData = new FormData();
      formData.append("file", file, file.name || code);

      const res = await dataApi.uploadFile(formData);
      const uploadedFileId = res?.response?.fileResource?.id || res?.fileResource?.id;
      if (res?.status !== "OK") {
        throw new Error(`File upload failed for ${code}`);
      }

      valuesToSend[code] = uploadedFileId;
      valuesToSend[`${code}-href`] =  `../../events/files?eventUid=${existingEvent?.event || ""}&dataElementUid=${code}`;
      valuesToSend[`${code}-file`] = { name: file.name };

    }
    tei.values = { ...tei.values, ...valuesToSend };
     
    const acuityDeId = ROLE_ACUITY_DE[roleKey];

    if (!acuityDeId) {
      throw new Error("Acuity data element not mapped for role: " + roleKey);
    }

    tei.values[acuityDeId] = "In-Progress";
    valuesToSend[acuityDeId] = "In-Progress"
    valuesToSend[dataElements.requestedBy] = userConfig?.username;
    tei.values = { ...tei.values, ...valuesToSend };
    tei.values[dataElements.requestedBy] = userConfig?.username;
    tei.values = { ...tei.values, ...valuesToSend};
    const payload = createPayload.event({
      tei,
      event: existingEvent.event,
      orgUnit: orgUnitId,
      enrollment: enrollment,
      program: programs.UINControlMaster,
      programStage: programStage.UINControlMaster
    });

    await dataApi.enroll(payload);
    toast({
      status: "SUCCESS",
      message: "Request Submitted Successfully",
      position: "bottomCenter"
    });

    $(modal).modal("hide");

    openAffiliateModal(null, tei.affiliate.trackedEntity);

  } catch (err) {
    console.error("Submit error:", err);
    toast({
      status: "ERROR",
      message: err.message || "Something went wrong"
    });
  }
  };
};

  function ensureChangeModal() {
    let modal = document.getElementById("requestChangeModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "requestChangeModal";
    modal.className = "modal";
    modal.style.zIndex = "1060"; 
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Request Change</h5>
            <button class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body" id="requestChangeModalBody"></div>
          <div class="modal-footer">
            <button class="btn bg-transparent border rounded-xl" data-dismiss="modal">Cancel</button>
            <button class="btn" style="background-color:#E93300; border-color:#E93300; color: #ffff" id="requestChangeSubmit">Request Change</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }
}
function showRoleLoaders() {

    const board = document.getElementById("tbody-board");
    const senior = document.getElementById("tbody-senior");
    const bank = document.getElementById("tbody-bank");

    const loaderHtml = `
          <tr>
            <td colspan="7">
                <div class="loader-wrapper">
                  <div class="section-loader"></div>
                </div>
            </td>
          </tr>
    `;

    board.innerHTML = loaderHtml;
    senior.innerHTML = loaderHtml;
    bank.innerHTML = loaderHtml;
}



export default handleAocRequestChange;
