const fs = require('fs');

const deleteHandler = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) {
                console.log(err);
                console.log(`Error deleting file: ${filepath}. Error: ${err}`);
                reject(`Error deleting file: ${filepath}. Error: ${err}`);
            } else {
                console.log(`File: ${filepath} deleted.`);
                resolve(`File: ${filepath} deleted.`);
            }
        });
    });
};

module.exports = deleteHandler;
