import { getUserConfig } from './config.js';

export async function applyAccessControl() {
    const userConfig = await getUserConfig();

    if (userConfig && userConfig.hideSideBar) {
        userConfig.hideSideBar.forEach(item => {
            const navLink = document.querySelector(`.nav-link[data-target="${item}"]`);
            if (navLink) {
                const listItem = navLink.closest('li');
                if (listItem) {
                    listItem.style.display = 'none';
                }
            }

            const menuItem = document.getElementById(item);
            if (menuItem) {
                menuItem.style.display = 'none';
            }
        });
    }
}

export async function isWaiverBlocked() {
    const userConfig = await getUserConfig();
    return userConfig?.blockAddWaiver || false;
}