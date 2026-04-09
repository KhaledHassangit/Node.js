const BrandModel = require('../models/brandModel');
const factory = require('../utils/handlerFactory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

// @desc    Create Brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    req.body.slug = slugify(name, { lower: true });

    return factory.createOne(BrandModel)(req, res, next);
});

// @desc    Get All Brands
// @route   GET /api/v1/brands
// @access  Public
exports.getAllBrands = factory.getAll(BrandModel, 'Brand');

// @desc    Get Single Brand
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrandById = factory.getOne(BrandModel);

// @desc    Update Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    if (name) {
        req.body.slug = slugify(name, { lower: true });
    }

    return factory.updateOne(BrandModel)(req, res, next);
});

// @desc    Delete Brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(BrandModel);