import { dataApi } from "../../api/DataApi.js";
import { dataElementsApi, optionSetApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, dataElements, optionSet, programStage, programs, tei, trackedEntityType } from "../../constant.js";
import { configureRules, convert, fetchValueType, ruleCallback } from "../metadata.js";
import { getUserConfig } from "../config.js";
import { toast } from "../utils.js";

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

  if(userConfig.user.includes('waiver')) $('#submitBtn').removeClass('d-none')
  
  fetchAffiliate();
  async function fetchAffiliate() {
    const params = new URLSearchParams(window.location.search);
    const affiliate = params.get('affiliate');
    if(affiliate) {
      try {
        const response = await Promise.all([
          dataElementsApi.get({param: ['filter=code:!null', 'fields=id,name,code']}),
          programStageApi.get(programStage.acuityWaiver),
          dataApi.getTrackedEntity(affiliate),
          dataApi.dataStore(`accuityResponse/${affiliate}`)
        ]);
        tei.dataElements = response[0].dataElements;
        const acuityWaiver = convert.stage({ programStage: response[1]});    
        tei.affiliate = response[2].trackedEntities[0];
        tei.acuityList = response[3].sort((a, b) => +a.sl_no - +b.sl_no);
      }
      catch(err) {
        toast({status: 'INFO', message: 'Affiliate Not found'});
        return;
      }
    }

    const dataValues = {};
    tei.affiliate.attributes.forEach(attr => dataValues[attr.attribute]=attr.value);
    tei.affiliate.enrollments.forEach(enroll => {
      enroll.events.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
      enroll.events.forEach(event => {
        event.dataValues.forEach(dv => {
          if (!dataValues.hasOwnProperty(dv.dataElement)) {
            dataValues[dv.dataElement] = dv.value;
          }
        });
      });
    });
    
    var acuityStatus = "";
    document.getElementById('region').innerHTML = dataValues[attributes.region] ||  '';
    document.getElementById('country').innerHTML = dataValues[attributes.countryRegistration] ||  '';
    document.getElementById('name').innerHTML = dataValues[attributes.legalName] ||  '';
    document.getElementById('reg-num').innerHTML = dataValues[attributes.registrationNum] ||  '';

    var tableBody = ""
    const elements = {};
    tei.dataElements.forEach(de => elements[de.code] = de.id);

    tei.acuityList.forEach(list => {
      const id = list.id.split('_')
      const data = list[list.id];
      const riskValues = [{name: 'Arms Trafficking & WMD', code: "AT", involved: false, status: "", description: "", justification: ""}, {name: 'PEP', code: "PEP", involved: false, status: "", description: "", justification: ""}, {name: 'Terrorism', code: "TWIf", involved: false, status: "", description: "", justification: ""}, {name: 'Money Laundering', code: "ML", involved: false, status: "", description: "", justification: ""}, {name: 'Drug Trafficking', code: "DT", involved: false, status: "", description: "", justification: ""}, {name: 'Fraud', code: "FR", involved: false, status: "", description: "", justification: ""}, {name: 'Wanted Individuals / Global Sanction List', code: "GSL", involved: false, status: "", description: "", justification: ""},  {name: 'Enforcement', code: "EN", involved: false, status: "", description: "", justification: ""}];

       riskValues.forEach(risk => {
        if(data.includes(risk.name)) {
          acuityStatus = 'Failed'
          risk.involved = true;
          risk.description = data;
        }
       })

      tableBody += `<tr>
      <td>${dataValues[id[0]]?dataValues[id[0]]:""}</td>
      <td>${dataValues[`${id[0]}-designation`]?`${id[0]}-designation`:"NA"}</td>`;
      riskValues.forEach(val => {
        if(val.involved){
          tableBody += `<td  class="text-center" style="cursor: pointer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-4 h-4 text-danger" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg></td>`;
        }
        else {
          tableBody += `<td  class="text-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4 text-success" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></td>`
        }
      })
      tableBody += '</tr>'
    })
    document.getElementById('acuity-status').innerHTML =  acuityStatus; 
    document.getElementById(`tbody-affiliate`).innerHTML = tableBody;
  
  }
})
