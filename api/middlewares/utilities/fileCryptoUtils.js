const fs = require('fs');
const { encryptAes, decryptAes } = require('../algorithms/aes');
const { resolve } = require('path');


const encryptFile = (filepath, key) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, filedata) => {
            if (err) {
                console.log(err);
                console.log(`Error reading file: ${filepath}`);
                reject(`Error reading file: ${filepath}`);
            }
            else {
                const encryptedFileData = encryptAes(filedata, key);
                if (encryptedFileData !== undefined) {
                    fs.writeFile(filepath, encryptedFileData, (err, result) => {
                        if (err) {
                            console.log(`Error writing encrypted data to the file: ${filepath}.`);
                            reject(`Error writing encrypted data to the file: ${filepath}.`);
                        }
                        else {
                            console.log('Encrypted Data Successfuly stored.');
                            resolve('Encrypted Data Successfuly stored.');
                        }
                    })
                }
                else {
                    console.log('Failed to encrypt file.');
                    reject('Failed to encrypt file.');
                }
            }
        })
    })
};

const decryptFile = (filepath, key) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, encryptedFileData) => {
            if (err) {
                console.log(`Error reading file: ${filepath}.`);
                reject(`Error reading file: ${filepath}.`);
            } else {
                const decryptedFileData = decryptAes(encryptedFileData.toString(), key); // Convert encrypted data to string before decrypting
                if (decryptedFileData !== undefined) {
                    fs.writeFile(filepath, Buffer.from(decryptedFileData), (err, result) => { // Write decrypted data to a new file
                        if (err) {
                            console.log(`Error writing decrypted data to the file: ${filepath}.`);
                            reject(`Error writing decrypted data to the file: ${filepath}.`);
                        } else {
                            console.log('Decrypted Data Successfuly stored.');
                            resolve('Decrypted Data Successfuly stored.');
                        }
                    });
                } else {
                    console.log('Failed to decrypt the file.');
                    reject('Failed to decrypt the file.');
                }
            }
        });
    })
};

module.exports = { encryptFile, decryptFile };
