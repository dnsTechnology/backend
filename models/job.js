import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String, // e.g., "Software Developer", "Designer", "Manager"
      required: true,
    },
    location: {
      type: String,
      default: "Onsite",
      required: true,
    },
    type: {
      type: String, // Full-time, Part-time, Internship, etc.
      default: "Full-time",
      required: true,
    },
    salaryRange: {
      type: String, // e.g., "$2000 - $3000"
      default: "",
    },
    requirements: {
      type: [String], // Array of skills/requirements
      default: [],
    },
    company: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const jobCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const JobCategory = mongoose.model("JobCategory", jobCategorySchema);

const Job = mongoose.model("Job", JobSchema);

export default Job;
