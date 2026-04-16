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
const authService = require("../controllers/authService");
const reviewRoute = require("./reviewRoute ");

const router = express.Router();

router.use("/:productId/reviews", reviewRoute);

//  GET ALL & CREATE
router
    .route("/")
    .get(getAllProducts)
    .post(
        authService.protect,
        authService.restrictTo("admin"),
        uploadProductImages, resizeProductImages, createProductValidator, createProduct);

//  ID routes
router
    .route("/:id")
    .get(getProductValidator, getProductById)

    .put(authService.protect,
        authService.restrictTo("admin"),
        uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
    .delete(authService.protect,
        authService.restrictTo("admin"),
        deleteProductValidator, deleteProduct);

module.exports = router;