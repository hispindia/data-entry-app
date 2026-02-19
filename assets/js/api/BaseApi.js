// const baseUrl = '../..';
const baseUrl = 'https://links.hispindia.org/ippf_uin/api';

const ApiToken = 'd2p_o7jOsP3UpYF06In2MUy1OjSM34Sn67skS0LfpYC9Vb7J25dU0g';

const BaseApi = async ({ url, method, payload, mode }) => {
    const REQUEST = {
        method: method ? method : "GET",
        headers: {},    
    }

    if(ApiToken) {
    REQUEST['headers']["Authorization"] = `ApiToken ${ApiToken}`
    }

    if(mode) {
        if(mode == 'file') REQUEST['body'] = payload;
        else {
        REQUEST['headers']["Content-Type"] = "application/x-www-form-urlencoded",
        REQUEST['body'] = new URLSearchParams(payload);
        }
    }
    else {
        REQUEST['headers']["Content-Type"] = "application/json"
        if(payload) REQUEST['body'] = JSON.stringify(payload)
    }
    
    return await fetch(`${baseUrl}/${url}`, REQUEST)
}

export default BaseApi
