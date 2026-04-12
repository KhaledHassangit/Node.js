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

const router = express.Router();

//  GET ALL & CREATE
router
    .route("/")
    .get(getAllBrands)
    .post(uploadBrandImage, reSizeBrandImage, createBrandValidator, createBrand);

//  ID routes
router
    .route("/:id")
    .get(getBrandValidator, getBrandById)
    .put(uploadBrandImage, reSizeBrandImage, updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;