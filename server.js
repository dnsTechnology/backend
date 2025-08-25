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
import "dotenv/config";
import { sendRes } from "./utils/utils.js";
import { isAdmin, isUser } from "./middleware/adminCheck.js";

const app = express();
app.use(cookieParser());

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
