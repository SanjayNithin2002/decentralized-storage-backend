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
            res.status(500).json({
                error: 'Failed to fetch all users. Try Again.'
            })
        })
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
            res.status(500).json({
                error: 'Failed to fetch user. Check if the user exists and try again.'
            })
        })
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
            res.status(500).json({
                error: 'Failed to fetch users by department. Check details and try again.'
            })
        })
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
            res.status(500).json({
                error: 'Failed to login the user. Check credentials and try again.'
            })
        })
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
                res.status(500).json({
                    error: 'Failed to signup the user. Try again.'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'Failed to signup the user. Try again.'
            })
        })
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
                res.status(500).json({
                    error: 'Failed to approve the user.'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'Failed to approve the user.'
            })
        })
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
                res.status(500).json({
                    error: 'Failed to delete the user.'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'Failed to delete the user.'
            })
        })
};

module.exports = { getAll, getById, getByDepartment, login, signup, approveById, deleteById };

