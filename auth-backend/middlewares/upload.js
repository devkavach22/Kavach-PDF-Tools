import multer from "multer";
import fs from "fs";
import path from "path";

// Auto-create uploads folder
// const uploadFolder = path.join(process.cwd(), "uploads");
const BASE_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || path.join(process.cwd(), "uploads", "workspace");

// if (!fs.existsSync(uploadFolder)) {
//     fs.mkdirSync(uploadFolder, { recursive: true });
//     console.log("✔ uploads folder created");
// }

// Storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user?.id;
        const folderId = req.params?.folderId;

        if (!userId || !folderId) {
            return cb(new Error("User ID or Folder ID is missing"));
        }

        const finalPath = path.join(BASE_STORAGE_PATH, userId.toString(), folderId.toString());
        if (!fs.existsSync(finalPath)) {
            fs.mkdirSync(finalPath, { recursive: true });
            console.log("Created directory:", finalPath);
        }
        cb(null, finalPath);
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Accept ALL file types (zip, rar, csv, pptx, etc.)
function fileFilter(req, file, cb) {
    cb(null, true); 
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max
    }
});

export default upload;
