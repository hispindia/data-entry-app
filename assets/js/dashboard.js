import { dataApi } from "./api/DataApi.js";
import { optionSetApi,programsApi } from "./api/metaDataApi.js";
import { optionSet, orgUnit, programs } from "./constant.js";

document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to 
  document.querySelectorAll(".nav-link").forEach(function (element) {
    element.addEventListener("click", function (event) {
        if (element.classList.contains("has-dropdown")) {
          return; 
        }
      var targetPage = event.currentTarget.getAttribute("data-target");
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
    document.getElementById("Region").innerHTML = populateOptions(region.options);
    document.getElementById("Countries").innerHTML = populateOptions(country.options);
  }

   async function fetchAffiliateList() {
          const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
          const regionValue = document.getElementById("Region").value;
          const countryValue = document.getElementById("Countries").value;
          if(regionValue && countryValue) {
              const otherParam = `filter=SMdW6ZnGllA:EQ:${regionValue}&filter=LZacnHsQJRs:EQ:${countryValue}`
              const affiliateList = await dataApi.get(orgUnit.id, programs.affiliateKyc, otherParam);
          

              const headerList = programAffiliateKyc.programTrackedEntityAttributes
              .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
              .map(attr => ({id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name}));
  
              const affilitateAttrList = affiliateList.trackedEntities.map(trackedEntity => {
                  const attributes = {};
                  trackedEntity.attributes.forEach(attr => attributes[attr.attribute] = attr.value);
                  return attributes;
              });
  
              var theadAffiliateRow = "";
              headerList.forEach(item => theadAffiliateRow+= `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`);
              document.getElementById('thead-affiliate').innerHTML = theadAffiliateRow;
  
              var tbodyAffiliateRow = "";
              affilitateAttrList.forEach(affiliate => {
                  tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`
                  headerList.forEach(attr => tbodyAffiliateRow += `<td style="padding: 15px;">${(affiliate[attr.id] ? affiliate[attr.id]: '')}</td>`);
                  tbodyAffiliateRow += `</tr>`
              })
              document.getElementById('tbody-affiliate').innerHTML = tbodyAffiliateRow;
          } else {
              alert('Please select Region/Country!')
          }
    }

  function populateOptions(options) {
    var optionSet = `<option value="">Select</option>`;
    options.forEach(opt => {
      optionSet += `<option value="${opt.code}">${opt.name}</option>`;
    })
    return optionSet;
  }

})
