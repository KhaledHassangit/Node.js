const SubCategoryModel = require('../models/subCategoryModel');
const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');


//  Create SubCategory
exports.createSubCategory = asyncHandler(async (req, res, next) => {
    if (!req.body.category && req.params.categoryId) {
        req.body.category = req.params.categoryId;
    }
    const { name, category } = req.body;

    const parentCategory = await CategoryModel.findById(category);
    if (!parentCategory) {
        return next(new ApiError("Parent category not found", 404));
    }

    const subCategory = await SubCategoryModel.create({
        name,
        slug: slugify(name, { lower: true }),
        category
    });

    res.status(201).json({ data: subCategory });
});


//  Get All SubCategories
exports.getAllSubCategories = asyncHandler(async (req, res) => {

    let filter = {};
    if (req.params.categoryId) {
        filter = { category: req.params.categoryId };
    }
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const subCategories = await SubCategoryModel
        .find(filter)
        .populate('category', 'name')
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        results: subCategories.length,
        page,
        data: subCategories
    });
});


//  Get Single SubCategory
exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const subCategory = await SubCategoryModel
        .findById(id)
        .populate('category', 'name');

    if (!subCategory) {
        return next(new ApiError("SubCategory not found", 404));
    }

    res.status(200).json({ data: subCategory });
});


//  Update SubCategory
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;

    if (category) {
        const parentCategory = await CategoryModel.findById(category);
        if (!parentCategory) {
            return next(new ApiError("Parent category not found", 404));
        }
    }

    const subCategory = await SubCategoryModel.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug: name ? slugify(name, { lower: true }) : undefined,
            category
        },
        { new: true }
    ).populate('category', 'name');

    if (!subCategory) {
        return next(new ApiError("SubCategory not found", 404));
    }

    res.status(200).json({ data: subCategory });
});


//  Delete SubCategory
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const subCategory = await SubCategoryModel.findByIdAndDelete(id);

    if (!subCategory) {
        return next(new ApiError("SubCategory not found", 404));
    }

    res.status(200).json({ message: "SubCategory deleted successfully" });
});