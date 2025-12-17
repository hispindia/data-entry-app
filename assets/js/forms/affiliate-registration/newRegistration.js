import { dataApi } from "../../api/DataApi.js";
import { populateOptions } from "../../api/func.js";
import { optionSetApi, programsApi, programStageApi } from "../../api/metaDataApi.js";
import { pushPayloadInDhis2 } from "../../api/payload.js";
import { optionSet, orgUnit, programStage, programs, tei } from "../../constant.js";
import { fetchValueType } from "./valueType.js";

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".nav-link").forEach(function (element) {
        element.addEventListener("click", function (event) {

            // allow dropdown toggle
            if (element.classList.contains("has-dropdown")) return;

            const targetPage = element.getAttribute("data-target");
            if (targetPage) {
                event.preventDefault();
                window.location.href = targetPage;
            }
        });
    });

    const searchButton = document.getElementById('searchButton');
    const addNewAffiliateButton = document.getElementById('addNewAffiliate');
    const searchResults = document.getElementById('searchResults');
    const addAffiliateForm = document.getElementById('addAffiliateForm');
    const acuityBtn = document.getElementById("sendToAcutiyBtn");
    acuityBtn.addEventListener("click", async () => {
        const payload = pushPayloadInDhis2(tei, orgUnit, programs, programStage);
        await dataApi.enroll(payload);
        alert("Affiliate saved successfully")
    });
    
    if (searchButton) {
        searchButton.addEventListener('click', function () {
            fetchAffiliateList();
            searchResults.style.display = 'block';
            addAffiliateForm.style.display = 'none';
        });
    }

    if (addNewAffiliateButton) {
        addNewAffiliateButton.addEventListener('click', function () {
            fetchNewRegistration();
            addAffiliateForm.style.display = 'block';
            searchResults.style.display = 'none';
        });
    }

    addHeaderDetails();
    async function addHeaderDetails() {
        const region = await optionSetApi.get(optionSet.region);
        const country = await optionSetApi.get(optionSet.country);
        document.getElementById("Region").innerHTML = populateOptions(region.options);
        document.getElementById("Countries").innerHTML = populateOptions(country.options);
    }
    
    async function fetchAffiliateList() {
        const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
        const regionValue = document.getElementById("Region").value;
        const countryValue = document.getElementById("Countries").value;
        if(regionValue && countryValue) {
            const otherParam = `filter=SMdW6ZnGllA:EQ:${regionValue}&filter=LZacnHsQJRs:EQ:${countryValue}`
            const affiliateList = await dataApi.get(orgUnit.id, programs.affiliateKyc, otherParam);

            const headerList = programAffiliateKyc.programTrackedEntityAttributes
            .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
            .map(attr => ({id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name}));

            const affilitateAttrList = affiliateList.trackedEntities.map(trackedEntity => {
                const attributes = {};
                trackedEntity.attributes.forEach(attr => attributes[attr.attribute] = attr.value);
                return attributes;
            });

            var theadAffiliateRow = "";
            headerList.forEach(item => theadAffiliateRow+= `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`);
            document.getElementById('thead-affiliate').innerHTML = theadAffiliateRow;

            var tbodyAffiliateRow = "";
            affilitateAttrList.forEach(affiliate => {
                tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
                headerList.forEach(attr => tbodyAffiliateRow += `<td style="padding: 15px;">${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`);
                tbodyAffiliateRow += `</tr>`
            })
            document.getElementById('tbody-affiliate').innerHTML = tbodyAffiliateRow;
        } else {
            alert('Please select Region/Country!')
        }
    }

    async function fetchNewRegistration() {
        const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
        const affilateStage = await programStageApi.get(programStage.affiliateKyc);
        document.getElementById("addKycDetails").innerHTML = renderSections(affilateStage.programStageSections);
        document.getElementById("basicInformation").innerHTML = renderProgramTrackedAttributes(programAffiliateKyc);
    }
    function renderSections(sections) {
    let container = "";

    for (const section of sections) {

        const sectionDiv = document.createElement("div");
        sectionDiv.className = "card mb-4 p-3";
        sectionDiv.style.backgroundColor = "white";
        sectionDiv.style.borderRadius = "8px";
        sectionDiv.innerHTML = `<h5 style="color:#3b71ca;font-weight:bold;">${section.name}</h5>`;
   
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        sectionDiv.appendChild(rowDiv);

        for (const el of section.dataElements) {

            if (el?.id) tei.programStage.push(el.id);

            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "form-group col-12 col-md-4 mb-2";

            fieldWrapper.innerHTML = `
                <label>${el.formName}</label>
                ${fetchValueType(el.valueType, el.optionSetValue, el.optionSet?.options, el?.id)}
            `;

            rowDiv.appendChild(fieldWrapper);
        }

        container += sectionDiv.outerHTML;
    }

    return container;
}

    function renderProgramTrackedAttributes(sections) {
        let container = "";

        console.log("sections =", sections);
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "card mb-4 p-3";
        sectionDiv.style.backgroundColor = "white";
        sectionDiv.style.borderRadius = "8px";
        sectionDiv.innerHTML = `<h5 style="color:#3b71ca;font-weight:bold;">${sections.name}</h5>`;
        // console.log('section Div-------', sectionDiv);
        
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        sectionDiv.appendChild(rowDiv);
        
        for (const attrObj of sections.programTrackedEntityAttributes) {
            const el = attrObj.trackedEntityAttribute;
            if(el?.id) tei.attributes.push(el?.id);
            
            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "form-group col-md-4 mb-2";
            
            const mandatoryIndicator = attrObj.mandatory ? '<span class="text-danger">*</span>' : '';

            fieldWrapper.innerHTML = `
              <label>${el.name}${mandatoryIndicator}</label>
              ${fetchValueType(el.valueType, el.optionSetValue, el.optionSet?.options, el?.id)}
          `;
            rowDiv.appendChild(fieldWrapper);
        }
        container += sectionDiv.outerHTML;
        return container;
    }

});
