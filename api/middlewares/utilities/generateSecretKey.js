const crypto = require('crypto')

const generateSecretKey = () => {
    return crypto.randomBytes(128).toString('hex');
}

module.exports = generateSecretKey;