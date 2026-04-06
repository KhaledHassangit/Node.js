const BrandModel = require('../models/brandModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('./utils/apiError');

//  Create Brand
exports.createBrand = asyncHandler(async (req, res) => {
    const { name, image } = req.body

    const brand = await BrandModel.create({
        name,
        slug: slugify(name, { lower: true }),
        image,
    });

    res.status(201).json({ data: brand });
});

//  Get All Brands
exports.getAllBrands = asyncHandler(async (req, res) => {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const brands = await BrandModel.find().skip(skip).limit(limit);

    res.status(200).json({
        results: brands.length,
        page,
        data: brands,
    });
});

//  Get Single Brand
exports.getBrandById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const brand = await BrandModel.findById(id);

    if (!brand) {
        return next(new ApiError("Brand not found", 404));
    }

    res.status(200).json({ data: brand });
});

//  Update Brand
exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, image } = req.body;

    const brand = await BrandModel.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug: name ? slugify(name, { lower: true }) : undefined,
            image,
        },
        { new: true }
    );

    if (!brand) {
        return next(new ApiError("Brand not found", 404));
    }

    res.status(200).json({ data: brand });
});

//  Delete Brand
exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const brand = await BrandModel.findByIdAndDelete(id);

    if (!brand) {
        return next(new ApiError("Brand not found", 404));
    }

    res.status(200).json({ message: "Brand deleted successfully" });
});