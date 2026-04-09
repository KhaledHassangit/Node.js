const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        unique: [true, 'Product title must be unique'],
        minlength: [3, 'Product title must be at least 3 characters long'],
        maxlength: [100, 'Product title must be at most 32 characters long'],
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [20, 'Product description must be at least 20 characters long'],
        maxlength: [2000, 'Product description must be at most 2000 characters long'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Product price must be a positive number'],
    },
    priceAfterDiscount: {
        type: Number,
        min: [0, 'Product price after discount must be a positive number'],
    },
    availableColors: [String],
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: [0, 'Product quantity must be a positive number'],
    },
    sold: {
        type: Number,
        default: 0,
    },
    imageCover: {
        type: String,
        required: [true, 'Product cover image is required'],
    },
    images: {
        type: [String],
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required'],
    },
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
    },
    subCategory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
    }],
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    ratingsAverage: {
        type: Number,
        min: [0, 'Total ratings must be a positive number'],
        max: [5, 'Total ratings must be at most 5'],
    },
    views: {
        type: Number,
        default: 0,
    },

}, { timestamps: true })


const productModel = mongoose.model("Product", productSchema)

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name -_id',
    });
    next();
});

module.exports = productModel
