const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

//  Get SubCategory
exports.getSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware,
];

//  Create SubCategory
exports.createSubCategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("SubCategory required")
        .isLength({ min: 2 })
        .withMessage("Too short SubCategory name")
        .isLength({ max: 32 })
        .withMessage("Too long SubCategory name"),

    check("category")
        .notEmpty()
        .withMessage("SubCategory must belong to category")
        .isMongoId()
        .withMessage("Invalid category ID"),

    validatorMiddleware,
];

//  Update SubCategory
exports.updateSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),

    check("name")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Too short SubCategory name")
        .isLength({ max: 32 })
        .withMessage("Too long SubCategory name"),

    check("category")
        .optional()
        .isMongoId()
        .withMessage("Invalid category ID"),

    validatorMiddleware,
];

//  Delete SubCategory
exports.deleteSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware,
];