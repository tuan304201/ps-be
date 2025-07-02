import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { $set: req.body }, { new: true, upsert: true });
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
