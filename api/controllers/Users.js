// Import packages
const { randomUUID } = require('crypto');
const fs = require('fs');

// Import Middlewares
const fetchAPI = require('../../kaleido/fetchAPI');
const generateToken = require('../middlewares/utilities/generateToken');
const sha256 = require('../middlewares/algorithms/sha256');
const verifyPassword = require('../middlewares/utilities/verifyPassword');
const { retrieveKey } = require('../middlewares/utilities/keystore');

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

const getSecretKey = async (req, res) => {
    if (req.userData.type === 'User') {
        try {
            const data = await retrieveKey({ department: req.userData.department, role: req.userData.role });
            const filename = `./uploads/${req.userData.role}.key`;
            fs.writeFileSync(filename, data.secret_key);
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', 'application/octet-stream');
            res.status(200).send(fs.readFileSync(filename));
        }
        catch (err) {
            res.status(500).json({
                error: 'Failed to generate key.'
            });
        }
    }
    else {
        res.status(401).json({
            error: 'You are unauthorized to execute this request.'
        })
    }
}
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
            console.log(user);
            if (req.body.email === user.email && verifyPassword(user.password, req.body.password)) {
                res.status(201).json({
                    message: 'Auth Successful',
                    user: user,
                    token: generateToken({
                        id: user.id,
                        email: user.email,
                        department: user.department,
                        role: user.role,
                        status: user.status,
                        type: 'User'
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
    const userId = randomUUID();
    const apiContent = {
        method: 'POST',
        instance: 'USER',
        func: 'createUser',
        body: {
            _id: userId,
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
                    message: 'Transaction executed successfuly. Try Login.'
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

module.exports = { getAll, getById, getByDepartment, getSecretKey, login, signup, approveById, deleteById };

