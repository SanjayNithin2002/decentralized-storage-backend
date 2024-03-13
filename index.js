const fetchAPI = require('./kaleido/fetchAPI');

const apiContent = {
    method: 'GET',
    instance: 'USER',
    func: 'doesEmailExist',
    params: {
        _email: 'sanjay@gmail.com'
    },
    body: {},
}
fetchAPI(apiContent)
.then(results => console.log(results))
.catch(err => console.log(err));