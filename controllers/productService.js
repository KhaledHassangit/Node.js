const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const SubCategoryModel = require('../models/subCategoryModel');
const BrandModel = require('../models/brandModel');
const factory = require('../utils/handlerFactory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res, next) => {
    const { title, category, subCategory, brand } = req.body;

    // Check category exists
    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
        return next(new ApiError("Category not found", 404));
    }

    // Check subcategories exist
    if (subCategory && subCategory.length > 0) {
        const subCategories = await SubCategoryModel.find({
            _id: { $in: subCategory, $exists: true },
        });
        if (subCategories.length !== subCategory.length) {
            return next(new ApiError("Invalid subCategories", 400));
        }
    }

    // Check brand exists
    if (brand) {
        const brandExists = await BrandModel.findById(brand);
        if (!brandExists) {
            return next(new ApiError("Brand not found", 404));
        }
    }

    // Add slug
    req.body.slug = slugify(title, { lower: true });

    // Use factory create
    return factory.createOne(ProductModel)(req, res, next);
});

// @desc    Get All Products
// @route   GET /api/v1/products
// @access  Public
exports.getAllProducts = factory.getAll(
    ProductModel,
    'Products',
    [
        { path: 'category', select: 'name' },
        { path: 'subCategory', select: 'name' },
        { path: 'brand', select: 'name' }
    ]
);

// @desc    Get Single Product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProductById = factory.getOne(
    ProductModel,
    [
        { path: 'category', select: 'name' },
        { path: 'subCategory', select: 'name' },
        { path: 'brand', select: 'name' }
    ]
);

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    // Add slug if title is being updated
    if (req.body.title) {
        req.body.slug = slugify(req.body.title, { lower: true });
    }

    return factory.updateOne(ProductModel)(req, res, next);
});

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(ProductModel);