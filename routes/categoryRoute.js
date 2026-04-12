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

const subcategoryRoute = require('./subCategoryRoute');

const router = express.Router();

// GET ALL & CREATE
router
    .route("/")
    .get(getAllCategories)
    .post(
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
        uploadCategoryImage,
        reSizeCategoryImage,
        updateCategoryValidator,
        updateCategory
    )
    .delete(deleteCategoryValidator, deleteCategory);

router.use("/:categoryId/subcategories", subcategoryRoute);

module.exports = router;