// controllers/authController.js
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, gender });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.activeTokens.push(token);
    await user.save();

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.activeTokens = user.activeTokens.filter((t) => t !== req.token);
    await user.save();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};

export const logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.activeTokens = [];
    await user.save();
    res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    res.status(500).json({ message: "Logout from all devices failed", error });
  }
};
