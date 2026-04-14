const express = require('express');
const { singUp, login, forgotPassword, resetPassword, verifyResetCode } = require('../controllers/authService');
const { signupValidator, loginValidator } = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', signupValidator, singUp);
router.post('/login', loginValidator, login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password ', resetPassword);


module.exports = router;