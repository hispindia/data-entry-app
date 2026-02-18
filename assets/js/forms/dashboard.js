import { dataApi } from "../api/DataApi.js";
import { populateOptions, convert, fetchValueType, ruleCallback, configureRules } from "./metadata.js";
import { optionSetApi, programsApi, programStageApi } from "../api/metaDataApi.js";
import { attributes, optionSet, orgUnit, programRules, programs,tei, programStage } from "../constant.js";
import { getUserConfig } from "./config.js";
import { toast } from "./utils.js"

document.addEventListener("DOMContentLoaded", async function () {
  const userConfig = await getUserConfig();
  const url = new URL(window.location.href);
  let affiliate = url.searchParams.get('affiliate');
  if (userConfig) {
      userConfig.user.forEach(user => {
      $(`.${user}`).hide();
      });
  }
  $('.sidebar-menu').show();
  if(!userConfig.user.includes('kyc'))  $('.maintenance').removeClass('d-none');

  // Add event listener to 
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
        if (element.classList.contains("has-dropdown")) {
          return; 
        }
      var targetPage = event.currentTarget.getAttribute("data-target") || event.currentTarget.parentElement.getAttribute("data-target");
      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });
  const searchButton = document.getElementById('searchButton');
  const searchResults = document.getElementById('searchResults');
  const addAffiliateForm = document.getElementById('addAffiliateForm');

  const regName = url.searchParams.get('name');
  const country = url.searchParams.get('country');
  const region = url.searchParams.get('region');
  if(region) {
        document.getElementById("Region").value = region;
        const optionGroup = resOptionGroups.optionGroups.find(group => group.id == programRules.hideCountry[region]);
        if(optionGroup) {
            const region = optionGroup.options.map(option => ({label: option.name, value: option.code}));
            document.getElementById("Countries").innerHTML = populateOptions(region);
        }
    }
    if(regName) document.getElementById("regName").value = regName;
    if(country) document.getElementById("Countries").value = country;

    if(affiliate) {
        addAffiliateForm.style.display = 'block';
        searchResults.style.display = 'none';
    } else {
        addAffiliateForm.style.display = 'none';
        searchResults.style.display = 'none';
    }

  searchResults.addEventListener('click', async function(e) {
    const btn = e.target.closest('button');
    if(!btn) return;
    const tracked = btn.dataset.trackedentity;
    affiliate = tracked;
    const url = new URL(window.location.href);
    url.searchParams.delete('country')
    url.searchParams.delete('region')
    url.searchParams.set('affiliate', tracked);
    window.history.pushState({}, "", url);
    addAffiliateForm.style.display = 'block';
    await viewForm(tracked);
            
    searchResults.style.display = 'none';
  });
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

    const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
    const regionValue = document.getElementById("Region").value;
    const countryValue = document.getElementById("Countries").value;
    const name = document.getElementById("regName").value;

    let otherParam = "";
    if (regionValue && !countryValue) {
      toast({ status: 'INFO', message: 'Please Select Country!' });
      return;
    }
    if (name) otherParam += `&filter=${attributes.legalName}:LIKE:${name.trim()}`;
    if (regionValue) otherParam += `&filter=${attributes.region}:EQ:${regionValue}`;
    if (countryValue) otherParam += `&filter=${attributes.countryRegistration}:EQ:${countryValue}`;
 
    const affiliateList = await dataApi.get(
        orgUnit.affiliateKYC,
        programs.affiliateKyc,
        otherParam
    );

    if (!affiliateList?.trackedEntities || affiliateList.trackedEntities.length === 0) {
        toast({ status: 'INFO', message: 'No affiliate found' });
        return;
    }

    const headerList = programAffiliateKyc.programTrackedEntityAttributes
        .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
        .map(attr => ({
            id: attr.trackedEntityAttribute.id,
            name: attr.trackedEntityAttribute.name
        }));

    const affilitateAttrList = affiliateList.trackedEntities.map(trackedEntity => {
        const attributesObj = { trackedEntity: trackedEntity.trackedEntity };
        trackedEntity.attributes.forEach(attr => attributesObj[attr.attribute] = attr.value);
        return attributesObj;
    });

    let theadAffiliateRow = "";
    headerList.forEach(item =>
        theadAffiliateRow += `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`
    );

    document.getElementById('thead-affiliate').innerHTML =
        `${theadAffiliateRow}<th style="padding: 12px 15px; font-weight: 600;">Action</th>`;

    let tbodyAffiliateRow = "";

    affilitateAttrList.forEach(affiliate => {
        tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`;

        headerList.forEach(attr =>
            tbodyAffiliateRow += `<td style="padding: 15px;">${affiliate[attr.id] ?? ''}</td>`
        );

        tbodyAffiliateRow +=
            `<td style="padding: 15px;">
                <button class="btn btn-primary" data-trackedentity="${affiliate.trackedEntity}">
                    View
                </button>
            </td></tr>`;
    });

    document.getElementById('tbody-affiliate').innerHTML = tbodyAffiliateRow;
   }

    async function viewForm(affiliateId) {
        const id = affiliateId || affiliate;
        if (!id) return;

        const resAffiliate = await dataApi.getTrackedEntity(id);
        if (resAffiliate.trackedEntities.length) {
            tei.affiliate = resAffiliate.trackedEntities[0];
            tei.disabled = true;
        }

        const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
        const affilateStage = await programStageApi.get(programStage.affiliateKyc);
    
        const programAttr = convert.attributes({ program: programAffiliateKyc, disabled: true });
        const affiliateStageData = convert.stage({ programStage: affilateStage, disabled: true });
        
        tei.fileType = new Set(affiliateStageData.fileType);
        tei.attributes = programAttr.attributes;
        tei.attributeSection = programAttr.sections;
        tei.dataElements = affiliateStageData.dataElements;
        tei.programStages = affiliateStageData.sections;
        tei.metadata = {...programAttr.metadata, ...affiliateStageData.metadata};
        tei.mandatoryList = [...programAttr.mandatoryList, ...affiliateStageData.mandatoryList];
        tei.values = {...programAttr.values, ...affiliateStageData.values};

        if(tei.affiliate) {
            const dataValues = convert.trackedEntity(tei.affiliate, tei.fileType);
            for(let id of tei.fileType) {
                if(dataValues[id]) {
                dataValues[`${id}-href`] = `../../events/files?eventUid=${dataValues[`${id}-event`]}&dataElementUid=${id}`
                dataValues[`${id}-file`] = await dataApi.getFile(dataValues[id]);
                }
            }
            tei.values = {...tei.values, ...dataValues};
        }
        
        const basicInfo = document.getElementById("basicInformation");
        const kycDetails = document.getElementById("addKycDetails");
        
        if(basicInfo) basicInfo.innerHTML = renderSections(tei.attributeSection, true);
        if(kycDetails) kycDetails.innerHTML = renderSections(tei.programStages, true);
    }

    function renderSections(sections, disabled) {
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
                    ${fetchValueType({id: el.code, valueType: el.valueType, valueSet: el.valueSet}, tei.values[el.code], {href:(tei?.values[`${el.code}-href`] || ""), file: (tei?.values[`${el.code}-file`] || "")}, (disabled || el.disabled))}
                    <div id="error-${el.code}" style="color: red"></div>
                `;
                rowDiv.appendChild(fieldWrapper);
            }
            container += sectionDiv.outerHTML;
        }
        return container;
    }
})
