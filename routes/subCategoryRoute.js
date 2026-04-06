const express = require("express");

const {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
} = require("../controllers/subCategoryService");

const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require("../validators/subCategoryValidator");

const router = express.Router({ mergeParams: true }); //  to access parent route params (categoryId)

//  GET ALL & CREATE
router
    .route("/")
    .get(getAllSubCategories)
    .post(createSubCategoryValidator, createSubCategory);

//  ID routes
router
    .route("/:id")
    .get(getSubCategoryValidator, getSubCategoryById)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory);


module.exports = router;