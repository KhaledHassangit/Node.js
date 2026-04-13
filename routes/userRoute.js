const express = require("express");

const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserPassword,
    uploadUserImage,
    resizeUserImage,
} = require("../controllers/userService");

const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
} = require("../validators/userValidator");

const router = express.Router();
const authService = require("../controllers/authService");


// GET ALL & CREATE
router
    .route("/")
    .get(authService.protect,
        authService.restrictTo("admin"),
        getAllUsers)
    .post(
        authService.protect,
        authService.restrictTo("admin"),
        uploadUserImage,
        resizeUserImage,
        createUserValidator,
        createUser
    );


// ==========================
// CHANGE PASSWORD
// ==========================
router.patch(
    authService.protect,
    "/changePassword/:id",
    changeUserPasswordValidator,
    changeUserPassword
);


// ==========================
//  ID ROUTES
// ==========================
router
    .route("/:id")
    .get(authService.protect,
        authService.restrictTo("admin"),
        getUserValidator, getUserById)
    .put(
        authService.protect,
        authService.restrictTo("admin"),
        uploadUserImage,
        resizeUserImage,
        updateUserValidator,
        updateUser
    )

    .delete(authService.protect,
        authService.restrictTo("admin"),
        getUserValidator,
        deleteUserValidator, deleteUser);


module.exports = router;