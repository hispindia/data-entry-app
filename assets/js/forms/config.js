import { meApi } from '../api/metaDataApi.js';
import { userGroup } from '../constant.js';

export const userGroupConfig = (data) => {
    const userGroupIds = data.userGroups.map(ug => ug.id);

    const isIppfAdmin = userGroupIds.includes(userGroup.disabledIPPFAdmin);
    if (isIppfAdmin) {
        return {
            hideSideBar: [],
            blockAddWaiver: false,
            isAdmin: true,
        };
    }

    const isAoc = userGroupIds.includes(userGroup.disabledAOCGroup);
    if (isAoc) {
        return {
            hideSideBar: [
                'generate-and-approve',
                'approve-change-renew'
            ],
            blockAddWaiver: true,
           
        };
    }

    const isKyc = userGroupIds.includes(userGroup.disabledKyc);
    if (isKyc) {
        return {
            hideSideBar: [
                'eligibility-check-menu', //1.2
                'generate-and-approve', //1.3,1.4
                'annual-report-menu', //2
                'standard-reports-menu' //3
            ],
            blockAddWaiver: false, 
        };
    }
   
    return {
        hideSideBar: [
            'affiliate-registration-menu',
            'annual-report-menu',
            'standard-reports-menu'
        ],
        blockAddWaiver: true,
    };
}


export const getUserConfig = async() => {
    try {   
        const me = await meApi.get();
        const config = userGroupConfig(me); 
        return config;
    } catch (error) {
        console.error("Error fetching user config:", error);
        return {
            hideSideBar: [
                'affiliate-registration-menu',
                'annual-report-menu',
                'standard-reports-menu'
            ],
            blockAddWaiver: true,
        };
    }

}
