const UserModel = require('../models/userModel');
const factory = require('../utils/handlerFactory');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const bcrypt = require("bcryptjs");
const createToken = require('./authService').createToken;
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleWare');
const { resizeSingleImage } = require('../middlewares/resizeImageMiddleware');
const ApiError = require('../utils/apiError');


//  Upload & Resize Image
exports.uploadUserImage = uploadSingleImage('profileImg');

exports.resizeUserImage = resizeSingleImage({
    folder: 'users',
    fieldName: 'profileImg',
    width: 600,
    height: 600,
    quality: 90,
});


// ==========================
//  Create User
// ==========================
// @route POST /api/v1/users
// @access Private (Admin)

exports.createUser = asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    if (name) {
        req.body.slug = slugify(name, { lower: true });
    }

    return factory.createOne(UserModel)(req, res, next);
});


// ==========================
//  Get All Users
// ==========================
// @route GET /api/v1/users
// @access Private (Admin)

exports.getAllUsers = factory.getAll(UserModel, 'Users');

// ==========================
//  Get Single User
// ==========================
// @route GET /api/v1/users/:id
// @access Private

exports.getUserById = factory.getOne(UserModel);


// ==========================
//  Update User (NO password)
// ==========================
// @route PUT /api/v1/users/:id
// @access Private

exports.updateUser = asyncHandler(async (req, res, next) => {
    const { name, slug, phoneNumber, address, profileImg, role, email } = req.body;

    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new ApiError('This route is not for password updates. Use change password route.')
        );
    }

    if (name) {
        req.body.slug = slugify(name, { lower: true });
    }

    return factory.updateOne(UserModel)(req, res, next);
});


// ==========================
//  Change Password
// ==========================
// @route PATCH /api/v1/users/changePassword/:id
// @access Private

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;

    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    res.status(200).json({
        status: 'success',
        data: user,
    });
});


// ==========================
//  Delete User
// ==========================
// @route DELETE /api/v1/users/:id
// @access Private (Admin)

exports.deleteUser = factory.deleteOne(UserModel);


// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Update user password based user payload (req.user._id)
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    // 2) Generate token
    const token = createToken(user._id);

    res.status(200).json({ data: user, token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        { new: true }
    );

    res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await UserModel.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({ status: 'Success' });
});
