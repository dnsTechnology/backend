import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsWithPagination,
  getBlogById,
} from "../controllers/blog.js";
import { isAdmin } from "../middleware/adminCheck.js";

const router = express.Router();

router.post("/create", isAdmin, createBlog);
router.put("/update/:id", isAdmin, updateBlog);
router.delete("/delete/:id", isAdmin, deleteBlog);
router.get("/all", getAllBlogsWithPagination);
router.get("/:id", getBlogById);

export default router;
