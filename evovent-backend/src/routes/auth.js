const express = require('express')
const { auth } = require('../controllers/authController');


const router = express.Router();

router.post('/', auth);

module.exports = router;