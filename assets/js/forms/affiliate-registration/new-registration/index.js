
import { getUserConfig } from "../../config.js";
import newRegistration from "./kycUser.js";
import handleRegistration from "./aocUser.js";

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
    
    if(userConfig.user.includes('kyc')) newRegistration(userConfig);
    else handleRegistration(userConfig);
}