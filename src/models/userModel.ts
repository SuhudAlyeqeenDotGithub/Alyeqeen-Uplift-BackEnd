import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    googleId: { type: String },
    userName: { type: String },
    userEmail: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
