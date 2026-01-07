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

    const configs = [];

    const isAoc = userGroupIds.includes(userGroup.disabledAOCGroup);
    if (isAoc) {
        configs.push({
            hideSideBar: [
                'generate-and-approve',
                'approve-change-renew'
            ],
            blockAddWaiver: true,
        });
    }

    const isKyc = userGroupIds.includes(userGroup.disabledKyc);
    if (isKyc) {
        configs.push({
            hideSideBar: [
                'eligibility-check-menu', //1.2
                'generate-and-approve', //1.3,1.4
                'annual-report-menu', //2
                'standard-reports-menu' //3
            ],
            blockAddWaiver: true, 
        });
    }
   
    if (configs.length > 0) {
        return {
            hideSideBar: configs.reduce((acc, curr) => acc.filter(item => curr.hideSideBar.includes(item)), configs[0].hideSideBar),
            blockAddWaiver: configs.every(c => c.blockAddWaiver),
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
        
        if (config?.isAdmin) {
            $('.maintenance').removeClass('d-none');
        }

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
