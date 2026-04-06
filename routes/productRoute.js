const express = require("express");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
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
    .post(createProductValidator, createProduct);

//  ID routes
router
    .route("/:id")
    .get(getProductValidator, getProductById)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;