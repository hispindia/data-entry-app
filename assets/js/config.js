const userGroupConfig = (data) => {
    var disabled = false, disabledValues = ''
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
    if (edUsers) {
        disabledValues += 'ed'
    }
    if (coreTeam) {
        disabledValues += 'core'
    }
    return { disabled, disabledValues }
}

function formatNumberInput(valueOrInput) {
    let value = typeof valueOrInput === "object" ? valueOrInput.value : valueOrInput;

    if (!value) return ""; // Handle empty values safely

    value = value.toString().replace(/[^0-9.-]/g, ""); // Remove non-numeric except '.'
    let parts = value.split(".");

    // Add commas to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Prevent multiple decimals (Keep only the first decimal part)
    let formattedValue = parts.length > 1 ? parts[0] + "." + parts[1].substring(0, 2)  : parts[0];

    // Update input field if an element was passed
    if (typeof valueOrInput === "object") {
        valueOrInput.value = formattedValue;
    }

    return formattedValue; // Return formatted number if called directly
}

// Function to remove commas
function unformatNumber(value) {
    return Number(value.replace(/[^0-9.-]/g, ""));
}