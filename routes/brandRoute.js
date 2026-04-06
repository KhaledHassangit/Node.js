const express = require("express");

const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} = require("../controllers/brandService");

const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require("../validators/brandValidator");

const router = express.Router();

// ✅ GET ALL & CREATE
router
    .route("/")
    .get(getAllBrands)
    .post(createBrandValidator, createBrand);

// ✅ ID routes
router
    .route("/:id")
    .get(getBrandValidator, getBrandById)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;