// Import required modules and packages
import express, { Request, Response } from 'express'; // Express framework for Node.js
import cors from 'cors'; // Cross-Origin Resource Sharing middleware
import "dotenv/config"; // Load environment variables from a .env file
import mongoose from 'mongoose'; // MongoDB object modeling tool
import userRoutes from "./routes/users"; // Import user routes
import authRoutes from "./routes/auth"; // Import authentication routes
import cookieParser from "cookie-parser";
import path from 'path';

// Connect to MongoDB using the connection string from environment variables
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
 // .then(() => console.log("Connected to database:", process.env.MONGODB_CONNECTION_STRING))
 // .catch((error) => console.error("Error connecting to database:", error));

// Create an Express application
const app = express();
app.use(cookieParser());

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({ // Enable CORS with options
  origin: process.env.FRONTEND_URL, // Allow requests from the specified frontend URL
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
}));

// Define routes
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", userRoutes); // User routes

// Start the Express server
app.listen(7000, () => {
    console.log("Server running on localhost:7000");
});