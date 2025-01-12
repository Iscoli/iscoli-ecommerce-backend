import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();




// Cross-platform solution to define __dirname
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); 




// Create middleware instance
const middleware = express();




// Configure session
middleware.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 60 * 1000, // Set the cookie's maxAge to 10 minutes
    },
  })
);


// Serve static files
middleware.use(express.static(path.join(__dirname, "../public")));

// Parse incoming requests
middleware.use(express.urlencoded({ extended: true }));
middleware.use(express.json());

// Set up EJS as the view engine
middleware.set("view engine", "ejs");

// Set views directory
middleware.set("views", path.join(__dirname, "../views"));

export default middleware;
