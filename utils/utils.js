import jwt from "jsonwebtoken";

// Send response helper
export const sendRes = (message, data, status, success, res) => {
  return res.status(status).json({
    message,
    data,
    status,
    success,
  });
};

// Set JWT token in cookie
export const setToken = (role, id, res) => {
  const token = jwt.sign({ role, id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true only in prod (HTTPS)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // lax for dev, none for prod
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });
};

// Clear JWT token
export const clearToken = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};

// Verify JWT token
export const verifyToken = (req) => {
  const token = req.cookies?.token;
  if (!token) throw new Error("Unauthorized. Please login.");
  return jwt.verify(token, process.env.JWT_SECRET);
};
