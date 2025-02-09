import Comment from "../models/commentModel";
import Post from "../models/postModel";

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      text,
      post: postId,
      createdBy: req.user._id,
    });

    // Push the comment to the post's comments array
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error });
  }
};

// Get all comments for a specific post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: { path: "createdBy", select: "name email" },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error });
  }
};

// Update a comment by ID
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Updated text is required" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the current user is the comment's owner
    if (comment.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this comment" });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update comment", error });
  }
};

// Delete a comment by ID
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the current user is the comment's owner
    if (comment.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    // Remove the comment from the post's comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    await comment.remove();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error });
  }
};
