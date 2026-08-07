
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

    document.getElementById("tbody-affiliate").addEventListener('click', async (e) => {
        const button = e.target.closest('.row-btn');
        if (!button) return;
        const affiliate = button.dataset.affiliate.split("_");
        if (affiliate[1] == "generate") {
            window.open(`../../../dhis-web-reports/index.html#/standard-report/view/W7AMqIhCqY6?affiliate=${affiliate[0]}`, '_blank');
        }
        else if (affiliate[1] == "view") window.location.href = `./2.1-1-view-profile.html?affiliate=${affiliate[0]}`;
    })

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