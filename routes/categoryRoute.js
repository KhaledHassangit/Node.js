const express = require("express");

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    reSizeCategoryImage
} = require("../controllers/categoryService");

const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
} = require("../validators/categoryValidator");
const authService = require("../controllers/authService");
const subcategoryRoute = require('./subCategoryRoute');

const router = express.Router();

// GET ALL & CREATE
router
    .route("/")
    .get(getAllCategories)
    .post(
        authService.protect,
        authService.restrictTo("admin"),
        uploadCategoryImage,
        reSizeCategoryImage,
        createCategoryValidator,
        createCategory
    );

// ID routes
router
    .route("/:id")
    .get(getCategoryValidator, getCategoryById)
    .put(
        authService.protect,
        authService.restrictTo("admin"),
        uploadCategoryImage,
        reSizeCategoryImage,
        updateCategoryValidator,
        updateCategory
    )
    .delete(authService.protect,
        authService.restrictTo("admin"),
        deleteCategoryValidator, deleteCategory);

router.use("/:categoryId/subcategories", subcategoryRoute);

module.exports = router;