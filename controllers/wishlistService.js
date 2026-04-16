const UserModel = require('../models/userModel');
const factory = require('../utils/handlerFactory');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');



exports.addToWishlist = asyncHandler(async (req, res, next) => {
    const user = await UserMode.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: req.params.productId }
    }, {
        // Retursn the updated document (user)
        new: true
    });
    res.status(200).json({
        data: user.wishlist, status: 'success',
        message: 'Product added to wishlist successfully'
    });


});
