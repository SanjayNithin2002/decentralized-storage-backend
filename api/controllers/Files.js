// Import packages

// Import Middlewares
const {loadData, saveData, createRecord, getAllRecords, getRecord, updateRecord, deleteRecord} = require('../../in_memory_db/lib');

const filepath = './in_memory_db/Files.json';

const getAll = (req, res) => {
    const files = getAllRecords(filepath);
    res.status(200).json({
        files: files
    });
};

const getById = (req, res) => {
    const file = getRecord(filepath, req.params.id);
    res.status(200).json({
        file: file
    });
};

const postFile = (req, res) => {
    const fileMetaData = {
        title: req.body.title,
        uploadedAt: new Date().toLocaleString(),
        filepath: req.file.path,
    }
    console.log(req.file.path);
    const fileExists = createRecord(filepath, fileMetaData);
    if(fileExists){
        res.status(201).json({
            message: 'File Creation Successful'
        })
    }
    else{
        res.status(401).json({
            message: 'File Creation Unsuccessful'
        })
    }
};

const patchById = (req, res) => {
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
};

const deleteById = (req, res) =>{
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
};

module.exports = {getAll, getById, postFile, patchById, deleteById};