import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  try {
    const token =
      req.headers["authorization"]?.split(" ")[1] || req.cookies.accessToken;
    if (!token) {
      return res.status(403).json({ message: "Access denied" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId; // Attach the decoded userId to the request object
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export { authenticateUser };
