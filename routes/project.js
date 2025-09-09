import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.js";
import { isAdmin } from "../middleware/adminCheck.js";

const router = express.Router();

router.post("/create", isAdmin, createProject);
router.get("/all", getProjects);
router.get("/:id", getProjectById);
router.put("/update/:id", isAdmin, updateProject);
router.delete("/delete/:id", isAdmin, deleteProject);

export default router;
