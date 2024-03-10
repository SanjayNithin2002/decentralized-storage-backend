const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/utilities/checkAuth');
const userControllers = require('../controllers/Users');

router.get('/', checkAuth, userControllers.getAll);
router.get('/:id', checkAuth, userControllers.getById);
router.post('/login', userControllers.login);
router.post('/signup', userControllers.signup);
router.delete('/:id', checkAuth, userControllers.deleteById);

module.exports = router;