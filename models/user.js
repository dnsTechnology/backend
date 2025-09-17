import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    roles: {
      type: [String],
      enum: ["admin", "editor", "author", "subscriber"],
      default: ["subscriber"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String, // optional profile picture URL
    },
    forgotpasswordToken: {
      type: String,
    },
    forgotpasswordExpiry: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
