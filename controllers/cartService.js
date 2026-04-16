const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const ProductModel = require('../models/productModel');
const CouponModel = require('../models/couponModel');
const CartModel = require('../models/cartModel');

const calcTotalCartPrice = (cart) => {
    const totalPrice = cart.cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;

    return totalPrice;
};

// @desc    Add product to cart
// @route   POST /api/v1/cart
// @access  Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
        return next(new ApiError('Product not found', 404));
    }

    let cart = await CartModel.findOne({ user: req.user._id });

    if (!cart) {
        cart = await CartModel.create({
            user: req.user._id,
            cartItems: [
                {
                    product: productId,
                    color,
                    price: product.price,
                },
            ],
        });
    } else {
        const productIndex = cart.cartItems.findIndex(
            (item) =>
                item.product.toString() === productId.toString() &&
                item.color === color
        );

        if (productIndex > -1) {
            cart.cartItems[productIndex].quantity += 1;
        } else {
            cart.cartItems.push({
                product: productId,
                color,
                price: product.price,
            });
        }
    }

    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await CartModel.findOne({ user: req.user._id });

    if (!cart) {
        return next(
            new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
        );
    }

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await CartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.itemId } },
        },
        { new: true }
    );

    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }

    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    Clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
    await CartModel.findOneAndDelete({ user: req.user._id });
    res.status(204).send();
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;

    const cart = await CartModel.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError(`There is no cart for user ${req.user._id}`, 404));
    }

    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex > -1) {
        if (quantity <= 0) {
            cart.cartItems.splice(itemIndex, 1);
        } else {
            cart.cartItems[itemIndex].quantity = quantity;
        }
    } else {
        return next(
            new ApiError(`No item found for this id: ${req.params.itemId}`, 404)
        );
    }

    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await CouponModel.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() },
    });

    if (!coupon) {
        return next(new ApiError('Coupon is invalid or expired', 400));
    }

    const cart = await CartModel.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }

    const totalPrice = cart.totalCartPrice;

    const totalPriceAfterDiscount = Number(
        (
            totalPrice -
            (totalPrice * coupon.discount) / 100
        ).toFixed(2)
    );

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});