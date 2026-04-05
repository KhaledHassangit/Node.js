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

const router = express.Router();

//  GET ALL & CREATE
router
    .route("/")
    .get(getAllCategories)
    .post(createCategoryValidator, createCategory);

//  ID routes
router
    .route("/:id")
    .get(getCategoryValidator, getCateogoryById)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;