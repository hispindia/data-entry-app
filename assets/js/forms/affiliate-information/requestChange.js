import { attributes,optionSet, orgUnit, programRules, programs, programStage, dataElements } from "../../constant.js";
import { optionSetApi,orgUnitsApi,programsApi, programStageApi } from "../../api/metaDataApi.js";
import { populateOptions, convert, fetchValueType } from "../metadata.js"
import { dataApi, } from "../../api/DataApi.js"
import { getUserConfig } from "../config.js";
import { toast } from "../utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userConfig = await getUserConfig();
  if (userConfig) {
      userConfig.user.forEach(user => {
      $(`.${user}`).hide();
      });
  }

  // modals are hidden on page reload
  ['affiliateModal', 'detailModal', 'approveModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

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

  // Map openDetailModal to openAffiliateModal so it loads data correctly
  function openDetailModal(affiliateId) {
    openAffiliateModal('view', affiliateId);
  }

  function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
  }

  function openApproveModal(affiliateId) {
    document.getElementById('approveModal').style.display = 'flex';
  }

  // Making functions global to be accessible from inline onclick
  window.openDetailModal = openDetailModal;
  window.closeDetailModal = closeDetailModal;
  window.openApproveModal = openApproveModal;
  window.closeApproveModal = function() { 
    document.getElementById('approveModal').style.display = 'none';
  };

  // Affiliate modal (static UI) functions
  function openAffiliateModal(mode = 'view', affiliateId = '') {
    const overlay = document.getElementById('affiliateModal');
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.dataset.mode = mode;
    overlay.dataset.affiliateId = affiliateId;
    document.getElementById('affiliateModalTitle').textContent = mode === 'view' ? 'Affiliate Details (View)' : 'Affiliate Details (Edit)';
    document.getElementById('affiliateModalSub').textContent = `UIN - ${affiliateId || 'placeholder'}`;
    const showAdds = mode === 'edit';
    ['add-board','add-senior','add-bank'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (showAdds) {
          el.classList.add('visible');
        } else {
          el.classList.remove('visible');
        }
      }
    });
    
    
    if (affiliateId) {
      loadAffiliateData(affiliateId);
    }
  }

  function closeAffiliateModal() {
    const overlay = document.getElementById('affiliateModal');
    if (!overlay) return;
    overlay.style.display = 'none';
    
   //reset content on load
    ['tbody-board', 'tbody-senior', 'tbody-bank'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });
  }

  // attach modal close buttons and overlay click
  (function attachAffiliateModalHandlers(){
    const overlay = document.getElementById('affiliateModal');
    if (!overlay) return;
    const closeBtn = document.getElementById('affiliateModalClose');
    const closeFooter = document.getElementById('affiliateModalCloseFooter');
    if (closeBtn) closeBtn.addEventListener('click', closeAffiliateModal);
    if (closeFooter) closeFooter.addEventListener('click', closeAffiliateModal);
   
    // Tab switching
    const tabButtons = Array.from(overlay.querySelectorAll('.tab-btn'));
    const panels = Array.from(overlay.querySelectorAll('.tab-panel'));
    tabButtons.forEach(btn => {
      btn.addEventListener('click', function(){
        const tab = btn.getAttribute('data-tab');
        tabButtons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById('tab-' + tab);
        if (target) target.classList.add('active');
      });
    });
  })();

  async function loadAffiliateData(affiliateId) {
    // show loading state
    ['tbody-board', 'tbody-senior', 'tbody-bank'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '<tr><td colspan="100%" class="text-center">Loading...</td></tr>';
    });

    try {
      const response = await dataApi.getTrackedEntity(affiliateId);
      if (!response || !response.trackedEntities || response.trackedEntities.length === 0) return;

      const tei = response.trackedEntities[0];

      if (tei.enrollments) {
        tei.enrollments.forEach(enroll => {
          if (enroll.events) {
            enroll.events.sort((a, b) => new Date(a.occurredAt) - new Date(b.occurredAt));
          }
        });
      }


      const resUINControlStage = await programStageApi.get(programStage.UINControlMaster);
      const uinStage = convert.stage({ programStage: resUINControlStage });
      const teiValues = convert.trackedEntity(tei, new Set(uinStage.fileType));
      const val = (id) => teiValues[id] || '';

      const attrs = {};
      if (tei.attributes) tei.attributes.forEach(a => attrs[a.attribute] = a.value);
      
      document.getElementById('aff-name').textContent = attrs[attributes.legalName] || 'not found';
      document.getElementById('aff-uin').textContent = attrs[attributes.uinCode] || 'not found';
      document.getElementById('aff-country').textContent = attrs[attributes.countryRegistration] || 'not found';
      document.getElementById('aff-region').textContent = attrs[attributes.region] || 'not found';

      const boardTbody = document.getElementById('tbody-board');
      const seniorTbody = document.getElementById('tbody-senior');
      const bankTbody = document.getElementById('tbody-bank');
      
      boardTbody.innerHTML = '';
      seniorTbody.innerHTML = '';
      bankTbody.innerHTML = '';

      const addRow = (tbody, label, fields, hasAction = false, valFunc = val) => {
          const tr = document.createElement('tr');
          let html = `<td class="font-weight-bold">${label}</td>`;
          fields.forEach(id => html += `<td>${valFunc(id)}</td>`);
          tr.innerHTML = html;
          
          if (hasAction) {
            const td = document.createElement('td');
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary btn-sm';
            btn.textContent = 'Action';
            btn.onclick = () => openChangeRequestForm(label, fields);
            td.appendChild(btn);
            tr.appendChild(td);
          }
          tbody.appendChild(tr);
      };

      function openChangeRequestForm(label, fields) {
        let modal = document.getElementById('changeRequestModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'changeRequestModal';
            modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;";
            modal.innerHTML = `
                <div style="background:white;padding:20px;border-radius:5px;width:60%;max-height:90%;overflow-y:auto;">
                    <h4 id="crTitle"></h4>
                    <div id="crBody" class="row"></div>
                    <div class="mt-3 text-right">
                        <button class="btn btn-secondary mr-2" id="crCancel">Cancel</button>
                        <button class="btn btn-primary" id="crRequest">Request changes</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            document.getElementById('crCancel').onclick = () => modal.style.display = 'none';
        }
        
        document.getElementById('crTitle').textContent = `Request Changes - ${label}`;
        const body = document.getElementById('crBody');
        body.innerHTML = '';
        
        let formFields = fields;
        if (uinStage && uinStage.sections) {
            const section = uinStage.sections.find(s => s.name === label);
            if (section) {
                formFields = section.items.filter(i => !i.hidden).map(item => item.code);
            }
        }
        
        formFields.forEach(id => {
            const meta = uinStage.metadata[id];
            if(!meta) return;
            
            const div = document.createElement('div');
            div.className = 'col-md-6 form-group';
            div.innerHTML = `
                <label>${meta.name} ${meta.mandatory ? '<span class="text-danger">*</span>' : ''}</label>
                ${fetchValueType({id: id, valueType: meta.valueType, valueSet: meta.optionSet}, val(id), {}, false)}
            `;
            body.appendChild(div);
        });
        
        if(window.flatpickr) window.flatpickr(".flatpickr-date-input", { dateFormat: "Y-m-d" });

        document.getElementById('crRequest').onclick = () => {
            let valid = true;
            formFields.forEach(id => {
                const meta = uinStage.metadata[id];
                if(meta && meta.mandatory) {
                    const el = document.getElementById(id);
                    if(el && !el.value) {
                        valid = false;
                        el.style.borderColor = 'red';
                    } else if(el) {
                        el.style.borderColor = '';
                    }
                }
            });
            
            if(valid) {
                toast({status: 'SUCCESS', message: 'Request submitted successfully'});
                modal.style.display = 'none';
            } else {
                toast({status: 'WARNING', message: 'Please fill all mandatory fields'});
            }
        };
        
        modal.style.display = 'flex';
      }
  
      
      // Board Members
      addRow(boardTbody, 'Chairperson', [
        dataElements.chairPersonName, dataElements.chairPersonEmail, dataElements.chairPersonPhone, 
        dataElements.chairPersonNationality, dataElements.chairPersonDob, dataElements.chairPersonIdNumber
      ], true);

      addRow(boardTbody, 'Vice-Chairperson', [
        dataElements.viceChairPersonName, dataElements.viceChairPersonEmail, dataElements.viceChairPersonPhone, 
        dataElements.viceChairPersonNationality, dataElements.viceChairPersonDob, dataElements.viceChairPersonIdNumber
      ], true);

      addRow(boardTbody, 'Secretary', [
        dataElements.secretaryName, dataElements.secretaryEmail, dataElements.secretaryPhone, 
        dataElements.secretaryNationality, dataElements.secretaryDob, dataElements.secretaryIdNumber
      ], true);

      addRow(boardTbody, 'Treasurer', [
        dataElements.treasurerName, dataElements.treasurerEmail, dataElements.treasurerPhone, 
        dataElements.tressurerNationality, dataElements.treasurerDob, dataElements.treasurerIdNumber
      ], true);

      addRow(boardTbody, 'Youth', [
        dataElements.youthName, dataElements.youthEmail, dataElements.youthPhone, 
        dataElements.youthNationality, dataElements.youthDob, dataElements.youthIdNumber
      ], true);

      // Senior Management - using val() from the same stage
      addRow(seniorTbody, 'Chief Executive Officer', [
        dataElements.seniorManagementCEOName, dataElements.seniorManagementCEOEmail, dataElements.seniorManagementCEOPhone,
        dataElements.seniorManagementCEONationality, dataElements.seniorManagementCEODob, dataElements.seniorManagementCEOIdNumber
      ], true, val);

      addRow(seniorTbody, 'Director of Finance', [
        dataElements.seniorManagementDirectorFinanceName, dataElements.seniorManagementDirectorFinanceEmail, dataElements.seniorManagementDirectorFinancePhone,
        dataElements.seniorManagementDirectorFinanceNationality, dataElements.seniorManagementDirectorFinanceDob, dataElements.seniorManagementDirectorFinanceIdNumber
      ], true, val);

      addRow(seniorTbody, 'Director of Programs', [
        dataElements.SeniorManagementDirectorProgramsName, dataElements.SeniorManagementDirectorProgramsEmail, dataElements.SeniorManagementDirectorProgramsPhone,
        dataElements.SeniorManagementDirectorProgramsNationality, dataElements.SeniorManagementDirectorProgramsDob, dataElements.SeniorManagementDirectorProgramsIdNumber
      ], true, val);

      // Bank Accounts - using val() from the same stage
      const trBank = document.createElement('tr');
      trBank.innerHTML = `
        <td>${val(dataElements.bankName)}</td>
        <td>${val(dataElements.bankAddress)}</td>
        <td>${val(dataElements.bankAccountNumber)}</td>
        <td>${val(dataElements.bankAccountCurrency)}</td>
        <td>${val(dataElements.bankSwift)}</td>
        <td>${val(dataElements.bankIBAN)}</td>
        <td></td>
      `;
      bankTbody.appendChild(trBank);

    } catch (err) {
      console.error("Failed to load affiliate data", err);
      toast({status: 'ERROR', message: 'Error loading details'});
    }
  }

  const searchButton = document.getElementById('searchButton');
  const searchResults = document.getElementById('searchResults');
    if (searchButton) {
      searchButton.addEventListener('click', function () {
        fetchAffiliateList();
        searchResults.style.display = 'block';
      });
    }

    const resRegion = await optionSetApi.get(optionSet.region);
    const resOptionGroups = await optionSetApi.getOptionGroups();

    document.getElementById("Region").innerHTML = populateOptions(resRegion.options);
    
    document.getElementById('Region').addEventListener('change', function (e) {
        const { value } = e.target;
        const optionGroup = resOptionGroups.optionGroups.find(group => group.id == programRules.hideCountry[value]);
        if(optionGroup) {
            const region = optionGroup.options.map(option => ({label: option.name, value: option.code}));
            document.getElementById("Countries").innerHTML = populateOptions(region);
        }
    })
  
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
              <button class="btn-icon blue" title="View Details" onclick="openDetailModal('${trackedEntityId}')">
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


  window.openAffiliateModal = openAffiliateModal;
  window.closeAffiliateModal = closeAffiliateModal;
  window.loadAffiliateData = loadAffiliateData;
});
