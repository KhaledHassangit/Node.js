const express = require("express");

const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
    reSizeImage,
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
    .post(uploadBrandImage, reSizeImage, createBrandValidator, createBrand);

//  ID routes
router
    .route("/:id")
    .get(getBrandValidator, getBrandById)
    .put(uploadBrandImage, reSizeImage, updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;