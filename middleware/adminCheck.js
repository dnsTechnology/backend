import User from "../models/user.js";
import { sendRes, verifyToken } from "../utils/utils.js";

export const isAdmin = async (req, res, next) => {
  const data = await verifyToken(req, res);
  if (data && data.id) {
    const userInfo = await User.findById(data.id);
    if (!userInfo && !userInfo.roles?.includes("admin")) {
      sendRes("Admin not found. Login first.", [], 404, false, res);
    }
    req.user = userInfo;
    next();
  } else {
    sendRes("Unauthorized. Login first.", [], 401, false, res);
  }
};

export const isUser = async (req, res, next) => {
  const data = await verifyToken(req, res);
  if (data && data.id) {
    const userInfo = await User.findById(data.id);
    if (!userInfo && !userInfo.roles?.includes("subscriber")) {
      sendRes("User not found. Login first.", [], 404, false, res);
    }
    req.user = userInfo;
    next();
  } else {
    sendRes("Unauthorized. Login first.", [], 401, false, res);
  }
};

export const isAuthentcated = async (req, res, next) => {
  try {
    const data = verifyToken(req); // will throw if invalid
    const userInfo = await User.findById(data.id);
    if (!userInfo) {
      return sendRes("User not found. Login first.", [], 404, false, res);
    }
    req.user = userInfo;
    return next();
  } catch (error) {
    return sendRes(error.message, [], 401, false, res);
  }
};
