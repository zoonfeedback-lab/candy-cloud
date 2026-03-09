const express = require("express");
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct } = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);

module.exports = router;
