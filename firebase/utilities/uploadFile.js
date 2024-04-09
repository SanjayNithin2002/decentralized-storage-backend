const bucket = require('../bucket');

const uploadFile = (filepath) => {
    return new Promise((resolve, reject) => {
        const [fileExt, ...fileNameArr] = filepath.split('.').reverse();
        bucket.upload(filepath, {
            destination: filepath,
            metadata: {
                contentType: fileExt
            }
        }, (err, file) => {
            if (err) {
                console.log(err);
                console.log(`Error uploading file to Firebase.\nFile: ${filepath}.\nError: ${err}`);
                reject(`Error uploading file to Firebase.\nFile: ${filepath}.\nError: ${err}`);
            } else {
                console.log('File Uploaded to firebase Successfuly');
                resolve('File Uploaded to firebase Successfuly');
            }
        });
    });
};

module.exports = uploadFile;