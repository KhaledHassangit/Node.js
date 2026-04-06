const mongoose = require('mongoose');


// Define Brand schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: [true, 'Brand name must be unique'],
        minlength: [3, 'Brand name must be at least 3 characters long'],
        maxlength: [32, 'Brand name must be at most 32 characters long'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image:String,
}, { timestamps: true });

// Create model from schema
const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel

