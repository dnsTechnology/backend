import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional if anonymous comments allowed
      required: false,
    },
    name: {
      type: String, // if anonymous, can use name field
      required: function () {
        return !this.author;
      },
    },
    email: {
      type: String, // optional for anonymous comments
      required: false,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
