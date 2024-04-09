const bucket = require('../bucket');

const deleteFile = (filepath) => {
    return new Promise((resolve, reject) => {
        var remoteFilePath = bucket.file(filepath);
        remoteFilePath.delete()
            .then(results => {
                console.log(`File: ${filepath} deleted Successfuly`);
                resolve(`File: ${filepath} deleted Successfuly`)
            })
            .catch(err => {
                console.log(`Error deleting file: ${filepath}.\nError: ${err}`);
                reject(`Error deleting file: ${filepath}.\nError: ${err}`);
            })
    })
};

module.exports = deleteFile;