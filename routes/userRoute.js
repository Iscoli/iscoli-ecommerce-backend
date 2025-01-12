import express from "express";
import {
  getUserCart,
  loginUser,
  currentUser,
} from "../controller/userController.js";
import validateToken from "../middleware/validateTokenHandle.js";
import { forgotPassword, resetPassword } from "../controller/forgot.js";

const router = express.Router();

router.post("/register", getUserCart);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);

// Forgot Password Routes
router.post("/forgot-password", forgotPassword); // Send reset link
router.post("/reset-password/:token", resetPassword); // Reset password with token

export default router;
