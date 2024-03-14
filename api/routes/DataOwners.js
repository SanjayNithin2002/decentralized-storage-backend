const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/utilities/checkAuth');
const dataOwnerControllers = require('../controllers/DataOwners');

router.get('/', checkAuth, dataOwnerControllers.getAll);
router.get('/secret-key', checkAuth, dataOwnerControllers.getSecretKey);
router.get('/:id', checkAuth, dataOwnerControllers.getById);
router.post('/login', dataOwnerControllers.login);
router.post('/signup', dataOwnerControllers.signup);

module.exports = router;