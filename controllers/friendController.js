import User from "../models/userModel";

// Get friends of a user
export const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("friends", "name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      friends: user.friends,
      friendsCount: user.friends.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch friends", error });
  }
};

// Get pending friend requests
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "pendingRequests",
      "name email"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      pendingRequests: user.pendingRequests,
      requestsCount: user.pendingRequests.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch pending requests", error });
  }
};

// Toggle friendship (send/cancel friend request or unfriend)
export const toggleFriendship = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    if (userId.toString() === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already friends
    if (user.friends.includes(friendId)) {
      // Remove friend (unfriend)
      user.friends = user.friends.filter((id) => id.toString() !== friendId);
      friend.friends = friend.friends.filter((id) => id.toString() !== userId);

      await user.save();
      await friend.save();

      return res.status(200).json({ message: "Friend removed successfully." });
    }

    // Check if there's a pending request
    if (user.pendingRequests.includes(friendId)) {
      return res
        .status(400)
        .json({ message: "Friend request is already pending." });
    }

    // Send friend request
    friend.pendingRequests.push(userId);
    await friend.save();

    res.status(200).json({ message: "Friend request sent." });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle friendship", error });
  }
};

// Accept or reject a friend request
export const respondToRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;
    const { response } = req.body; // 'accept' or 'reject'

    if (!response || (response !== "accept" && response !== "reject")) {
      return res
        .status(400)
        .json({ message: "Invalid response. Use 'accept' or 'reject'." });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a request exists
    if (!user.pendingRequests.includes(friendId)) {
      return res
        .status(400)
        .json({ message: "No pending friend request found." });
    }

    if (response === "accept") {
      // Accept friend request
      user.friends.push(friendId);
      friend.friends.push(userId);
    }

    // Remove from pending requests
    user.pendingRequests = user.pendingRequests.filter(
      (id) => id.toString() !== friendId
    );
    await user.save();
    await friend.save();

    const message =
      response === "accept"
        ? "Friend request accepted."
        : "Friend request rejected.";

    res.status(200).json({ message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to respond to friend request", error });
  }
};
