const express = require('express');
const { singUp, login } = require('../controllers/authService');
const { signupValidator, loginValidator } = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', signupValidator, singUp);
router.post('/login', loginValidator, login);

module.exports = router;