import Post from "../models/postModel";
import User from "../models/userModel";

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;

    if (!caption) {
      return res.status(400).json({ message: "Caption is required" });
    }

    const post = await Post.create({
      caption,
      imageUrl: imageUrl || null,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
};

// Get all posts for the news feed
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "name email")
      .populate("likes", "name email")
      .populate({
        path: "comments",
        populate: { path: "createdBy", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

// Get a specific post by ID
exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("createdBy", "name email")
      .populate("likes", "name email")
      .populate({
        path: "comments",
        populate: { path: "createdBy", select: "name email" },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error });
  }
};

// Update a specific post by ID
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { caption, imageUrl } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }

    if (caption) post.caption = caption;
    if (imageUrl) post.imageUrl = imageUrl;

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error });
  }
};

// Delete a specific post by ID
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await post.remove();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error });
  }
};

// Get all posts for a specific user
exports.getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ createdBy: userId })
      .populate("createdBy", "name email")
      .populate("likes", "name email")
      .populate({
        path: "comments",
        populate: { path: "createdBy", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user's posts", error });
  }
};
