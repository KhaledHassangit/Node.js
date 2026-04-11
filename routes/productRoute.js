const express = require("express");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeProductImages,
} = require("../controllers/productService");

const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require("../validators/productValidator");

const router = express.Router();

//  GET ALL & CREATE
router
    .route("/")
    .get(getAllProducts)
    .post(uploadProductImages, resizeProductImages, createProductValidator, createProduct);

//  ID routes
router
    .route("/:id")
    .get(getProductValidator, getProductById)
    .put(uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;