import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyDetails,
} from "../controllers/user.js";
import { isAuthentcated } from "../middleware/adminCheck.js";
import { sendRes } from "../utils/utils.js";
import User from "../models/user.js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { sendResetPasswordEmail } from "../utils/sendMail.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", isAuthentcated, logoutUser);
router.get("/me", isAuthentcated, getMyDetails);
router.post("/resetpassword", async (req, res) => {
  try {
    const { email } = req.body; // ✅ destructure properly

    if (!email) {
      return sendRes(
        "Email address required to reset password.",
        "",
        400,
        false,
        res,
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
        res,
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
        res,
      );
    }

    return sendRes(
      "Reset password email sent successfully. Please check your inbox.",
      "",
      200,
      true,
      res,
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
        res,
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
