const CategoryModel = require('../models/categoryModel');
const factory = require('../utils/handlerFactory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const multer = require('multer')
const upload = multer({ dest: "uploads/categories" })
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../utils/apiError';

// diskStorage engine for multer
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/categories");
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const fiilename = `category-${uuidv4()}-${Date.now()}.${ext}`;
        cb(null, fiilename);
    },
})
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new ApiError("Not an image! Please upload only images.", 400), false);
    }
}
exports.uploadCategoryImage = upload.single({ storage: multerStorage, fileFilter: multerFilter })

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