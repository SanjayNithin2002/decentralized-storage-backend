const fs = require('fs');
const readFile = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        })
    })
}
module.exports = readFile;