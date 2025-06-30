import Product from "../models/Product.js";
import { getIO } from "../config/websocket.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, manufacturer, category, images, isActive } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      manufacturer,
      category,
      images,
      isActive,
    });

    getIO().emit("productCreated", { message: "Tạo sản phẩm thành công!" });
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    getIO().emit("productUpdated", { message: "Cập nhật sản phẩm thành công!" });
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    getIO().emit("productDeleted", { message: "Xóa sản phẩm thành công!" });
    return res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};
