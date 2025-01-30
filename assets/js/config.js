const userGroupConfig = (data) => {
    var disabled=false, disabledValues = ''
    const aocUsers = data.userGroups.find(group => disabledUserGroups.includes(group.id));
    const trtUsers = data.userGroups.find(group => disabledTRTUserGroups.includes(group.id));
    const edUsers = data.userGroups.find(group => disabledEDUserGroups.includes(group.id));
    const coreTeam = data.userGroups.find(group => coreTeamGroups.includes(group.id));

    if (aocUsers || trtUsers) {
        disabled = true;
    }
    if (!aocUsers) {
        disabledValues += 'aoc'
    }
    if (!trtUsers) {
        disabledValues += 'trt'
    }
    if(edUsers) {
        disabledValues += 'ed'
    }
    if(coreTeam) {
        disabledValues += 'core'
    }
    return {disabled, disabledValues}
}