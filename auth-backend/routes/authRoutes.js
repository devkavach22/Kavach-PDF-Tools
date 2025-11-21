import express from "express";
import { register,login, forgotPassword, resetPassword, logout, changePassword } from "../controllers/authController.js";
import {auth} from "../middlewares/auth.js";
import { authorize } from "../middlewares/roles.js";
import User from "../models/Users.js";
import Folder from "../models/Folder.js";
import File from "../models/File.js";
import upload  from "../middlewares/upload.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/admin", auth, authorize("admin"), (req,res) => {
    res.json({ message: "Admin Access Granted!"});
});

router.get("/user", auth, authorize("admin","user"), (req,res) => {
    res.json({ message: "User Access Granted!"});
});

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

router.post("/folder/create",auth,async(req,res) => {
    try
    {
        const { name,createdAt,updatedAt,desc } = req.body;

        const folder = await Folder.create({
            userId: req.user.id,
            name,
            desc: desc || " ",
            createdAt: createdAt || new Date(),
            updatedAt: updatedAt || new Date(),
        });

        res.json({message: "Folder Created", folder});
    }
    catch(error)
    {
        res.status(500).json({error:error.message});
    }
});

router.get("/folders",auth,async(req,res) => {
    try
    {
        const folders = await Folder.find({userId: req.user.id});

        res.json({folders});
    }
    catch (error)
    {
        res.status(500).json({error:error.message});
    }
});

// router.post("/upload/:folderId",auth,upload.array("files"),async(req,res) => {
//     try
//     {
//         const folderId = req.params.folderId;

//         const filesInfo = req.files.map((file) => ({
//             folderId,
//             userId: req.user.id,
//             originalName: file.originalName,
//             storedName: file.fileName,
//             size: file.size,
//             extension: file.originalName.split(".").pop(),
//             mimeType: file.mimeType,
//         }));

//     }

//     catch (error)
//     {
//         res.status(500).json({error: error.message});
//     }
// });

router.post("/upload/:folderId", auth, upload.array("files"), async (req, res) => {
  try {
    const folderId = req.params.folderId;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const filesInfo = req.files.map((file) => ({
      folderId,
      userId: req.user.id,

      originalName: file.originalname,     // FIXED
      storedName: file.filename,           // FIXED
      size: file.size,
      
      extension: file.originalname.includes(".")      // SAFE EXTENSION EXTRACT
        ? file.originalname.substring(file.originalname.lastIndexOf(".") + 1)
        : "unknown",

      mimeType: file.mimetype,             // FIXED
      path: file.path,                     // Full path to file
      uploadedAt: new Date(),
    }));

    // Save all file entries to database
    const savedFiles = await File.insertMany(filesInfo);

    res.status(200).json({
      message: "Files uploaded successfully",
      files: savedFiles,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/files/:folderId",auth,async(req,res) => {
    try
    {
        const folderId = req.params.folderId;

        const files = await File.find({
            folderId,
            userId: req.user.id,
        });

        res.json({files});
    }
    catch (error)
    {
        res.status(500).json({error: error.message});
    }
});

// router.get("/dashboard",auth,async(req,res) => {
//     try
//     {
//         const folders = await Folder.find({userId: req.user.id});
//         const files = await File.find({userId: req.user.id});

//         res.json({
//             userId: req.user.id,
//             totalFolders: folders.length,
//             totalFiles: files.length,
//             folders,
//             files
//         });
//     }
//     catch (error)
//     {
//         res.status(500).json({error:error.message});
//     }
// });

router.put("/change-password",changePassword);
router.put("/verify-otp",changePassword);

// router.post("/send-otp",auth,async(req,res) => {
//     try
//     {
//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({ error: "User not found"});
//         // Generate OTP
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
//         user.otp = otp;
//         user.otpExpires = otpExpires;
//         await user.save();

//         res.json({ message: "OTP sent to your registered email id.", otp }); // In production, do not send OTP in response
//     }
//     catch (error)
//     {
//         res.status(500).json({ error: error.message });
//     }   
// });

// router.post("/verify-otp",auth,async(req,res) => {
//     try
//     {
//         const { otp } = req.body;
//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({ error: "User not found"});     
//         if (user.otp !== otp || Date.now() > user.otpExpires)
//         {
//             return res.status(400).json({ error: "Invalid or expired OTP"});
//         } 
//         // OTP is valid
//         user.otp = undefined;
//         user.otpExpires = undefined;
//         await user.save();    
//         res.json({ message: "OTP verified successfully."});
//     }
//     catch (error)
//     {
//         res.status(500).json({ error: error.message });
//     } 
// });

export default router;