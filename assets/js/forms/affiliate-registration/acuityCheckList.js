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
    const user = await meApi.get();
    const userOrgUnit = user?.organisationUnits.map(ou => ou.id);
    const userOUCode = user?.organisationUnits.map(ou => ou.code)?.filter(ou => ou);
    document.getElementById('process-first').innerHTML = "1) Fetching Affiliate's.";
    const resAffiliateList = await dataApi.get(userOrgUnit.join(';'), programs.affiliateKyc, `filter=${attributes.countryRegistration}:in:${userOUCode.join(';')}&filter=${attributes.acuityCheck}:eq:In Progress`);
    document.getElementById('process-second').innerHTML = "2) Validating Affiliate's from Datastore.";
    const resDataStore = await dataApi.dataStore(`accuityResponse`);
    const searchableAffiliates = resAffiliateList.trackedEntities.filter(affiliate => !resDataStore.includes(affiliate.trackedEntity));
    if(searchableAffiliates.length) document.getElementById('process-third').innerHTML = `3) Total ${searchableAffiliates.length} affiliate's found`;
    else {
        document.getElementById('process-third').innerHTML = `No Affiliate's found!`;
        return;
    }
    fetchAffiliateList(searchableAffiliates);
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
        ];
        const dataValues = convert.trackedEntity(affiliate, new Set([]));
        var tableBody =  [`<tr><td colspan="4" style="text-align:center;font-weight:bold">Affiliate Name: ${dataValues['UkQI1dWzZOv'] || ''}</td></tr><tr><td style="font-weight:bold">S.No.</td><td style="font-weight:bold">Name</td><td style="font-weight:bold">Reg. No.</td><td style="font-weight:bold">Record</td></tr>`];
        
        var index = 0;
        for(let element of dataElements) {
            index++;
            const id = element.id.split('_');
            const name = dataValues[id[0]]?dataValues[id[0]]:'';
            const regNo = dataValues[id[1]]?dataValues[id[1]]:'';
            var status = "Loading";
            var body = `<tr><td>${index}</td><td>${name}</td><td>${regNo}</td><td>${status}</td></tr>`;
            tableBody.push(body);
            document.getElementById('table').innerHTML = tableBody.join('');
            await runAcuity(2000);
            status = "No Records Found";
            tableBody.pop();
            body = `<tr><td>${(index)}</td><td>${name}</td><td>${regNo}</td><td>${status}</td></tr>`;
            tableBody.push(body);
            document.getElementById('table').innerHTML = tableBody.join('');
        }
    }
  }

  function runAcuity(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

})
