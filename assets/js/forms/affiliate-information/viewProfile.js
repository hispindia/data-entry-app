import { attributes,optionSet, orgUnit, programs } from "../../constant.js";
import { optionSetApi,orgUnitsApi,programsApi } from "../../api/metaDataApi.js";
import { populateOptions } from "../metadata.js"
import { dataApi } from "../../api/DataApi.js"
import { applyAccessControl } from "../accessControl.js";



document.addEventListener("DOMContentLoaded", function () {
  applyAccessControl();
  iziToast.settings({
    position: 'center'
  });
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

  addHeaderDetails();
  async function addHeaderDetails() {
    const region = await optionSetApi.get(optionSet.region);
    const country = await optionSetApi.get(optionSet.country);
    console.log('country:', country.options);
    
    document.getElementById("Region").innerHTML = populateOptions(
      region.options
    );
    document.getElementById("Countries").innerHTML = populateOptions(
      country.options
    );
  }
  
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
        iziToast.info({
          message: "No affiliate found",
          timeout: 1500,
        });
        // document.getElementById("affiliate-table").style.display = "none";
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
      document.getElementById("thead-affiliate").innerHTML = theadAffiliateRow;

      var tbodyAffiliateRow = "";
      affilitateAttrList.forEach((affiliate, index) => {
        const trackedEntityId = affiliateList.trackedEntities[index].trackedEntity
        tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5; cursor:pointer;" class="affiliate-row" data-affiliate="${trackedEntityId}">`;
        headerList.forEach(
          (attr) => tbodyAffiliateRow += `<td style="padding: 15px;">${affiliate[attr.id] ? affiliate[attr.id] : ""}</td>`
        );
        tbodyAffiliateRow += `</tr>`;
      });
      document.getElementById("tbody-affiliate").innerHTML = tbodyAffiliateRow;

      document.querySelectorAll(".affiliate-row").forEach(row => {
        row.addEventListener("click", function()  {
          const affiliateId = this.getAttribute("data-affiliate");
          window.location.href = `./2.1-1-view-profile.html?affiliate=${affiliateId}`;
        })
      });
    } else {
      iziToast.info({
        message: "Please Select Country!",
        timeout: 1500,
      });
    }
  }
});
