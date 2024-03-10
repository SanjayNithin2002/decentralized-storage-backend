// Import packages
const { randomUUID } = require('crypto');

// Import Middlewares
const { loadData, saveData, createRecord, getAllRecords, getByEmail, getRecord, updateRecord, deleteRecord } = require('../../in_memory_db/lib');
const generateToken = require('../middlewares/utilities/generateToken');
const sha256 = require('../middlewares/algorithms/sha256');
const verifyPassword = require('../middlewares/utilities/verifyPassword');

const filepath = './in_memory_db/Users.json';

const getAll = (req, res) => {
    const users = getAllRecords(filepath);
    res.status(200).json({
        users: users
    });
};

const getById = (req, res) => {
    const user = getRecord(filepath, req.params.id);
    res.status(200).json({
        user: user
    });
};

const login = (req, res) => {
    const user = getByEmail(filepath, req.body.email);
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
};

const signup = (req, res) => {
    const user = {
        id: randomUUID(),
        name: req.body.name,
        email: req.body.email,
        password: sha256(req.body.password),
        department: req.body.department,
        role: req.body.role, 
        status: 'Pending'
    }
    const loginFlag = createRecord(filepath, user);
    if (loginFlag) {
        res.status(201).json({
            message: 'User Creation Successful',
            user: user,
            token: generateToken({
                id: user.id,
                email: user.email
            })
        })
    }
    else {
        res.status(401).json({
            message: 'User Creation Unsuccessful'
        })
    }
};

const approveById = (req, res) => {
    const updateOps = {
        status: "Approved"
    };
    const updateFlag = updateRecord(filepath, req.params.id, updateOps);
    if(updateFlag){
        res.status(201).json({
            message: 'Updation Successful'
        })
    }
    else{
        res.status(409).json({
            message: 'Updation Unsuccesful'
        })
    }
}

const deleteById = (req, res) => {
    const deleteFlag = deleteRecord(filepath, req.params.id);
    if (deleteFlag) {
        res.status(201).json({
            message: 'Deletion Successful'
        })
    }
    else {
        res.status(409).json({
            message: 'Deletion Unsuccesful'
        })
    }
};

module.exports = { getAll, getById, login, signup, approveById, deleteById };

