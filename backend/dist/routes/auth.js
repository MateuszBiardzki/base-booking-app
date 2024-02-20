"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules and dependencies
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user")); // Assuming this represents the user model
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
// Create an instance of the Express router
const router = express_1.default.Router();
// Define the login route
router.post("/login", [
    // Validate email and password in the request body
    (0, express_validator_1.check)("email", "Email is required").isEmail(),
    (0, express_validator_1.check)("password", "Password with 6 or more characters required").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Route handler function for handling POST requests to "/login"
    const errors = (0, express_validator_1.validationResult)(req); // Get validation errors from the request
    // If there are validation errors, return a 400 Bad Request response with the error messages
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    // Extract email and password from the request body
    const { email, password } = req.body;
    try {
        // Find a user with the provided email in the database
        const user = yield user_1.default.findOne({ email });
        // If user does not exist, return a 400 Bad Request response with an error message
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        // Compare the provided password with the hashed password stored in the database
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        // If passwords do not match, return a 400 Bad Request response with an error message
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        // Generate a JWT token with the user ID as payload and the secret key
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
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
    }
    catch (error) {
        // Handle server errors and return a 500 Internal Server Error response
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/validate-token", auth_1.default, (req, res) => {
    res.status(200).send({ userId: req.userId });
});
router.post("/logout", (req, res) => {
    res.cookie("auth_token", "", {
        expires: new Date(0)
    });
    res.send();
});
// Export the router for use in other parts of the application
exports.default = router;
