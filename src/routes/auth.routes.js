import express from "express";
import {
  register,
  verifyOtp,
  login,
  logout,
  resendOtp,
  lockUserAccount,
  confirmChangePassword,
  requestChangePassword,
  resendChangePasswordOtp,
  requestForgotPassword,
  resendForgotPasswordOtp,
  confirmForgotPassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.post("/change-password", authenticate, confirmChangePassword);
router.post("/send-otp-change-password", authenticate, requestChangePassword);
router.post("/resend-otp-change-password", authenticate, resendChangePasswordOtp);
router.post("/send-otp-fortgot-password", requestForgotPassword);
router.post("/fortgot-password", confirmForgotPassword);
router.post("/resend-otp-fortgot-password", resendForgotPasswordOtp);

router.post("/lock-user", lockUserAccount);

export default router;
