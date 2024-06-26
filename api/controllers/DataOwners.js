// Import packages
const { randomUUID } = require('crypto');
const fs = require('fs');
const archiver = require('archiver');

// Import Middlewares
const fetchAPI = require('../../kaleido/fetchAPI');
const Roles = require('../../Roles.json');
const sha256 = require('../middlewares/algorithms/sha256');
const generateToken = require('../middlewares/utilities/generateToken');
const verifyPassword = require('../middlewares/utilities/verifyPassword');
const generateSecretKey = require('../middlewares/utilities/generateSecretKey');
const { storeKey, retrieveKey, deleteKey } = require('../middlewares/utilities/keystore');

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
            console.log(dataOwners);
            res.status(200).json({
                dataOwners: dataOwners.output
            });
        })
        .catch(err => {
            console.log(err);
            console.log('Failed to fetch the data owner.');
            res.status(500).json({
                error: 'Failed to fetch the data owner.'
            })
        });
};

const getSecretKey = async (req, res) => {
    if (req.userData.type === 'Data Owner') {
        const secrets = {
            keys: Roles[req.userData.department].map(role => ({
                department: req.userData.department,
                role: role,
                secret_key: generateSecretKey()
            }))
        };
        try {
            const zip = archiver('zip');
            res.attachment('secrets.zip'); // Set the name of the zip file to be downloaded

            zip.pipe(res); // Send the zip file in the response

            await Promise.all(secrets.keys.map(async key => {
                await storeKey({ department: key.department, role: key.role }, { secret_key: key.secret_key });
                const filename = `./uploads/${key.role}.key`;
                fs.writeFileSync(filename, key.secret_key);
                zip.append(fs.createReadStream(filename), { name: `${key.role}.key` });
            }));

            zip.finalize(); // Finalize the zip file
            console.log(`Sent zip file containing all the keys.`)
        }
        catch (err) {
            console.log(err);
            console.log('Failed to generate keys for all roles.');
            res.status(500).json({
                error: 'Failed to generate keys for all roles.'
            });
        }
    }
    else {
        console.log(`Unauthorized access.`);
        res.status(401).json({
            error: 'You are unauthorized to generate keys.'
        })
    }
}

const clearKeys = async (req, res) => {
    if (req.userData.type === 'Data Owner') {
        const roles = Roles[req.userData.department];
        try {
            const settledPromies = await Promise.all(roles.map(role => deleteKey({ department: req.userData.department, role: role })));
            console.log('Keys Deleted Successfuly.');
            res.status(200).json({
                message: 'Keys Deleted Successfuly.'
            });
        }
        catch (err) {
            console.log(err);
            console.log('Failed to delete keys.');
            res.status(500).json({
                error: 'Failed to delete keys.'
            });
        }
    }
    else {
        console.log(`Unauthorized access.`);
        res.status(401).json({
            error: 'You are unauthorized to clear keys.'
        })
    }
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
                console.log('Login Successful.')
                res.status(201).json({
                    message: 'Auth Successful.',
                    user: dataOwner,
                    token: generateToken({
                        id: dataOwner.id,
                        email: dataOwner.email,
                        department: dataOwner.department,
                        type: 'Data Owner'
                    })
                });
            }
            else {
                console.log('Invalid credentials. Login failed.')
                res.status(401).json({
                    error: 'Auth Failed. Check credentials.'
                });
            }
        })
        .catch(err => {
            console.log(err);
            console.log('Failed to login the data owner. Try again.');
            res.status(500).json({
                error: 'Failed to login the data owner. Try again.'
            })
        });
};

const signup = (req, res) => {
    if (!Roles.hasOwnProperty(req.body.department)) {
        console.log('Invalid department. Signup failed.');
        res.status(400).json({
            error: "Department is not valid. Try one of the following departments.",
            departments: Object.keys(Roles)
        })
    }
    else {
        const apiContent = {
            method: 'GET',
            instance: 'DATA_OWNER',
            func: 'checkDataOwnerCreation',
            params: {
                _email: req.body.email,
                _department: req.body.department
            }
        }
        fetchAPI(apiContent)
            .then(results => {
                if (results.isEmailExists) {
                    console.log('Email already exists. Signup failed.');
                    res.status(409).json({
                        error: 'Email already exists.'
                    })
                }
                else if (results.isDeptExists) {
                    console.log('Data Owner for the department already exists. Signup failed.');
                    res.status(409).json({
                        error: 'Data Owner for the department already exists.'
                    })
                }
                else {
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
                                console.log('Data Owner created Successfuly.');
                                res.status(201).json({
                                    message: 'Data Owner created Successfuly.'
                                });
                            }
                            else {
                                console.log('Failed to signup the data owner. Try again.');
                                res.status(500).json({
                                    error: 'Failed to signup the data owner. Try again.'
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            console.log('Failed to signup the data owner. Try again.');
                            res.status(500).json({
                                error: 'Failed to signup the data owner. Try again.'
                            })
                        });
                }
            })
            .catch(err => {
                console.log(err);
                console.log('Failed to signup the data owner. Try again.');
                res.status(500).json({
                    error: 'Failed to signup the data owner. Try again.'
                })
            })
    }
}

module.exports = { getById, getSecretKey, clearKeys, login, signup }