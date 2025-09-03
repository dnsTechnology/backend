// models/teamMember.model.js
import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please fill a valid email address",
      ],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: 80,
    },
    qualification: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    linkedin: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    intro: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;
