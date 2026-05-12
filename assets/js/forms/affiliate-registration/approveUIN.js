import { dataApi } from "../../api/DataApi.js";
import { meApi, programsApi} from "../../api/metaDataApi.js";
import { attributes, programs} from "../../constant.js";
import { getUserConfig } from "../config.js";
import { toast } from "../utils.js";
 const checkboxOptions = [
    {
      label: "Business Planning and Reporting Portal",
      api: "http://stage.hispindia.org:8000/orgunit-bpr"
    },
    {
      label: "IPPF DHIS2",
      api: "http://stage.hispindia.org:8000/orgunit-pro"
    },
    {
      label: "Kofax Unrestricted Funding Agreement",
      api: ""
    },
    {
      label: "NetSuite",
      api: ""
    }

 ]
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
  
  fetchAffiliateList();
  
  async function fetchAffiliateList() {
    try {
      const user = await meApi.get();
      const userOrgUnit = user?.organisationUnits.map(ou => ou.id).join(';');
      const resAffiliateList = await dataApi.get(userOrgUnit, programs.affiliateKyc);
  
      const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
  
      const affilitateAttrList = resAffiliateList.trackedEntities.map(trackedEntity => {
        const attributesObj = {
          id: trackedEntity.trackedEntity
        };
        trackedEntity.attributes.forEach(attr => attributesObj[attr.attribute] = attr.value);
        return attributesObj;
      });

      const approvedList = affilitateAttrList.filter(trackedEntity => 
        trackedEntity[attributes.acuityCheck] == "Passed" && 
        trackedEntity[attributes.submitted] && 
        trackedEntity[attributes.uinCodeAffiliate]
      );
  
      document.getElementById('approvedCount').innerHTML = approvedList.length;
    
      const headerList = programAffiliateKyc.programTrackedEntityAttributes
      .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
      .map(attr => ({id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name}));
  
      var theadAffiliateRow = "";
      headerList.forEach(item => theadAffiliateRow+= `<th class="py-3 px-4 font-weight-bold border-0 text-center">${item.name}</th>`);
      
      document.getElementById('thead-affiliate-approved').innerHTML = `${theadAffiliateRow}<th class="py-3 px-4 font-weight-bold border-0 text-center">Actions</th>`;
      
      var tbodyAffiliateApprovedRow = "";

      if (approvedList.length === 0) {
        tbodyAffiliateApprovedRow = `<tr><td colspan="${headerList.length + 1}" class="text-center py-4">No records found</td></tr>`;
      } else {
        approvedList.forEach(affiliate => {
          tbodyAffiliateApprovedRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`;
            if (affiliate[attributes.uinCodeAffiliate]) {
                headerList.forEach(attr => {
                if(attr.id == attributes.acuityCheck) {
                  tbodyAffiliateApprovedRow += `<td class="text-center">
                  ${(affiliate[attr.id] ? `<span style="background-color: #bbf7d0; color: #15803d; font-weight: 500; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem;">Approved</span>`: '')}
                  </td>`;
                }
                else {
                  tbodyAffiliateApprovedRow += `<td class="text-center">${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`;
                }
              });
            tbodyAffiliateApprovedRow += `
            <td class="text-center">  
              <button 
                data-affiliate="${affiliate.id}" 
                data-uin="${affiliate[attributes.uinCodeAffiliate]}"
                data-region="${affiliate[attributes.region]}"
                data-name="${affiliate[attributes.legalName]}"
                data-id="sync-uin"
                class="btn btn-sm row-btn open-popup-btn" style="background-color: rgb(235, 51, 0); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 16px;">
                Sync UIN
              </button>
            </td>
            </tr>`;
        } 
      });
    }
      
      const tbodyApproved = document.getElementById('tbody-affiliate-approved');
      tbodyApproved.innerHTML = tbodyAffiliateApprovedRow;

      tbodyApproved.addEventListener('click', async (e)=> {
        const button = e.target.closest('.row-btn');
        if(!button) return;
        const { id, affiliate } = button.dataset;
        
        if (id == "sync-uin") {
      
        let selectedAffiliateData = null;  
        $(document).on("click", ".open-popup-btn", function () {

          selectedAffiliateData = {
            regionCode: $(this).data("region"),
            legalName: $(this).data("name"),
            uinCode: $(this).data("uin"),
            teiUId: $(this).data("affiliate"),
          };

            const html = checkboxOptions.map(option => `
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input dynamic-checkbox" id="${option.id}" data-api="${option.api}">
                <label class="custom-control-label font-weight-bold fs-6"for="${option.id}">
                  ${option.label}
                </label>
              </div>
            `).join("");

            $("#checkboxContainer").html(html);
            $("#submitActions").prop("disabled", true);
            $("#actionModal").modal("show");
        });

        $(document).on("change", ".dynamic-checkbox", function () {
          const checked = $(".dynamic-checkbox:checked").length;
          $("#submitActions").prop("disabled", checked === 0);
        });

        $("#submitActions").on("click", async function () {

          const checkedBoxes = $(".dynamic-checkbox:checked");

          try {

            for (let checkbox of checkedBoxes) {
              const api = $(checkbox).data("api");
              const payload = {
                tei_uid: selectedAffiliateData.teiUId,
                uin_code: selectedAffiliateData.uinCode,
                region_code: selectedAffiliateData.regionCode,
                legal_name: selectedAffiliateData.legalName,
              };

              console.log("Calling API:", api, payload);

              await fetch(api, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
              });
            }

            alert("All APIs executed successfully");

            $("#actionModal").modal("hide");

          } catch (error) {

            console.error(error);

            alert("Something went wrong");
          }
        });
      }
    });
    } catch (error) {
      console.error(error);
      toast({ status: 'ERROR', message: error.message });
    }
  }
    // syncUIn({
    //   regionCode: "ESEAOR", 
    //   legalName: "Global Development Partners Foundation Ltd.", 
    //   uinCode: "IPPF-THA-008", 
    //   teiUId: "drBWOwC30Zw"
    // });
    
    async function syncUIn({regionCode, legalName, uinCode, teiUId}) {
      try {
        const payload = { regionCode, legalName, uinCode, teiUId };
        const res = await fetch('http://stage.hispindia.org:8000/orgunit', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();  
        // console.log("Sync UIn ", data);
      } catch (error) {
        console.error(error);
      }
    }
});