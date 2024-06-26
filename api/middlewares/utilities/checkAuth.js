const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (err) {
        console.log(`Error parsing the token.\nError: ${err}`);
        res.status(401).json({
            error: 'Auth failed'
        });
    }
}

module.exports = checkAuth;
