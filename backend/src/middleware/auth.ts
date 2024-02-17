import { NextFunction, Request, Response } from "express"; // Import required types from Express
import jwt, { JwtPayload } from "jsonwebtoken"; // Import JSON Web Token (JWT) library

// Extend the Request interface of Express to include a userId property
declare global {
    namespace Express {
        interface Request {
            userId: string; // userId property to store the user ID extracted from the JWT token
        }
    }
}

// Middleware function to verify JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"]; // Extract JWT token from cookies

    // If token is not present, return unauthorized status
    if (!token) {
        return res.status(401).json({ message: "unauthorized" }); // Return unauthorized status with JSON message
    }

    try {
        // Verify the token using the JWT_SECRET_KEY from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string); // Decode the JWT token
        req.userId = (decoded as JwtPayload).userId; // Extract and store the user ID from the decoded JWT payload
        next(); // Call the next middleware or route handler
    } catch (error) {
        // If verification fails (e.g., token is invalid or expired), return unauthorized status
        return res.status(401).json({ message: "unauthorized" }); // Return unauthorized status with JSON message
    }
};

export default verifyToken; // Export the verifyToken middleware function