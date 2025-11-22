import multer from "multer";
import fs from "fs";
import path from "path";

// --- 1️⃣ Ensure uploads folder exists ---
const uploadFolder = path.join(process.cwd(), "uploads");

try {
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
    console.log("✔ uploads folder created");
  }
} catch (err) {
  console.error("❌ Failed to create uploads folder:", err);
}

// --- 2️⃣ Allowed MIME types ---
const allowedMimes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",

  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",

  "application/zip",
  "application/x-zip-compressed",
  "multipart/x-zip",

  "application/x-rar-compressed",
];

// --- 3️⃣ Fallback: allowed extensions ---
const allowedExts = [
  ".pdf", ".png", ".jpg", ".jpeg",
  ".doc", ".docx", ".xls", ".xlsx",
  ".ppt", ".pptx", ".zip", ".rar"
];

// --- 4️⃣ Storage config ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    if (!file.originalname) return cb(new Error("File missing name"), "");
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_"); // Replace spaces
    cb(null, `${timestamp}-${safeName}`);
  },
});

// --- 5️⃣ File filter ---
function fileFilter(req, file, cb) {
  try {
    if (!file || !file.originalname) {
      return cb(new Error("❌ File is missing a name"), false);
    }

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      console.log("Rejected file:", file.originalname, file.mimetype);
      cb(new Error(`❌ Unsupported file format: ${file.mimetype}`), false);
    }
  } catch (err) {
    cb(new Error("❌ File validation error"), false);
  }
}

// --- 6️⃣ Multer instance ---
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

export default upload;
