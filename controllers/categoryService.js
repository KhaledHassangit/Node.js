const CategoryModel = require('../models/categoryModel');
const factory = require('../utils/handlerFactory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const { resizeSingleImage } = require('../middlewares/resizeImageMiddleware');




// Image Proccessing Middleware
exports.reSizeCategoryImage = resizeSingleImage({
    folder: 'categories',
    width: 600,
    height: 600,
    quality: 90,
});

exports.uploadCategoryImage = uploadSingleImage('image')


// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    req.body.slug = slugify(name, { lower: true });

    return factory.createOne(CategoryModel)(req, res, next);
});



// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = factory.getAll(CategoryModel, 'Category');



// @desc    Get Single Category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategoryById = factory.getOne(CategoryModel);



// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    if (name) {
        req.body.slug = slugify(name, { lower: true });
    }

    return factory.updateOne(CategoryModel)(req, res, next);
});


// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(CategoryModel);