import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to authenticate and authorize users
const authMiddleware = async (req, res, next) => {
  try {
    // Check if authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided, authorization denied" });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token, authorization denied" });
    }

    // Find the user based on the decoded token's ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request object for further access
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token verification failed, authorization denied" });
  }
};

export default authMiddleware;
