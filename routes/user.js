import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyDetails,
} from "../controllers/user.js";
import { isAuthentcated } from "../middleware/adminCheck.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", isAuthentcated, logoutUser);
router.get("/me", isAuthentcated, getMyDetails);

export default router;
