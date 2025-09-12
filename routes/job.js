import express from "express";
import { isAdmin } from "../middleware/adminCheck.js";
import {
  createJob,
  getJobById,
  getJobs,
  deleteJob,
  updateJob,
} from "../controllers/job.js";
import {
  createJobCategory,
  deleteJobCategory,
  getJobCategories,
  getJobCategoryById,
  updateJobCategory,
} from "../controllers/jobcategory.js";

const router = express.Router();

router.post("/create", isAdmin, createJob);
router.get("/all", getJobs);
router.get("/:id", getJobById);
router.put("/update/:id", isAdmin, updateJob);
router.delete("/delete/:id", isAdmin, deleteJob);

//jobs category routes can be added here
router.get("/categories/getall", getJobCategories);
router.post("/category/create", isAdmin, createJobCategory);
router.put("/update/category/:id", isAdmin, updateJobCategory);
router.delete("/delete/category/:id", isAdmin, deleteJobCategory);
router.get("/category/:id", getJobCategoryById);

export default router;
