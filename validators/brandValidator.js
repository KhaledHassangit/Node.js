const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

// ✅ Get Brand
exports.getBrandValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware,
];

// ✅ Create Brand
exports.createBrandValidator = [
    check("name")
        .notEmpty()
        .withMessage("Brand name required")
        .isLength({ min: 3 })
        .withMessage("Too short brand name")
        .isLength({ max: 32 })
        .withMessage("Too long brand name"),

    check("image")
        .optional()
        .isString()
        .withMessage("Image must be string"),

    validatorMiddleware,
];

// ✅ Update Brand
exports.updateBrandValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),

    check("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Too short brand name")
        .isLength({ max: 32 })
        .withMessage("Too long brand name"),

    check("image")
        .optional()
        .isString()
        .withMessage("Image must be string"),

    validatorMiddleware,
];

// ✅ Delete Brand
exports.deleteBrandValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware,
];