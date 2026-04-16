const ReviewModel = require('../models/reviewModel');
const factory = require('../utils/handlerFactory');
const asyncHandler = require('express-async-handler');

// Nested route
// POST /products/:productId/reviews
exports.setProductIdAndUserId = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;

    if (!req.body.user) req.body.user = req.user._id;

    next();
};
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
};

// @desc    Create Review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = factory.createOne(ReviewModel);


// @desc    Get All Reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getAllReviews = factory.getAll(ReviewModel, 'Review');


// @desc    Get Single Review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReviewById = factory.getOne(ReviewModel);


// @desc    Update Review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = factory.updateOne(ReviewModel);


// @desc    Delete Review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = factory.deleteOne(ReviewModel);