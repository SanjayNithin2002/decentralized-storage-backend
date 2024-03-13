const fetchAPI = (apiContent) => {
    const { method, instance, func = '', params = {}, body = {} } = apiContent;

    return new Promise((resolve, reject) => {

        const endpoint = (func === '') ? `${process.env[instance + '_ENDPOINT']}` : `${process.env[instance + '_ENDPOINT']}/${func}`;
        if (endpoint === undefined) {
            const error = new Error('Invalid Endpoint');
            error.status = 404;
            reject(error);
        }
        const queryParams = new URLSearchParams(params);
        const url = JSON.stringify(params) === '{}' ? `${process.env.KALEIDO_URL}/${endpoint}` : `${process.env.KALEIDO_URL}/${endpoint}/?${queryParams}`;

        const options = {
            method: method, 
            headers: {
                "Content-Type": "application/json",
                "Authorization": process.env.KALEIDO_AUTH_HEADER,
                "x-kaleido-from": process.env.KALEIDO_ADDRESS
            }
        }

        if(JSON.stringify(body) !== '{}'){
            options.body = JSON.stringify(body);
        }
        console.log(url, options);

        fetch(url, options)
        .then(response => {
            if(!response.ok){
                const error = new Error(response.statusText);
                error.status = response.status;
                reject(error);
            }
            return response.json();
        })
        .then(results => resolve(results))
        .catch(err => reject(err));
    })
}

module.exports = fetchAPI;



