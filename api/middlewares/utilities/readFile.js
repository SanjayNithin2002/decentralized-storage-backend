const fs = require('fs');
const readFile = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                console.log('Successfuly read the file.');
                resolve(data);
            }
        })
    })
}
module.exports = readFile;