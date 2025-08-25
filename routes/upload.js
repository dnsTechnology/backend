import express from "express";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "Image uploaded successfully!",
    file: {
      filename: image.filename,
      path: image.path,
      size: image.size,
      mimetype: image.mimetype,
    },
  });
});

export default router;
