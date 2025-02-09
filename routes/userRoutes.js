import express from "express";
import userController from "../controllers/userController";
import { authenticateUser } from "../middlewares/authMiddleware";
import upload from "../middlewares/avatarUpload";

const router = express.Router();

// Register a new user
router.post("/signup", userController.registerUser);

// Log in an existing user
router.post("/signin", userController.loginUser);

// Log out the currently logged-in user
router.post("/logout", authenticateUser, userController.logoutUser);

// Log out the user from all devices
router.post(
  "/logout-all-devices",
  authenticateUser,
  userController.logoutAllDevices
);

// Get details of the logged-in user
router.get(
  "/get-details/:userId",
  authenticateUser,
  userController.getUserDetails
);

// Get all users (admin only)
router.get(
  "/get-all-details",
  authenticateUser,
  userController.getAllUserDetails
);

// Update user details
router.put(
  "/update-details/:userId",
  authenticateUser,
  userController.updateUserDetails
);

// Update the user's avatar
router.put(
  "/update-avatar/:userId",
  authenticateUser,
  upload.single("avatar"),
  userController.updateAvatar
);
export default router;
module.exports = router;
