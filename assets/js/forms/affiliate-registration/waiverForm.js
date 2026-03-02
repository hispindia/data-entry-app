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
  document.getElementById('submitBtn').addEventListener('click', async() => {

    tei.acuityList.forEach(acuity => {
      acuity.riskValues.forEach(risk => {
        if(risk.involved) {
          const de = tei.dataElementcode[`${risk.code}-${acuity.memberId}`];
          const deJustification = tei.dataElementcode[`${risk.code}-Justification-${acuity.memberId}`];
          const deStatus = tei.dataElementcode[`${risk.code}-Status-${acuity.memberId}`];
          const deDescription = tei.dataElementcode[`${risk.code}-Description-${acuity.memberId}`];
          if(de) tei.values[de] = risk.involved;
          if(deJustification) tei.values[deJustification] = risk.justification;
          if(deStatus) tei.values[deStatus] = risk.status;
          if(deDescription) tei.values[deDescription] = risk.description;
        }
      })
    })
      await dataApi.postAttribute({trackedEntities: [{
        trackedEntity: tei.affiliate.trackedEntity,
        orgUnit: tei.affiliate.orgUnit,
        trackedEntityType: trackedEntityType,
        attributes: [{ attribute:attributes.acuityCheck, value: "Passed"}]
        }]
      })
      const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.orgUnit;
      const enrollment = tei.affiliate.enrollments.find(enroll => enroll.program == programs.affiliateKyc)?.enrollment;
      
      console.log("tei.values before payload:", tei.values);
      const payloadWaiver = createPayload.event(tei, orgUnitId, enrollment, programs.affiliateKyc, programStage.acuityWaiver);
      const existingEventId = tei.values[programStage.acuityWaiver];

      if(existingEventId) {
        const eventPayload = payloadWaiver.events ? payloadWaiver.events[0] : payloadWaiver;
        eventPayload.event = existingEventId;
        await dataApi.update({ events: [eventPayload]});
       
      }
      else {
        const createdEventId = await dataApi.enroll(payloadWaiver);
        tei.values[programStage.acuityWaiver] = createdEventId;
      }
      toast({status: 'SUCCESS', message: 'Waiver added Successfully.'});

})
  
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
        response[0].dataElements.forEach(de => tei.dataElementcode[de.code] = de.id);

        const acuityWaiver = convert.stage({ programStage: response[1]}); 
        
        tei.programStages = [...acuityWaiver.sections];
        tei.dataElements = acuityWaiver.dataElements;
        tei.metadata = {...acuityWaiver.metadata};   
        
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
        dataValues[event.programStage] = event.event;
        event.dataValues.forEach(dv => {
          if (!dataValues.hasOwnProperty(dv.dataElement)) {
            dataValues[dv.dataElement] = dv.value;
          }
        });
      });
    });
    tei.values = dataValues;
    
    var acuityStatus = "";
    document.getElementById('region').innerHTML = tei.values[attributes.region] ||  '';
    document.getElementById('country').innerHTML = tei.values[attributes.countryRegistration] ||  '';
    document.getElementById('name').innerHTML = tei.values[attributes.legalName] ||  '';
    document.getElementById('reg-num').innerHTML = tei.values[attributes.registrationNum] ||  '';

    var tableBody = ""

    tei.acuityList.forEach((list,index) => {
      const id = list.id.split('_');
      const memberId = id[0];
      const data = list[list.id];
      const riskValues = [{name: 'Arms Trafficking & WMD', code: "AT", involved: false, status: "", description: "", justification: ""}, {name: 'PEP', code: "PEP", involved: false, status: "", description: "", justification: ""}, {name: 'Terrorism', code: "TWIf", involved: false, status: "", description: "", justification: ""}, {name: 'Money Laundering', code: "ML", involved: false, status: "", description: "", justification: ""}, {name: 'Drug Trafficking', code: "DT", involved: false, status: "", description: "", justification: ""}, {name: 'Fraud', code: "FR", involved: false, status: "", description: "", justification: ""}, {name: 'Wanted Individuals / Global Sanction List', code: "GSL", involved: false, status: "", description: "", justification: ""},  {name: 'Enforcement', code: "EN", involved: false, status: "", description: "", justification: ""}];

       riskValues.forEach(risk => {
        if(data.includes(risk.name)) {
          acuityStatus = 'Failed'
          risk.involved = true;
          risk.description = data;
        }
      list.memberId = memberId;
      list.name = tei.values[memberId]?tei.values[memberId]:"";
      list.designation = tei.values[`${memberId}-designation`]?tei.values[`${memberId}-designation`]:"NA";
      list.description = tei.values[tei.dataElementcode[`${risk.code}-Description-${memberId}`]] ? tei.values[tei.dataElementcode[`${risk.code}-Description-${memberId}`]] : risk.description;
      list.justification = tei.values[tei.dataElementcode[`${risk.code}-Justification-${memberId}`]] ? tei.values[tei.dataElementcode[`${risk.code}-Justification-${memberId}`]] : '';
      list.status = tei.values[tei.dataElementcode[`${risk.code}-Status-${memberId}`]] ? tei.values[tei.dataElementcode[`${risk.code}-Status-${memberId}`]] : '';
      list.riskValues = riskValues;
       })
       
    })
    tei.acuityList.forEach((acuity, index) => {
      tableBody += `<tr>
      <td>${acuity.name}</td>
      <td>${acuity.designation}</td>`;
      acuity.riskValues.forEach(risk => {
        if(risk.involved){
          tableBody += `<td  class="text-center" style="cursor: pointer;background-color: rgb(254, 242, 242);border-color: rgb(252, 165, 165);" data-risk="${index}-${risk.code}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4 text-danger" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </td>`;
        }
        else {
          tableBody += `<td  class="text-center" style="background-color: rgb(240, 253, 244);border-color: rgb(134, 239, 172);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-4 h-4 text-success" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>
          </td>`
        }
      })
      tableBody += '</tr>'
    })
    document.getElementById('acuity-status').innerHTML =  acuityStatus; 
    document.getElementById(`tbody-affiliate`).innerHTML = tableBody;
    document.getElementById(`tbody-affiliate`).addEventListener('click', (ev) => {

      const td = ev.target.closest("td");

      if (!td) return;

      const {risk} = td.dataset;
      if(risk) {
        const index = risk.split('-')[0];
        const code = risk.split('-')[1];
        const acuity = tei.acuityList[index];
        const riskValue = acuity.riskValues.find(risk => risk.code ==code);
        const content = document.querySelector('#body-modal');
        const memberId = acuity['memberId'];
        const description = riskValue['description'].match(/,\s*(.*?)\./)[1];
        // const status = riskValue['status'];
        const status = tei.values[tei.dataElementcode[`${code}-Status-${memberId}`]] || riskValue.status || '';
        // const justification = riskValue['justification'];
        const justification = tei.values[tei.dataElementcode[`${code}-Justification-${memberId}`]] || riskValue.justification || '';
        debugger;
        content.innerHTML = `
                  <h6 class="font-weight-bold mb-2">Flag Details:</h6>
                  <p class="alert alert-danger mb-4" id="${code}-Description-${memberId}">
                  ${description};
                  </p>

                  <h6 class="font-weight-bold mb-2">Decision:</h6>
                  <select class="status form-control" id="${code}-status-${memberId}">
                  <option ${status=="" ? "selected": ""} value="">Select</option>
                  <option ${status=="Approve" ? "selected": ""} value="Approve">Approve</option>
                  <option ${status=="Reject" ? "selected": ""} value="Reject">Reject</option>
                  </select>
                 
                  </div>

                  <div class="mb-3">
                    <label class="font-weight-bold">Comments:</label>
                    <textarea  id="${code}-Justification-${memberId}" class=" justification form-control" >${justification}</textarea>
                  </div>

                <div class="custom-modal-footer">
                  <button class="btn bg-transparent border modalAction" style="cursor: pointer;"
                  id="close-modal">
                    Cancel
                  </button>

                  <button class="btn modalAction"
                    style="background:#E93300;color:#fff"
                    data-acuityindex="${risk}"
                    id="submit-modal">
                    Submit Decision
                  </button>
                </div>
                  `
      document.getElementById("risk-modal").classList.add('show');
      }
    })

    document.getElementById('riskModalContent').addEventListener('click', (ev)=> {

  const button = ev.target.closest('.modalAction');
  if(!button) return;
  if(button.id == "close-modal") {
    document.getElementById("risk-modal").classList.remove('show');
  } 
  if(button.id == "submit-modal") {
    const risk = button.dataset.acuityindex;
    if(risk) {

        const index = risk.split('-')[0];
        const code = risk.split('-')[1];
      
        const acuity = tei.acuityList[index];
        const riskValue = acuity.riskValues.find(risk => risk.code ==code);
        const justification = document.getElementsByClassName('justification')[0].value;
        const status = document.getElementsByClassName('status')[0].value;
        
        riskValue.justification = justification;
        riskValue.status = status;
    }
    document.getElementById("risk-modal").classList.remove('show');

  }
    })
  }

})
