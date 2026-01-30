import { dataApi } from "../api/DataApi.js";
import { populateOptions } from "./metadata.js";
import { optionSetApi,programsApi } from "../api/metaDataApi.js";
import { attributes, optionSet, orgUnit, programRules, programs } from "../constant.js";
import { getUserConfig } from "./config.js";
import { toast } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userConfig = await getUserConfig();
  if (userConfig) {
      userConfig.user.forEach(user => {
      $(`.${user}`).hide();
      });
  }
  if(!userConfig.user.includes('kyc'))  $('.maintenance').removeClass('d-none');

  // Add event listener to 
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
        if (element.classList.contains("has-dropdown")) {
          return; 
        }
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
          const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
          const regionValue = document.getElementById("Region").value;
          const countryValue = document.getElementById("Countries").value;
          const name = document.getElementById("regName").value;
          if(countryValue) {
              let otherParam = `filter=${attributes.countryRegistration}:EQ:${countryValue}` 
              if(regionValue) otherParam += `&filter=${attributes.region}:EQ:${regionValue}`
              if(name) otherParam += `&filter=${attributes.legalName}:EQ:${name.trim()}`
              const affiliateList = await dataApi.get(orgUnit.affiliateKYC, programs.affiliateKyc, otherParam);
              
              
              if (!affiliateList?.trackedEntities || affiliateList.trackedEntities.length === 0) {
                toast({status:'INFO', message: 'No affiliate found'});
                document.getElementById("affiliate-table").style.display = "none";
                return;
            }
              const headerList = programAffiliateKyc.programTrackedEntityAttributes
              .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
              .map(attr => ({id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name}));
  
              const affilitateAttrList = affiliateList.trackedEntities.map(trackedEntity => {
                  const attributes = {};
                  trackedEntity.attributes.forEach(attr => attributes[attr.attribute] = attr.value);
                  return attributes;
              });
  
              var theadAffiliateRow = "";
              headerList.forEach(item => theadAffiliateRow += `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`);
              document.getElementById('thead-affiliate').innerHTML = theadAffiliateRow;
  
              var tbodyAffiliateRow = "";
              affilitateAttrList.forEach(affiliate => {
                  tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
                  headerList.forEach(attr => tbodyAffiliateRow += `<td style="padding: 15px;">${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`);
                  tbodyAffiliateRow += `</tr>`
              })
              document.getElementById('tbody-affiliate').innerHTML = tbodyAffiliateRow;
          } else {
                toast({status: 'INFO', message: 'Please Select Country!'});
          }
    }

})
