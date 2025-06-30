import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmailOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Pet Shop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Xác thực OTP",
      text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 1 phút.`,
    });
    console.log("OTP email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
