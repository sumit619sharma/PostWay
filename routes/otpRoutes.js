import express from "express";
import { sendOTP, verifyOTP, resetPassword } from "../controllers/otpController.js";

const router = express.Router();

// OTP routes
router.post("/send", sendOTP); // Send OTP
router.post("/verify", verifyOTP); // Verify OTP
router.post("/reset-password", resetPassword); // Reset password using OTP

export default router;
