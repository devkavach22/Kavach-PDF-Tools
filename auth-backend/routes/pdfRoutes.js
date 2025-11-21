import express from "express";
import upload from "../middlewares/upload.js";
import {auth} from "../middlewares/auth.js";
import { mergePdf } from "../controllers/pdf/mergePdf.js";
import {pdfToWord} from "../controllers/pdf/pdfToWord.js";
import {pdfToExcel} from "../controllers/pdf/pdfToExcel.js";
import {splitPdf} from "../controllers/pdf/splitPdf.js";
import {watermarkPdf} from "../controllers/pdf/watermarkPdf.js";
import {imageToPdf} from "../controllers/pdf/imageToPdf.js";
import {compressPdf} from "../controllers/pdf/compressPdf.js";
import {pdfSignature} from "../controllers/pdf/pdfSignature.js";
import {pdfToImage} from "../controllers/pdf/pdfToImage.js";
import {pdfToPpt} from "../controllers/pdf/pdfToPpt.js";
import {protectPdf} from "../controllers/pdf/protectPdf.js";
import {wordToPdf} from "../controllers/pdf/wordToPdf.js";
import {unlockPdf} from "../controllers/pdf/unlockPdf.js";
import {rotatePdf} from "../controllers/pdf/rotatePdf.js";
import { downloadGeneratedFile } from "../controllers/pdf/downloadGeneratedFile.js";
// import { Router } from "express";
// import { split } from "postcss/lib/list";

const router = express.Router();

router.post("/merge-pdf",auth,upload.array("files",10),mergePdf);

router.post("/pdf-to-word",auth,upload.array("files"),pdfToWord);

router.post("/pdf-to-excel",auth,upload.array("files"),pdfToExcel);

router.post("/pdf-sign",auth,upload.array("files"),pdfSignature);

router.post("/pdf-to-image",auth,upload.array("files"),pdfToImage);

router.post("/image-to-pdf",auth,upload.array("files"),imageToPdf);

router.post("/split-pdf",auth,upload.single("file"),splitPdf);

router.post("/compress-pdf",auth,upload.array("files",20),compressPdf);

router.post("/pdf-to-ppt",auth,upload.array("files"),pdfToPpt);

router.post("/watermark-pdf",auth,upload.array("files"),watermarkPdf);

router.post("/protect-pdf",auth,upload.array("files"),protectPdf);

router.post("/word-to-pdf",auth,upload.array("files"),wordToPdf);

router.post("/unlock-pdf",auth,upload.array("files"),unlockPdf);

router.post("/rotate-pdf",auth,upload.array("files"),rotatePdf);

router.get("/download/:filename",auth,downloadGeneratedFile);

export default router;