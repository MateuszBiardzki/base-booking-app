// Import necessary modules and dependencies
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user"; // Assuming this represents the user model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create an instance of the Express router
const router = express.Router();

// Define the login route
router.post("/login", [
    // Validate email and password in the request body
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({ min: 6 }),
], async (req: Request, res: Response) => {
    // Route handler function for handling POST requests to "/login"
    const errors = validationResult(req); // Get validation errors from the request
    // If there are validation errors, return a 400 Bad Request response with the error messages
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    // Extract email and password from the request body
    const { email, password } = req.body;

    try {
        // Find a user with the provided email in the database
        const user = await User.findOne({ email });

        // If user does not exist, return a 400 Bad Request response with an error message
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match, return a 400 Bad Request response with an error message
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate a JWT token with the user ID as payload and the secret key
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d",
        });

        // Set the token as a cookie in the response
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });

        // Send the JWT token back to the client as a JSON response
        return res.status(200).json({ userId: user._id });
    } catch (error) {
        // Handle server errors and return a 500 Internal Server Error response
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

// Export the router for use in other parts of the application
export default router;