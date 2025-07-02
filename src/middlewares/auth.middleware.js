import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import { generateAccessToken } from "../utils/helper.js";

// 🛡️ Middleware xác thực Access Token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có Access Token!" });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return refreshAccessToken(req, res, next);
      }
      return res.status(403).json({ message: "Access Token không hợp lệ!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server!", error });
  }
};

// 🔄 Middleware tự động làm mới Access Token khi hết hạn
const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Không có Refresh Token!" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    // Kiểm tra Refresh Token có hợp lệ trong Redis không
    const storedToken = await redisClient.get(`refreshToken:${userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ message: "Refresh Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại!" });
    }

    // Tạo Access Token mới
    const newAccessToken = generateAccessToken(userId);

    // Gửi Access Token mới cho client
    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    req.user = { userId }; // Cập nhật req.user
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Refresh Token hết hạn, vui lòng đăng nhập lại!" });
  }
};

// 🔑 Middleware kiểm tra quyền Admin
export const checkManagerOrSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin" && req.user.role !== "manager") {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Bạn không có quyền Admin" });
  }
  next();
};

export const isEditor = (req, res, next) => {
  if (!["admin", "superadmin", "editor"].includes(req.user.role)) {
    return res.status(403).json({ message: "Bạn không có quyền Editor" });
  }
  next();
};
