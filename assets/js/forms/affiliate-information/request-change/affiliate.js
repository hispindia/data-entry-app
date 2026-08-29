import { dataApi } from "../../../api/DataApi.js";
import { optionSetApi, programsApi, programStageApi } from "../../../api/metaDataApi.js";
import { createPayload } from "../../../api/payload.js";
import { programs, programStage, tei } from "../../../constant.js";
import { configureRules, convert, fetchValueType, ruleCallback } from "../../metadata.js";
import { isGmailOrYahoo, toast } from "../../utils.js";
import { hideLoader, showLoader } from "./common.js";


export const displayAffiliate = async (affiliate) => {
  showLoader('Fetching Affiliate...');
  $('.modal-close').on('click', function () {
    $(this).closest('.modal').hide();
  });

  $('.profile-tab').on('click', function () {
    tei.tabId = this.id;
    updateTabTable();
  });

  $('.request-change-button').on('click',  async function () {
    if (checkMandatory()) {
      toast({ status: 'INFO', message: 'Please fill mandatory fields!' });
      return;
    }
    showLoader('Uploading files!');
    for (let id of tei.fileType) {
      if(tei.values[id]) {
        try {
          const formData = new FormData();
          if (tei.values[`${id}-modified`]) {
            const file = tei.values[id];
            formData.append('file', file);  
          } else  formData.append('file', tei.values[`${id}-fileResources`], tei.values[`${id}-file`].name)
          const res = await dataApi.uploadFile(formData);
          if (res.status == 'OK') {
            tei.values[id] = res.response.fileResource.id;
          } else {
            toast({ status: 'ERROR', message: `File generation error` });
            tei.values[id] = '';
          }
        } catch (error) {
          toast({ status: 'ERROR', message: `Error uploading file: ${error}` });
          return;
        }

      }
    }

    showLoader('Uploading details!');
    if (tei.tabDetails[tei.tabId]) {
      const section = tei.tabDetails[tei.tabId].find(section => section.sectionId == tei.tabSection[0].id);
      tei.values[section.status] = 'In-Progress';
    }
    const eventPayload = createPayload.event({
      tei,
      orgUnit: tei.affiliate.orgUnit,
      program: programs.UINControlMaster,
      programStage: programStage.UINControlMaster,
      enrollment: tei.affiliate.enrollments[0].enrollment,
      event: ""
    })
    await dataApi.update(eventPayload);
    toast({ status: "SUCCESS", message: "Draft Saved Successfully", position: "center" });
    await fetchAffiliate();
    document.getElementById('section-modal').style.display = "none";
    fetchAffiliate(affiliate);
    updateTabTable();
    hideLoader();
  });
  
  $('.request-change-content, .profile-content').on('change', async function (e) {
    if (e.target.matches("input, select, textarea")) {
      const { id, checked, value, type } = e.target;
      if (type === "file") {
        if (e.target.files.length > 0) {
          tei.values[id] = e.target.files[0];
          tei.values[`${id}-modified`] = true;
        }
        const blobUrl = URL.createObjectURL(e.target.files[0]);
        const fileLink = document.getElementById(`${id}-link`);
        if (fileLink) {
          fileLink.href = blobUrl;
          fileLink.textContent = e.target.files[0].name;
          fileLink.style.display = 'inline-block';
          fileLink.target = '_blank';
        }

        let errorEl = document.getElementById(`error-${id}`);
        if (errorEl) errorEl.innerHTML = '';
        renderTabSection();
        return;
      }

      tei.values[id] = type == 'checkbox' ? (checked ? 'true' : '') : value;
      const errorEl = document.getElementById(`error-${id}`);
      if (errorEl) errorEl.innerHTML = '';
      renderTabSection();
    }
  });

  tei.tabId = 'affiliate-details';

  await fetchAffiliate(affiliate);
  updateTabTable();

  async function fetchAffiliate(affiliate) {
    if (affiliate) {
      try {
        const resAffiliate = await dataApi.getTrackedEntity(affiliate);
        if (!resAffiliate.trackedEntities) {
          const errorBody = await resAffiliate.json();
          throw new Error(errorBody.message || 'Request failed');
        }
        tei.affiliate = resAffiliate.trackedEntities[0];

        const dataValues = convert.trackedEntity(tei.affiliate, tei.fileType);
        for (let id of tei.fileType) {
          dataValues[`${id}-modified`] = false;
          if (dataValues[id]) {
            dataValues[`${id}-href`] = `../../events/files?eventUid=${dataValues[`${id}-event`]}&dataElementUid=${id}`
            dataValues[`${id}-file`] = await dataApi.getFile(dataValues[id]);
            dataValues[`${id}-fileResources`] = await dataApi.getFileResources(dataValues[`${id}-event`], id);
          }
        }
        tei.values = { ...tei.values, ...dataValues };
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

  function updateTabTable() {

    $('.profile-tab').removeClass('active');
    $(`#${tei.tabId}`).addClass('active');

    tei.tabSection = tei.stageSection.filter(section => tei.tabDetails[section.id] == tei.tabId);
    tei.metadata = Object.fromEntries(
      tei.tabSection.flatMap(section => section.items).map(item => [item.id, item])
    );
    var thead = tei.tabDetails[`${tei.tabId}-fields`].map(name => `<th>${name}<//th>`).join('');
    thead += '<th style="padding: 12px 15px; font-weight: 600; text-align: center;">Action</th>'

    var tbody = '';
    tei.tabDetails[tei.tabId].forEach(member => {
      if(tei.tabId == 'affiliate-details') {
        tbody += renderTabSection();
      }
      else if (tei.tabId == 'bank-member') {
        tbody += `<tr>
        <td>${tei.values?.[member.name] || ''}</td>
        <td>${tei.values?.[member.address] || ''}</td>
        <td>${tei.values?.[member.telephone] || ''}</td>
        <td>${tei.values?.[member.accountNumber] || ''}</td>
        <td>${tei.values?.[member.accountCurrency] || ''}</td>
        <td>${tei.values?.[member.swift] || ''}</td>
        <td>${tei.values?.[member.iban] || ''}</td>
        <td>
        <button class="btn-icon blue" style="cursor: pointer; border: none; background: transparent; color: #0056b3;" title="View Details" data-section="${member.sectionId}">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>
        </td>
        </tr>`;
      }
      else {
        tbody += `<tr>
        <td>${member.designation.type == "id" ? (tei.values?.[member.designation.value] || "") : member.designation.value}</td>
        <td>${tei.values?.[member.name] || ''}</td>
        <td>${tei.values?.[member.email] || ''}</td>
        <td>${tei.values?.[member.phone] || ''}</td>
        <td>${tei.values?.[member.nationality] || ''}</td>
        <td>${tei.values?.[member.dob] || ''}</td>
        <td>${tei.values?.[member.idNumber] || ''}</td>
        <td>
        <button class="btn-icon blue" style="cursor: pointer; border: none; background: transparent; color: #0056b3;" title="View Details" data-section="${member.sectionId}">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </button>
        </td>
        </tr>`;
      }
    });

    document.getElementById('thead').innerHTML = thead;
    document.getElementById('tbody').innerHTML = tbody;
    hideLoader();
    document.getElementById('tbody').addEventListener('click', async function (e) {
      const button = e.target.closest('button');
      if(button?.id == "update-profile") {
        showLoader('Updating profile!')
        const attributePayload = createPayload.attribute({
            tei, orgUnit: tei.affiliate.orgUnit, program: programs.UINControlMaster,
        });

        await dataApi.update(attributePayload);
        hideLoader();
      }
      else if (button) {
        const sectionId = button.dataset.section;
        tei.tabSection = tei.stageSection.filter(section => section.id == sectionId);
        tei.metadata = Object.fromEntries(
          tei.tabSection.flatMap(section => section.items).map(item => [item.id, item])
        );
        renderTabSection();
      }
    })
  }

  function renderTabSection() {
    ruleCallback(tei.programRules, tei.tabSection, tei.mandatoryList, tei.metadata, tei.values);

    tei.mandatoryList = tei.tabSection.flatMap(section => section.items.filter(item => tei.metadata[item.id].mandatory).map(item => item.id));
    const sectionDisplay = renderSections(tei.tabSection, tei.disabled);
    if(tei.tabId == "affiliate-details") {
      return `${sectionDisplay}<div><button class="btn" id="update-profile" style="background-color: #E93300; color: #ffff;">Update</button>`;
    };
    document.getElementById('section-modal').style.display = "block";
    document.querySelector('.request-change-content').innerHTML = sectionDisplay;
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
        fieldWrapper.className = "form-group col-md-6 mb-2";
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

  function checkMandatory() {
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

}
