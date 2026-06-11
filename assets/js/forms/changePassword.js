import { changePassword } from "../api/metaDataApi.js";
import { getUserConfig } from "./config.js";

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
    }debugger

    document.getElementById('username').value = userConfig.username;

    document.getElementById('submit').addEventListener('click', async (event) => {
        event.preventDefault();

        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('Current Passwords do not match');
            return;
        }
        const response = await changePassword.put({oldPassword, newPassword});
        if(response?.ok) {
            alert('Password changed successfully. Please log in again with your new password.');
            window.location.replace('../../../dhis-web-commons/security/login.action');
        } else {
            const resValue = await response.json();
            console.log(resValue);
            if(resValue?.status == 'ERROR') alert(resValue.message);
        }
    });    
});
