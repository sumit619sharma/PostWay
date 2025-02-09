import jwt from "jsonwebtoken";

// Generate Access Token
const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  // Generate token with a short expiration time (e.g., 15 minutes)
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  // Generate token with a longer expiration time (e.g., 7 days)
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Verify Token (Access or Refresh)
const verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Decode Token (without verifying signature)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// Validate Access Token Middleware
const validateAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  const { valid, decoded, error } = verifyToken(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );

  if (!valid) {
    return res.status(401).json({ message: "Invalid token", error });
  }

  req.user = decoded; // Attach user data to request object
  next();
};

// Validate Refresh Token
const validateRefreshToken = (refreshToken) => {
  return verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
};

// Invalidate Token Logic (e.g., for logout from all devices)
const invalidateToken = (user) => {
  // Store a version key or blacklist to invalidate tokens if necessary
  user.tokenVersion += 1; // Example: Increment tokenVersion to invalidate existing tokens
  return user.save();
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  validateAccessToken,
  validateRefreshToken,
  invalidateToken,
};
