const express = require('express');
const router = express.Router();

const uploadHandler = require('../middlewares/utilities/uploadHandler');
const checkAuth = require('../middlewares/utilities/checkAuth');
const fileControllers = require('../controllers/Files');

router.get('/dept/:dept', checkAuth, fileControllers.getFilesByDepartment);
router.get('/:id', checkAuth, fileControllers.getById);
router.post('/:id', checkAuth, fileControllers.getById );
router.post('/', checkAuth, uploadHandler.single('file'), fileControllers.postFile);
router.delete('/:id', checkAuth, fileControllers.deleteById);

module.exports = router;