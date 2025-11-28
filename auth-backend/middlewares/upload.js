import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user?.id;

    if (!userId) {
      return cb(new Error("User ID is missing"));
    }

    const url = req.originalUrl;

    // 1️⃣ TOOL ROUTES — DO NOT REQUIRE folderId
    if (url.startsWith("/api/pdf")) {
      const toolPath = path.join("uploads", userId.toString(), "tools");

      fs.mkdirSync(toolPath, { recursive: true });
      return cb(null, toolPath);
    }

    // 2️⃣ WORKSPACE ROUTES — REQUIRE folderId
    const folderId = req.body.folderId || req.query.folderId;

    if (!folderId) {
      return cb(new Error("Folder ID is missing"));
    }

    const workspacePath = path.join("uploads", "workspace", userId.toString(), folderId.toString());

    fs.mkdirSync(workspacePath, { recursive: true });
    return cb(null, workspacePath);
  }
});

const upload = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    cb(null, true);
  }
});

export default upload;
