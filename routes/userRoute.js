const express = require("express");
const router = express.Router();

// ================= CONTROLLERS =================
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserPassword,
    uploadUserImage,
    resizeUserImage,
    getLoggedUserData,
    updateLoggedUserPassword,
    deleteLoggedUserData,
    updateLoggedUserData
} = require("../controllers/userService");

// ================= VALIDATORS =================
const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
} = require("../validators/userValidator");

// ================= AUTH =================
const authService = require("../controllers/authService");

// ================= GLOBAL MIDDLEWARE =================
router.use(authService.protect);

// ================= LOGGED USER ROUTES =================
router.get("/me", getLoggedUserData, getUserById);

router.put(
    "/me/update",
    uploadUserImage,
    resizeUserImage,
    updateLoggedUserData
);

router.put("/me/change-password", updateLoggedUserPassword);

router.delete("/me/delete", deleteLoggedUserData);

// ================= ADMIN ONLY ROUTES =================
router.use(authService.restrictTo("admin"));

// GET ALL USERS & CREATE USER
router
    .route("/")
    .get(getAllUsers)
    .post(
        uploadUserImage,
        resizeUserImage,
        createUserValidator,
        createUser
    );

// ================= CHANGE PASSWORD (ADMIN) =================
router.patch(
    "/change-password/:id",
    changeUserPasswordValidator,
    changeUserPassword
);

// ================= USER BY ID =================
router
    .route("/:id")
    .get(getUserValidator, getUserById)
    .put(
        uploadUserImage,
        resizeUserImage,
        updateUserValidator,
        updateUser
    )
    .delete(
        getUserValidator,
        deleteUserValidator,
        deleteUser
    );

module.exports = router;