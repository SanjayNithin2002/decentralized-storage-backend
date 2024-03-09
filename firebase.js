const admin = require("firebase-admin");
const fetchPDF = require('./api/middlewares/utilities/fetchPDF');

const serviceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key.replace(/\\n/g, '\n'),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: "googleapis.com"
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_URL
});

const bucket = admin.storage().bucket();

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
                reject({
                    error: `Error uploading file to Firebase.\nFile: ${filepath}.\nError: ${err}`,
                    status: err.status // Change error.status to err.status
                });
            } else {
                resolve({
                    message: 'File Uploaded to firebase successfuly',
                    status: 201
                });
            }
        });
    });
};


const deleteFile = (filepath) => {
    return new Promise((resolve, reject) => {
        var remoteFilePath = bucket.file(filepath);
        remoteFilePath.delete()
            .then(results => {
                resolve({
                    message: `File: ${filepath} deleted successfuly`,
                    status: 200
                })
            })
            .catch(err => {
                reject({
                    error: `Error deleting file: ${filepath}.\nError: ${err}`,
                    status: err.status
                })
            })
    })
}

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

module.exports = { uploadFile, deleteFile, getFile};
