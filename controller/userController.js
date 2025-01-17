import asynchandler from "express-async-handler"
import User from "../modal/userModal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";






















//@desc Register a user
//@route POST /api/users/register
//@access  public
export const getUserCart = asynchandler(async (req, res) => {
  const { username, email, phonebook, password } = req.body;

  if ((!username, !email, !password, !phonebook)) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  
  
  if (userAvailable) {
    // If the user exists and has a googleId, return a specific error
    if (userAvailable.googleId) {
      return res
        .status(400)
        .send("This email is already linked to a Google account.");
    }

    // If the user exists but doesn't have a googleId, handle it accordingly
    return res.status(400).send("User already registered");
  }
  // Hash
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  console.log("Your Hash password is this", hash);
  const user = await User.create({
    username,
    email,
    phonebook,
    password: hash,
  });

  console.log(`username is ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data not valid");
  }
});





//@desc Login user
//@route POST /api/users/login
//@access  public
export const loginUser = asynchandler(async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
     res.status(400);
     throw new Error("All fields are mandatory");
   }
   const user = await User.findOne({ email });

   if (user && (await bcrypt.compare(password, user.password))) {
     // Use bcrypt.compare for async
     const accessToken = jwt.sign(
       {
         user: {
           username: user.username,
           email: user.email,
           id: user.id,
         },
       },
       process.env.ACCESS_TOKEN_SECRET,
       { expiresIn: "175m" }
     );

     res.status(200).json({ accessToken });
   } else {
     res.status(401);
     throw new Error("Email or password is not valid");
   }
});





//@desc  user  info
//@route get /api/users/current
//@access  private
// Get current user info
export const currentUser = asynchandler(async (req, res) => {
   res.json({
     message: "Current user data",
     user: req.user, // This should be the user object attached to the request
   });
});

