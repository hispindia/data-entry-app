
import { getUserConfig } from "../../config.js";
import handleAocViewAndUpdate from "./aocViewProfile.js";
import handleKycViewProfile from "./kycViewProfile.js"

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
    
    await runPage();
});

async function runPage() {
    const userConfig = await getUserConfig();
    
    userConfig.user.forEach(user => {
        $(`.${user}`).hide();
    });
    $('.sidebar-menu').show();
    if(userConfig.user.includes('kyc')) handleKycViewProfile(userConfig);
    else handleAocViewAndUpdate(userConfig);
}