import crypto from "crypto";
import nodemailer from "nodemailer";
import OtpModel from "../models/otpModel";

// Generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// Send OTP to the user's email
const sendOtp = async (email) => {
  try {
    // Generate a new OTP
    const otp = generateOtp();

    // Hash the OTP for secure storage in the database
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    // Save the OTP and email to the database (expire in 10 minutes)
    await OtpModel.create({
      email,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Configure nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service provider
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`OTP sent to ${email}`);
    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Please try again later.");
  }
};

export default sendOtp;
