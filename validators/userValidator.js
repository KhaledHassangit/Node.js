const { check } = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const UserModel = require('../models/userModel');


// ==========================
//  GET USER
// ==========================
exports.getUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User id format'),
    validatorMiddleware,
];


// ==========================
//  CREATE USER
// ==========================
exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('User name is required')
        .isLength({ min: 2 })
        .withMessage('Too short user name'),

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
        .withMessage('Confirm password is required')
        .custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new Error('Password confirmation incorrect');
            }
            return true;
        }),

    check('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Invalid role'),

    check('phoneNumber')
        .optional()
        .isMobilePhone(["ar-EG"])
        .withMessage('Invalid phone number'),

    check('profileImg')
        .optional(),

    validatorMiddleware,
];


// ==========================
//  UPDATE USER
// ==========================
exports.updateUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User id format'),

    check('name')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Too short user name'),

    check('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format'),

    check('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Invalid role'),

    check('phoneNumber')
        .optional()
        .isMobilePhone('any')
        .withMessage('Invalid phone number'),

    check('password')
        .not()
        .exists()
        .withMessage('You cannot update password from this route'),

    validatorMiddleware,
];


// ==========================
// 🔹 DELETE USER
// ==========================
exports.deleteUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User id format'),
    validatorMiddleware,
];


// ==========================
//  CHANGE PASSWORD
// ==========================

exports.changeUserPasswordValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid User id format')
        .custom(async (val) => {
            const user = await UserModel.findById(val);
            if (!user) {
                throw new Error('User not found');
            }
            return true;
        }),

    check('currentPassword')
        .notEmpty()
        .withMessage('Current password is required')
        .custom(async (val, { req }) => {
            const user = await UserModel.findById(req.params.id).select('+password');

            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = await bcrypt.compare(val, user.password);

            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }

            return true;
        }),

    check('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .custom((val, { req }) => {
            if (val === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        }),

    check('confirmNewPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((val, { req }) => {
            if (val !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    validatorMiddleware,
];