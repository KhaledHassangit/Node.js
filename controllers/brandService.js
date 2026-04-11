const BrandModel = require('../models/brandModel');
const factory = require('../utils/handlerFactory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleWare');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { resizeSingleImage } = require('../middlewares/resizeImageMiddleware');


// Image Proccessing Middleware
exports.reSizeBrandImage = resizeSingleImage({
    folder: 'brands',
    width: 600,
    height: 600,
    quality: 95,
});

exports.uploadBrandImage = uploadSingleImage('image')

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