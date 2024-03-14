// Import packages
const { randomUUID } = require('crypto');

// Import Middlewares
const fetchAPI = require('../../kaleido/fetchAPI');
const generateToken = require('../middlewares/utilities/generateToken');
const sha256 = require('../middlewares/algorithms/sha256');
const verifyPassword = require('../middlewares/utilities/verifyPassword');

const getAll = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'USER',
        func: 'getAllUsers'
    }
    fetchAPI(apiContent)
        .then(users => {
            res.status(200).json({
                users: users.output
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
        instance: 'USER',
        func: 'getUser',
        params: {
            _id: req.params.id
        }
    }
    fetchAPI(apiContent)
        .then(users => {
            res.status(200).json({
                user: users.output
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

const getByDepartment = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'USER',
        func: 'getUsersByDepartment',
        params: {
            _department: req.params.dept
        }
    }
    fetchAPI(apiContent)
        .then(users => {
            res.status(200).json({
                user: users.output
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

const login = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'USER',
        func: 'getUserByEmail',
        params: {
            _email: req.body.email
        }
    }
    fetchAPI(apiContent)
        .then(results => {
            const user = results.output;
            if (req.body.email === user.email && verifyPassword(user.password, req.body.password)) {
                res.status(201).json({
                    message: 'Auth Successful',
                    user: user,
                    token: generateToken({
                        id: user.id,
                        email: user.email
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
        instance: 'USER',
        func: 'createUser',
        body: {
            _id: randomUUID(),
            _name: req.body.name,
            _email: req.body.email,
            _password: sha256(req.body.password),
            _department: req.body.department,
            _role: req.body.role
        }
    }
    fetchAPI(apiContent)
        .then(results => {
            if (results.sent) {
                res.status(201).json({
                    message: 'User Successfuly Created'
                });
            }
            else {
                res.status(400).json({
                    error: 'User signup failed. Try again.'
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
};

const approveById = (req, res) => {
    const apiContent = {
        method: 'POST',
        instance: 'USER',
        func: 'approveUser',
        body: {
            _id: req.params.id
        }
    }
    fetchAPI(apiContent)
        .then(results => {
            if (results.sent) {
                res.status(200).json({
                    message: 'User Approved Successfuly'
                });
            }
            else {
                res.status(400).json({
                    error: 'User approval failed.'
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

const deleteById = (req, res) => {
    const apiContent = {
        method: 'POST',
        instance: 'USER',
        func: 'deleteUser',
        body: {
            _id: req.params.id
        }
    }
    fetchAPI(apiContent)
        .then(results => {
            if (results.sent) {
                res.status(200).json({
                    message: 'User Deleted Successfuly'
                });
            }
            else {
                res.status(400).json({
                    error: 'User deletion failed.'
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
};

module.exports = { getAll, getById, getByDepartment, login, signup, approveById, deleteById };

