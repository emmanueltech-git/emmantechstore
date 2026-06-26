const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  initiatePayment,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/init/:orderId", protect, initiatePayment);
router.get("/verify/:reference", verifyPayment);

module.exports = router;