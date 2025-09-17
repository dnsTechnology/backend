import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import blogRoutes from "./routes/blog.js";
import userRoutes from "./routes/user.js";
import commentRoutes from "./routes/comment.js";
import uploadRoutes from "./routes/upload.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import teamRoutes from "./routes/team.js";
import orderRoutes from "./routes/order.js";
import enquiryRoutes from "./routes/enquiry.js";
import projectRoutes from "./routes/project.js";
import jobRoutes from "./routes/job.js";
import applicationRoutes from "./routes/application.js";
import "dotenv/config";
import { sendRes } from "./utils/utils.js";
import { isAdmin, isUser } from "./middleware/adminCheck.js";
import { sendBookingMailToUserAndAdmin } from "./utils/sendMail.js";

const app = express();
app.use(cookieParser());

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());
app.use(morgan("dev")); // optional for logging

// Routes
app.use("/uploads", express.static("uploads"));

app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/project", projectRoutes); // Using enquiryRoutes for project as well
app.use("/api/jobs", jobRoutes); // Using enquiryRoutes for project as well
app.use("/api/application", applicationRoutes); // Using enquiryRoutes for project as well
app.post("/api/send-booking-mail", async (req, res) => {
  const data = req.body;
  await sendBookingMailToUserAndAdmin(data, req, res);
});
app.get("/api/mydata", isAdmin, (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo) {
      return sendRes("Unauthorized user. login first.", "", 401, false, res);
    }
    return sendRes("Successfully got user info.", userInfo, 200, true, res);
  } catch (error) {
    console.log(error);
    return sendRes("Internal server error.", "", 500, false, res);
  }
});

// Root route
app.get("/", (req, res) => {
  console.log(req.user);
  sendRes("hey from server", [], 200, true, res);
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
