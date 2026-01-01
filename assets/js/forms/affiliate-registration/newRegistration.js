
import { dataApi } from "../../api/DataApi.js";
import { populateOptions, ruleCallback } from "../metadata.js";
import { optionSetApi, programsApi, programStageApi } from "../../api/metaDataApi.js";
import { pushPayloadInDhis2 } from "../../api/payload.js";
import { attributes, optionSet, orgUnit, programStage, programs, tei } from "../../constant.js";
import { configureRules, convert, fetchValueType } from "../metadata.js";

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

    const disclaimerCheck = document.getElementById('disclaimerCheck');
    const searchButton = document.getElementById('searchButton');
    const addNewAffiliateButton = document.getElementById('addNewAffiliate');
    const searchResults = document.getElementById('searchResults');
    const addAffiliateForm = document.getElementById('addAffiliateForm');
    const acuityBtn = document.getElementById("sendToAcuityBtn");
    acuityBtn.addEventListener("click", async () => {
        if(tei.mandatoryList) {
            let empty = false;
            for(const id of tei.mandatoryList) {
                const value = document.getElementById(id).value;
                const mandatoryError = document.querySelector(`#error-${id}`);
                if(!value) {
                    empty = true;
                    if(mandatoryError) {
                        mandatoryError.innerHTML = "This field is required";
                        mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
                        mandatoryError.focus({ preventScroll: true });
                    }

                } else {
                    mandatoryError.innerHTML = "";
               }
            }
            if(empty) {
                iziToast.info({
                    message: "Please fill mandatory fields!",
                    timeout: 1500
                })
                return;
            }
        }
        const fileInputs = document.querySelectorAll(".file-upload");
        for(const input of fileInputs) {
            const file = tei.values[input.id];
            if (!file) continue;

            try {
                const formData = new FormData();
                formData.append('file', file);
                const res = await dataApi.uploadFile(formData);
                if(res.status == 'OK') {
                tei.values[input.id] = res.response.fileResource.id;
                } else {
                    throw('File generation error!')
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                return;
            }
        }
        const payload = pushPayloadInDhis2(tei, orgUnit.id, programs.affiliateKyc, programStage.affiliateKyc);
        await dataApi.enroll(payload);
        iziToast.info({
            message: "Affiliate saved successfully",
            timeout: 1500
        })
        window.location.reload();
    });
    disclaimerCheck.addEventListener('change', function(e) {
        if (e.target.checked) {
        document.getElementById('sendToAcuityBtn').disabled = false;
        } else {
        document.getElementById('sendToAcuityBtn').disabled = true;
        }
    });
    document.getElementById("addKycDetails").addEventListener('change', function(e) {
        const input = e.target;
        if (input.matches("input, select, textarea")) {
            if(input.type == "file") {
            tei.values[input.id] = input.files[0];
            document.getElementById(`error-${e.target.id}`).innerHTML = '';
            document.getElementById(`${input.id}-message`).textContent = input.files[0].name;
            return;
            }
            tei.values[input.id] = input.value;
            document.getElementById(`error-${e.target.id}`).innerHTML = '';
            ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
            document.getElementById("addKycDetails").innerHTML = renderSections(tei.programStages);
        }
    });
    document.getElementById("basicInformation").addEventListener('change', function(e) {
        if (e.target.matches("input, select, textarea")) {
            tei.values[e.target.id] = e.target.value;
            document.getElementById(`error-${e.target.id}`).innerHTML = '';
            if(e.target.type == "file") return;
            ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
            document.getElementById("basicInformation").innerHTML = renderSections(tei.attributes);
        }
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
        const name = document.getElementById("regName").value;
        if(countryValue) {
            let otherParam = `filter=${attributes.countryRegistration}:EQ:${countryValue}` 
            if(regionValue) otherParam += `&filter=${attributes.region}:EQ:${regionValue}`
            if(name) otherParam += `&filter=${attributes.legalName}:EQ:${name.trim()}`
            const affiliateList = await dataApi.get(orgUnit.id, programs.affiliateKyc, otherParam);

            if (!affiliateList?.trackedEntities || affiliateList.trackedEntities.length === 0) {
                iziToast.info({
                    message: "No affiliate found",
                    timeout: 1500
                });
                document.getElementById("affiliate-table").style.display = "none";
                return;
          }

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
                iziToast.info({
                    message: "Please Select Country!",
                    timeout: 1500
                });
        }
    }

    async function fetchNewRegistration() {
        const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
        const affilateStage = await programStageApi.get(programStage.affiliateKyc);
        
        const resRules = await programsApi.rules(programs.affiliateKyc);
        const resRuleVariables = await programsApi.ruleVariables(programs.affiliateKyc);
        const resOptionGroups = await optionSetApi.getOptionGroups();
        tei.programRules = configureRules(resRuleVariables.programRuleVariables, resRules.programRules, resOptionGroups.optionGroups);

        const programAttr = convert.attributes({ program: programAffiliateKyc });
        const affiliateStage = convert.stage({ programStage: affilateStage });
        
        tei.attributes = programAttr.attributes;
        tei.programStages = affiliateStage.sections;
        tei.values = {...programAttr.values, ...affiliateStage.values};
        tei.metadata = {...programAttr.metadata, ...affiliateStage.metadata};
        tei.mandatoryList = [...programAttr.mandatoryList, ...affiliateStage.mandatoryList];
        
        ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList,  tei.metadata, tei.values);
        
        document.getElementById("basicInformation").innerHTML = renderSections(tei.attributes);
        document.getElementById("addKycDetails").innerHTML = renderSections(tei.programStages);
    }

    function renderSections(sections) {
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
                ${fetchValueType({id: el.code, valueType: el.valueType, valueSet: el.valueSet}, tei.values[el.code], el.disabled)}
                <div id="error-${el.code}" style="color: red"></div>
            `;
            rowDiv.appendChild(fieldWrapper);
        }
        container += sectionDiv.outerHTML;
    }
    return container;
    }

});
