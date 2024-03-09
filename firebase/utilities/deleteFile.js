const deleteFile = (bucket, filepath) => {
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
};

module.exports = deleteFile;