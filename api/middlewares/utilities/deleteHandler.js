const fs = require('fs');

const deleteHandler = (filepath) => {
    fs.unlink(filepath, (err) => {
        if (err) {
            console.error(`Error deleting file:${filepath}. Error:${err}`);
            return false;
        }
        else{
            console.log(`File:${filepath} deleted.`);
            return true;
        }
    })
}

module.exports = deleteHandler;