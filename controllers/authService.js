const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const createToken = (payload) => {
    jwt.sign(
        { userId: payload },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

exports.singUp = asyncHandler(async (req, res, next) => {

    // remove passwordConfirm
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


exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check if user exists + include password
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            message: 'Incorrect email or password',
        });
    }

    // 2) compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({
            message: 'Incorrect email or password',
        });
    }

    // 3) generate token
    const token = createToken({ userId: user._id });

    // 4) remove password from response
    user.password = undefined;

    res.status(200).json({
        status: 'success',
        data: { user, token },
    });
});