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
    });
    

    if (searchButton) {
        searchButton.addEventListener('click', function () {
            searchResults.style.display = 'block';
            addAffiliateForm.style.display = 'none';
        });
    }

    if (addNewAffiliateButton) {
        addNewAffiliateButton.addEventListener('click', function () {
            addAffiliateForm.style.display = 'block';
            searchResults.style.display = 'none';
        });
    }

   

    fetchNewRegistration();
    

   async function fetchNewRegistration() {
    const region = await optionSetApi.get(optionSet.region);
    const country = await optionSetApi.get(optionSet.country);
    const affilateStage = await programStageApi.get(programStage.affiliateKyc);
    const trackedEntityAttributes = await programsApi.get(programs.affiliateKyc);
    document.getElementById("Region").innerHTML = populateOptions(region.options);
    document.getElementById("Countries").innerHTML = populateOptions(country.options);
    document.getElementById("addKycDetails").innerHTML = renderSections(affilateStage.programStageSections);
    document.getElementById("basicInformation").innerHTML = renderProgramTrackedAttributes(trackedEntityAttributes);
   }

  
 function renderSections(sections) {
    let container = "";

    for (const section of sections) {

        const sectionDiv = document.createElement("div");
        sectionDiv.className = "card mb-4 p-3";
        sectionDiv.style.backgroundColor = "white";
        sectionDiv.style.borderRadius = "8px";
        sectionDiv.innerHTML = `<h5 style="color:#3b71ca;font-weight:bold;">${section.name}</h5>`;

        let rowDiv = null;

        for (const [index, el] of section.dataElements.entries()) {

            // improvement
            if (index % 2 === 0) {
                rowDiv = document.createElement("div");
                rowDiv.className = "form-row";
                sectionDiv.appendChild(rowDiv);
            }
            if(el?.id) tei.programStage.push(el?.id);
            
            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "form-group col-md-6 mb-2";

            fieldWrapper.innerHTML = `
                <label>${el.name}</label>
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
        
        let rowDiv = null;

        for (const [index, attrObj] of sections.programTrackedEntityAttributes.entries()) {
            console.log(`-----index ${index} ---- ${attrObj}----------- `);
            const el = attrObj.trackedEntityAttribute;
            if(el?.id) tei.attributes.push(el?.id);
            // improvement
            if (index % 2 === 0) {
                rowDiv = document.createElement("div");
                rowDiv.className = "form-row";
                sectionDiv.appendChild(rowDiv);
            }

            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "form-group col-md-6 mb-2";

            fieldWrapper.innerHTML = `
                <label>${el.name}</label>
                ${fetchValueType(el.valueType, el.optionSetValue, el.optionSet?.options, el?.id)}
            `;
               rowDiv.appendChild(fieldWrapper);
        }
        container += sectionDiv.outerHTML;
        return container;
    }

});



