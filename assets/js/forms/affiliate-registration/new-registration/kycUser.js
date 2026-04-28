import { createPayload } from "../../../api/payload.js";
import { optionSetApi, programStageApi, programsApi } from "../../../api/metaDataApi.js";
import { configureRules, convert, fetchValueType, ruleCallback } from "../../metadata.js";
import { attributes, orgUnit, programStage, programs, tei, trackedEntityType } from "../../../constant.js";
import { dataApi } from "../../../api/DataApi.js";
import { toast, isGmailOrYahoo } from "../../utils.js";

const newRegistration = async (userConfig) => {
    const url = new URL(window.location.href);
    const affiliate = url.searchParams.get('affiliate');
    tei.affiliate = '';
    if(userConfig.user.includes('aoc')) document.getElementById('sendToAcuityBtn').style.display = 'block';
        
    var resAffiliate = { trackedEntities: [] };
    
    if(affiliate) resAffiliate = await dataApi.getTrackedEntity(affiliate);
    else if(userConfig.user.includes('aoc')) resAffiliate = { trackedEntities: [] }
    else resAffiliate = await dataApi.get(orgUnit.affiliateKYC, programs.affiliateKyc,  `filter=${attributes.user}:EQ:${userConfig.username}`);

    if(resAffiliate.trackedEntities.length) {
        tei.affiliate = resAffiliate.trackedEntities[0];
        tei.affiliate.enrollments.forEach(enroll => {
            enroll.events.forEach(event => {
                if(event.programStage == programStage.affiliateKyc && event.status == "COMPLETED") {
                    tei.disabled = true;
                }
            })
        })
    }

    if(tei.disabled) {
        document.getElementById('disclaimerCheck').checked = true;
        document.getElementById('saveAsDraft').disabled = true;
        document.getElementById('submitBtn').disabled = true;
    }
    
    const disclaimerCheck = document.getElementById('disclaimerCheck');
    disclaimerCheck.addEventListener('change', function(e) {
        if (e.target.checked) {
        
        document.getElementById('submitBtn').disabled = false;
        } else {
        document.getElementById('submitBtn').disabled = true;
        }
    });

    document.getElementById("sendToAcuityBtn").addEventListener('click', async () => {
        const payload = {
            trackedEntities: [{
                trackedEntity: tei.affiliate.trackedEntity,
                orgUnit: tei.affiliate.orgUnit,
                trackedEntityType: trackedEntityType,
                attributes: [{
                        attribute:attributes.acuityCheck,
                        value:"In Progress"
                    }]
                }]
            }
        try {
            await dataApi.update(payload);
            window.location.href = `../../apps/IPPF-UIN/1.1-1-acuity-check-list.html?affiliate=${tei.affiliate.trackedEntity}`;
            toast({status: 'SUCCESS', message: 'Affiliate sent to acuity!'});
        }
        catch(e) {
        toast({status: 'ERROR', message: 'Error occurred'});
        }
    })

    document.getElementById("saveAsDraft").addEventListener('click', async () => {
        var isEmpty = false;
        tei.attributes.forEach(attr => {
            if(tei.mandatoryList.includes(attr)) {
                const mandatoryError = document.getElementById(`error-${attr}`);
                const value = tei.values[attr];
                if(!value) {
                    isEmpty = true;
                    mandatoryError.innerHTML = "This field is required";
                    mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
                    mandatoryError.focus({ preventScroll: true });
                } else if(tei.metadata[attr].valueType === 'EMAIL' && !isGmailOrYahoo(value)){
                  isEmpty = true;
                  mandatoryError.innerHTML = "Only valid email addresses are allowed.";
                  mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
                  mandatoryError.focus({ preventScroll: true });
                } else if(tei.metadata[attr].valueType === "FILE_RESOURCE" && (tei.values[attr] instanceof File) && 
                    !['.pdf', '.jpeg', '.jpg'].some(txt => tei.values[attr].name.toLowerCase().endsWith(txt))
                )
                {
                  isEmpty = true;
                  mandatoryError.innerHTML = "Only valid File Formats are allowed.";
                  mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
                  mandatoryError.focus({ preventScroll: true });

                } 
                
                else {
                    mandatoryError.innerHTML = "";
                }
            }
        })
        if(isEmpty) {
            toast({status: 'ERROR', message: 'Please fill Affiliate KYC & Risk Screening section!'});
            return;
        }
        const fileInputs = document.querySelectorAll(".file-upload");
        for(const input of fileInputs) {
            const file = tei.values[input.id];
            if (!file || typeof file === "string")  continue;
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
                return;
            }
        }
        try {
            
            if(!tei.affiliate) {
                const payload = createPayload.newEnroll({tei, orgUnit: orgUnit.affiliateKYC, program: programs.affiliateKyc, programStage: programStage.affiliateKyc});
                const affiliate = await dataApi.enroll(payload);
                toast({status: 'SUCCESS', message: 'Details saved successfully!', affiliate});
            } else {
                let eventId = '', enrollmentId = '';
                let trackedEntity = tei.affiliate.trackedEntity;
                tei.affiliate.enrollments.forEach(enroll => {
                    enroll.events.forEach(event => {
                        if(event.programStage == programStage.affiliateKyc) {
                            eventId = event.event;
                            enrollmentId = enroll.enrollment;
                        }
                    })
                })
                const payload = createPayload.newEnroll({tei, orgUnit: orgUnit.affiliateKYC, program: programs.affiliateKyc, programStage: programStage.affiliateKyc, trackedEntity, enrollment:enrollmentId, event:eventId});
                await dataApi.enroll(payload);
                toast({status: 'SUCCESS', message: 'Affiliate saved successfully!'});
            }
        }
        catch(e) {
            toast({status: 'ERROR', message: `Error occurred: ${e}`});
            return;
        }
    });

    document.getElementById("submitBtn").addEventListener("click", async () => {
        for(let el in tei.metadata) {
            if(!tei.mandatoryList.includes(el) && tei.metadata[el].mandatory) tei.mandatoryList.push(el);
        }
        if(tei.mandatoryList) {
            let empty = false;
            for(const id of tei.mandatoryList) {
                const mandatoryError = document.querySelector(`#error-${id}`);
                if(!tei.values[id]) {
                    empty = true;
                    mandatoryError.innerHTML = "This field is required";
                    mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
                    mandatoryError.focus({ preventScroll: true });
                } else if(tei.metadata[id].valueType === 'EMAIL' && !isGmailOrYahoo(tei.values[id])){
                    empty = true;
                    mandatoryError.innerHTML = "Only valid email addresses are allowed.";
                    mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
                    mandatoryError.focus({ preventScroll: true });
                } else if(tei.metadata[id].valueType === "FILE_RESOURCE" && (tei.values[id] instanceof File) 
                        && !['.pdf',',image/jpeg','.jpg','.jpeg'].some(ext => tei.values[id].name.toLowerCase().endsWith(ext))
                ) {
                    empty = true;
                    mandatoryError.innerHTML = "Only valid File Formats are allowed.";
                    mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
                    mandatoryError.focus({ preventScroll: true });

                } else {
                    mandatoryError.innerHTML = "";
                }
            }
            if(empty) {
                toast({status: 'INFO', message: 'Please fill mandatory fields!'});
                return;
            }
        }

        const fileInputs = document.querySelectorAll(".file-upload");
        for(const input of fileInputs) {
            const file = tei.values[input.id];
            if (!file || typeof file === "string")  continue;
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
                return;
            }
        }
        try {

            if(!tei.affiliate) {
                const payload = createPayload.newEnroll({tei, orgUnit: orgUnit.affiliateKYC, program: programs.affiliateKyc, programStage: programStage.affiliateKyc, eventStatus: 'COMPLETED'});
                const affiliate = await dataApi.enroll(payload);
                toast({status: 'SUCCESS', message: 'Affiliate saved successfully!', affiliate});
            } else {
                let eventId = '', enrollmentId = '';
                let trackedEntity = tei.affiliate.trackedEntity;
                tei.affiliate.enrollments.forEach(enroll => {
                    enroll.events.forEach(event => {
                        if(event.programStage == programStage.affiliateKyc) {
                            eventId = event.event;
                            if(enroll.enrollment) enrollmentId = enroll.enrollment;
                        }
                    })
                })

                const payload = createPayload.newEnroll({tei, orgUnit: orgUnit.affiliateKYC, program: programs.affiliateKyc, programStage: programStage.affiliateKyc, trackedEntity, enrollment:enrollmentId, event:eventId, eventStatus: 'COMPLETED'});
                dataApi.enroll(payload);
                toast({status: 'SUCCESS', message: 'Affiliate saved successfully', affiliate: trackedEntity});
            }
        }
        catch(e) {
            toast({status: 'ERROR', message: `Error Occurred: ${e}`});
            return;
        }
    });

    document.getElementById("addKycDetails").addEventListener('change', function(e) {
        const input = e.target;
        if (input.matches("input, select, textarea")) {
            if(input.type == "file") {
            tei.values[input.id] = input.files[0];
            document.getElementById(`error-${e.target.id}`).innerHTML = '';
    
            //file donwload- change
            const blobUrl = URL.createObjectURL(input.files[0]);
            const fileLink = document.getElementById(`${input.id}-link`);
            if(fileLink){
                fileLink.href = blobUrl;
                fileLink.textContent = input.files[0].name;
                fileLink.style.display = 'inline-block';
                fileLink.target = '_blank';
            }
            return;
            }
            tei.values[input.id] = input.value;
            document.getElementById(`error-${e.target.id}`).innerHTML = '';
            ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
            document.getElementById("addKycDetails").innerHTML = renderSections(tei.programStages, tei.disabled);
            flatpickr(".flatpickr-date-input", { 
                dateFormat: "Y-m-d", 
                disable: [
                    function(date) { 
                        return  (date.getFullYear() < 1924) ||  (date > new Date()); 
                    }
                ] 
            });
        }
    });

    document.getElementById("basicInformation").addEventListener('change', function(e) {
        if (e.target.matches("input, select, textarea")) {
            tei.values[e.target.id] = e.target.value;
            document.getElementById(`error-${e.target.id}`).innerHTML = '';
            if(e.target.type == "file") return;
            ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList, tei.metadata, tei.values);
            document.getElementById("basicInformation").innerHTML = renderSections(tei.attributeSection, tei.disabled);
            flatpickr(".flatpickr-date-input", { 
                dateFormat: "Y-m-d", 
                disable: [
                    function(date) {
                        return (date.getFullYear() < 1924) || (date > new Date()); 
                    }
                ] 
            });
        }
    });

    const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
    const affilateStage = await programStageApi.get(programStage.affiliateKyc);
        
    const resRules = await programsApi.rules(programs.affiliateKyc);
    const resRuleVariables = await programsApi.ruleVariables(programs.affiliateKyc);
    const resOptionGroups = await optionSetApi.getOptionGroups();
    tei.programRules = configureRules(resRuleVariables.programRuleVariables, resRules.programRules, resOptionGroups.optionGroups);

    const programAttr = convert.attributes({ program: programAffiliateKyc });
    const affiliateStage = convert.stage({ programStage: affilateStage });
        
    tei.fileType = new Set(affiliateStage.fileType);
    tei.attributes = programAttr.attributes;
    tei.attributeSection = programAttr.sections;
    tei.dataElements = affiliateStage.dataElements;
    tei.programStages = affiliateStage.sections;
    tei.metadata = {...programAttr.metadata, ...affiliateStage.metadata};
    tei.mandatoryList = [...programAttr.mandatoryList, ...affiliateStage.mandatoryList];
    tei.values = {...programAttr.values, ...affiliateStage.values};
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
    if(userConfig.user.includes('kyc')) tei['values'][attributes.user] = userConfig.username;         

    if(tei.values[attributes.acuityCheck]) document.getElementById("sendToAcuityBtn").disabled = true;
    
    ruleCallback(tei.programRules, tei.programStages, tei.mandatoryList,  tei.metadata, tei.values);
        
    document.getElementById("basicInformation").innerHTML = renderSections(tei.attributeSection, tei.disabled);
    document.getElementById("addKycDetails").innerHTML = renderSections(tei.programStages, tei.disabled);
    flatpickr(".flatpickr-date-input", { 
        dateFormat: "Y-m-d", 
        disable: [
            function(date) { 
               return  (date.getFullYear() < 1924) ||  (date > new Date());
            }
        ] 
    });

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
    document.getElementById('addAffiliateForm').style.display = 'block';

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
}
export default newRegistration;