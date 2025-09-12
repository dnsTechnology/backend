import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    resume: {
      type: String, // file path or URL
    },
    coverLetter: {
      type: String,
    },
    experience: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    linkedin: {
      type: String,
      default: "",
    },
    portfolio: {
      type: String,
      default: "",
    },
    additionalInfo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);

export default Application;
