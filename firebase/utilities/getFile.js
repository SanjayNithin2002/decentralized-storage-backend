const fetchPDF = require('../../api/middlewares/utilities/fetchPDF');
const bucket = require('../bucket');

const getFile = (filepath) => {
    return new Promise((resolve, reject) => {
        const file = bucket.file(filepath);
        var options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7 //one week
        };
        file.getSignedUrl(options)
            .then(url => {
                fetchPDF(url, filepath)
                    .then(results => {
                        console.log('Successfuly read the file from the cloud.');
                        resolve(results);
                    })
                    .catch(err => {
                        console.log(err);
                        console.log('Error reading the file from cloud.');
                        reject(err);
                    });
            }
            )
            .catch(err => {
                console.log(err);
                console.log('Error reading the file from cloud.');
                reject('Error reading the file from cloud.');
            }
            );
    })
}

module.exports = getFile;