import express from "express";
import { sendRes } from "../utils/utils.js";
import { sendGeneralInquiryMail } from "../utils/sendGeneralEnquiry.js";
import Enquiry from "../models/enquiry.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { firstname, lastname, email, phone, message } = req.body;

    if (!firstname || !email || !phone || !message) {
      return sendRes("All fields are required", [], 400, false, res);
    }

    // Here, you would typically save the enquiry to your database

    const response = await sendGeneralInquiryMail(req.body);

    if (!response.success) {
      return sendRes(response.message, [], 500, false, res);
    }

    // Simulate enquiry creation
    const enquiry = {
      firstname,
      lastname,
      email,
      phone,
      message,
      date: new Date(),
    };

    // In a real application, you would save 'enquiry' to the database here
    if (!enquiry) {
      return sendRes("Enquiry creation failed", [], 500, false, res);
    }
    const enquiryData = await Enquiry.create(enquiry);
    if (!enquiryData) {
      return sendRes("Enquiry creation failed", [], 500, false, res);
    }
    return sendRes("Enquiry submitted successfully", enquiry, 201, true, res);
  } catch (error) {
    console.error(error);
    return sendRes("Server Error.", [], 500, false, res);
  }
});

router.get("/all", async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};
    if (status && ["Pending", "Resolved"].includes(status)) {
      query.status = status;
    }

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalEnquiries = await Enquiry.countDocuments(query);

    return sendRes(
      "Enquiries fetched successfully",
      {
        enquiries,
        totalEnquiries,
        totalPages: Math.ceil(totalEnquiries / limit),
        currentPage: Number(page),
      },
      200,
      true,
      res
    );
  } catch (error) {
    console.error(error);
    return sendRes("Server Error.", [], 500, false, res);
  }
});

/**
 * Update enquiry status (Pending ↔ Resolved)
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Resolved"].includes(status)) {
      return sendRes("Invalid status value", [], 400, false, res);
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return sendRes("Enquiry not found", [], 404, false, res);
    }

    return sendRes(
      "Enquiry status updated successfully",
      enquiry,
      200,
      true,
      res
    );
  } catch (error) {
    console.error(error);
    return sendRes("Server Error.", [], 500, false, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return sendRes("Enquiry not found", [], 404, false, res);
    }
    return sendRes("Enquiry fetched successfully", enquiry, 200, true, res);
  } catch (error) {
    console.error(error);
    return sendRes("Server Error.", [], 500, false, res);
  }
});

export default router;
