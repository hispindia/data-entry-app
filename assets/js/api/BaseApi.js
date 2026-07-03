
const baseUrl = '../..';
// const baseUrl = 'https://links.hispindia.org/ippf_uin_staging/api';

const ApiToken = ''; //RFHAF_UIN token
// const ApiToken = 'd2p_nP1sdfsFQ7nmSPqyGM11Y6dnVFjBWlsmhkU8na0l6n2p41CZsk' //admin

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
