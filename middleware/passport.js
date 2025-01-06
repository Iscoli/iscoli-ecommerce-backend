import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../modal/userModal.js"; 
import dotenv from "dotenv";


dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {


      console.log(accessToken,"access Token")
       console.log(refreshToken, "refresh Token");
     
      try {
       let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          
          // Check if a user with the same email exists
          user = await User.findOne({email: profile.emails[0].value  });
      

          if (user) {
            // If a user with the email exists, update it with Google ID
            user.googleId = profile.id;
            await user.save();
          } else {
            // Otherwise, create a new user
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
            });
          }
        }
        
        cb(null, user);  
      } catch (err) {
        cb(err, null);
      }
    }
  )
);



