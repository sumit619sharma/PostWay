import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
} from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Post CRUD operations
router.post("/", authMiddleware, createPost);
router.get("/all", authMiddleware, getAllPosts);
router.get("/:postId", authMiddleware, getPostById);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, deletePost);

// Get posts by a specific user
router.get("/user/:userId", authMiddleware, getPostsByUser);

export default router;
