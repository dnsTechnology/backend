import express from "express";
import { isAdmin } from "../middleware/adminCheck.js";
import { sendJobApplicationConfirmationEmail } from "../utils/sendMail.js";
import { sendRes } from "../utils/utils.js";
import Job from "../models/job.js";
import Application from "../models/application.js";
import mongoose from "mongoose";

const router = express.Router();

const createApplication = async (req, res) => {
  try {
    const {
      jobId,
      fullName,
      email,
      address,
      mobile,
      resume,
      country,
      coverLetter,
      experience,
      skills,
      linkedin,
      portfolio,
      additionalInfo,
    } = req.body;

    // ✅ Validation for required fields
    if (!jobId) return sendRes("JobId is required", [], 400, false, res);
    if (!fullName) return sendRes("Full name is required", [], 400, false, res);
    if (!email) return sendRes("Email is required", [], 400, false, res);
    if (!address) return sendRes("Address is required", [], 400, false, res);
    if (!mobile) return sendRes("Mobile is required", [], 400, false, res);
    if (!country) return sendRes("Country is required", [], 400, false, res);
    if (!linkedin)
      return sendRes("LinkedIn profile is required", [], 400, false, res);

    // ✅ Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return sendRes("Job not found", [], 404, false, res);
    if (!job.isActive && new Date(job.deadline) < new Date())
      return sendRes("Job is not active. try next time.", [], 400, false, res);
    const existingapplication = await Application.find({
      jobId: new mongoose.Types.ObjectId(jobId),
      email,
    });

    if (existingapplication.length >= 1) {
      return sendRes(
        "You already have applied for this position.",
        [],
        400,
        false,
        res
      );
    }

    // ✅ Create new application
    const application = await Application.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      fullName,
      email,
      address,
      mobile,
      country,
      resume,
      coverLetter,
      experience,
      skills: skills ? skills.split(",").map((s) => s.trim()) : [],
      linkedin,
      portfolio,
      additionalInfo,
    });

    await sendJobApplicationConfirmationEmail(email, job?.title);

    return sendRes(
      "Application submitted successfully",
      application,
      201,
      true,
      res
    );
  } catch (error) {
    console.error("Application Error:", error);
    return sendRes(error.message || "Server error", [], 500, false, res);
  }
};

export const getAllApplicationsWithJobId = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    if (!jobId) {
      return sendRes(
        "JobId is required to fetch applications.",
        [],
        400,
        false,
        res
      );
    }

    const allApplications = await Application.find({
      jobId: new mongoose.Types.ObjectId(jobId),
    });

    if (allApplications.length === 0) {
      return sendRes(
        "No applications found for this job role.",
        [],
        404,
        false,
        res
      );
    }

    return sendRes(
      "Successfully fetched all applications.",
      allApplications,
      200,
      true,
      res
    );
  } catch (error) {
    console.error(error);
    return sendRes("Internal server error.", [], 500, false, res);
  }
};

router.post("/create", createApplication);
router.get("/all/:id", getAllApplicationsWithJobId);
// router.get("/:id", getTeamMemberById);

export default router;
