const express = require("express");

const {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
    setProductIdAndUserId,
    createFilterObj
} = require("../controllers/reviewService");

const {
    getReviewValidator,
    createReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
} = require("../validators/reviewValidator");

const authService = require("../controllers/authService");

const router = express.Router({ mergeParams: true });

// GET ALL & CREATE
router
    .route("/")
    .get(createFilterObj, getAllReviews)
    .post(
        authService.protect,
        authService.allowedTo('user'),
        setProductIdAndUserId,
        createReviewValidator,
        createReview
    );

// ID routes
router
    .route("/:id")
    .get(getReviewValidator, getReviewById)
    .put(
        authService.protect,
        authService.allowedTo('user'),
        updateReviewValidator,
        updateReview
    )
    .delete(
        authService.protect,
        authService.allowedTo('user',"admin"),
        deleteReviewValidator,
        deleteReview
    );

module.exports = router;