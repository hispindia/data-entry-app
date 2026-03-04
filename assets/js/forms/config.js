import { meApi } from '../api/metaDataApi.js';
import { userGroup } from '../constant.js';

export const userGroupConfig = (data) => {
    const pages={
        username: data.username,
        user: [],
        blockWaiver: false,
    };
    const userGroupIds = data.userGroups.map(ug => ug.id);
    const isIppfAdmin = userGroupIds.includes(userGroup.disabledIPPFAdmin);
    if (isIppfAdmin) {
        pages['user'].push('admin');
        pages['blockWaiver'] = true;
    }

    const isAoc = userGroupIds.includes(userGroup.disabledAOCGroup);
    if (isAoc) {
        pages['user'].push('aoc');
        pages['blockWaiver'] = true;
    }

    const isKyc = userGroupIds.includes(userGroup.disabledKyc);
    if (isKyc) {
        pages['user'].push('kyc');
        pages['blockWaiver'] = true;
    }

    const isWaiver = userGroupIds.includes(userGroup.waiver);
    if (isWaiver) {
        pages['user'].push('waiver');
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
