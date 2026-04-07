const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

// Create new category
exports.createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const category = await CategoryModel.create({
        name,
        slug: slugify(name, { lower: true })
    });

    res.status(200).json({ data: category });
});

// Get all categories
exports.getAllCategories = asyncHandler(async (req, res) => {
    // Pagenation
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const categories = await CategoryModel.find().skip(skip).limit(limit);

    res.status(200).json({
        results: categories.length,
        page,
        data: categories
    });
});



// Get single category
exports.getCateogoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const category = await CategoryModel.findById(id)

    if (!category) {
        return next(new ApiError("Category not found", 404));
    }
    res.status(201).json({ data: category })
})


// Update category

exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await CategoryModel.findOneAndUpdate({ _id: id }, {
        name,
        slug: slugify(name, { lower: true })
    }, { new: true });  // { new: true } returns the updated document   
    if (!category) {
        return next(new ApiError("Category not found", 404));
    }
    res.status(201).json({ data: category })
})

// Delete category
exports.deleteCategory = asyncHandler(async (req, res,) => {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
        return next(new ApiError("Category not found", 404));
    }
    res.status(201).json({ message: "Category deleted successfully" })
})