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
      const disabledUser = userConfig.user.some(user => user=="aoc" || user=="admin");
      if(disabledUser) tei.disabled = true;
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
  document.getElementById('submit').addEventListener('click', async() => {
    const orgUnitId = tei.affiliate.enrollments.find(e => e.program == programs.affiliateKyc)?.orgUnit;
    const enrollment = tei.affiliate.enrollments.find(e => e.program == programs.affiliateKyc)?.enrollment;
    const eventId = tei.values[programStage.acuityWaiver];
    const payloadWaiver = createPayload.event({tei, event: eventId, orgUnit: orgUnitId, enrollment, program: programs.affiliateKyc, programStage: programStage.acuityWaiver});
    if(eventId) {
      await dataApi.update({ events: [eventPayload] });
    } else {
      await dataApi.enroll(payloadWaiver);
    }
    if(tei.acuityList.length) {
      const isApproved = true;
      tei.acuityList.forEach(acuity => {
        acuity.riskValues.forEach(risk => {
          if(risk.involved && risk.status!="Approve") {
          isApproved = false;
          }
        })
      })
      if(isApproved) {
        await dataApi.postAttribute({trackedEntities: [{
          trackedEntity: tei.affiliate.trackedEntity,
          orgUnit: tei.affiliate.orgUnit,
          trackedEntityType: trackedEntityType,
          attributes: [{ attribute:attributes.acuityCheck, value: "Passed"}]
          }]
        })
      } 
    }
    
    toast({status: 'SUCCESS', message: 'Waiver added Successfully!', move: true});
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
        response[0].dataElements.forEach(de => {
          tei.dataElementcode[de.code] = de.id;
          tei.dataElementcode[de.id] = de.code;
      });

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

    tei.acuityList.forEach((list) => {
      const id = list.id.split('_');
      const memberId = id[0];
      const data = list[list.id];

      list.memberId = memberId;
      list.name = tei.values[memberId]?tei.values[memberId]:"";
      if(tei.values[tei.dataElementcode[`${memberId}-designation`]]) list.designation = tei.values[tei.dataElementcode[`${memberId}-designation`]];
      else if(tei.dataElementcode[memberId]) list.designation = tei.dataElementcode[memberId];
      else list.designation = "NA";

      const riskValues = [{name: 'Arms Trafficking & WMD', code: "AT", involved: false, status: "", description: "", justification: ""}, {name: 'PEP', code: "PEP", involved: false, status: "", description: "", justification: ""}, {name: 'Terrorism', code: "TWIf", involved: false, status: "", description: "", justification: ""}, {name: 'Money Laundering', code: "ML", involved: false, status: "", description: "", justification: ""}, {name: 'Drug Trafficking', code: "DT", involved: false, status: "", description: "", justification: ""}, {name: 'Fraud', code: "FR", involved: false, status: "", description: "", justification: ""}, {name: 'Wanted Individuals', code: "WI", involved: false, status: "", description: "", justification: ""},  {name: 'Enforcement', code: "EN", involved: false, status: "", description: "", justification: ""}, {name: 'Global Sanction List', code: "GSL", involved: false, status: "", description: "", justification: ""}, ];

      if(data.includes("No Records Found")) list.riskValues = riskValues;
      else {
        riskValues.forEach(risk => {
        const riskName = risk.name
        var hasValue = false;
        var description = data.split(/\r\n/).filter(row => row.trim()
        .endsWith(risk.name))
        .map(row => row
          .replace(new RegExp(`\\.${risk.name}$`, "i"), "")
          .replace(/^[^,]+,\s*/, "")
          .trim()
        ).join(', ');
        
        risk.description = tei.values[tei.dataElementcode[`${risk.code}-Description-${memberId}`]] ? tei.values[tei.dataElementcode[`${risk.code}-Description-${memberId}`]] : description;
        risk.justification = tei.values[tei.dataElementcode[`${risk.code}-Justification-${memberId}`]] ? tei.values[tei.dataElementcode[`${risk.code}-Justification-${memberId}`]] : '';
        risk.status = tei.values[tei.dataElementcode[`${risk.code}-Status-${memberId}`]] ? tei.values[tei.dataElementcode[`${risk.code}-Status-${memberId}`]] : '';
        
        if(riskName.includes('/')) {
          const risk = riskName.split('/');
          hasValue = risk.some(name => data.includes(name));
        } else if(data.includes(riskName)) {
          hasValue = true;
        }

        if(hasValue) {
          acuityStatus = 'Failed'
          risk.involved = true;
          if(risk.code == "PEP" || risk.code == "EN") {
            risk.status = "Approve";
          }
        }
        })
        list.riskValues = riskValues;
      }
    })
    
    tei.acuityList.forEach((acuity, index) => {
      tableBody += `<tr>
      <td>${acuity.name}</td>
      <td>${acuity.designation}</td>`;
      acuity.riskValues.forEach((risk) => {
        if(risk.involved && risk.status == "Approve") {
          tableBody += `<td  class="text-center" style="background-color: rgb(240, 253, 244);border-color: rgb(134, 239, 172);" data-risk="${index}-${risk.code}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-4 h-4 text-orange" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>
          </td>`;          
        }
        else if(risk.involved && risk.status == "Reject") {
          tableBody += `<td  class="text-center" style="cursor: pointer;background-color: rgb(254, 242, 242);border-color: rgb(252, 165, 165);" data-risk="${index}-${risk.code}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4 text-orange" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </td>`;
        }
        else if(risk.involved){
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
        const riskValue = acuity.riskValues.find(risk => risk.code == code);
        const content = document.querySelector('#body-modal');
        const memberId = acuity['memberId'];
        const description = riskValue['description'];
        const status = tei.values[tei.dataElementcode[`${code}-Status-${memberId}`]] || riskValue.status || '';
        const justification = tei.values[tei.dataElementcode[`${code}-Justification-${memberId}`]] || riskValue.justification || '';
        content.innerHTML = `
                  <h6 class="font-weight-bold mb-2">Flag Details:</h6>
                  <p class="alert alert-danger mb-4" id="${code}-Description-${memberId}">
                  ${description};
                  </p>

                  <h6 class="font-weight-bold mb-2">Decision:</h6>
                  <select class="status form-control" id="${code}-status-${memberId}" ${((tei.disabled || status=='Approve') ? 'disabled' : '')}>
                  <option ${status=="" ? "selected": ""} value="">Select</option>
                  <option ${status=="Approve" ? "selected": ""} value="Approve">Approve</option>
                  <option ${status=="Reject" ? "selected": ""} value="Reject">Reject</option>
                  </select>
                 
                  </div>

                  <div class="mb-3">
                    <label class="font-weight-bold">Comments:</label>
                    <textarea  id="${code}-Justification-${memberId}" ${((tei.disabled || status=='Approve') ? 'disabled' : '')} class="justification form-control" >${justification}</textarea>
                  </div>

                <div class="custom-modal-footer">
                  <button class="btn modalAction"
                    style="background:#E93300;color:#fff"
                    ${((tei.disabled || status=='Approve') ? 'disabled' : '')}
                    data-acuityindex="${risk}"
                    id="submit-modal">
                    Submit Decision
                  </button>
                  
                  <button class="btn bg-transparent border modalAction" style="cursor: pointer;"
                  id="close-modal">
                    Cancel
                  </button>
                </div>
                  `
      document.getElementById("risk-modal").classList.add('show');
      }
    })

    document.getElementById('riskModalContent').addEventListener('click', async(ev)=> {

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
          const td = document.querySelector(`td[data-risk="${risk}"]`);
          if(status == "Approve") {
            td.style.backgroundColor = "rgb(240, 253, 244)";
            td.style.border = "rgb(134, 239, 172)";
            td.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check w-4 h-4 text-orange" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>`;
          } else if (status == "Reject") {
            td.style.backgroundColor = "rgb(254, 242, 242)";
            td.style.border = "rgb(252, 165, 165)";
            td.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4 text-orange" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`;
          } else if(status == "") {
            td.style.backgroundColor = "rgb(254, 242, 242)";
            td.style.border = "rgb(252, 165, 165)";
            td.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-4 h-4 text-danger" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`;
          }
          
          riskValue.justification = justification;
          riskValue.status = status;

          const memberId = acuity.memberId;
          const de = tei.dataElementcode[`${code}-${memberId}`];
          const deJustification = tei.dataElementcode[`${code}-Justification-${memberId}`];
          const deStatus = tei.dataElementcode[`${code}-Status-${memberId}`];
          const deDescription = tei.dataElementcode[`${code}-Description-${memberId}`];

          if(de) tei.values[de] = riskValue.involved;
          if(deJustification) tei.values[deJustification] = justification;
          if(deStatus) tei.values[deStatus] = status;
          if(deDescription) tei.values[deDescription] = riskValue.description;

          toast({ status: 'SUCCESS', message: 'Decision saved.'});
        }
        document.getElementById("risk-modal").classList.remove('show');

      }
    })
  }

})
