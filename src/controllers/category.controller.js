import Category from "../models/Category.js";
import { getIO } from "../config/websocket.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    await Category.create({ name, description });

    getIO().emit("categoryCreated", { message: "Tạo category thành công!" });
    return res.status(201).json({ message: "Tạo thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// 🟡 Cập nhật Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }

    getIO().emit("categoryUpdated", { message: "Sửa category thành công!" });
    res.json({ message: "Sửa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }

    getIO().emit("categoryDeleted", { message: "Xoá category thành công!" });
    res.json({ message: "Xóa category thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
