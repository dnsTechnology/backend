import { clearToken, sendRes, setToken } from "../utils/utils.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

// -------------------- Register --------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return sendRes("All fields are required", [], 400, false, res);
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendRes("User already exists", [], 400, false, res);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    // Don’t return password in response
    const { password: _, ...userData } = user.toObject();

    return sendRes("User registered successfully", userData, 201, true, res);
  } catch (error) {
    console.error("Register Error:", error);
    return sendRes(error.message, [], 500, false, res);
  }
};

// -------------------- Login --------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendRes("All fields are required", [], 400, false, res);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendRes("Invalid credentials", [], 400, false, res);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendRes("Invalid credentials", [], 400, false, res);
    }

    // set cookie
    setToken(user.role, user._id, res);

    // remove password before sending
    const { password: _, ...userData } = user.toObject();

    return sendRes("User logged in successfully", userData, 200, true, res);
  } catch (error) {
    console.error("Login Error:", error);
    return sendRes(error.message, [], 500, false, res);
  }
};

// -------------------- Logout --------------------
export const logoutUser = async (req, res) => {
  try {
    if (!req.user)
      return sendRes("Unauthorized. Login first.", [], 401, false, res);

    clearToken(res); // just remove the cookie
    return sendRes("User logged out successfully", [], 200, true, res);
  } catch (error) {
    console.error("Logout Error:", error);
    return sendRes(error.message, [], 500, false, res);
  }
};

export const getMyDetails = async (req, res) => {
  try {
    if (!req.user)
      return sendRes("Unauthorized. Login first.", [], 401, false, res);

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendRes("User not found. re login.", [], 404, false, res);
    }

    return sendRes(
      "User details fetched successfully",
      userData,
      200,
      true,
      res
    );
  } catch (error) {
    console.error("Get My Details Error:", error);
    return sendRes(error.message, [], 500, false, res);
  }
};
