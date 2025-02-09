import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/userModel";
import OTP from "../models/otpModel";

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // Change as per your email provider
  auth: {
    user: process.env.EMAIL, // Email address
    pass: process.env.EMAIL_PASSWORD, // App password or email password
  },
});

// Generate and send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);

    // Save OTP in the database
    const otpEntry = new OTP({
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
    });
    await otpEntry.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email address." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP.", error });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP entry
    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Check if OTP is expired
    if (otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify OTP.", error });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find and verify OTP
    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Find user and update the password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = newPassword; // Ensure the password is hashed before saving
    await user.save();

    // Delete the OTP entry after successful password reset
    await OTP.deleteOne({ email, otp });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password.", error });
  }
};
