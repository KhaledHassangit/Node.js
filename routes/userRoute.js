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


// GET ALL & CREATE
router
    .route("/")
    .get(getAllUsers)
    .post(
        uploadUserImage,
        resizeUserImage,
        createUserValidator,
        createUser
    );


// ==========================
// CHANGE PASSWORD
// ==========================
router.patch(
    "/changePassword/:id",
    changeUserPasswordValidator,
    changeUserPassword
);


// ==========================
//  ID ROUTES
// ==========================
router
    .route("/:id")
    .get(getUserValidator, getUserById)
    .put(
        uploadUserImage,
        resizeUserImage,
        updateUserValidator,
        updateUser
    )
    .delete(deleteUserValidator, deleteUser);


module.exports = router;