const express = require('express');

const authService = require("../controllers/authService");

const {
    addProductToWishlist,
    removeFromWishlist,
    getUserWishlist,
} = require('../controllers/wishlistService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.route('/').post(addToWishlist).get(getUserWishlist);

router.delete('/:productId', removeFromWishlist);

module.exports = router;