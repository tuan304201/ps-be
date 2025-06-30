import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Tạo mã OTP ngẫu nhiên (6 chữ số)
 */
export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Kiểm tra mã OTP có hợp lệ không (chưa hết hạn)
 */
export const isOtpValid = (user) => {
  return user.otp && user.otpExpires && new Date() < new Date(user.otpExpires);
};

/**
 * Hash mật khẩu trước khi lưu vào database
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Kiểm tra mật khẩu nhập vào có đúng không
 */
export const comparePassword = async (enteredPassword, hashedPassword) => {
  return bcrypt.compare(enteredPassword, hashedPassword);
};

/**
 * Tạo Access Token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// Hàm tạo Refresh Token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
};

export const generateAccessTokenAdmin = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// Hàm tạo Refresh Token
export const generateRefreshTokenAdmin = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
};
