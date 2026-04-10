const CategoryModel = require('../models/categoryModel');
const factory = require('../utils/handlerFactory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
import { v4 as uuidv4 } from 'uuid';
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleWare');




// Image Proccessing Middleware
exports.reSizeImage = asyncHandler(async (req, res, next) => {
    if (!req.file) return next();

    const filename = `category-${uuidv4()}-${Date.now()}.webp`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('webp')
        .webp({ quality: 90 })
        .toFile(`uploads/categories/${filename}`);
    // Save image in req.body to save it in DB 
    req.body.image = filename;

    next();

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