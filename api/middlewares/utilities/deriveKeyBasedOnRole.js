const crypto = require('crypto');

const deriveKeyBasedOnRole = (masterKey, role) => {
    return crypto.createHash('sha512').update(masterKey + '_' + role).digest('hex');
}

module.exports = deriveKeyBasedOnRole;

