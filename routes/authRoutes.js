// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  logoutAllDevices,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", register); // Register route
router.post("/signin", login); // Login route
router.post("/logout", authMiddleware, logout); // Logout route
router.post("/logout-all-devices", authMiddleware, logoutAllDevices); // Logout from all devices route

export default router;
