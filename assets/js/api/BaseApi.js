// const baseUrl = '../..';
const baseUrl = 'https://links.hispindia.org/ippf_co/api';
const ApiToken = 'd2pat_qXe9qy7u9MvQ2vHbXqnelAtRcha8XwK72068580573';

const BaseApi = async ({ url, method, payload, mode }) => {
    const REQUEST = {
        method: method ? method : "GET",
        headers: {},    
    }

    if(ApiToken) {
    REQUEST['headers']["Authorization"] = `ApiToken ${ApiToken}`
    }

    if(mode) {
        REQUEST['headers']["Content-Type"] = "application/x-www-form-urlencoded",
        REQUEST['body'] = new URLSearchParams(payload);
    }
    else {
        REQUEST['headers']["Content-Type"] = "application/json"
        REQUEST['body'] = JSON.stringify(payload)
    }
    
    return await fetch(`${baseUrl}/${url}`, REQUEST)
}

export default BaseApi