import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsWithPagination,
  getBlogById,
} from "../controllers/blog.js";
import { isUser } from "../middleware/adminCheck.js";

const router = express.Router();

router.post("/create", isUser, createBlog);
router.put("/update/:id", isUser, updateBlog);
router.delete("/delete/:id", isUser, deleteBlog);
router.get("/all", getAllBlogsWithPagination);
router.get("/:id", getBlogById);

export default router;
