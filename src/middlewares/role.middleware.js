import UserAdmin from "../models/UserAdmin.js";

export const checkRole = (rolesAllowed) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const user = await UserAdmin.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }

      if (!rolesAllowed.includes(user.role)) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
      }

      req.currentUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  };
};
