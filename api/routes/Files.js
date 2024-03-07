const express = require('express');
const router = express.Router();
const {loadData, saveData, createRecord, getAllRecords, getById, updateRecord, deleteRecord} = require('../../in_memory_db/lib');
const filepath = './in_memory_db/Files.json';

router.get('/', (req, res) => {
    const files = getAllRecords(filepath);
    res.status(200).json({
        files: files
    });
});

router.get('/:id', (req, res) => {
    const file = getById(filepath, req.params.id);
    res.status(200).json({
        file: file
    });
});

router.post('/', (req, res) => {
    const fileExists = createRecord(filepath, req.body);
    if(loginFlag){
        res.status(201).json({
            message: 'File Creation Successful'
        })
    }
    else{
        res.status(401).json({
            message: 'File Creation Unsuccessful'
        })
    }
});

router.patch('/:id', (req, res) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.key] = ops.value;
    }
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