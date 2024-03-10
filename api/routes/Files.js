const express = require('express');
const router = express.Router();

const uploadHandler = require('../middlewares/utilities/uploadHandler');
const checkAuth = require('../middlewares/utilities/checkAuth');
const fileControllers = require('../controllers/Files');

router.get('/', checkAuth, fileControllers.getAll);
router.get('/:id',checkAuth, fileControllers.getById );
router.post('/', checkAuth, uploadHandler.single('file'), fileControllers.postFile);
router.patch('/:id', checkAuth, fileControllers.patchById);
router.delete('/:id', checkAuth, fileControllers.deleteById);

module.exports = router;