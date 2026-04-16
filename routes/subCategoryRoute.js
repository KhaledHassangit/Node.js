const express = require("express");

const {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    createFilterObj,
} = require("../controllers/subCategoryService");

const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require("../validators/subCategoryValidator");
const authService = require("../controllers/authService");

const router = express.Router({ mergeParams: true }); //  to access parent route params (categoryId)

//  GET ALL & CREATE
router
    .route("/")
    .get(createFilterObj, getAllSubCategories)
    .post(authService.protect,
        authService.restrictTo("admin"),
        setCategoryIdToBody,
        createSubCategoryValidator, createSubCategory);

//  ID routes
router
    .route("/:id")
    .get(getSubCategoryValidator, getSubCategoryById)
    .put(authService.protect,
        authService.restrictTo("admin"),
        updateSubCategoryValidator, updateSubCategory)
    .delete(authService.protect,
        authService.restrictTo("admin"),
        deleteSubCategoryValidator, deleteSubCategory);


module.exports = router;