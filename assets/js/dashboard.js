import { optionSetApi } from "./api/metaDataApi.js";
import { optionSet } from "./constant.js";

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
        if (searchResults) searchResults.style.display = 'block';
      });
    }
  fetchDashboard();

  async function fetchDashboard() {
    const region = await optionSetApi.get(optionSet.region);
    const country = await optionSetApi.get(optionSet.country);
    document.getElementById("region").innerHTML = populateOptions(region.options);
    document.getElementById("country").innerHTML = populateOptions(country.options);
  }

  function populateOptions(options) {
    var optionSet = `<option value="">Select</option>`;
    options.forEach(opt => {
      optionSet += `<option value="${opt.code}">${opt.name}</option>`;
    })
    return optionSet;
  }

})
