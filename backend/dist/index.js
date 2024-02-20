"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules and packages
const express_1 = __importDefault(require("express")); // Express framework for Node.js
const cors_1 = __importDefault(require("cors")); // Cross-Origin Resource Sharing middleware
require("dotenv/config"); // Load environment variables from a .env file
const mongoose_1 = __importDefault(require("mongoose")); // MongoDB object modeling tool
const users_1 = __importDefault(require("./routes/users")); // Import user routes
const auth_1 = __importDefault(require("./routes/auth")); // Import authentication routes
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
// Connect to MongoDB using the connection string from environment variables
mongoose_1.default
    .connect(process.env.MONGODB_CONNECTION_STRING);
// .then(() => console.log("Connected to database:", process.env.MONGODB_CONNECTION_STRING))
// .catch((error) => console.error("Error connecting to database:", error));
// Create an Express application
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Middleware setup
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL, // Allow requests from the specified frontend URL
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
}));
// Define routes
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
app.use("/api/auth", auth_1.default); // Authentication routes
app.use("/api/users", users_1.default); // User routes
// Start the Express server
app.listen(7000, () => {
    console.log("Server running on localhost:7000");
});
