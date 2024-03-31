const fetchAPI = require('./kaleido/fetchAPI');

const { randomUUID } = require('crypto');
const apiContent = {
    method: 'GET',
    instance: 'USER',
    func: 'getAllUsers'
}

fetchAPI(apiContent)
.then(results => {
    console.log(results);
})
.catch(err => {
    console.log(err);
});