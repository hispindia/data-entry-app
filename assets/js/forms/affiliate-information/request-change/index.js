
import { dataApi } from "../../../api/DataApi.js";
import { optionSetApi, programsApi, programStageApi } from "../../../api/metaDataApi.js";
import { programs, programStage, tei } from "../../../constant.js";
import { getUserConfig } from "../../config.js";
import { configureRules, convert } from "../../metadata.js";
import handleAocRequestChange from "./aocRequestChange.js";
import { hideLoader, showLoader } from "./common.js";
import handleKycRequestChange from "./kycRequestChange.js";

document.addEventListener("DOMContentLoaded", async function () {
    window.addEventListener("popstate", async () => {
        await runPage();
});
    document.querySelectorAll(".nav-link").forEach(function (element) {
        element.addEventListener("click", function (event) {
            // allow dropdown toggle
            if (element.classList.contains("has-dropdown")) return;

            const targetPage = element.getAttribute("data-target") || element.parentElement.getAttribute("data-target");
            if (targetPage) {
                event.preventDefault();
                window.location.href = targetPage;
            }
        });
    });
    showLoader('View & Update Profile')
    const programMetadata = await programsApi.get(programs.UINControlMaster);
    tei.tabDetails = await dataApi.dataStore('uinApp/uinUpdateTab');
    const resUINControlStage = await programStageApi.get(programStage.UINControlMaster);
    const resRules = await programsApi.rules(programs.UINControlMaster);
    const resRuleVariables = await programsApi.ruleVariables(programs.UINControlMaster);
    const resOptionGroups = await optionSetApi.getOptionGroups();
    tei.programRules = configureRules(resRuleVariables.programRuleVariables, resRules.programRules, resOptionGroups.optionGroups);

    const programAttributes = convert.attributes({ program: programMetadata, disabled: false });
    const uinStage = convert.stage({ programStage: resUINControlStage, disabled: false });
    tei.attributeSection = programAttributes.sections;
    tei.attributes = programAttributes.attributes;
    tei.stageSection = [...programAttributes.sections, ...uinStage.sections];
    tei.values = { ...programAttributes.values, ...uinStage.values };
    tei.fileType = new Set([...uinStage.fileType]);
    tei.dataElements = uinStage.dataElements;

    await runPage();
    hideLoader();
});

async function runPage() {
    const userConfig = await getUserConfig();
    
    userConfig.user.forEach(user => {
        $(`.${user}`).hide();
    });
    $('.sidebar-menu').show();
    if(userConfig.user.includes('kyc')) handleKycRequestChange(userConfig);
    else handleAocRequestChange(userConfig);
}