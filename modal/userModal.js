import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [false, "Please add the user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    phonebook: {
      type: String,
      required: [false, "Please add the user password"],
    },
    password: {
      type: String,
      required: [false, "Please add the user password"],
    },
    googleId: { type: String, unique: true, sparse: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
