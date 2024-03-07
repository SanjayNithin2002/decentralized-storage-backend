const express = require('express');
const router = express.Router();
const {loadData, saveData, createRecord, getAllRecords, getById, updateRecord, deleteRecord} = require('../../in_memory_db/lib');
const filepath = '../../in_memory_db/Users.js';

router.get('/', (req, res) => {
    const users = getAllRecords(filepath);
    res.status(200).json({
        users: users
    });
});

router.get('/:id', (req, res) => {
    const user = getById(filepath, req.params.id);
    res.status(200).json({
        user: user
    });
});

router.post('/login', (req, res) => {
    const user = getById(filepath, req.body.email);
    if(req.body.email === user.email && req.body.password === user.password){
        res.status(201).json({
            message: 'Auth Successful'
        });
    }
    else{
        res.status(401).json({
            message: 'Auth failed'
        });
    }
});

router.post('/signup', (req, res) => {
    const loginFlag = createRecord(filepath, req.body);
    if(loginFlag){
        res.status(201).json({
            message: 'Auth Successful'
        })
    }
    else{
        res.status(401).json({
            message: 'Auth Failed'
        })
    }
});

router.patch('/:id', (req, res) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    const updateFlag = updateRecord(filepath, updateOps);
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
});

router.delete('/:id', (req, res) =>{
    const deleteFlag = deleteRecord(filepath, req.params.id);
    if(deleteFlag){
        res.status(201).json({
            message: 'Deletion Successful'
        })
    }
    else{
        res.status(409).json({
            message: 'Deletion Unsuccesful'
        })
    }
});

module.exports = router;