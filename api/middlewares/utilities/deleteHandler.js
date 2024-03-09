const fs = require('fs');

const deleteHandler = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) {
                reject({
                    error: `Error deleting file: ${filepath}. Error: ${err}`,
                    status: err.code
                });
            } else {
                resolve({
                    message: `File: ${filepath} deleted.`,
                    status: 200
                });
            }
        });
    });
};

module.exports = deleteHandler;
