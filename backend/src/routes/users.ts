import express, { Request, Response, Router } from "express";
import { check, validationResult } from "express-validator"; // Importing check and validationResult
import User from "../models/user";
import jwt from "jsonwebtoken";

const router: Router = express.Router();

// /api/users/register
router.post("/register", [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({ min: 6 })
],
async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        // Check if the user already exists
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // If user does not exist, create a new user
        user = new User(req.body);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: "1d" }
        );

        // Set the token as a cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000 // 1 day in milliseconds
        });

        // Send a success response
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;