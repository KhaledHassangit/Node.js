const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

// Create new category
exports.createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const category = await CategoryModel.create({
        name,
        slug: slugify(name, { lower: true })
    });

    res.status(200).json({ data: category });
});

// Get All Categories - Refactored with ApiFeatures
exports.getAllCategories = asyncHandler(async (req, res) => {
    // Get total count for pagination
    const documentsCount = await CategoryModel.countDocuments();
    
    // Initialize ApiFeatures
    const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
        .filter()
        .search() // Will use default search on 'name' field
        .sort()
        .limitFields()
        .paginate(documentsCount);
    
    // Execute query
    const categories = await apiFeatures.mongooseQuery;
    
    res.status(200).json({
        results: categories.length,
        pagination: apiFeatures.paginationResult,
        data: categories,
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