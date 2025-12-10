import { populateOptions } from "../../api/func.js";
import { optionSetApi, programStageApi } from "../../api/metaDataApi.js";
import { optionSet, programStage } from "../../constant.js";
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
    document.getElementById("Region").innerHTML = populateOptions(region.options);
    document.getElementById("Countries").innerHTML = populateOptions(country.options);
    document.getElementById("addKycDetails").innerHTML = renderSections(affilateStage.programStageSections);
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

            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "form-group col-md-6 mb-2";

            fieldWrapper.innerHTML = `
                <label>${el.name}</label>
                ${fetchValueType(el.valueType, el.optionSetValue, el.optionSet?.options)}
            `;

            rowDiv.appendChild(fieldWrapper);
        }

        container += sectionDiv.outerHTML;
    }

    return container;
}




});
