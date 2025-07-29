// const baseUrl = '../..';
const baseUrl = 'https://links.hispindia.org/ippf_co/api';

const ApiToken = 'd2pat_tGR4aNdgU8oqWx3xYwqdq9dcxnu4OL4u0121970776';

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