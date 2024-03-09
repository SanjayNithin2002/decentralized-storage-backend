const uploadFile = (bucket, filepath) => {
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

module.exports = uploadFile;