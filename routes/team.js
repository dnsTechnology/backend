import express from "express";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMembers,
  getTeamMemberById,
} from "../controllers/teamMamber.js";
import { isAdmin } from "../middleware/adminCheck.js";

const router = express.Router();

router.post("/create", isAdmin, createTeamMember);
router.put("/update/:id", isAdmin, updateTeamMember);
router.delete("/delete/:id", isAdmin, deleteTeamMember);
router.get("/all", getTeamMembers);
router.get("/:id", getTeamMemberById);

export default router;
