import { dataApi } from "../../api/DataApi.js"
import { optionSetApi, orgUnitsApi, programStageApi, programsApi } from "../../api/metaDataApi.js";
import { createPayload } from "../../api/payload.js";
import { attributes, dataElements, optionSet, programStage, programs, tei } from "../../constant.js";
import { getNextCode } from "../func.js";
import { convert, fetchValueType } from "../metadata.js";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault(); 
      var targetPage = event.currentTarget.getAttribute("data-target");
      if (targetPage) {
        window.location.href = targetPage;
      }
    });
  });

  document.getElementById('generateUIN').addEventListener('click', async function() { 
     if(tei.mandatoryList) {
            let empty = false;
            for(const id of tei.mandatoryList) {
                const value = document.getElementById(id).value;
                const mandatoryError = document.querySelector(`#error-${id}`);
                if(!value) {
                    empty = true;
                    if(mandatoryError) {
                        mandatoryError.innerHTML = "This field is required";
                        mandatoryError.scrollIntoView({ behavior: "smooth", block: "center" });
                        mandatoryError.focus({ preventScroll: true });
                    }

                } else {
                    mandatoryError.innerHTML = "";
               }
            }
            if(empty) {
                alert('Please fill mandatory fields!');
                return;
            }
        }
    if(tei.affiliate) {
        const orgUnitId = tei.affiliate.enrollments.find(enroll => enroll.program == programs.UINControlMaster)?.orgUnit;
        const enrollment = tei.affiliate.enrollments.find(enroll => enroll.program == programs.UINControlMaster)?.enrollment;
        const countryRegistration = tei.affiliate.attributes.find(attr => attr.attribute == attributes.countryRegistration);
        if(!orgUnitId || !enrollment) return;
        // debugger;
        // await dataApi.postAttribute({
        // })
        const payloadDueDiligence = createPayload.event(tei, orgUnitId, enrollment, programs.UINControlMaster, programStage.dueDiligence);
        await dataApi.enroll(payloadDueDiligence);
        const orgUnit = await orgUnitsApi.get({filter:countryRegistration.value});
        const nextNum = getNextCode(orgUnit.organisationUnits[0].children.filter(obj => obj.code !== undefined).map(obj => obj.code));
        const nextOUCode = `${orgUnit.organisationUnits[0].parent.code}-${orgUnit.organisationUnits[0].code}-${nextNum}`;
        const payloadOrgUnit = createPayload.orgUnit(orgUnit.organisationUnits[0].id, tei.affiliate.attributes, nextOUCode);
        const neworgUnit = await orgUnitsApi.post(payloadOrgUnit);
        if(neworgUnit.httpStatus == "OK" && neworgUnit.response.typeReports) {
          const orgUnitId = neworgUnit.response.typeReports[0].objectReports[0].uid;
          await programsApi.postOU({orgUnit:orgUnitId, program: programs.UINControlMaster})
          const payloadEvent =  createPayload.modifyEvent(tei.affiliate, orgUnitId, programs.UINControlMaster, programStage.UINControlMaster, programStage.affiliateKyc);
          await dataApi.enroll(payloadEvent);
          alert(`UIN Generated Successfully!\nUIN No: ${nextOUCode}`);
          window.location.href = './1.2-eligibility-check-and-manage-waivers.html'
        }
    }
  })

  document.getElementById("dueDiligence").addEventListener('change', function(e) {
      if (e.target.matches("input, select, textarea")) {
          tei.values[e.target.id] = e.target.value;
          document.getElementById(`error-${e.target.id}`).innerHTML = '';
        }
  });

  fetchAffiliateList();
  async function fetchAffiliateList() {
    tei.mandatoryList = []
  const params = new URLSearchParams(window.location.search);
  const affiliate = params.get('affiliate');
  if(affiliate) {
    try {
    const resAffiliate = await dataApi.getTrackedEntity(affiliate);
    
    if (!resAffiliate.trackedEntities) {
      const errorBody = await resAffiliate.json();
      throw new Error(errorBody.message || 'Request failed');
    }

    tei.affiliate = resAffiliate.trackedEntities[0];
    document.getElementById('generateUIN').disabled = false;
    }
    catch(err) {
      console.log('no affiliate found')
      alert('No affiliate found!', err)
      return;
    }
  }

  const dataValues = {};
  tei.affiliate.attributes.forEach(attr => dataValues[attr.attribute]=attr.value);
  tei.affiliate.enrollments.forEach(enroll => {
    enroll.events.forEach(event => {
      event.dataValues.forEach(dv =>dataValues[dv.dataElement]=dv.value);
    })
  });
  const countryNameAndCodes = {};
  const country = await optionSetApi.get(optionSet.country);
  if(country.options){
    country.options.forEach(opt => {
      countryNameAndCodes[opt.value] = opt.label;
    })
  }
  document.getElementById('country').innerHTML = countryNameAndCodes[dataValues[attributes.countryRegistration]] ? `(${countryNameAndCodes[dataValues[attributes.countryRegistration]]})`  : ''

  const programMetadata = await programsApi.get(programs.affiliateKyc);
  const programAttributes = convert.attributes({ program: programMetadata, disabled: true });
  
  const resAffilateStage = await programStageApi.get(programStage.affiliateKyc);
  const resDueDiligence = await programStageApi.get(programStage.dueDiligence);

  const affilateStage = convert.stage({ programStage: resAffilateStage, disabled: true });
  const dueDiligence = convert.stage({ programStage: resDueDiligence });
  
  tei.programStages = dueDiligence.sections;
  tei.values = {...programAttributes.values, ...affilateStage.values, ...dueDiligence.values, ...dataValues};
  tei.metadata = {...programAttributes.metadata, ...affilateStage.metadata, ...dueDiligence.metadata};
  tei.mandatoryList = [...programAttributes.mandatoryList, ...affilateStage.mandatoryList, ...dueDiligence.mandatoryList];
  dataElements.affiliateKYCOther.forEach(section => section.items.forEach(el => {
    if(el.mandatory) tei.mandatoryList.push(el.code);
  }))

  document.getElementById("basicInformation").innerHTML = renderSections(programAttributes.attributes);
  const dueDiligenceDiv = renderSections(dueDiligence.sections);
  const affiliateKYCDiv = renderSections(affilateStage.sections);
  const affiliateOtherDiv = renderSections(dataElements.affiliateKYCOther);
  
    document.getElementById("dueDiligence").innerHTML = `${affiliateKYCDiv} 
    <h4 class="mt-3" style="color: black;">Due Dilligence</h4>
    ${dueDiligenceDiv}
    ${affiliateOtherDiv}`
  }

    function renderSections(sections) {
    let container = "";

    for (const section of sections) {
        if(section.hidden) continue;
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "card mb-4 p-3";
        sectionDiv.style.backgroundColor = "white";
        sectionDiv.style.borderRadius = "8px";
        sectionDiv.innerHTML = `<h5 style="color:#3b71ca;font-weight:bold;">${section.name}</h5>`;
   
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        sectionDiv.appendChild(rowDiv);

        for (const el of section.items) {
            if(el.hidden) continue;
            const fieldWrapper = document.createElement("div");
            fieldWrapper.className = "form-group col-md-4 mb-2";

            fieldWrapper.innerHTML = `
                <label>
                    ${el.name}
                    ${el.mandatory ? '<span class="text-danger">*</span>' : ''}
                </label>
                ${fetchValueType({id: el.code, valueType: el.valueType, valueSet: el.valueSet}, (tei?.values[el.code] || "") , el.disabled)}
                <div id="error-${el.code}" style="color: red"></div>
            `;
            rowDiv.appendChild(fieldWrapper);
        }
        container += sectionDiv.outerHTML;
    }
    return container;
    }
})
