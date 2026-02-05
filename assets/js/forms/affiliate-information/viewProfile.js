import { attributes,optionSet, orgUnit, programRules, programs } from "../../constant.js";
import { optionSetApi,orgUnitsApi,programsApi } from "../../api/metaDataApi.js";
import { populateOptions } from "../metadata.js"
import { dataApi } from "../../api/DataApi.js"
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
  const searchButton = document.getElementById('searchButton');
  const searchResults = document.getElementById('searchResults');
    if (searchButton) {
      searchButton.addEventListener('click', function () {
        fetchAffiliateList();
        searchResults.style.display = 'block';
      });
    }

    const resRegion = await optionSetApi.get(optionSet.region);
    const resOptionGroups = await optionSetApi.getOptionGroups();

    document.getElementById("Region").innerHTML = populateOptions(resRegion.options);
    
    document.getElementById('Region').addEventListener('change', function (e) {
        const { value } = e.target;
        const optionGroup = resOptionGroups.optionGroups.find(group => group.id == programRules.hideCountry[value]);
        if(optionGroup) {
            const region = optionGroup.options.map(option => ({label: option.name, value: option.code}));
            document.getElementById("Countries").innerHTML = populateOptions(region);
        }
    })
  
  async function fetchAffiliateList() {
    const programAffiliateKyc = await programsApi.get(programs.UINControlMaster);
    const regionValue = document.getElementById("Region").value;
    const countryValue = document.getElementById("Countries").value;
    const ouRes = await orgUnitsApi.get({level: 2, filter: countryValue});
    const matched = ouRes?.organisationUnits?.find(ou => ou.code === countryValue);    
    if(matched) orgUnit.id = matched.id;

    const name = document.getElementById("regName").value;
    const uin = document.getElementById("uin").value;
    if (countryValue) {
      let otherParam = `filter=${attributes.countryRegistration}:EQ:${countryValue}`;
      if (regionValue)
        otherParam += `&filter=${attributes.region}:EQ:${regionValue}`;
      if (name)
        otherParam += `&filter=${attributes.legalName}:EQ:${name.trim()}`;
      if (uin)
        otherParam += `&filter=${attributes.uinCode}:EQ:${uin.trim()}`;
      const affiliateList = await dataApi.get(
        orgUnit.id,
        programs.UINControlMaster,
        otherParam
      );
      
      if (!affiliateList?.trackedEntities || affiliateList.trackedEntities.length === 0) {
        toast({status: 'INFO', message: 'No affiliate found'});
        return;
      }
      const headerList = programAffiliateKyc.programTrackedEntityAttributes
        .filter((trackedEntityAttr) => trackedEntityAttr.displayInList)
        .map((attr) => ({
          id: attr.trackedEntityAttribute.id,
          name: attr.trackedEntityAttribute.name,
        }));

      const affilitateAttrList = affiliateList.trackedEntities.map(
        (trackedEntity) => {
          const attributes = {};
          trackedEntity.attributes.forEach(
            (attr) => (attributes[attr.attribute] = attr.value)
          );
          return attributes;
        }
      );

      var theadAffiliateRow = "";
      headerList.forEach(
        (item) => theadAffiliateRow += `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`
      );
      document.getElementById("thead-affiliate").innerHTML = `${theadAffiliateRow}<th style="padding: 12px 15px; font-weight: 600;">Action</th>`;

      var tbodyAffiliateRow = "";
      affilitateAttrList.forEach((affiliate, index) => {
        const trackedEntityId = affiliateList.trackedEntities[index].trackedEntity
        tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`;
        headerList.forEach(
          (attr) => tbodyAffiliateRow += `<td style="padding: 15px;">${affiliate[attr.id] ? affiliate[attr.id] : ""}</td>`
        );
        tbodyAffiliateRow += `<td style="padding: 15px;"><button class="btn btn-primary view-btn" data-affiliate="${trackedEntityId}">View</button></td></tr>`;
      });
      document.getElementById("tbody-affiliate").innerHTML = tbodyAffiliateRow;

      document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", function()  {
          const affiliateId = this.getAttribute("data-affiliate");
          window.location.href = `./2.1-1-view-profile.html?affiliate=${affiliateId}`;
        })
      });
    } else {
      toast({status: 'INFO', message: 'Please Select Country!'});
    }
  }
});
