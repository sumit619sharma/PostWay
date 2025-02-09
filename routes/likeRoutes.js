import express from "express";
import { toggleLike, getLikes } from "../controllers/likeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Like routes
router.post("/toggle/:id", authMiddleware, toggleLike); // Toggle like for a post/comment
router.get("/:id", authMiddleware, getLikes); // Get likes for a post/comment

export default router;
