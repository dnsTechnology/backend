import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategoriesWithPagination,
  getCategoryById,
} from "../controllers/blog.js";
import { isAdmin } from "../middleware/adminCheck.js";

const router = express.Router();

router.post("/create", isAdmin, createCategory);
router.put("/update/:id", isAdmin, updateCategory);
router.delete("/delete/:id", isAdmin, deleteCategory);
router.get("/all", getAllCategoriesWithPagination);
router.get("/:id", getCategoryById);

export default router;
