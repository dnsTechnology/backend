import mongoose from "mongoose";
import { JobCategory } from "../models/job.js"; // adjust path
import { sendRes } from "../utils/utils.js"; // adjust path

// CREATE CATEGORY
export const createJobCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return sendRes("Category name is required", "", 400, false, res);
    }

    const existingCategory = await JobCategory.findOne({ name });
    if (existingCategory) {
      return sendRes("Category already exists", "", 400, false, res);
    }

    const category = await JobCategory.create({
      name,
      description: description || "",
    });

    return sendRes("Category created successfully", category, 201, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// GET ALL CATEGORIES (with search + pagination)
export const getJobCategories = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let filters = {};
    if (search) {
      filters.name = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const categories = await JobCategory.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await JobCategory.countDocuments(filters);

    return sendRes(
      "Categories fetched successfully",
      {
        categories,
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

// GET CATEGORY BY ID
export const getJobCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid category ID", "", 400, false, res);
    }

    const category = await JobCategory.findById(id);
    if (!category) return sendRes("Category not found", "", 404, false, res);

    return sendRes("Category fetched successfully", category, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// UPDATE CATEGORY
export const updateJobCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid category ID", "", 400, false, res);
    }

    const category = await JobCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!category) return sendRes("Category not found", "", 404, false, res);

    return sendRes("Category updated successfully", category, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};

// DELETE CATEGORY
export const deleteJobCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendRes("Invalid category ID", "", 400, false, res);
    }

    const category = await JobCategory.findByIdAndDelete(id);
    if (!category) return sendRes("Category not found", "", 404, false, res);

    return sendRes("Category deleted successfully", category, 200, true, res);
  } catch (error) {
    console.error(error);
    sendRes(error.message, "", 500, false, res);
  }
};
