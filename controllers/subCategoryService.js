const SubCategoryModel = require('../models/subCategoryModel');
const CategoryModel = require('../models/categoryModel');
const factory = require('../utils/handlerFactory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

// Middleware to set categoryId to body for nested routes
exports.setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category && req.params.categoryId) {
        req.body.category = req.params.categoryId;
    }
    next();
};

// Middleware to create filter object for nested routes
exports.createFilterObject = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) {
        filterObject = { category: req.params.categoryId };
    }
    req.filterObj = filterObject;
    next();
};

// @desc    Create SubCategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
    const { name, category } = req.body;

    // Check if parent category exists
    const parentCategory = await CategoryModel.findById(category);
    if (!parentCategory) {
        return next(new ApiError("Parent category not found", 404));
    }

    // Add slug
    req.body.slug = slugify(name, { lower: true });

    return factory.createOne(SubCategoryModel)(req, res, next);
});

// @desc    Get All SubCategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getAllSubCategories = factory.getAll(
    SubCategoryModel,
    'SubCategory',
    { path: 'category', select: 'name' }
);

// @desc    Get Single SubCategory
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategoryById = factory.getOne(
    SubCategoryModel,
    { path: 'category', select: 'name' }
);

// @desc    Update SubCategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { name, category } = req.body;

    // Check if parent category exists when updating
    if (category) {
        const parentCategory = await CategoryModel.findById(category);
        if (!parentCategory) {
            return next(new ApiError("Parent category not found", 404));
        }
    }

    // Add slug if name is being updated
    if (name) {
        req.body.slug = slugify(name, { lower: true });
    }

    return factory.updateOne(SubCategoryModel)(req, res, next);
});

// @desc    Delete SubCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);