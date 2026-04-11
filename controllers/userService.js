const UserModel = require('../models/userModel');
const factory = require('../utils/handlerFactory');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const bcrypt = require("bcryptjs");

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