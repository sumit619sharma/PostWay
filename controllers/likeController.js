import Post from "../models/postModel";
import Comment from "../models/commentModel";

// Toggle like for a post or comment
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // ID of the post or comment
    const { type } = req.query; // Type: 'post' or 'comment'

    if (!type || (type !== "post" && type !== "comment")) {
      return res
        .status(400)
        .json({ message: "Invalid type. Must be 'post' or 'comment'." });
    }

    let target; // Holds the post or comment being liked/unliked
    if (type === "post") {
      target = await Post.findById(id);
    } else if (type === "comment") {
      target = await Comment.findById(id);
    }

    if (!target) {
      return res.status(404).json({ message: `${type} not found` });
    }

    const userId = req.user._id.toString();

    // Check if the user has already liked this post/comment
    const isLiked = target.likes.includes(userId);

    if (isLiked) {
      // Unlike: Remove the user's ID from the likes array
      target.likes = target.likes.filter((like) => like.toString() !== userId);
    } else {
      // Like: Add the user's ID to the likes array
      target.likes.push(userId);
    }

    await target.save();

    res.status(200).json({
      message: isLiked ? "Like removed" : "Like added",
      likesCount: target.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle like", error });
  }
};

// Get likes for a specific post or comment
export const getLikes = async (req, res) => {
  try {
    const { id } = req.params; // ID of the post or comment
    const { type } = req.query; // Type: 'post' or 'comment'

    if (!type || (type !== "post" && type !== "comment")) {
      return res
        .status(400)
        .json({ message: "Invalid type. Must be 'post' or 'comment'." });
    }

    let target;
    if (type === "post") {
      target = await Post.findById(id).populate("likes", "name email");
    } else if (type === "comment") {
      target = await Comment.findById(id).populate("likes", "name email");
    }

    if (!target) {
      return res.status(404).json({ message: `${type} not found` });
    }

    res.status(200).json({
      likes: target.likes,
      likesCount: target.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch likes", error });
  }
};
