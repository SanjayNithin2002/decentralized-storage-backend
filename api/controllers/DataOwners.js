// Import packages
const { randomUUID } = require('crypto');
const fs = require('fs');
const archiver = require('archiver');

// Import Middlewares
const fetchAPI = require('../../kaleido/fetchAPI');
const sha256 = require('../middlewares/algorithms/sha256');
const generateToken = require('../middlewares/utilities/generateToken');
const verifyPassword = require('../middlewares/utilities/verifyPassword');
const generateSecretKey = require('../middlewares/utilities/generateSecretKey');
const { storeKey, retrieveKey, deleteKey } = require('../middlewares/utilities/keystore');

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
            res.status(500).json({
                error: 'Failed to fetch all data owners.'
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
            res.status(500).json({
                error: 'Failed to fetch the data owner.'
            })
        });
};

const getSecretKey = async (req, res) => {
    if (req.userData.type === 'Data Owner') {
        const secrets = {
            keys: [
                {
                    department: req.userData.department,
                    role: 'Student',
                    secret_key: generateSecretKey()
                },
                {
                    department: req.userData.department,
                    role: 'Teacher',
                    secret_key: generateSecretKey()
                },
                {
                    department: req.userData.department,
                    role: 'Researcher',
                    secret_key: generateSecretKey()
                },
            ]
        }
        try {
            const zip = archiver('zip');
            res.attachment('secrets.zip'); // Set the name of the zip file to be downloaded

            zip.pipe(res); // Send the zip file in the response

            await Promise.all(secrets.keys.map(async key => {
                await storeKey({department: key.department, role: key.role}, {secret_key: key.secret_key});
                const filename = `${key.role}.key`;
                fs.writeFileSync(filename, key.secret_key);
                zip.append(fs.createReadStream(filename), { name: filename }); // Add each file to the zip
            }));

            zip.finalize(); // Finalize the zip file
        }
        catch (err) {
            res.status(500).json({
                error: 'Failed to generate keys for all roles'
            });
        }
    }
    else {
        res.status(401).json({
            error: 'You are unauthorized to execute this request.'
        })
    }
}

const clearKeys = async (req, res) => {
    if (req.userData.type === 'Data Owner') {
        const roles = ['Student', 'Teacher', 'Researcher'];
        try {
            const settledPromies = await Promise.all(roles.map(role => deleteKey({ department: req.userData.department, role: role })));
            res.status(200).json({
                message: 'Keys Delete Successfuly'
            });
        }
        catch (err) {
            res.status(500).json({
                error: 'Failed to delete keys'
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
                        email: dataOwner.email,
                        department: dataOwner.department,
                        type: 'Data Owner'
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
                error: 'Failed to login the data owner.'
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
                res.status(500).json({
                    error: 'Failed to signup the data owner.'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'Failed to signup the data owner.'
            })
        });
}

module.exports = { getAll, getById, getSecretKey, clearKeys, login, signup }