// upload.js
import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure "uploads" folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Optional: filter only images

function fileFilter(req, file, cb) {
  // Allowed file types: images + pdf + word documents
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|svg/;

  const ext = path.extname(file.originalname).toLowerCase().replace(".", ""); // remove dot
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDF, and Word files are allowed"), false);
  }
}

// Upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
