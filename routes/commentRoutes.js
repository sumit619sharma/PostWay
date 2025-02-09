import express from "express";
import {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Comment routes
router.post("/:postId", authMiddleware, addComment);
router.get("/:postId", authMiddleware, getCommentsByPost);
router.put("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
