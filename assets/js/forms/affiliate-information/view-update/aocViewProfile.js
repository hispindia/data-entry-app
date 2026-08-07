import { attributes, optionSet, orgUnit, programs, source } from "../../../constant.js";
import { optionSetApi, orgUnitsApi, programsApi } from "../../../api/metaDataApi.js";
import { populateOptions } from "../../metadata.js"
import { dataApi } from "../../../api/DataApi.js"
import { getUserConfig } from "../../config.js";
import { toast } from "../../utils.js";
import { displayAffiliateList, displayCountries } from "./common.js";

const handleAocViewAndUpdate = async (userConfig) => {
  const resRegion = await optionSetApi.get(optionSet.region);
  const resOptionGroups = await optionSetApi.getOptionGroups();

  const userRegion = userConfig.attributeValues.find(attrValue => attrValue.attribute.id == "gfl4DSpDn3o");
  if (userRegion) {
    const region = resRegion.options.filter(region => region.id == userRegion.value);
    document.getElementById("Region").innerHTML = `<option value='${region[0].value}' selected> ${region[0].label} </option>`;

    const countries = displayCountries(userConfig, resOptionGroups?.optionGroups, region[0].value);
    document.getElementById("Countries").innerHTML = populateOptions(countries);
  } else {
    const list = resRegion.options.sort((a, b) => a.label.localeCompare(b.label));
    document.getElementById("Region").innerHTML = populateOptions(list);
  }

  document.getElementById('Region').addEventListener('change', function (e) {
    const { value } = e.target;
    const countries = displayCountries(userConfig, resOptionGroups?.optionGroups, value);
    document.getElementById("Countries").innerHTML = populateOptions(countries);
  })

  document.getElementById('searchButton').addEventListener('click', function () {
    document.getElementById("searchResults").style.display = "none";
    fetchAffiliateList();
    document.getElementById('searchResults').style.display = 'block';
  });

  async function fetchAffiliateList() {
    const uin = document.getElementById("uin").value;
    const name = document.getElementById("regName").value;
    const regionValue = document.getElementById("Region").value;
    const countryValue = document.getElementById("Countries").value;

    const programUINControl = await programsApi.get(programs.UINControlMaster);
    const ouRes = await orgUnitsApi.get({ level: 2, filter: countryValue });
    const matched = ouRes?.organisationUnits?.find(ou => ou.code === countryValue);
    if (matched) source.orgUnit = matched.id;
    else source.orgUnit = '';

    if (!uin && !name && !regionValue) {
      document.getElementById("searchResults").style.display = "none";
      toast({ status: 'INFO', message: 'Please Enter UIN or Name or select Region and Country to search.', position: 'center' });
      return;
    }
    if (regionValue && !countryValue) {
      document.getElementById("searchResults").style.display = "none";
      toast({ status: 'INFO', message: 'Please Select Country!' });
      return;
    }

    var otherParam = "";
    if (uin) otherParam += `&filter=${attributes.uinCode}:EQ:${uin.trim()}`;
    if (name) otherParam += `&filter=${attributes.legalName}:LIKE:${name.trim()}`;
    if (regionValue) otherParam += `&filter=${attributes.region}:EQ:${regionValue}`;
    if (countryValue) otherParam += `&filter=${attributes.countryRegistration}:EQ:${countryValue}`;

    const affiliateList = await dataApi.get(source.orgUnit, programs.UINControlMaster, otherParam);

    if (!affiliateList?.trackedEntities?.length) {
      toast({ status: 'INFO', message: 'No affiliate found', position: "center" });
      return;
    }

    const affiliateRows = displayAffiliateList(programUINControl.programTrackedEntityAttributes, affiliateList?.trackedEntities);

    document.getElementById("thead-affiliate").innerHTML = affiliateRows.theadAffiliate;
    document.getElementById("tbody-affiliate").innerHTML = affiliateRows.tbodyAffiliate;
  }

}

export default handleAocViewAndUpdate;