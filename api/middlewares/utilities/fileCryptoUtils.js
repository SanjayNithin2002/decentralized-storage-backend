const fs = require('fs');
const { encryptAes, decryptAes } = require('../algorithms/aes');
const { resolve } = require('path');


const encryptFile = (filepath, key) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, filedata) => {
            if (err) {
                const error = new Error(`Error reading file: ${filepath}`);
                error.status = err.status || 500;
                console.log(error);
                reject(error);
            }
            else {
                const encryptedFileData = encryptAes(filedata, key);
                if (encryptedFileData !== undefined) {
                    fs.writeFile(filepath, encryptedFileData, (err, result) => {
                        if (err) {
                            const error = new Error(`Error writing encrypted data to the file: ${filepath}.`);
                            error.status = err.status || 500;
                            console.log(error);
                            reject(error);
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
                    const error = new Error('Encryption failed');
                    error.status = 500;
                    console.log(error);
                    reject(error);
                }
            }
        })
    })
};

const decryptFile = (filepath, key) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, encryptedFileData) => {
            if (err) {
                const error = new Error(`Error reading file: ${filepath}.`);
                error.status = err.status || 500;
                reject(error);
            } else {
                const decryptedFileData = decryptAes(encryptedFileData.toString(), key); // Convert encrypted data to string before decrypting
                if (decryptedFileData !== undefined) {
                    fs.writeFile(filepath, Buffer.from(decryptedFileData), (err, result) => { // Write decrypted data to a new file
                        if (err) {
                            const error = new Error(`Error writing decrypted data to the file: ${filepath}.`);
                            error.status = err.status || 500;
                            reject(error);
                        } else {
                            resolve({
                                message: 'Decrypted Data Successfuly stored.'
                            })
                        }
                    });
                } else {
                    const error = new Error('Decryption Failed.');
                    error.status = 500;
                    reject(error);
                }
            }
        });
    })
};

module.exports = { encryptFile, decryptFile };
