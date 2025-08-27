import {getMeData} from '../api/func.js';
import { disabledUserGroups, disabledTRTUserGroups, disabledEDUserGroups, coreTeamGroups} from '../constant.js';

export const userGroupConfig = (data) => {

    var disabled = false, disabledValues = ''
    const aocUsers = data.userGroups.find(group => disabledUserGroups.includes(group.id));
    const trtUsers = data.userGroups.find(group => disabledTRTUserGroups.includes(group.id));
    const edUsers = data.userGroups.find(group => disabledEDUserGroups.includes(group.id));
    const coreTeam = data.userGroups.find(group => coreTeamGroups.includes(group.id));

    // if (aocUsers || trtUsers) {
    if (aocUsers) {
        disabled = true;
    }
    if (aocUsers) {
        disabledValues += 'aoc'
    } else {
        disabledValues += '!aoc'
    }
    if (trtUsers) {
        disabledValues += 'trt'
    } else {
        disabledValues += '!trt'
    }
    if (edUsers) {
        disabledValues += 'ed'
    }
    if (coreTeam) {
        disabledValues += 'core'
    }
    return { disabled, disabledValues }
}


export const 
getUserConfig = async() => {
    try { 
        var user = {
            disabled: false,
            hideReporting: '',
            organisationUnits: {},
            annualReporting: '',
            annualYear: '',
            annualYearAR: '',
        };
        const masterOU = window.localStorage.getItem("masterOU");

        if (masterOU) {
            user['organisationUnits'] = [{ ...JSON.parse(masterOU)}];
            user['disabled'] = window.localStorage.getItem("userDisabled");
            user['hideReporting'] = window.localStorage.getItem("hideReporting");
            user['annualReporting'] = window.localStorage.getItem("annualReporting");
            user['annualYear'] = window.localStorage.getItem("annualYear");
            user['annualYearAR'] = window.localStorage.getItem("annualYearAR");
        }
        else {
            user = await getMeData();

            const userConfig = userGroupConfig(user);
            user['disabled'] = userConfig.disabled;
            user['hideReporting'] = userConfig.disabledValues;
        }
        return user;
    } catch (error) {
        console.error("Error fetching organization unit:", error);
    }

}
