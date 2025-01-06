import nodemailer from "nodemailer";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import User from "../modal/userModal.js";
import bcrypt from "bcryptjs";


dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address that will send the emails
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//@desc Forgot Password (Send Reset Link)
//@route POST /api/users/forgot-password
//@access public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User with that email not found");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL - make sure CLIENT_URL is set in your .env
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Email template
    const message = `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.name || "valued user"},</p>
      <p>You requested a password reset for your account with email: ${email}</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email and ensure your account is secure.</p>
      <p>Best regards,<br>Your Application Team</p>
    `;

    // Send email with detailed error handling
    try {
      const info = await transporter.sendMail({
        from: `"Your App Name" <${process.env.EMAIL_USER}>`, // The email address configured in EMAIL_USER
        to: email, // The user's email address
        subject: "Password Reset",
        text: `Hello ${
          user.name || "valued user"
        },\n\nYou requested a password reset for your account with email: ${email}.\n\nPlease use the following link to reset your password (this link will expire in 1 hour):\n${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nYour Application Team`,
        html: `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.name || "valued user"},</p>
      <p>You requested a password reset for your account with email: ${email}</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email and ensure your account is secure.</p>
      <p>Best regards,<br>Your Application Team</p>
  `,
      });

      console.log("Password reset email sent to:", email);
      console.log("Message ID:", info.messageId);

      res.status(200).json({
        success: true,
        message: `Password reset link sent to ${email}`,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);

      // Reset the token fields if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(500);
      throw new Error(
        "Failed to send password reset email. Please try again later."
      );
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500);
    throw new Error(
      error.message || "Failed to process password reset request"
    );
  }
});

//@desc Reset Password (Update Password)
//@route POST /api/users/reset-password/:token
//@access public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  console.log(newPassword,'sabo')

  if (!newPassword) {
    res.status(400);
    throw new Error("New password is required");
  }

  // Hash the token from params
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with valid reset token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update user password and clear reset token fields
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Send confirmation email
  try {
    await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Successful",
      html: `
        <h1>Password Reset Successful</h1>
        <p>Hello ${user.name || "valued user"},</p>
        <p>Your password has been successfully reset.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <p>Best regards,<br>Your Application Team</p>
      `,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    // Continue with the response even if confirmation email fails
  }

  res.status(200).json({
    success: true,
    message: "Password has been successfully updated",
  });
});
