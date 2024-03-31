const express = require('express');
const router = express.Router();

const uploadHandler = require('../middlewares/utilities/uploadHandler');
const checkAuth = require('../middlewares/utilities/checkAuth');
const fileControllers = require('../controllers/Files');

router.get('/dept/:dept', checkAuth, fileControllers.getFilesByDepartment);
router.post('/:id', checkAuth, uploadHandler.single('key'), fileControllers.getById );
router.post('/integrity/:id', checkAuth, uploadHandler.single('key'), fileControllers.verifyIntegrity);
router.post('/', checkAuth, uploadHandler.fields([{ name: 'file', maxCount: 1 }, { name: 'key', maxCount: 1 }]), fileControllers.postFile);
router.delete('/:id', checkAuth, fileControllers.deleteById);

module.exports = router;