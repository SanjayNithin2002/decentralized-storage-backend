const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/utilities/checkAuth');
const userControllers = require('../controllers/Users');
const uploadFile = require('../../firebase/utilities/uploadFile');

router.get('/', checkAuth, userControllers.getAll);
router.get('/dept/:dept', checkAuth, userControllers.getByDepartment);
router.get('/:id', checkAuth, userControllers.getById);
router.post('/login', userControllers.login);
router.post('/signup', userControllers.signup);
router.patch('/approve/:id', checkAuth, userControllers.approveById);
router.delete('/:id', checkAuth, userControllers.deleteById);

module.exports = router;