import { meApi } from "./assets/js/api/metaDataApi.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Index JS loaded");

  try {
    const currentUser = await meApi.get();
    if (currentUser?.userGroups?.some(group => group.code === 'KYCs')) {
      window.location.replace('1.1-new-registration.html');
    } else {
      window.location.replace('dashboard.html');
    }
  } catch (err) {
    console.error("Config load failed", err);
  }
});
