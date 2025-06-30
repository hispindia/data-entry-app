const BaseApi = async ({ url, method, payload }) => {
    const REQUEST = {
        method: method ? method : "GET",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Basic ${btoa('admin:district')}`,
        }
    }
    if(payload) REQUEST['body'] = JSON.stringify(payload);

    return await fetch(url, REQUEST)
}

export default BaseApi