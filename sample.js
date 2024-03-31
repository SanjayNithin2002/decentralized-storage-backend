const readFile = require('./api/middlewares/utilities/readFile');
readFile('uploads/secret_key_1711910727955.pem')
.then(data => console.log(data))
.catch(err => console.log(err));