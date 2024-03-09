const fs = require('fs');
const { encryptAes, decryptAes } = require('../algorithms/aes');
const { resolve } = require('path');
const { error } = require('console');

const encryptFile = (filepath, key) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, filedata) => {
            if (err) {
                reject({
                    error: `Error reading file: ${filepath}\nError: ${err}.`,
                    status: err.status
                })
            }
            else {
                const encryptedFileData = encryptAes(filedata, key);
                if (encryptedFileData !== undefined) {
                    fs.writeFile(filepath, encryptedFileData, (err, result) => {
                        if (err) {
                            reject({
                                error: `Error writing encrypted data to the file: ${filepath}.\nError: ${err}.`,
                                status: err.status
                            })
                        }
                        else {
                            resolve({
                                message: 'Encrypted Data Successfuly stored.',
                                status: 200
                            })
                        }
                    })
                }
                else {
                    reject({
                        error: 'Encryption failed',
                        status: 500
                    })
                }
            }
        })
    })
};

const decryptFile = (filepath, key) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, encryptedFileData) => {
            if (err) {
                reject({
                    error: `Error reading file: ${filepath}\nError: ${err}.`,
                    status: err.status
                })
            } else {
                const decryptedFileData = decryptAes(encryptedFileData.toString(), key); // Convert encrypted data to string before decrypting
                if (decryptedFileData !== undefined) {
                    fs.writeFile(filepath, Buffer.from(decryptedFileData), (err, result) => { // Write decrypted data to a new file
                        if (err) {
                            reject({
                                error: `Error writing decrypted data to the file: ${filepath}.\nError: ${err}.`,
                                status: error.status
                            })
                        } else {
                            resolve({
                                message: 'Decrypted Data Successfuly stored.',
                                status: 200
                            })
                        }
                    });
                } else {
                    reject({
                        message: 'Decryption Failed.',
                        status: 500
                    })
                }
            }
        });
    })
};

module.exports = { encryptFile, decryptFile };
