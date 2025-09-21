import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyDetails,
} from "../controllers/user.js";
import { isAdmin, isAuthentcated } from "../middleware/adminCheck.js";
import { sendRes } from "../utils/utils.js";
import User from "../models/user.js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail } from "../utils/sendMail.js";
import Blog from "../models/blog.js";
import Project from "../models/projects.js";
import Order from "../models/order.js";
import Category from "../models/category.js";
import ProductCategory from "../models/category.js";
import TeamMember from "../models/teamMember.js";
import Job from "../models/job.js";
import Product from "../models/product.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", isAuthentcated, logoutUser);
router.get("/me", isAuthentcated, getMyDetails);
router.get("/dashboard", isAuthentcated, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalBlogCategories = await Category.countDocuments();
    const totalProductCategories = await ProductCategory.countDocuments();
    const totalTeamMembers = await TeamMember.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalUsers = await User.countDocuments();

    const recentFiveProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentFiveProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentFiveBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);
    return sendRes(
      "Dashboard data fetched successfully",
      {
        totalProducts,
        totalBlogs,
        totalProjects,
        totalOrders,
        totalBlogCategories,
        totalProductCategories,
        totalTeamMembers,
        totalJobs,
        totalUsers,
        recentFiveProjects,
        recentFiveProducts,
        recentFiveBlogs,
      },
      200,
      true,
      res
    );
  } catch (error) {
    return sendRes("Internal server error", "", 500, false, res);
  }
});

router.get("/allusers", isAdmin, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo || !userInfo.roles.includes("admin")) {
      return sendRes("Unauthorized user", "", 401, false, res);
    }

    const users = await User.find();
    if (!users) {
      return sendRes("No users found", "", 404, false, res);
    }
    return sendRes("Users fetched successfully", users, 200, true, res);
  } catch (error) {
    return sendRes("Internal server error", "", 500, false, res);
  }
});
router.post("/resetpassword", async (req, res) => {
  try {
    const { email } = req.body; // ✅ destructure properly

    if (!email) {
      return sendRes(
        "Email address required to reset password.",
        "",
        400,
        false,
        res
      );
    }

    const userexist = await User.findOne({ email });

    if (!userexist) {
      return sendRes("User not exist. Unauthorized user.", "", 401, false, res);
    }

    // If token already exists and is valid
    if (
      userexist?.forgotpasswordToken &&
      userexist?.forgotpasswordExpiry > Date.now()
    ) {
      return sendRes(
        "Already sent a reset token to your email. Please check inbox.",
        "",
        401,
        false,
        res
      );
    }

    // Generate fresh token
    const urlToken = randomUUID();
    const newtoken = urlToken.split("-").join(""); // clean token
    const expiryTime = Date.now() + 1000 * 60 * 15; // 15 minutes expiry

    // Save token + expiry to user
    userexist.forgotpasswordToken = newtoken;
    userexist.forgotpasswordExpiry = expiryTime;
    await userexist.save();

    // Send email
    const emailResponse = await sendResetPasswordEmail(email, newtoken);

    if (!emailResponse.success) {
      return sendRes(
        "Failed to send reset password email.",
        "",
        500,
        false,
        res
      );
    }

    return sendRes(
      "Reset password email sent successfully. Please check your inbox.",
      "",
      200,
      true,
      res
    );
  } catch (err) {
    console.error(err);
    return sendRes("Internal server error", "", 501, false, res);
  }
});
router.post("/changepass", async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    // 1️⃣ Validate inputs
    if (!token) {
      return sendRes("Token is required.", "", 400, false, res);
    }
    if (!newPassword) {
      return sendRes("New password is required.", "", 400, false, res);
    }

    // 2️⃣ Find user with valid token
    const user = await User.findOne({
      forgotpasswordToken: token,
      forgotpasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return sendRes("Invalid or expired token.", "", 401, false, res);
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (hashedPassword === user.password) {
      return sendRes(
        "Invalid Password. try another password.",
        "",
        401,
        false,
        res
      );
    }

    // 4️⃣ Update user password and clear reset token
    user.password = hashedPassword;
    user.forgotpasswordToken = undefined;
    user.forgotpasswordExpiry = undefined;

    await user.save();

    // 5️⃣ Response
    return sendRes("Password changed successfully!", "", 200, true, res);
  } catch (err) {
    console.error(err);
    return sendRes("Internal server error.", "", 500, false, res);
  }
});

export default router;
