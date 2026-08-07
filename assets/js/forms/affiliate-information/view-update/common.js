import { programRules } from "../../../constant.js";

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

export const displayAffiliateList = (attributes, trackedEntities, ) => {
    const headerList = attributes
        .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
        .map(attr => ({ id: attr.trackedEntityAttribute.id, name: attr.trackedEntityAttribute.name }));

    const affilitateAttrList = trackedEntities.map(entity => {
        const attributesObj = { trackedEntity: entity.trackedEntity };
        entity.attributes.forEach(attr => attributesObj[attr.attribute] = attr.value);
        return attributesObj;
    });

    var theadAffiliate = "";
    headerList.forEach(item => theadAffiliate += `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`);
    theadAffiliate += '<th colspan="2" style="padding: 12px 15px; font-weight: 600;text-align: center">Action</th>';

    var tbodyAffiliate = "";
    affilitateAttrList.forEach((affiliate, index) => {
        tbodyAffiliate += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`;
        headerList.forEach(attr => tbodyAffiliate += `<td style="padding: 15px;">${affiliate[attr.id] ? affiliate[attr.id] : ""}</td>`);
        tbodyAffiliate += `
        <td class="text-center">  
        <button 
          data-affiliate="${affiliate.trackedEntity}_generate" 
          class="btn btn-sm row-btn" style="background-color: rgb(153, 27, 27); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.85rem; padding: 6px 16px; transition: background-color 0.2s ease-in-out;"
          onmouseover="this.style.backgroundColor='#a2161b' "onmouseout="this.style.backgroundColor='rgb(153, 27, 27)'"
          > Generate Report
        </button>
        </td>
        <td style="padding: 15px;">
        <button data-affiliate="${affiliate.trackedEntity}_view" class="btn btn-primary row-btn">
          View
        </button>
        </td></tr>`;
    });

    return { theadAffiliate, tbodyAffiliate };
}