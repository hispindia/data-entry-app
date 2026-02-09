import {
  programs,
  programStage,
  dataElements,
  tei,
  optionSet,
  orgUnit,
  programRules,
  attributes
} from "../../constant.js";

import {
  optionSetApi,
  orgUnitsApi,
  programsApi,
  programStageApi
} from "../../api/metaDataApi.js";

import { populateOptions, convert, fetchValueType } from "../metadata.js";
import { dataApi } from "../../api/DataApi.js";
import { getUserConfig } from "../config.js";
import { toast } from "../utils.js";
import { createPayload } from "../../api/payload.js";

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
  }
};

const STAGE_LABELS = {
  [programStage.ChairPerson]: "Chairperson",
  [programStage.viceChairperson]: "Vice Chairperson",
  [programStage.Secretary]: "Secretary",
  [programStage.Treasurer]: "Treasurer",
  [programStage.Youth]: "Youth",
  [programStage.seniorManagement]: "Chief Executive Officer",
  [programStage.seniorManagementFinance]: "Director of Finance",
  [programStage.seniorManagementPrograms]: "Director of Programs",
  [programStage.bank]: "Bank Details"
};

const STAGE_MAPPING = {
  chairperson: programStage.ChairPerson,
  viceChairperson: programStage.viceChairperson,
  secretary: programStage.Secretary,
  treasurer: programStage.Treasurer,
  youth: programStage.Youth,
  seniorManagementCEO: programStage.seniorManagement,
  seniorManagementFinance: programStage.seniorManagementFinance,
  seniorManagementPrograms: programStage.seniorManagementPrograms,
  bank: programStage.bank
};

document.addEventListener("DOMContentLoaded", async () => {
  const userConfig = await getUserConfig();

  if (userConfig?.user) {
    userConfig.user.forEach(u => $(`.${u}`).hide());
  }

  $(".sidebar-menu").show();

  ["affiliateModal", "detailModal", "approveModal"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  document.querySelectorAll(".nav-link").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      const target =
        el.getAttribute("data-target") ||
        el.parentElement.getAttribute("data-target");
      if (target) window.location.href = target;
    });
  });

  const regionSelect = document.getElementById("Region");
  const countrySelect = document.getElementById("Countries");

  const resRegion = await optionSetApi.get(optionSet.region);
  const resOptionGroups = await optionSetApi.getOptionGroups();

  regionSelect.innerHTML = populateOptions(resRegion.options);

  regionSelect.addEventListener("change", e => {
    const regionCode = e.target.value;
    countrySelect.innerHTML = `<option value="">Select Country</option>`;
    if (!regionCode) return;

    const optionGroupId = programRules.hideCountry[regionCode];
    const optionGroup = resOptionGroups.optionGroups.find(
      g => g.id === optionGroupId
    );

    if (!optionGroup) return;

    const countries = optionGroup.options.map(o => ({
      label: o.name,
      value: o.code
    }));

    countrySelect.innerHTML = populateOptions(countries);
  });

  document
    .getElementById("searchButton")
    .addEventListener("click", fetchAffiliateList);

  async function fetchAffiliateList() {
    const programAffiliateKyc = await programsApi.get(programs.UINControlMaster);
    const regionValue = document.getElementById("Region").value;
    const countryValue = document.getElementById("Countries").value;
    const ouRes = await orgUnitsApi.get({level: 2, filter: countryValue});
    const matched = ouRes?.organisationUnits?.find(ou => ou.code === countryValue);    
    if(matched) orgUnit.id = matched.id;

    const name = document.getElementById("regName").value;
    const uin = document.getElementById("uin").value;
    if (countryValue) {
      let otherParam = `filter=${attributes.countryRegistration}:EQ:${countryValue}`;
      if (regionValue)
        otherParam += `&filter=${attributes.region}:EQ:${regionValue}`;
      if (name)
        otherParam += `&filter=${attributes.legalName}:EQ:${name.trim()}`;
      if (uin)
        otherParam += `&filter=${attributes.uinCode}:EQ:${uin.trim()}`;
      const affiliateList = await dataApi.get(
        orgUnit.id,
        programs.UINControlMaster,
        otherParam
      );
      
      if (!affiliateList?.trackedEntities || affiliateList.trackedEntities.length === 0) {
        toast({status: 'INFO', message: 'No affiliate found'});
        return;
      }
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
      document.getElementById("thead-affiliate").innerHTML = `${theadAffiliateRow}<th style="padding: 12px 15px; font-weight: 600;">Action</th>`;

      var tbodyAffiliateRow = "";
      affilitateAttrList.forEach((affiliate, index) => {
        const trackedEntityId = affiliateList.trackedEntities[index].trackedEntity
        tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`;
        headerList.forEach(

          (attr) => tbodyAffiliateRow += `<td style="padding: 15px;">${affiliate[attr.id] ? affiliate[attr.id] : ""}</td>`
        );
        tbodyAffiliateRow += `
          <td style="padding: 15px;">
            <div class="actions">
              <button class="btn-icon blue" style="cursor: pointer;" title="View Details" onclick="openAffiliateModal(null, '${trackedEntityId}')">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>`;
      });
      document.getElementById("tbody-affiliate").innerHTML = tbodyAffiliateRow;
    } else {
      toast({status: 'INFO', message: 'Please Select Country!'});
    }
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

    const res = await dataApi.getTrackedEntity(teiId);
    tei.affiliate = res.trackedEntities[0];

    const attrs = {};
    tei.affiliate.attributes.forEach(a => (attrs[a.attribute] = a.value));
    document.getElementById('affiliateModalSub').textContent = `UIN - ${attrs[attributes.uinCode] || ' '}`;
    document.getElementById('aff-name').textContent = attrs[attributes.legalName] || '';
    document.getElementById('aff-uin').textContent = attrs[attributes.uinCode] || '';
    document.getElementById('aff-country').textContent = attrs[attributes.countryRegistration] || '';
    document.getElementById('aff-region').textContent = attrs[attributes.region] || '';

    const stageRes = await programStageApi.get(programStage.UINControlMaster);
    const stage = convert.stage({ programStage: stageRes });

    tei.programStages = stage.sections;
    tei.dataElements = stage.dataElements;
    tei.metadata = stage.metadata;
    tei.values = convert.trackedEntity(
      tei.affiliate,
      new Set(stage.fileType)
    );

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
  }

  window.openRequestChangeModal = async roleKey => {
    const modal = ensureChangeModal();
    const body = modal.querySelector("#requestChangeModalBody");
    body.innerHTML = "";

    const stageId = STAGE_MAPPING[roleKey];

    const matchingSection = tei.programStages.find(section => section.id === stageId)

    const fieldsToRender = matchingSection.items;
   
    const row = document.createElement("div");
    row.className = "row";

    let fieldsHtml = "";
    fieldsToRender.forEach(meta => {
      const metaWithId = { ...meta, id: meta.code };
      fieldsHtml += `
        <div class="col-md-6 mb-2">
          <label>${meta.name} ${meta.mandatory ? '<span class="text-danger">*</span>' : ''}</label>
          ${fetchValueType(metaWithId, tei.values[meta.code] || "", {}, false)}
        </div>`;
    });
    row.innerHTML = fieldsHtml;

    body.appendChild(row);
    
    if (window.flatpickr) {
        flatpickr(modal.querySelectorAll(".flatpickr-date-input"), { dateFormat: "Y-m-d" });
    }

    $(modal).modal("show");

    modal.querySelector("#requestChangeSubmit").onclick = async () => {
      fieldsToRender.forEach(meta => {
        const code = meta.code;
        const el = document.getElementById(code);
        if (el) tei.values[code] = el.value;
      });

      const enrollment = tei.affiliate.enrollments.find(
        e => e.program === programs.UINControlMaster
      );

      const payload = createPayload.event(
        tei,
        enrollment.orgUnit,
        enrollment.enrollment,
        programs.UINControlMaster,
        programStage.UINControlMaster
      );

      await dataApi.enroll(payload);
      toast({status: 'SUCCESS', message: "Request Submitted Successfully"});
      $(modal).modal("hide");
    };
  };

  function ensureChangeModal() {
    let modal = document.getElementById("requestChangeModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "requestChangeModal";
    modal.className = "modal";
    modal.style.zIndex = "1060"; // Ensure this modal appears on top of the other
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Request Change</h5>
            <button class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body" id="requestChangeModalBody"></div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" id="requestChangeSubmit">Submit</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }
});
