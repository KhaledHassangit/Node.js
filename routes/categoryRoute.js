const express = require('express');
const { createCategory, getAllCategories, getCateogoryById, updateCategory, deleteCategory } = require('../controllers/categoryService');

const router = express.Router();

// router.post("/", createCategory);
// router.get("/", getAllCategories);

router.route("/").get(getAllCategories).post(createCategory);
router.route("/:id").get(getCateogoryById).put(updateCategory).delete(deleteCategory);


module.exports = router;