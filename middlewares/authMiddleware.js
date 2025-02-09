// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user info to the request
    next(); // Move to the next middleware or route handler
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};
