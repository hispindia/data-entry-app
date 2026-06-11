
const baseUrl = '../..';
// const baseUrl = 'https://uin.ippf.org/api';

const ApiToken = '';

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
