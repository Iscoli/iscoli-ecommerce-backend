import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import cartRoute from "./routes/cartRoute.js";
import payStackRoute from "./routes/paymentRoute.js";
import errorHandler from "./middleware/errorHandle.js";
import paystackMiddleware from "./middleware/paystackMiddleWare.js";
import connectDb from "./config/dbConnection.js";
import expressSession from "express-session";
import passport from "passport";
import jwt from "jsonwebtoken";

import "./middleware/passport.js";
dotenv.config();
connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
// app.use("/api/contacts", require("./routes/contactRoutes"));

app.use(paystackMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Iscoli E-commerce API!");
});

app.use(
  expressSession({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//routes

app.get("/failed", (req, res) => {
  res.send("Failed");
});
app.get("/success", (req, res) => {
  res.send(`Welcome ${req.user.email}`);
});

app.use("/api/payments", payStackRoute);
app.use("/api/users", userRoute);
app.use("/api/cart", cartRoute);
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureMessage: "Failed to authenticate" }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(req.user, "nahm");

    const accessToken = jwt.sign(
      {
        user: {
          username: req.user.username,
          email: req.user.email,
          id: req.user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ accessToken });
  }
);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is run on express ${port}`);
});
