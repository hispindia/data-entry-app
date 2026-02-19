
import { dataApi } from "../../../api/DataApi.js";
import { populateOptions } from "../../metadata.js";
import { optionSetApi, programsApi } from "../../../api/metaDataApi.js";
import { attributes, optionSet, orgUnit, programRules, programs } from "../../../constant.js";
import newRegistration from "./kycUser.js";
import { toast } from "../../utils.js";

const handleRegistration = async(userConfig) => {
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

    document.getElementById('search-bar').style.display = "block";
    const searchResults = document.getElementById('searchResults');
    const addAffiliateForm = document.getElementById('addAffiliateForm');

    const url = new URL(window.location.href);
    const affiliate = url.searchParams.get('affiliate');
    const regName = url.searchParams.get('name');
    const country = url.searchParams.get('country');
    const region = url.searchParams.get('region');
    if(region) {
        document.getElementById("Region").value = region;
        const optionGroup = resOptionGroups.optionGroups.find(group => group.id == programRules.hideCountry[region]);
        if(optionGroup) {
            const region = optionGroup.options.map(option => ({label: option.name, value: option.code}));
            document.getElementById("Countries").innerHTML = populateOptions(region);
        }
    }
    if(regName) document.getElementById("regName").value = regName;
    if(country) document.getElementById("Countries").value = country;

    if(affiliate) {
        newRegistration(userConfig);
        addAffiliateForm.style.display = 'block';
        searchResults.style.display = 'none';
    } else {
        addAffiliateForm.style.display = 'none';
        searchResults.style.display = 'none';
    }

    document.getElementById('searchResults').addEventListener('click', function(e) {
         if (e.target.tagName === 'BUTTON') {
            const url = new URL(window.location.href);
            url.searchParams.delete('country')
            url.searchParams.delete('region')
            url.searchParams.set('affiliate', e.target.dataset.trackedentity)
            window.history.pushState({}, "", url);
            newRegistration(userConfig);
            
            addAffiliateForm.style.display = 'block';
            searchResults.style.display = 'none';
        }
    })
   
    document.getElementById('searchButton').addEventListener('click', function () {
        const regName = document.getElementById('regName').value;
        const country = document.getElementById('Countries').value;
        const region = document.getElementById('Region').value;

        const url = new URL(window.location.href);
        if(regName) url.searchParams.set('name',regName);
        if(region) url.searchParams.set('region',region);
        if(country) url.searchParams.set('country',country);
        url.searchParams.delete('affiliate');

        window.history.pushState({}, "", url);

        fetchAffiliateList();
        searchResults.style.display = 'block';
        addAffiliateForm.style.display = 'none';
    });

    document.getElementById('addNewAffiliate').addEventListener('click', function () {
        const url = new URL(window.location.href);
        url.searchParams.delete('name');
        url.searchParams.delete('region');
        url.searchParams.delete('country');
        url.searchParams.delete('affiliate');
        window.history.pushState({}, "", url);
        newRegistration(userConfig);
        addAffiliateForm.style.display = 'block';
        searchResults.style.display = 'none';
    });
    
    async function fetchAffiliateList() {

    const programAffiliateKyc = await programsApi.get(programs.affiliateKyc);
    const regionValue = document.getElementById("Region").value;
    const countryValue = document.getElementById("Countries").value;
    const name = document.getElementById("regName").value;

    let otherParam = "";
    if (regionValue && !countryValue) {
      toast({ status: 'INFO', message: 'Please Select Country!', position: 'Center'});
      return;
    }
    if (!name && !regionValue) {
      toast({ status: 'INFO', message: 'Please enter Name or select Region and Country to search.', position: 'Center' });
      return;
    }
    if (name) otherParam += `&filter=${attributes.legalName}:LIKE:${name.trim()}`;
    if (regionValue) otherParam += `&filter=${attributes.region}:EQ:${regionValue}`;
    if (countryValue) otherParam += `&filter=${attributes.countryRegistration}:EQ:${countryValue}`;

    const affiliateList = await dataApi.get(
        orgUnit.affiliateKYC,
        programs.affiliateKyc,
        otherParam
    );

    if (!affiliateList?.trackedEntities || affiliateList.trackedEntities.length === 0) {
        toast({ status: 'INFO', message: 'No affiliate found', position: 'Center' });
        return;
    }

    const headerList = programAffiliateKyc.programTrackedEntityAttributes
        .filter(trackedEntityAttr => trackedEntityAttr.displayInList)
        .map(attr => ({
            id: attr.trackedEntityAttribute.id,
            name: attr.trackedEntityAttribute.name
        }));

    const affilitateAttrList = affiliateList.trackedEntities.map(trackedEntity => {
        const attributesObj = { trackedEntity: trackedEntity.trackedEntity };
        trackedEntity.attributes.forEach(attr => attributesObj[attr.attribute] = attr.value);
        return attributesObj;
    });

    let theadAffiliateRow = "";
    headerList.forEach(item =>
        theadAffiliateRow += `<th style="padding: 12px 15px; font-weight: 600;">${item.name}</th>`
    );

    document.getElementById('thead-affiliate').innerHTML =
        `${theadAffiliateRow}<th style="padding: 12px 15px; font-weight: 600;">Action</th>`;

    let tbodyAffiliateRow = "";

    affilitateAttrList.forEach(affiliate => {
        tbodyAffiliateRow += `<tr style="background-color: #ffffff; border-bottom: 1px solid #f0f0f5;">`;

        headerList.forEach(attr =>
            tbodyAffiliateRow += `<td style="padding: 15px;">${affiliate[attr.id] ?? ''}</td>`
        );

        tbodyAffiliateRow +=
            `<td style="padding: 15px;">
                <button class="btn btn-primary" data-trackedentity="${affiliate.trackedEntity}">
                    View
                </button>
            </td></tr>`;
    });

    document.getElementById('tbody-affiliate').innerHTML = tbodyAffiliateRow;
   }

}

export default handleRegistration;