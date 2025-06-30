import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import UserAdmin from "../models/UserAdmin.js";
import { generateAccessTokenAdmin, generateRefreshTokenAdmin } from "../utils/helper.js";

dotenv.config();
// Đăng ký tài khoản Admin
export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    if (username.length < 8) return res.status(400).json({ message: "Tên đăng nhập phải có ít nhất 8 ký tự" });
    if (password.length < 6) return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });

    const existingUser = await UserAdmin.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username đã tồn tại" });

    const isFirstAdmin = (await UserAdmin.countDocuments()) === 0;
    const role = isFirstAdmin ? "superadmin" : "staff";

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserAdmin({ username, password: hashedPassword, role });
    await newUser.save();

    return res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đăng nhập Admin
export const loginAdmin = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;

    const existingUser = await UserAdmin.findOne({ username });
    if (!existingUser) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const accessToken = generateAccessTokenAdmin(existingUser._id, existingUser.role);
    const refreshToken = generateRefreshTokenAdmin(existingUser._id, existingUser.role);

    if (rememberMe) {
      await redisClient.set(`refreshToken:${existingUser._id}`, refreshToken, "EX", 30 * 24 * 60 * 60);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
      });
    }

    res.status(200).json({ message: "Đăng nhập thành công!", accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: "Bạn chưa đăng nhập!" });

    // Xóa Refresh Token trong Redis
    const userId = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET).userId;

    await redisClient.del(`refreshToken:${userId}`);

    // Xóa cookie Refresh Token
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error });
  }
};
