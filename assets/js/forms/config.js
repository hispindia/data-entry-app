import { meApi } from '../api/metaDataApi.js';
import { userGroup } from '../constant.js';

export const userGroupConfig = (data) => {
    const pages={
        username: data.username,
        user: [],
        blockAddWaiver: false,
    };
    const userGroupIds = data.userGroups.map(ug => ug.id);
    const isIppfAdmin = userGroupIds.includes(userGroup.disabledIPPFAdmin);
    if (isIppfAdmin) pages['user'].push('admin');

    const isAoc = userGroupIds.includes(userGroup.disabledAOCGroup);
    if (isAoc) {
        pages['user'].push('aoc');
        pages['blockAddWaiver'] = true;
    }

    const isKyc = userGroupIds.includes(userGroup.disabledKyc);
    if (isKyc) {
        pages['user'].push('kyc');
        pages['blockAddWaiver'] = true;
    }
    return pages;
}


export const getUserConfig = async() => {
    try {   
        const me = await meApi.get();
        const config = userGroupConfig(me); 
        
        return config;
    } catch (error) {
        console.error("Error fetching user config:", error);
    }
}
