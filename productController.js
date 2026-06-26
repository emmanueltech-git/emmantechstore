const Product = require("../models/Product");

// CREATE PRODUCT (ADMIN ONLY)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL PRODUCTS (PUBLIC)
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};