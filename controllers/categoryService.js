const CategoryModel = require('../models/categoryModel');

// Create new category
exports.createCategory = async (req, res) => {
    try {
        const name = req.body.name;

        const newCategory = new CategoryModel({ name });
        const doc = await newCategory.save();

        res.json(doc);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();

        res.json({
            results: categories.length,
            data: categories
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching categories',
            error: err.message
        });
    }
};