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
                const [folderName, fileName] = filepath.split('/');
                const downloadFilePath = `downloads/${fileName}`;
                fetchPDF(url, downloadFilePath)
                    .then(results => resolve(results))
                    .catch(err => reject(err));
            }
            )
            .catch(err => {
                reject({
                    error: err,
                    status: err.status
                })
            }
            );
    })
}