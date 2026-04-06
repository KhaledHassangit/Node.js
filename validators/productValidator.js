const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

//  Get Product
exports.getProductValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware,
];

//  Create Product
exports.createProductValidator = [
    check("title")
        .notEmpty()
        .withMessage("Product title required")
        .isLength({ min: 3 })
        .withMessage("Too short product title")
        .isLength({ max: 100 })
        .withMessage("Too long product title"),

    check("description")
        .notEmpty()
        .withMessage("Product description required")
        .isLength({ min: 20 })
        .withMessage("Too short description"),

    check("price")
        .notEmpty()
        .withMessage("Product price required")
        .isNumeric()
        .withMessage("Price must be number"),

    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("Must be number")
        .custom((val, { req }) => {
            if (val > req.body.price) {
                throw new Error("Discount price must be lower than price");
            }
            return true;
        }),

    check("quantity")
        .notEmpty()
        .withMessage("Quantity required")
        .isNumeric()
        .withMessage("Quantity must be number"),

    check("imageCover")
        .notEmpty()
        .withMessage("Image cover required"),

    check("category")
        .notEmpty()
        .withMessage("Category required")
        .isMongoId()
        .withMessage("Invalid category ID"),

    check("subCategory")
        .optional()
        .isArray()
        .withMessage("SubCategory must be array"),

    check("subCategory.*")
        .optional()
        .isMongoId()
        .withMessage("Invalid SubCategory ID"),

    check("brand")
        .optional()
        .isMongoId()
        .withMessage("Invalid brand ID"),

    check("ratingsAverage")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("Ratings must be between 0 and 5"),

    validatorMiddleware,
];

//  Update Product
exports.updateProductValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),

    check("title")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Too short title"),

    check("priceAfterDiscount")
        .optional()
        .custom((val, { req }) => {
            if (req.body.price && val > req.body.price) {
                throw new Error("Discount must be lower than price");
            }
            return true;
        }),

    check("category")
        .optional()
        .isMongoId()
        .withMessage("Invalid category ID"),

    check("subCategory")
        .optional()
        .isArray(),

    check("subCategory.*")
        .optional()
        .isMongoId(),

    check("brand")
        .optional()
        .isMongoId(),

    validatorMiddleware,
];

//  Delete Product
exports.deleteProductValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware,
];