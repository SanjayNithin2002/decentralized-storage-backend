const jwt = require('jsonwebtoken');

const generateToken = (jsonData) => {
    const token = jwt.sign(
        jsonData,
        process.env.JWT_KEY || 'sample-key',
        {
            expiresIn: "1h"
        });
    return token;
}

module.exports = generateToken;

