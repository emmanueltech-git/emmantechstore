const Cart = require("../models/Cart");
const Order = require("../models/Order");

// CREATE ORDER (CHECKOUT)
exports.createOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let total = 0;

  const items = cart.items.map((i) => {
    total += i.product.price * i.quantity;

    return {
      product: i.product._id,
      quantity: i.quantity,
      price: i.product.price,
    };
  });

  const order = await Order.create({
    user: req.user.id,
    items,
    totalAmount: total,
    status: "pending",
  });

  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(201).json(order);
};