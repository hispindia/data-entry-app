import { changePassword } from "./api/DataApi.js";
import { getMeData } from "./api/func.js";
import { getUserConfig, userGroupConfig } from "./forms/config.js";
import {showToast as toast} from "./utils.js"

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
    const { username } = await getMeData();
    document.getElementById('username').value = username;

    document.getElementById('btnUpdatePassword').addEventListener('click', async (event) => {
        event.preventDefault();

        const oldPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            toast("New password and confirm password do not match.")
            return;
        }
        const response = await changePassword.put({oldPassword, newPassword});
        if(response?.ok) {
            toast({ status: 'SUCCESS', message: 'Password Updated Successfully!', position: 'center' });
            window.location.replace('../../../dhis-web-commons/security/login.action');
        } else {
            const resValue = await response.json();
            console.log(resValue);
            if(resValue?.status == 'ERROR') toast(`${resValue.message}`)
        }
    });    
});
