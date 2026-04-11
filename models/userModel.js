
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'User name is required'],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        slug: {
            type: String,
            lowercase: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,
        },

        passwordConfirm: {
            type: String,
            required: [true, 'Confirm password is required'],
            validate: {
                validator: function (val) {
                    return val === this.password;
                },
                message: 'Passwords are not the same!',
            },
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        active: {
            type: Boolean,
            default: true,
        },

        phoneNumber: String,

        address: String,

        profileImg: String,

        passwordChangedAt: Date,
    },
    { timestamps: true }
);
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hashSync(this.password, 12);
    next();
});
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel