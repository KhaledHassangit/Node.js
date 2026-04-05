const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

//  Get Category
exports.getCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware,
];

//  Create Category
exports.createCategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("Category required")
        .isLength({ min: 3 })
        .withMessage("Too short category name")
        .isLength({ max: 32 })
        .withMessage("Too long category name"),
    validatorMiddleware,
];

//  Update Category
exports.updateCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),
    check("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Too short category name")
        .isLength({ max: 32 })
        .withMessage("Too long category name"),
    validatorMiddleware,
];

//  Delete Category
exports.deleteCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid ID"),
    validatorMiddleware,
];