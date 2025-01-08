const userConfig = () => {
    var disabled=false, disabledValues = ''
    const userDisabled = data.userGroups.find(group => disabledUserGroups.includes(group.id));
    const trtUserDisabled = data.userGroups.find(group => disabledTRTUserGroups.includes(group.id));
    const edUserDisabled = data.userGroups.find(group => disabledEDUserGroups.includes(group.id));

    if (userDisabled || trtUserDisabled) {
        disabled = true;
    }
    let disabledValues = '';
    if (!userDisabled) {
        disabledValues += 'aoc'
    }
    if (!trtUserDisabled) {
        disabledValues += 'trt'
    }
    if(edUserDisabled) {
        disabledValues += 'ed'
    }
    return {disabled, disabledValues}
}