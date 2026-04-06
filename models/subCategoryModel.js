const mongoose = require('mongoose');


const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, 'SubCategory must be unique'],
        minlength: [2, 'To sh       ort SubCategory name'],
        maxlength: [32, 'To long SubCategory name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'SubCategory must belong to parent category'],
    },
}, { timestamps: true });


const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategoryModel;