// Import packages
const { randomUUID } = require('crypto');
// Import Middlewares
const { loadData, saveData, createRecord, getAllRecords, getRecord, updateRecord, deleteRecord } = require('../../in_memory_db/lib');
const convertBytes = require('../middlewares/utilities/convertBytes');
const deleteFile = require('../../firebase/utilities/deleteFile');
const uploadFile = require('../../firebase/utilities/uploadFile');
const getFile = require('../../firebase/utilities/getFile');
const deleteHandler = require('../middlewares/utilities/deleteHandler');
const { encryptFile, decryptFile } = require('../middlewares/utilities/fileCryptoUtils');
const deriveKeyBasedOnRole = require('../middlewares/utilities/deriveKeyBasedOnRole');
const { constructMerkleTree, verifyMerkleRoot } = require('../middlewares/algorithms/merkleRoot');

const filepath = './in_memory_db/Files.json';

const getAll = (req, res) => {
    const files = getAllRecords(filepath);
    res.status(200).json({
        files: files
    });
};

const getById = (req, res) => {
    const file = getRecord(filepath, req.params.id);
    if (file?.filepath) {
        getFile(file.filepath)
            .then(firebaseResults => {
                decryptFile(file.filepath, req.body.key)
                    .then(decryptResults => {
                        res.download(file.filepath, (err) => {
                            deleteHandler(file.filepath);
                        });
                    })
                    .catch(err => {
                        res.status(err.status || 500).json({
                            error: err
                        })
                    })
            })
            .catch(err => {
                res.status(err.status || 404).json({
                    error: err || 'File Not Found'
                });
            });
    }
    else {
        res.status(404).json({
            error: 'File Not Found'
        });
    }
};

const postFile = (req, res) => {
    const derivedKey = deriveKeyBasedOnRole(req.body.master_key, req.body.role);
    encryptFile(req.file.path, derivedKey)
        .then(results => {
            uploadFile(req.file.path)
                .then(results => {
                    const fileMetaData = {
                        id: randomUUID(),
                        title: req.body.title,
                        uploadedAt: new Date().toLocaleString(),
                        filepath: req.file.path,
                        mimetype: req.file.mimetype,
                        originalName: req.file.originalname,
                        size: convertBytes(req.file.size),
                        merkleTree: constructMerkleTree(req.file.path)
                    }
                    const fileExists = createRecord(filepath, fileMetaData);
                    if (fileExists) {
                        deleteHandler(req.file.path);
                        res.status(201).json({
                            message: 'File Upload Successful'
                        })
                    }
                    else {
                        res.status(409).json({
                            message: 'File Creation Unsuccessful'
                        })
                    }
                })
                .catch(err => {
                    res.status(err.status || 500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            res.status(err.status || 500).json({
                error: err
            })
        });
};

const patchById = (req, res) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.key] = ops.value;
    }
    const updateFlag = updateRecord(filepath, req.params.id, updateOps);
    if (updateFlag) {
        res.status(201).json({
            message: 'Updation Successful'
        })
    }
    else {
        res.status(409).json({
            message: 'Updation Unsuccesful'
        })
    }
};

const deleteById = (req, res) => {
    const file = getRecord(filepath, req.params.id);
    if (file?.filepath) {
        deleteFile(file.filepath)
            .then(results => {
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

            })
            .catch(err => {
                res.status(err.status || 500).json({
                    error: err
                })
            })
    }
    else {
        res.status(404).json({
            error: 'File Not Found'
        })

    }
};

module.exports = { getAll, getById, postFile, patchById, deleteById };