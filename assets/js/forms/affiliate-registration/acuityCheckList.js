import { dataApi } from "../../api/DataApi.js";
import { meApi, optionSetApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, dataElements, optionSet, programStage, programs, tei, trackedEntityType } from "../../constant.js";
import { configureRules, convert, fetchValueType, ruleCallback } from "../metadata.js";
import { getUserConfig } from "../config.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userConfig = await getUserConfig();
  if (userConfig) {
      userConfig.user.forEach(user => {
      $(`.${user}`).hide();
      });
  }

  $('.sidebar-menu').show();

  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault(); 
      var targetPage = event.currentTarget.getAttribute("data-target") || event.currentTarget.parentElement.getAttribute("data-target");
      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });
 

  loadAffiliates();
  async function loadAffiliates() {
    // const rresponse = await dataApi.dataStoreDelete('accuityResponse', 'YhW4ROqTyVi');
    const url = new URL(window.location.href);
    const affiliate = url.searchParams.get('affiliate');

    const user = await meApi.get();
    const userOrgUnit = user?.organisationUnits.map(ou => ou.id);
    const userOUCode = user?.organisationUnits.map(ou => ou.code)?.filter(ou => ou);
    document.getElementById('process-first').innerHTML = "1) Fetching Affiliate's.";
    var resAffiliateList = [];
    if(affiliate) resAffiliateList = await dataApi.getTrackedEntity(affiliate);
    else resAffiliateList = await dataApi.get(userOrgUnit.join(';'), programs.affiliateKyc, `filter=${attributes.countryRegistration}:in:${userOUCode.join(';')}&filter=${attributes.acuityCheck}:eq:In Progress`);
    document.getElementById('process-second').innerHTML = "2) Validating Affiliate's from Datastore.";
    if(resAffiliateList.status == "ERROR") document.getElementById('process-third').innerHTML = "Error fetching Affiliate's!";
    const resDataStore = await dataApi.dataStore(`accuityResponse`);
    const searchableAffiliates = resAffiliateList.trackedEntities.filter(affiliate => !resDataStore.includes(affiliate.trackedEntity));
    if(searchableAffiliates.length) document.getElementById('process-third').innerHTML = `3) Total ${searchableAffiliates.length} affiliate's found`;
    else {
        document.getElementById('process-third').innerHTML = `No Affiliate's found!`;
        return;
    }
    await fetchAffiliateList(searchableAffiliates);
    document.getElementById('process-fifth').innerHTML = "5) Afffilaite's check Completed!";
  }

  async function fetchAffiliateList(searchableAffiliates) {
    var count = 0;
    for(let affiliate of searchableAffiliates) {
        document.getElementById('table').innerHTML = '';
        document.getElementById('process-fourth').innerHTML = `4) Checking ${++count} out of ${searchableAffiliates.length} Affiliate's.`;
        const dataElements = [
            {id: "UkQI1dWzZOv_qsASQ0NRTVA", status: ""},
            {id: "daG91uRV8pi_DhSKMFMRH84", status: ""},
            {id: "uT1NdSet4eo_LGaOnTyfRJ2", status: ""},
            {id: "DMJOfwrOwo8_kezRO5k8bYy", status: ""},
            {id: "fKFIKK33FRc_ZqxEuYK8vUB", status: ""},
            {id: "xCJOBTvagP9_NHoDQ5DC1jY", status: ""},
            {id: "RA5zVHd7pVO_VWdVRyHFlBh", status: ""},
            {id: "glFVJpRaGWK_vcR9TS21A05", status: ""},
            {id: "U4OSVfrlPxQ_A46ZGJLezyc", status: ""},
            {id: "YjmSPK8DMOZ_nY0g2hnfnUB", status: ""},
            {id: "TfCXfVv6j2O_WY7Aao5rT82", status: ""},
            {id: "cvI0Tq2uPjC_no-de", status: ""},
            {id: "CkulnRpyanv_no-de", status: ""},
            {id: "OHPBCB8PgSo_no-de", status: ""},
        ];
        const dataValues = convert.trackedEntity(affiliate, new Set([]));  
        var teiAcuityCheck = []; 
        var index = 0;
        var tableBody =  [`<tr><td colspan="4" style="text-align:center;font-weight:bold">Affiliate Name: ${dataValues['UkQI1dWzZOv'] || ''}</td></tr><tr><td style="font-weight:bold">S.No.</td><td style="font-weight:bold">Name</td><td style="font-weight:bold">Reg. No.</td><td style="font-weight:bold">Record</td></tr>`];
        for(let element of dataElements) {
            index++;
            const date = new Date();
            const newDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const id = element.id.split('_');
            const name = dataValues[id[0]]?dataValues[id[0]]:'';
            const regNo = dataValues[id[1]]?dataValues[id[1]]:'';
            var status = "Loading";
            var body = `<tr><td>${index}</td><td>${name}</td><td>${regNo}</td><td>${status}</td></tr>`;
            tableBody.push(body);
            document.getElementById('table').innerHTML = tableBody.join('');
            if(index >= 12) {
              if(name) {
                showLoader(`Please wait ${name} is Loaded...`);
                const response = await runAcuityBank({name});
                hideLoader();
                status = response.rawPageText;
                teiAcuityCheck.push({
                  "id": `${element.id}`,
                  "date": newDate,
                  "sl_no": index,
                  "tei_uid": affiliate.trackedEntity,
                  [id[0]]: name,
                  [id[1]]: regNo,
                  [element.id]: response.rawPageText,
                });
              } else {
                status = "No Data Found in Source";
                teiAcuityCheck.push({
                  "id": `${element.id}`,
                  "date": newDate,
                  "sl_no": index,
                  "tei_uid": affiliate.trackedEntity,
                  [id[0]]: name,
                  [id[1]]: regNo,
                  [element.id]: "No Data Found in Source",
                });
              }

            } 
            // else {
            //   if(name && regNo) {
            //     showLoader(`Please wait ${name} is Loaded...`);
            //     const response = await runAcuity({name, regNo});
            //     hideLoader();
            //     status = response.rawPageText;
            //     teiAcuityCheck.push({
            //       "id": `${element.id}`,
            //       "date": newDate,
            //       "sl_no": index,
            //       "tei_uid": affiliate.trackedEntity,
            //       [id[0]]: name,
            //       [id[1]]: regNo,
            //       [element.id]: response.rawPageText,
            //     });
            //   } else {
            //     status = "No Data Found in Source";
            //     teiAcuityCheck.push({
            //       "id": `${element.id}`,
            //       "date": newDate,
            //       "sl_no": index,
            //       "tei_uid": affiliate.trackedEntity,
            //       [id[0]]: name,
            //       [id[1]]: regNo,
            //       [element.id]: "No Data Found in Source",
            //     });
            //   }
            // }
            tableBody.pop();
            body = `<tr><td>${(index)}</td><td>${name}</td><td>${regNo}</td><td>${status}</td></tr>`;
            tableBody.push(body);
            document.getElementById('table').innerHTML = tableBody.join('');
        }
        await dataApi.dataStoreNew('accuityResponse', affiliate.trackedEntity, teiAcuityCheck);
    }
  }

 async function runAcuity({name, regNo}) {
    try {
      const res = await fetch("https://default56af9532501a404c995d80633a35c0.ac.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/659d9a7a7b404fbfa426dfa84e486992/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5VaBmHuGhyAYYnAumUf0eqdXPwOpue0aPICvxPgfthQ", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "eventUid": "abc123",
        "action": "complete",
        "orgUnit": "OU_01",
        "program": "Prog_01",
        "PresidentName": `${name} ${regNo}`
      })
    });
    if(!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    var response = await res.json();
    if(response?.rawPageText) {
      const pageText = ['Names', 'Country/Region', 'Class'].some(val => response.rawPageText.includes(val));
      if(!pageText) response.rawPageText = "No Records Found";
    }
      return response;
      
    } catch (error) {
      console.error("Error in acuity: ", error);
      showLoader(`Accuity is not Responding Fetching again for ${name}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await runAcuity({name, regNo});

    }
  }
  
 async function runAcuityBank({name}) {
    try {
       var res = await fetch("https://default56af9532501a404c995d80633a35c0.ac.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/1b806d85e0c3424984a2033ab269967a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4YFvKxncVyxpWlgVmBVd96icBe-JT4X6AjUhrGbWaFI", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "eventUid": "abc123",
        "action": "complete",
        "orgUnit": "OU_01",
        "program": "Prog_01",
        "EntityType":"Organization",
        "OrganizationName": `${name}`
      })
    });
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    var response = res.json();

    if(response?.rawPageText) {
      const pageText = ['Names', 'Country/Region', 'Class'].some(val => response.rawPageText.includes(val));
      if(!pageText) response.rawPageText = "No Records Found";
    }

    return response;  
      
    } catch (error) {
      console.error("Error in runAcuityBank:", error);
      showLoader(`Fetching again for ${name}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await runAcuityBank({name});
    }
  }
})

 function showLoader(message) {
    // Remove existing loader if any
    const existingLoader = document.getElementById("global-loader");
    if (existingLoader) existingLoader.remove();
    
    const loader = document.createElement("div");
    loader.id = "global-loader";
    loader.innerHTML = `
      <div style="
        position: fixed;
        top:0; left:0;
        width:100%; height:100%;
        background: rgba(0,0,0,0.5);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:99999;
      ">
        <div style="
          background:white;
          padding:30px 40px;
          border-radius:10px;
          text-align:center;
          box-shadow:0 4px 20px rgba(0,0,0,0.2);
        ">
          <div class="spinner" style="
            border:5px solid #eee;
            border-top:5px solid #15803d;
            border-radius:50%;
            width:40px;
            height:40px;
            margin:0 auto 15px;
            animation: spin 1s linear infinite;
          "></div>
          <p style="font-weight:500;">${message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(loader);

    // inject animation once
    if (!document.getElementById("loader-style")) {
      const style = document.createElement("style");
      style.id = "loader-style";
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
}

function hideLoader() {
    const loader = document.getElementById("global-loader");
    if (loader) loader.remove();
}