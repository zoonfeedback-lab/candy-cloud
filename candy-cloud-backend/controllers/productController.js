const Product = require("../models/Product");

// @desc    Get all products (with optional category filter)
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
    try {
        const filter = { isActive: true };
        if (req.query.category) {
            filter.category = req.query.category.toLowerCase();
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            return next(new Error("Product not found"));
        }
        res.json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product (admin)
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            res.status(404);
            return next(new Error("Product not found"));
        }
        res.json({ success: true, product });
    } catch (error) {
        next(error);
    }
};
