import { changePassword } from "../api/metaDataApi.js";
import { getUserConfig } from "./config.js";
import { toast } from "./utils.js"

document.addEventListener("DOMContentLoaded", async function () {
    $('.sidebar-menu').show();
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

    const userConfig = await getUserConfig();
    if (userConfig) {
        userConfig.user.forEach(user => {
        $(`.${user}`).hide();
        });
    }

    document.getElementById('username').value = userConfig.username;

    document.getElementById('submit').addEventListener('click', async (event) => {
        event.preventDefault();

        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            toast({ status: 'ERROR', message: 'Please Select Country!', position: 'center' });
            return;
        }
        const response = await changePassword.put({oldPassword, newPassword});
        if(response?.ok) {
            toast({ status: 'SUCCESS', message: 'Please Select Country!', position: 'center' });
            window.location.replace('../../../dhis-web-commons/security/login.action');
        } else {
            const resValue = await response.json();
            console.log(resValue);
            if(resValue?.status == 'ERROR') toast({ status: 'ERROR', message: resValue.message, position: 'center' })
        }
    });    
});
