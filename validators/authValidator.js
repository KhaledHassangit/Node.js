const { check } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const UserModel = require('../models/userModel');

exports.signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (val) => {
            const user = await UserModel.findOne({ email: val });
            if (user) {
                return Promise.reject(new Error('Email already in use'));
            }
        }),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation required')
        .custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new Error('Password confirmation incorrect');
            }
            return true;
        }),

    validatorMiddleware
];
exports.loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),

    
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    ,
    validatorMiddleware
];