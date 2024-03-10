// Import packages
const { randomUUID } = require('crypto');

// Import Middlewares
const { loadData, saveData, createRecord, getAllRecords, getByEmail, getRecord, updateRecord, deleteRecord } = require('../../in_memory_db/lib');
const generateToken = require('../middlewares/utilities/generateToken');

const filepath = './in_memory_db/Data-Owners.json';

const getAll = (req, res) => {
    const dataOwners = getAllRecords(filepath);
    res.status(200).json({
        dataOwners: dataOwners
    });
};

const getById = (req, res) => {
    const dataOwner = getById(filepath, req.params.id);
    res.status(200).json({
        dataOwner: dataOwner
    });
};

const login = (req, res) => {
    const dataOwner = getByEmail(filepath, req.body.email);
    if (req.body.email === dataOwner.email && req.body.password === dataOwner.password) {
        res.status(201).json({
            message: 'Auth Successful',
            dataOwner: dataOwner,
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
};

const signup = (req, res) => {
    const dataOwner = req.body;
    dataOwner.id = randomUUID();
    const loginFlag = createRecord(filepath, dataOwner);
    if (loginFlag) {
        res.status(201).json({
            message: 'dataOwner Creation Successful',
            dataOwner: dataOwner,
            token: generateToken({
                id: dataOwner.id,
                email: dataOwner.email
            })
        })
    }
    else {
        res.status(401).json({
            message: 'dataOwner Creation Unsuccessful'
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

module.exports = {getAll, getById, login, signup, deleteById}