import { getUserConfig } from './config.js';

export async function applyAccessControl() {
    const userConfig = await getUserConfig();

    if (userConfig) {
        // Hide sidebar items and buttons
        // [...userConfig.hideSideBar, ...(userConfig.hideButtons || [])].forEach(item => {
        //     if (!item || typeof item !== 'string') return;
        //     const cls = item.trim();
        //     if (!cls) return;

        //     try {
        //         document.querySelectorAll(`.${cls}`).forEach(el => {
        //             el.style.display = 'none';
        //         });
        //     } catch (err) {
        //         console.warn(`Skipping invalid selector: .${cls}`, err);
        //     }

        //     try {
        //         const el = document.getElementById(cls);
        //         if (el) el.style.display = 'none';
        //     } catch (err) {
        //         console.warn(`Error occured while hiding UIN button: ${cls}`, err);
        //     }
        userConfig.user.forEach(user => {
        $(`.${user}`).hide();
        // })
        });
    }
}

export async function isWaiverBlocked() {
    const userConfig = await getUserConfig();
    return userConfig?.blockAddWaiver || false;
}