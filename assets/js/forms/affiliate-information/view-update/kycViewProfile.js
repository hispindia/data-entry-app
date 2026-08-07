import { attributes,optionSet, orgUnit, programRules, programs, source } from "../../../constant.js";
import { meApi, optionSetApi,orgUnitsApi,programsApi } from "../../../api/metaDataApi.js";
import { populateOptions } from "../../metadata.js"
import { dataApi } from "../../../api/DataApi.js"
import { getUserConfig, userGroupConfig } from "../../config.js";
import { toast } from "../../utils.js";
import { displayAffiliateList } from "./common.js";

const handleKycViewProfile = async(userConfig) => {
  document.getElementById('viewAndUpdate').style.display = 'none';
  document.getElementById("searchResults").style.display = "none";

  if (userConfig?.orgUnits?.length) {
    const nonKycUnit = userConfig.orgUnits.find(unit => unit.name !== "KYC Affiliates");
    if (nonKycUnit) source.orgUnit = nonKycUnit.id;
  }

  const programUINControl = await programsApi.get(programs.UINControlMaster);
  const affiliateList = await dataApi.get(source.orgUnit, programs.UINControlMaster);
  
  if (!affiliateList?.trackedEntities?.length) {
    toast({ status: 'INFO', message: 'No affiliate found', position: "center"});
    return;
  }
  
  const affiliateRows = displayAffiliateList(programUINControl.programTrackedEntityAttributes, affiliateList?.trackedEntities);
      
  document.getElementById("thead-affiliate").innerHTML = affiliateRows.theadAffiliate;
  document.getElementById("tbody-affiliate").innerHTML = affiliateRows.tbodyAffiliate;
  document.getElementById("searchResults").style.display = "block";
}

export default handleKycViewProfile;