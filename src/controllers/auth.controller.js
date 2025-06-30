import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import { generateOtp, generateAccessToken, generateRefreshToken } from "../utils/helper.js";
import { getIO } from "../config/websocket.js";
import { isValidEmail } from "../utils/validator.js";
import { sendEmailOTP } from "../utils/mailer.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, status: "inactive" });
    await newUser.save();

    const otp = generateOtp();

    const existingOtp = await redisClient.get(`otpActive:${email}`);
    if (existingOtp) {
      return res.status(400).json({ message: "OTP hiện tại vẫn còn hiệu lực. Vui lòng kiểm tra email." });
    }

    await redisClient.set(`otpActive:${email}`, otp, "EX", 60);
    await sendEmailOTP(email, otp);

    return res.status(201).json({ message: "Đăng ký thành công! Vui lòng kiểm tra OTP." });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 📌 Gửi lại OTP nếu hết hạn
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    const otp = generateOtp();

    const existingOtp = await redisClient.get(`otpActive:${email}`);
    if (existingOtp) {
      return res.status(400).json({ message: "OTP hiện tại vẫn còn hiệu lực. Vui lòng kiểm tra email." });
    }

    await redisClient.set(`otpActive:${email}`, otp, "EX", 60);
    await sendEmailOTP(email, otp);

    return res.json({ message: "Mã OTP mới đã được gửi lại. Vui lòng kiểm tra email!" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 📌 Xác nhận OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await redisClient.get(`otpActive:${email}`);

    if (!storedOtp || storedOtp !== otp) return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });

    await User.findOneAndUpdate({ email }, { status: "active" });

    await redisClient.del(`otpActive:${email}`);

    return res.json({ message: "Xác nhận thành công!" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

    if (existingUser.status === "inactive") {
      return res.status(403).json({
        message: "Tài khoản chưa kích hoạt.",
      });
    }

    if (existingUser.status == "locked") return res.status(403).json({ message: "Tài khoản đã bị khoá" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const accessToken = generateAccessToken(existingUser._id);
    const refreshToken = generateRefreshToken(existingUser._id);

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

// Đăng xuất
export const logout = async (req, res) => {
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

// Yêu cầu thay đổi mật khẩu và xác nhận
export const requestChangePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });

    if (newPassword.length < 6) return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });

    const existingOtp = await redisClient.get(`otp:changePassword:${user.email}`);

    if (existingOtp) {
      return res.status(400).json({ message: "OTP hiện tại vẫn còn hiệu lực. Vui lòng kiểm tra email." });
    }

    const otp = generateOtp();
    await redisClient.set(`otp:changePassword:${user.email}`, otp, "EX", 60);
    await sendEmailOTP(user.email, otp);

    return res.json({ message: "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const resendChangePasswordOtp = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const existingOtp = await redisClient.get(`otp:changePassword:${user.email}`);
    if (existingOtp) {
      return res.status(400).json({ message: "OTP hiện tại vẫn còn hiệu lực. Vui lòng kiểm tra email." });
    }

    const otp = generateOtp();
    await redisClient.set(`otp:changePassword:${user.email}`, otp, "EX", 60);

    await sendEmailOTP(user.email, otp);

    res.json({ message: "Mã OTP mới đã được gửi lại. Vui lòng kiểm tra email!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const confirmChangePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { otp, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const storedOtp = await redisClient.get(`otp:changePassword:${user.email}`);
    if (!storedOtp) return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });

    if (storedOtp !== otp) return res.status(400).json({ message: "OTP không chính xác" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await redisClient.del(`otp:changePassword:${user.email}`);

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const requestForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email chưa đăng ký tài khoản!" });

    const existingOtp = await redisClient.get(`forgotPasswordOtp:${email}`);

    if (existingOtp) {
      return res.status(400).json({ message: "OTP hiện tại vẫn còn hiệu lực. Vui lòng kiểm tra email." });
    }

    const otp = generateOtp();
    await redisClient.set(`forgotPasswordOtp:${email}`, otp, "EX", 60);
    await sendEmailOTP(user.email, otp);

    return res.json({ message: "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const confirmForgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email chưa đăng ký tài khoản!" });

    const storedOtp = await redisClient.get(`forgotPasswordOtp:${user.email}`);
    if (!storedOtp) return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });

    if (storedOtp !== otp) return res.status(400).json({ message: "OTP không chính xác" });

    if (newPassword.length < 6) return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await redisClient.del(`forgotPasswordOtp:${user.email}`);

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const resendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email chưa đăng ký tài khoản!" });

    const existingOtp = await redisClient.get(`forgotPasswordOtp:${email}`);

    if (!existingOtp) {
      return res.status(400).json({ message: "OTP hiện tại vẫn còn hiệu lực. Vui lòng kiểm tra email." });
    }

    const otp = generateOtp();
    await redisClient.set(`forgotPasswordOtp:${email}`, otp, "EX", 60);
    await sendEmailOTP(user.email, otp);

    return res.json({ message: "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Khóa tài khoản (Admin)
export const lockUserAccount = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { status: "locked" });

    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    getIO().to(userId).emit("accountLocked", { message: "Tài khoản của bạn đã bị khóa!" });

    return res.json({ message: "Tài khoản đã bị khóa!" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
