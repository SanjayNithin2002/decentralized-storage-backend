const fetchAPI = (apiContent) => {
    const { method, instance, func = '', params = {}, body = {} } = apiContent;

    return new Promise((resolve, reject) => {

        const endpoint = (func === '') ? `${process.env[instance + '_ENDPOINT']}` : `${process.env[instance + '_ENDPOINT']}/${func}`;
        if (endpoint === undefined) {
            console.log('Invalid Endpoint');
            reject('Invalid Endpoint');
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

        if (JSON.stringify(body) !== '{}') {
            options.body = JSON.stringify(body);
        }

        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    const error = new Error(response.statusText);
                    error.status = response.status;
                    console.log(error);
                    console.log('Error exectuing the requested Kaleido API.');
                    reject(error);
                }
                return response.json();
            })
            .then(results => {
                console.log(results);
                console.log('Successfuly executed the requested Kaleido API.')
                resolve(results)
            })
            .catch(err => {
                console.log(err);
                console.log('Error exectuing the requested Kaleido API.');
                reject(err)
            });
    })
}

module.exports = fetchAPI;



