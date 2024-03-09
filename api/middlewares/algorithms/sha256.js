const crypto = require('crypto');

const sha256 = (data) => {
    return crypto
    .createHash('sha256')
    .update(data.toString())
    .digest('hex');
}

module.exports = sha256;
