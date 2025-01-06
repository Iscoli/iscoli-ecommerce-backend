import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Helper to generate a hashed token
const generateHashedToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// @desc Forgot Password (Send Reset Link)
// @route POST /api/users/forgot-password
// @access Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User with that email not found" });
  }

  // Generate and hash reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = generateHashedToken(resetToken);
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  // Send reset email
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `
    <h1>Password Reset Request</h1>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: message,
    });

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// @desc Reset Password (Update Password)
// @route POST /api/users/reset-password/:token
// @access Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Hash the received token for lookup
  const hashedToken = generateHashedToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  // Hash the new password securely
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password and clear reset token fields
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been successfully updated" });
});
