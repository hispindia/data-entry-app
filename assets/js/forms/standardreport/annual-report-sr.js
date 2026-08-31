import { tei } from "../../constant.js";
import { getUserConfig } from "../config.js";

document.addEventListener("DOMContentLoaded", function () {
    // Add event listener to each list item
    document.querySelectorAll(".nav-link").forEach(function (element) {
        element.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default action
            var targetPage = event.currentTarget.getAttribute("data-target");
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });

    configurePage();
    async function configurePage() {
        try {
            const user = await getUserConfig();

            if (user.organisationUnits?.length) {
                tei.orgUnit = user.organisationUnits[0].id;
            }

            if (user.hideReporting.includes('aoc')) {
                $(`.aoc-users`).show();
            } else $(`.aoc-users`).hide();

            if (user.hideReporting.includes('trt')) {
                $(`.trt-users`).show();
            } else if (!user.hideReporting.includes('trt') && !user.hideReporting.includes('aoc')) $(`.trt-users`).hide();

            if (user.hideReporting.includes('core')) {
                $('.core-users').show();
            }

            if (user.hideReporting.includes('ma')) {
                $('.ma-users').show();
            }
        }
        catch(e) {
            console.log('err loding user')
        }
    }
});
