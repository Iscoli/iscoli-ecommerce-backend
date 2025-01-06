import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Create middleware instance
const middleware = express();

// Get the directory name of the current file (equivalent to __dirname)
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Configure session
middleware.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 1000, // Set the cookie's maxAge to 10 seconds (in milliseconds)
    },
  })
);

// Set up static file serving
middleware.use(express.static(path.join(__dirname, "../public"))); // This will now work

middleware.use(express.urlencoded({ extended: true }));
middleware.use(express.json());

// EJS setup
middleware.set("view engine", "ejs");

// Absolute Directory Path
middleware.set("views", path.join(__dirname, "../views"));

middleware.use(express.urlencoded({ extended: true }));
middleware.use(express.json());

// Export middleware
export default middleware;
