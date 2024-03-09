const fs = require('fs');
const { encryptAes, decryptAes } = require('../algorithms/aes');

const encryptFile = (filepath, key) => {
    fs.readFile(filepath, (err, filedata) => {
        if (err) {
            console.log(`Error reading file: ${filepath}\nError: ${err}.`);
            return false;
        }
        else {
            const encryptedFileData = encryptAes(filedata, key);
            if (encryptedFileData !== undefined) {
                fs.writeFile(filepath, encryptedFileData, (err, result) => {
                    if (err) {
                        console.log(`Error writing encrypted data to the file: ${filepath}.\nError: ${err}.`);
                        return false;
                    }
                    else {
                        console.log('Encrypted Data Successfuly stored.');
                        return true;
                    }
                })
            }
            else {
                console.log('Decryption failed!');
                return false;
            }

        }
    })
};

const decryptFile = (filepath, key) => {
    fs.readFile(filepath, (err, encryptedFileData) => {
        if (err) {
            console.log(`Error reading file: ${filepath}\nError: ${err}.`);
            return false;
        } else {
            const decryptedFileData = decryptAes(encryptedFileData.toString(), key); // Convert encrypted data to string before decrypting
            if (decryptedFileData !== undefined) {
                fs.writeFile(filepath, Buffer.from(decryptedFileData), (err, result) => { // Write decrypted data to a new file
                    if (err) {
                        console.log(`Error writing decrypted data to the file: ${filepath}.\nError: ${err}.`);
                        return false;
                    } else {
                        console.log('Encrypted Data Successfuly stored.');
                        return true;
                    }
                });
            } else {
                console.log('Decryption failed!');
                return false;
            }
        }
    });
};

module.exports = {encryptFile, decryptFile};
