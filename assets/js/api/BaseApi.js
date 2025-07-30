// const baseUrl = '../..';
const baseUrl = 'https://links.hispindia.org/ippf_co/api';

const ApiToken = '';

const BaseApi = async ({ url, method, payload }) => {
    const REQUEST = {
        method: method ? method : "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }
    
    if(ApiToken) {
    REQUEST['headers']["Authorization"] = `ApiToken ${ApiToken}`
    }

    if(payload) REQUEST['body'] = JSON.stringify(payload);

    return await fetch(`${baseUrl}/${url}`, REQUEST)
}

export default BaseApi