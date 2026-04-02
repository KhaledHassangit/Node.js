const mongoose = require('mongoose');


// Define Category schema
const categorySchema = new mongoose.Schema({
    name: String, 
});

// Create model from schema
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel

