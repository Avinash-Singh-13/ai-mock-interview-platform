import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["candidate", "interviewer"], default: "candidate", index: true }
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", UserSchema);
