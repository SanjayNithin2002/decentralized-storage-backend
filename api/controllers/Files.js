// Import packages
const { randomUUID } = require('crypto');
// Import Middlewares
const fetchAPI = require('../../kaleido/fetchAPI');
const convertBytes = require('../middlewares/utilities/convertBytes');
const deleteFile = require('../../firebase/utilities/deleteFile');
const uploadFile = require('../../firebase/utilities/uploadFile');
const getFile = require('../../firebase/utilities/getFile');
const deleteHandler = require('../middlewares/utilities/deleteHandler');
const { encryptFile, decryptFile } = require('../middlewares/utilities/fileCryptoUtils');
const deriveKeyBasedOnRole = require('../middlewares/utilities/deriveKeyBasedOnRole');
const { constructMerkleTree, verifyMerkleRoot } = require('../middlewares/algorithms/merkleRoot');


const getFilesByDepartment = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'FILE',
        func: 'getFilesByDepartment',
        params: {
            _department: req.params.dept
        }
    }
    fetchAPI(apiContent)
        .then(files => {
            res.status(200).json({
                files: files.output
            });
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.status || 500;
            const errorMessage = err.stack || 'Internal Server Error';
            res.status(statusCode).json({
                error: errorMessage
            })
        });
};

const getById = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'FILE',
        func: 'getFileById',
        params: {
            _id: req.params.id
        }
    }
    fetchAPI(apiContent)
        .then(files => {
            const file = files.output;
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
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.status || 500;
            const errorMessage = err.stack || 'Internal Server Error';
            res.status(statusCode).json({
                error: errorMessage
            })
        });
};

const verifyIntegrity = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'FILE',
        func: 'getFileById',
        params: {
            _id: req.params.id
        }
    }
    fetchAPI(apiContent)
        .then(files => {
            const file = files.output;
            if (file?.filepath) {
                getFile(file.filepath)
                    .then(firebaseResults => {
                        decryptFile(file.filepath, req.body.key)
                            .then(decryptResults => {
                                const calculatedMerkleRoot = constructMerkleTree(file.filepath);
                                const storedMerkleRoot = file.merkleRoot;
                                res.status(200).json({
                                    calculatedMerkleRoot: calculatedMerkleRoot,
                                    storedMerkleRoot: storedMerkleRoot,
                                    integrityPreserved: (storedMerkleRoot === calculatedMerkleRoot)
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
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.status || 500;
            const errorMessage = err.stack || 'Internal Server Error';
            res.status(statusCode).json({
                error: errorMessage
            })
        });
};

const postFile = (req, res) => {
    encryptFile(req.file.path, req.body.key)
        .then(results => {
            uploadFile(req.file.path)
                .then(results => {
                    const apiContent = {
                        method: 'POST',
                        instance: 'FILE',
                        func: 'createFile',
                        body: {
                            _id: randomUUID(),
                            _title: req.body.title,
                            _filepath: req.file.path,
                            _uploadedAt: new Date().toLocaleString(),
                            _mimetype: req.file.mimetype,
                            _originalName: req.file.originalname,
                            _size: convertBytes(req.file.size),
                            _merkleRoot: constructMerkleTree(req.file.path),
                            _department: req.body.department,
                            _role: req.body.role
                        }
                    }
                    fetchAPI(apiContent)
                        .then(results => {
                            if (results.sent) {
                                deleteHandler(req.file.path);
                                res.status(200).json({
                                    message: 'File Uploaded Successfuly'
                                });
                            }
                            else {
                                res.status(400).json({
                                    error: 'Bad Request. Check Again'
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            const statusCode = err.status || 500;
                            const errorMessage = err.stack || 'Internal Server Error';
                            res.status(statusCode).json({
                                error: errorMessage
                            })
                        });
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

const deleteById = (req, res) => {
    const apiContent = {
        method: 'GET',
        instance: 'FILE',
        func: 'getFileById',
        params: {
            _id: req.params.id
        }
    }
    fetchAPI(apiContent)
        .then(results => {
            if (results?.output) {
                const file = results.output;
                deleteFile(file.filepath)
                    .then(results => {
                        const apiContent = {
                            method: 'POST',
                            instance: 'FILE',
                            func: 'deleteFile',
                            body: {
                                _id: req.params.id
                            }
                        }
                        fetchAPI(apiContent)
                            .then(results => {
                                if (results.sent) {
                                    res.status(200).json({
                                        message: 'Deletion Successful'
                                    })
                                }
                                else {
                                    res.status(400).json({
                                        message: 'Deletion Unsuccesful'
                                    })
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                const statusCode = err.status || 500;
                                const errorMessage = err.stack || 'Internal Server Error';
                                res.status(statusCode).json({
                                    error: errorMessage
                                })
                            });

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
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.status || 500;
            const errorMessage = err.stack || 'Internal Server Error';
            res.status(statusCode).json({
                error: errorMessage
            })
        });
};

module.exports = { getFilesByDepartment, getById, verifyIntegrity, postFile, deleteById };