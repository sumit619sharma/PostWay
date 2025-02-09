// Custom error handler middleware
const errorMiddleware = (err, res) => {
  // Set default error values
  let statusCode = err.statusCode || 500; // Default to 500 for server errors
  let message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400; // Bad Request
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400; // Bad Request
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409; // Conflict
    message = "Duplicate field value entered.";
  }

  // Log the error (for debugging purposes)
  console.error(`[Error]: ${message}`);

  // Send a structured response to the client
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorMiddleware;
