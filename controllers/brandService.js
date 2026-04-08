const BrandModel = require('../models/brandModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

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

// Get All Brands - Refactored with ApiFeatures
exports.getAllBrands = asyncHandler(async (req, res) => {
    // Get total count for pagination
    const documentsCount = await BrandModel.countDocuments();

    // Initialize ApiFeatures
    const apiFeatures = new ApiFeatures(BrandModel.find(), req.query)
        .filter()
        .search() // Will use default search on 'name' field
        .sort()
        .limitFields()
        .paginate(documentsCount);

    // Execute query
    const brands = await apiFeatures.mongooseQuery;

    res.status(200).json({
        results: brands.length,
        pagination: apiFeatures.paginationResult,
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