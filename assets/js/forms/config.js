import { meApi } from '../api/metaDataApi.js';
import { userGroup } from '../constant.js';

export const userGroupConfig = (data) => {
    const pages={
        hideSideBar: [],
        blockAddWaiver: false,
        isAdmin: false,
    };
    const userGroupIds = data.userGroups.map(ug => ug.id);
    const isIppfAdmin = userGroupIds.includes(userGroup.disabledIPPFAdmin);
    if (isIppfAdmin) pages['isAdmin'] = true;

    const isAoc = userGroupIds.includes(userGroup.disabledAOCGroup);
    if (isAoc) {
        pages['hideSideBar'].push('aoc-user');
        pages['blockAddWaiver'] = true;
    }

    const isKyc = userGroupIds.includes(userGroup.disabledKyc);
    if (isKyc) {
        pages['hideSideBar'].push('kyc-user');
        pages['blockAddWaiver'] = true;
    }
    return pages;
}


export const getUserConfig = async() => {
    try {   
        const me = await meApi.get();
        const config = userGroupConfig(me); 
        
        if (config?.isAdmin) {
            $('.maintenance').removeClass('d-none');
        }

        return config;
    } catch (error) {
        console.error("Error fetching user config:", error);
    }
}
