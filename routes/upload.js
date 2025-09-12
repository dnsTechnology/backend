import express from "express";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
  try {
    const image = req.file;

    if (
      image.mimetype !== "image/jpeg" &&
      image.mimetype !== "image/png" &&
      image.mimetype !== "image/jpg" &&
      image.mimetype !== "image/gif" &&
      image.mimetype !== "image/webp"
    ) {
      return res.status(400).json({ message: "Invalid file type" });
    }
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
  } catch (error) {
    return res.status(500).json({ message: error.message || error.Error });
  }
});
router.post("/docs", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    if (
      file.mimetype !== "application/pdf" &&
      file.mimetype !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && // .docx
      file.mimetype !== "application/msword" // .doc
    ) {
      return res.status(400).json({ message: "Invalid file type" });
    }
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      message: "Document uploaded successfully!",
      file: {
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || error.Error });
  }
});

export default router;
