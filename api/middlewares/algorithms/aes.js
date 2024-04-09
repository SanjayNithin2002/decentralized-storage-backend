const { CipherGCM, CipherGCMTypes, DecipherGCM } = require('crypto');
const crypto = require('crypto');

const getAlgorithm = () => 'aes-256-gcm';
const deriveKeyFromPassword = (password, salt, iterations) => {
    return crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha512');
};

const encryptAes = (plainText, secret_key) => {
    try {
        if (typeof plainText === 'object') {
            plainText = JSON.stringify(plainText);
        } else {
            plainText = String(plainText);
        }
        const algorithm = getAlgorithm();
        const salt = crypto.randomBytes(64);
        const iv = crypto.randomBytes(16);
        const iterations = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        const encryptionKey = deriveKeyFromPassword(secret_key, salt, Math.floor(iterations * 0.47 + 1337));
        const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
        const encryptedData = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();
        const output = Buffer.concat([salt, iv, authTag, Buffer.from(iterations.toString()), encryptedData]).toString('hex');
        return output;
    } catch (error) {
        console.error('Encryption failed!');
        console.error(error);
        return void 0;
    }
};

const decryptAes = (cipherText, secret_key) => {
    try {
        const algorithm = getAlgorithm();
        const inputData = Buffer.from(cipherText, 'hex');
        const salt = inputData.slice(0, 64);
        const iv = inputData.slice(64, 80);
        const authTag = inputData.slice(80, 96);
        const iterations = parseInt(inputData.slice(96, 101).toString('utf-8'), 10);
        const encryptedData = inputData.slice(101);
        const decryptionKey = deriveKeyFromPassword(secret_key, salt, Math.floor(iterations * 0.47 + 1337));
        const decipher = crypto.createDecipheriv(algorithm, decryptionKey, iv);
        decipher.setAuthTag(authTag);
        const decrypted = decipher.update(encryptedData, 'binary', 'utf-8') + decipher.final('utf-8');
        try {
            return JSON.parse(decrypted);
        } catch (error) {
            console.log(error);
            return decrypted;
        }
    } catch (error) {
        console.error('Decryption failed!');
        console.error(error);
        return void 0;
    }
};

module.exports = { encryptAes, decryptAes }
