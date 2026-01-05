import { meApi } from '../api/metaDataApi.js';
import { userGroup} from '../constant.js';

export const userGroupConfig = (data) => {
    const userGroupIds = data.userGroups.map(ug => ug.id);

    const isIppfAdmin = userGroupIds.includes(userGroup.disabledIPPFAdmin);
    if (isIppfAdmin) {
        return {
            hideSideBar: [],
            blockAddWaiver: false,
        };
    }

    const isAoc = userGroupIds.includes(userGroup.disabledAOCGroup);
    if (isAoc) {
        return {
            hideSideBar: [
                '1.3-generate-and-manage-uins.html',
                '1.4-approve-and-sync-uins.html',
                'annual-report-menu'
            ],
            blockAddWaiver: true,
            isAoc: true,
        };
    }

    const isKyc = userGroupIds.includes(userGroup.disabledKyc);
    if (isKyc) {
        return {
            hideSideBar: [
                '1.2-eligibility-check-and-manage-waivers.html',
                '1.3-generate-and-manage-uins.html',
                '1.4-approve-and-sync-uins.html',
                'annual-report-menu',
                'standard-reports-menu'
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
