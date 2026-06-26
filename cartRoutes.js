const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  addToCart,
  getCart,
  clearCart,
} = require("../controllers/cartController");

router.use(protect);

router.post("/", addToCart);
router.get("/", getCart);
router.delete("/", clearCart);

module.exports = router;