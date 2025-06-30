import UserAdmin from "../models/UserAdmin.js";
import { getIO } from "../config/websocket.js";

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await UserAdmin.find().select("-password");
    return res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const userId = req.user.userId;
    const currentUser = await UserAdmin.findById(userId);
    if (currentUser.role == "staff") {
      return res.status(403).json({ message: "Bạn không có quyền!" });
    }

    const userToUpdate = await UserAdmin.findById(id);
    if (!userToUpdate) return res.status(404).json({ message: "Tài khoản không tồn tại" });

    if (currentUser.role === "manager" && userToUpdate.role === "superadmin") {
      return res.status(403).json({ message: "Bạn không thể chỉnh sửa tài khoản SuperAdmin!" });
    }

    if (role) userToUpdate.role = role;
    await userToUpdate.save();

    getIO().emit("adminUpdated", { message: "Cập nhật thành công!" });

    res.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const userToDelete = await UserAdmin.findById(id);
    if (!userToDelete) return res.status(404).json({ message: "Tài khoản không tồn tại" });

    const userId = req.user.userId;
    const currentUser = await UserAdmin.findById(userId);
    if (currentUser.role == "staff") {
      return res.status(403).json({ message: "Bạn không có quyền!" });
    }

    if (userToDelete.role === "superadmin") {
      return res.status(403).json({ message: "Bạn không có quyền!" });
    }

    if (userToDelete._id.equals(currentUser._id)) {
      return res.status(403).json({ message: "Bạn không thể xóa chính mình!" });
    }

    await userToDelete.deleteOne();

    getIO().emit("adminDeleted", { message: "Xóa tài khoản thành công!" });

    res.json({ message: "Xóa tài khoản thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
