// Import packages
const { randomUUID } = require('crypto');

// Import Middlewares
const fetchAPI = require('../../kaleido/fetchAPI');
const sha256 = require('../middlewares/algorithms/sha256');
const generateToken = require('../middlewares/utilities/generateToken');
const verifyPassword = require('../middlewares/utilities/verifyPassword');
const generateSecretKey = require('../middlewares/utilities/generateSecretKey');

const getAll = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'DATA_OWNER',
        func: 'getAllDataOwners'
    }
    fetchAPI(apiContent)
        .then(dataOwners => {
            res.status(200).json({
                dataOwners: dataOwners.output
            });
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.status || 500;
            const errorMessage = err.stack || 'Internal Server Error';
            res.status(statusCode).json({
                error: errorMessage
            })
        });
};

const getById = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'DATA_OWNER',
        func: 'getById',
        params: {
            _id: req.params.id
        }
    }
    fetchAPI(apiContent)
        .then(dataOwners => {
            res.status(200).json({
                dataOwners: dataOwners.output
            });
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.status || 500;
            const errorMessage = err.stack || 'Internal Server Error';
            res.status(statusCode).json({
                error: errorMessage
            })
        });
};

const getSecretKey = (req, res) => {
    res.status(200).json({
        secret_key: generateSecretKey()
    })
}

const login = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'DATA_OWNER',
        func: 'getByEmail',
        params: {
            _email: req.body.email
        }
    }
    fetchAPI(apiContent)
        .then(results => {
            const dataOwner = results.output;
            if (req.body.email === dataOwner.email && verifyPassword(dataOwner.password, req.body.password)) {
                res.status(201).json({
                    message: 'Auth Successful',
                    user: dataOwner,
                    token: generateToken({
                        id: dataOwner.id,
                        email: dataOwner.email
                    })
                });
            }
            else {
                res.status(401).json({
                    message: 'Auth Failed'
                });
            }
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.status || 500;
            const errorMessage = err.stack || 'Internal Server Error';
            res.status(statusCode).json({
                error: errorMessage
            })
        });
};

const signup = (req, res) => {
    const apiContent = {
        method: 'POST',
        instance: 'DATA_OWNER',
        func: 'createDataOwner',
        body: {
            _id: randomUUID(),
            _name: req.body.name,
            _email: req.body.email,
            _password: sha256(req.body.password),
            _department: req.body.department
        }
    }
    fetchAPI(apiContent)
        .then(results => {
            if (results.sent) {
                res.status(201).json({
                    message: 'Data Owner Successfuly Created'
                });
            }
            else {
                res.status(400).json({
                    error: 'Data Owner signup failed. Try again.'
                })
            }
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.status || 500;
            const errorMessage = err.stack || 'Internal Server Error';
            res.status(statusCode).json({
                error: errorMessage
            })
        });
}

module.exports = {getAll, getById, getSecretKey, login, signup}