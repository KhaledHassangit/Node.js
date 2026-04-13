const express = require("express");

const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
    reSizeBrandImage,   
    uploadBrandImage,
} = require("../controllers/brandService");

const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require("../validators/brandValidator");
const authService = require("../controllers/authService");

const router = express.Router();

//  GET ALL & CREATE
router
    .route("/")
    .get(getAllBrands)
    .post(authService.protect,
        authService.restrictTo("admin"),
        ploadBrandImage, reSizeBrandImage, createBrandValidator, createBrand);

//  ID routes
router
    .route("/:id")
    .get(getBrandValidator, getBrandById)
    .put(authService.protect,
        authService.restrictTo("admin"),
        uploadBrandImage, reSizeBrandImage, updateBrandValidator, updateBrand)
    .delete(authService.protect,
        authService.restrictTo("admin"),
        deleteBrandValidator, deleteBrand);

module.exports = router;