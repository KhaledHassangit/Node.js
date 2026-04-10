const express = require("express");
const {
    createCategory,
    getAllCategories,
    getCateogoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryService");

const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
} = require("../validators/categoryValidator");
const subcategoryRoute = require('./subCategoryRoute');
const uploadCategoryImage = require("../controllers/categoryService")
const reSizeImage = require("../controllers/categoryService")
const router = express.Router();

//  GET ALL & CREATE
router
    .route("/")
    .get(getAllCategories)
    .post(uploadCategoryImage, reSizeImage,
        createCategoryValidator, createCategory);


//  ID routes
router
    .route("/:id")
    .get(getCategoryValidator, getCateogoryById)
    .put(uploadCategoryImage, reSizeImage, updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);


router.use("/:categoryId/subcategories", subcategoryRoute);

module.exports = router;