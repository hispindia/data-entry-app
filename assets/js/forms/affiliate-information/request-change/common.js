import { dataApi } from "../../../api/DataApi.js";
import { programsApi, programStageApi } from "../../../api/metaDataApi.js";
import { attributes, programRules, tei } from "../../../constant.js";

export const displayCountries = (userConfig, optionGroups, value) => {
  const optionGroup = optionGroups.find(group => group.id == programRules.hideCountry[value]);
  if (optionGroup) {
    const countries = optionGroup.options;
    const UserCountry = userConfig.orgUnits
      .filter(country => countries.some(c => c.code == country.code))
      .map(option => ({ label: option.name, value: option.code }))

    return UserCountry.sort((a, b) => a.label.localeCompare(b.label));
  }
  return [];
}

export const displayAffiliateList = (attributeList, trackedEntities, userType) => {
  const headerList = attributeList
    .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
    .map(attr => ({ id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name }));

  const affilitateAttrList = trackedEntities.map(entity => {
    const attributesObj = { trackedEntity: entity.trackedEntity };
    entity.attributes.forEach(attr => attributesObj[attr.attribute] = attr.value);
    return attributesObj;
  });

  var theadAffiliate = "";
  headerList.forEach(item => theadAffiliate += `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`);
  theadAffiliate += `<th tyle="padding: 12px 15px; font-weight: 600;" class="text-center">Action</th>`;
  theadAffiliate += userType == 'aoc' ? `<th style="padding: 12px 15px; font-weight: 600;" class="text-center">
    <input class="form-check-input"  style="transform: scale(1.3);" type="checkbox" id="schedule-all">
    <label class="form-check-label" for="schedule-all">
        Schedule Acuity
    </label>
    </th>`: '';

  var tbodyAffiliate = "";
  affilitateAttrList.forEach((affiliate, index) => {
    tbodyAffiliate += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`;
    headerList.forEach(attr => tbodyAffiliate += `<td style="padding: 15px;">${affiliate[attr.id] ? affiliate[attr.id] : ""}</td>`);
    tbodyAffiliate += `<td class="text-center">
          <button class="btn-icon blue action-button" style="cursor: pointer; border: none; background: transparent; color: #0056b3;" data-affiliate="${affiliate.trackedEntity}">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
        </td>`
    tbodyAffiliate += userType == 'aoc' ? `<td class="text-center">  
          <input  style="transform: scale(1.3);" type="checkbox" class="check-list" ${affiliate[attributes.acuityCheck] == "In Progress" ? 'disabled checked' : ''} data-affiliate="${affiliate[attributes.acuityCheck] == "In Progress" ? '' : affiliate.trackedEntity}" />
        </td>`: '';
    tbodyAffiliate += `</tr>`;


  });
  const tfootAffiliate = userType == 'aoc' ? `<tr><td colspan="${headerList.length + 1}"></td><td class="text-center">
    <button type="button" class="btn btn-sm" style="background-color: #E93300; color: white;" id="submit-acuity">Submit Acuity</button>
    </td></tr>`: ''

  return { theadAffiliate, tbodyAffiliate, tfootAffiliate };
}


export function showLoader(message = "Uploading") {
  let loader = document.getElementById("global-loader");

  // If loader already exists, just update its message
  if (loader) {
    loader.querySelector(".loader-message").textContent = message;
    return;
  }

  loader = document.createElement("div");
  loader.id = "global-loader";

  loader.innerHTML = `
    <div style="
      position: fixed;
      top:0; left:0;
      width:100%; height:100%;
      background: rgba(0,0,0,0.5);
      display:flex;
      justify-content:center;
      align-items:center;
      z-index:9999;
    ">
      <div style="
        background:white;
        padding:30px 40px;
        border-radius:10px;
        text-align:center;
        box-shadow:0 4px 20px rgba(0,0,0,0.2);
      ">
        <div class="spinner" style="
          border:5px solid #eee;
          border-top:5px solid #15803d;
          border-radius:50%;
          width:40px;
          height:40px;
          margin:0 auto 15px;
          animation: spin 1s linear infinite;
        "></div>

        <p class="loader-message" style="font-weight:500;">
          ${message}
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(loader);

  if (!document.getElementById("loader-style")) {
    const style = document.createElement("style");
    style.id = "loader-style";
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

export function hideLoader() {
    const loader = document.getElementById("global-loader");
    if (loader) loader.remove();
  }