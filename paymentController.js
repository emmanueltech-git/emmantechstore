const axios = require("axios");
const Order = require("../models/Order");

// INITIATE PAYMENT
exports.initiatePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.body.email,
        amount: order.totalAmount * 100, // kobo conversion
        reference: `ORD-${Date.now()}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    order.paymentReference = response.data.data.reference;
    await order.save();

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data.data;

    if (paymentData.status === "success") {
      const order = await Order.findOne({ paymentReference: reference });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.status = "paid";
      await order.save();

      return res.json({
        message: "Payment verified successfully",
        order,
      });
    }

    res.status(400).json({ message: "Payment not successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};