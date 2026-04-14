const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail");

// ================= CREATE TOKEN =================
exports.createToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// ================= SIGN UP =================
exports.singUp = asyncHandler(async (req, res, next) => {
    delete req.body.passwordConfirm;

    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    const token = createToken({ userId: user._id });

    res.status(201).json({
        status: 'success',
        data: { user, token }
    });
});

// ================= LOGIN =================
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new ApiError(401, 'Incorrect email or password'));
    }

    const token = createToken({ userId: user._id });

    user.password = undefined;

    res.status(200).json({
        status: 'success',
        data: { user, token },
    });
});

// ================= PROTECT =================
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError(401, 'You are not logged in!'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const currentUser = await UserModel.findById(decoded.userId);

    if (!currentUser) {
        return next(new ApiError(401, 'User no longer exists'));
    }

    if (currentUser.passwordChangedAt) {
        const changedTime = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);

        if (decoded.iat < changedTime) {
            return next(new ApiError(401, 'Password changed recently. Login again.'));
        }
    }

    req.user = currentUser;
    next();
});

// ================= RESTRICT =================
exports.restrictTo = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, 'Not allowed'));
        }
        next();
    });
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
        return next(new ApiError(404, 'No user with this email'));
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    user.passwordResetCode = hashedCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;

    await user.save();

    await sendEmail({
        email: user.email,
        subject: 'Password reset code',
        message: `Your reset code: ${resetCode}`
    });

    res.status(200).json({
        status: 'success',
        message: 'Reset code sent'
    });
});

// ================= VERIFY RESET CODE =================
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    const { resetCode } = req.body;

    const hashedCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    const user = await UserModel.findOne({
        passwordResetCode: hashedCode,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ApiError(400, 'Invalid or expired code'));
    }

    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Code verified'
    });
});

// ================= RESET PASSWORD =================
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { email, newPassword } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    if (!user.passwordResetVerified) {
        return next(new ApiError(400, 'Reset code not verified'));
    }

    // update password
    user.password = newPassword;

    // clear reset fields
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // generate new token
    const token = createToken({ userId: user._id });

    res.status(200).json({
        status: 'success',
        message: 'Password reset successfully',
        token
    });
});