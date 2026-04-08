const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const SubCategoryModel = require('../models/subCategoryModel');
const BrandModel = require('../models/brandModel');
const ApiFeatures = require('../utils/apiFeatures');

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

// Create Product (unchanged)
exports.createProduct = asyncHandler(async (req, res, next) => {
    const {
        title,
        description,
        price,
        priceAfterDiscount,
        quantity,
        category,
        subCategory,
        brand,
    } = req.body;

    // check category exists
    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
        return next(new ApiError("Category not found", 404));
    }

    // check subcategories exist
    if (subCategory && subCategory.length > 0) {
        const subCategories = await SubCategoryModel.find({
            _id: { $in: subCategory, $exists: true },
        });

        if (subCategories.length !== subCategory.length) {
            return next(new ApiError("Invalid subCategories", 400));
        }
    }

    // check brand exists
    if (brand) {
        const brandExists = await BrandModel.findById(brand);
        if (!brandExists) {
            return next(new ApiError("Brand not found", 404));
        }
    }

    const product = await ProductModel.create({
        ...req.body,
        slug: slugify(title, { lower: true }),
    });

    res.status(201).json({ data: product });
});

// Get All Products 
exports.getAllProducts = asyncHandler(async (req, res) => {
    // Get total count for pagination before applying pagination
    const documentsCount = await ProductModel.countDocuments();

    // Initialize ApiFeatures
    const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
        .filter()
        .search('Products')
        .sort()
        .limitFields()
        .paginate(documentsCount);

    // Execute query with population
    const products = await apiFeatures.mongooseQuery
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .populate('brand', 'name');

    res.status(200).json({
        results: products.length,
        pagination: apiFeatures.paginationResult,
        data: products,
    });
});

// Get Single Product
exports.getProductById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const product = await ProductModel.findById(id)
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .populate('brand', 'name');

    if (!product) {
        return next(new ApiError("Product not found", 404));
    }

    res.status(200).json({ data: product });
});

// Update Product 
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (req.body.title) {
        req.body.slug = slugify(req.body.title, { lower: true });
    }

    const product = await ProductModel.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    )
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .populate('brand', 'name');

    if (!product) {
        return next(new ApiError("Product not found", 404));
    }

    res.status(200).json({ data: product });
});

// Delete Product 
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
        return next(new ApiError("Product not found", 404));
    }

    res.status(200).json({ message: "Product deleted successfully" });
});