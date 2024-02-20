"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import JSON Web Token (JWT) library
// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies["auth_token"]; // Extract JWT token from cookies
    // If token is not present, return unauthorized status
    if (!token) {
        return res.status(401).json({ message: "unauthorized" }); // Return unauthorized status with JSON message
    }
    try {
        // Verify the token using the JWT_SECRET_KEY from environment variables
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY); // Decode the JWT token
        req.userId = decoded.userId; // Extract and store the user ID from the decoded JWT payload
        next(); // Call the next middleware or route handler
    }
    catch (error) {
        // If verification fails (e.g., token is invalid or expired), return unauthorized status
        return res.status(401).json({ message: "unauthorized" }); // Return unauthorized status with JSON message
    }
};
exports.default = verifyToken; // Export the verifyToken middleware function
