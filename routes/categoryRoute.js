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
const multer = require('multer')
const upload = multer({ dest: "uploads/categories" })

const router = express.Router();

//  GET ALL & CREATE
router
    .route("/")
    .get(getAllCategories)
    .post(upload.single("image"), (req, res, next) => {
        if (req.file) {
            req.body.image = req.file.path;
        } next();
    },
        createCategoryValidator, createCategory);


//  ID routes
router
    .route("/:id")
    .get(getCategoryValidator, getCateogoryById)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);


router.use("/:categoryId/subcategories", subcategoryRoute);

module.exports = router;