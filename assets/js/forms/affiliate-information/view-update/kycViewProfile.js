import { attributes,optionSet, orgUnit, programRules, programs } from "../../../constant.js";
import { meApi, optionSetApi,orgUnitsApi,programsApi } from "../../../api/metaDataApi.js";
import { populateOptions } from "../../metadata.js"
import { dataApi } from "../../../api/DataApi.js"
import { getUserConfig, userGroupConfig } from "../../config.js";
import { toast } from "../../utils.js";

const handleKycViewProfile = async(userConfig) => {
  
  document.getElementById('viewAndUpdate').style.display = 'none';
  fetchAffiliateList();
  
  async function fetchAffiliateList() {
    document.getElementById("searchResults").style.display = "none";
        
    if (!userConfig?.username) {
      toast({ status: 'INFO', message: 'No Data Exist', position: 'center' });
      return;
    }

    const programUINControl = await programsApi.get(programs.UINControlMaster);
    
    const filterParam = `filter=${attributes.user}:EQ:${userConfig?.username}`;

    if (userConfig?.orgUnits?.length > 0) {
      const nonKycUnit = userConfig.orgUnits.find(unit => unit.name !== "KYC Affiliates");
      if (nonKycUnit) {
        orgUnit.id = nonKycUnit.id;
      }
    }
  
    const affiliateList = await dataApi.get(orgUnit.id, programs.UINControlMaster, filterParam);

      if (!affiliateList?.trackedEntities || affiliateList.trackedEntities.length === 0) {
        toast({ status: 'INFO', message: 'No affiliate found for locked in username', position: "center"});
        return;
      }

      document.getElementById("searchResults").style.display = "block";
      const headerList = programUINControl.programTrackedEntityAttributes
        .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
        .map(attr => ({ id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name }));

      const affilitateAttrList = affiliateList.trackedEntities.map(trackedEntity => {
        const attributesObj = {};
        trackedEntity.attributes.forEach(attr => attributesObj[attr.attribute] = attr.value);
        return attributesObj;
      });

      let theadAffiliateRow = "";
      headerList.forEach(item => theadAffiliateRow += `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`);
      document.getElementById("thead-affiliate").innerHTML = `${theadAffiliateRow}<th colspan="2" style="padding: 12px 15px; font-weight: 600;text-align: center">Action</th>`;

      let tbodyAffiliateRow = "";
      affilitateAttrList.forEach((affiliate, index) => {
        const trackedEntityId = affiliateList.trackedEntities[index].trackedEntity;
        const uinCode = affiliate[attributes.uinCode] ? affiliate[attributes.uinCode] : "";
        tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`;
        headerList.forEach(attr => tbodyAffiliateRow += `<td style="padding: 15px;">${affiliate[attr.id] ? affiliate[attr.id] : ""}</td>`);
        tbodyAffiliateRow += `
        <td class="text-center">  
        <button 
          data-affiliate="${uinCode}_waiver" 
          class="btn btn-sm row-btn" style="background-color: rgb(153, 27, 27); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 16px; transition: background-color 0.2s ease-in-out;"
          onmouseover="this.style.backgroundColor='#a2161b' "onmouseout="this.style.backgroundColor='rgb(153, 27, 27)'"
          > Generate Report
        </button>
        </td>
        <td style="padding: 15px;">
        <button data-affiliate="${trackedEntityId}_view" class="btn btn-primary row-btn">
          View
        </button>
        </td></tr>`;
      });

      document.getElementById("tbody-affiliate").innerHTML = tbodyAffiliateRow;

      document.getElementById("tbody-affiliate").addEventListener('click', async (e)=> {
        const button = e.target.closest('.row-btn');
        if(!button) return;
        const affiliate = button.dataset.affiliate.split("_");
        if(affiliate[1]=="waiver")  {
          if(!affiliate[0]) return;
          const response = await dataApi.get(orgUnit.affiliateKYC, programs.affiliateKyc, `filter=pkLdNynZWat:EQ:${affiliate[0]}`);
          if(!response.trackedEntities.length) return;
          window.location.href = `../../../dhis-web-reports/index.html#/standard-report/view/W7AMqIhCqY6?affiliate=${response.trackedEntities[0]['trackedEntity']}`;
        }
        else if(affiliate[1]=="view") window.location.href = `./2.1-1-view-profile.html?affiliate=${affiliate[0]}`;
      })
    }

}

export default handleKycViewProfile;