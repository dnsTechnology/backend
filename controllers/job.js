import mongoose from "mongoose";
import Job from "../models/job.js";
import { sendRes } from "../utils/utils.js";

// CREATE JOB
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      type,
      salaryRange,
      requirements,
      company,
      deadline,
    } = req.body;

    if (!title || !description || !category) {
      return sendRes(
        "Title, description, and category are required",
        "",
        400,
        false,
        res
      );
    }

    const user = req?.user;
    if (!user) return sendRes("User not found", "", 404, false, res);

    const job = await Job.create({
      title,
      description,
      category,
      location,
      type,
      salaryRange,
      requirements: requirements || [],
      company,
      deadline,
      author: new mongoose.Types.ObjectId(user._id), // optional ownership
    });

    return sendRes("Job created successfully", job, 201, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// GET ALL JOBS
export const getJobs = async (req, res) => {
  try {
    const {
      category,
      location,
      type,
      company,
      isActive,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filters dynamically
    let filters = {};

    if (category) filters.category = category;
    if (location) filters.location = location;
    if (type) filters.type = type;
    if (company) filters.company = company;
    if (isActive !== undefined) filters.isActive = isActive === "true";

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(filters);

    return sendRes(
      "Jobs fetched successfully",
      {
        jobs,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
      200,
      true,
      res
    );
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// GET JOB BY ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid job ID", "", 400, false, res);
    }

    const job = await Job.findById(id);
    if (!job) return sendRes("Job not found", "", 404, false, res);

    return sendRes("Job fetched successfully", job, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid job ID", "", 400, false, res);
    }

    const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!job) return sendRes("Job not found", "", 404, false, res);

    return sendRes("Job updated successfully", job, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid job ID", "", 400, false, res);
    }

    const job = await Job.findByIdAndDelete(id);
    if (!job) return sendRes("Job not found", "", 404, false, res);

    return sendRes("Job deleted successfully", job, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};
