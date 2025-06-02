const express = require('express');
const { register, login, authenticateToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/auth', login);
router.use(authenticateToken);

module.exports = router;
