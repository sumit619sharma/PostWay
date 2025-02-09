import express from "express";
import {
  getFriends,
  getPendingRequests,
  toggleFriendship,
  respondToRequest,
} from "../controllers/friendController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Friend routes
router.get("/get-friends/:userId", authMiddleware, getFriends); // Get user's friends
router.get("/get-pending-requests", authMiddleware, getPendingRequests); // Get pending friend requests
router.post("/toggle-friendship/:friendId", authMiddleware, toggleFriendship); // Send/Cancel friend request or unfriend
router.post("/response-to-request/:friendId", authMiddleware, respondToRequest); // Accept/Reject friend request

export default router;
