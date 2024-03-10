const sha256 = require('../algorithms/sha256');

const verifyPassword = (hash, password) => {
    return hash === sha256(password);
}

module.exports = verifyPassword;