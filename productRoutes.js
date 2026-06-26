const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createProduct,
  getProducts,
} = require("../controllers/productController");

// PUBLIC
router.get("/", getProducts);

// ADMIN ONLY
router.post("/", protect, authorizeRoles("admin"), createProduct);

module.exports = router;