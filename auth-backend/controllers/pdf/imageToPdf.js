// controllers/pdf/imageToPdf.js
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * POST /api/pdf/image-to-pdf
 * upload.array('files', 50)
 * returns single PDF (images in uploaded order)
 */

export const imageToPdf = async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: "Upload one or more image files as 'files'." });

    const pdfDoc = await PDFDocument.create();

    for (const f of files) {
      const buffer = fs.readFileSync(f.path);
      // convert image to png buffer to ensure compatibility
      const pngBuffer = await sharp(buffer).png().toBuffer();
      const img = await pdfDoc.embedPng(pngBuffer);
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    const outName = `images_to_pdf_${Date.now()}.pdf`;
    const outPath = path.join(OUTPUT_DIR, outName);
    const bytes = await pdfDoc.save();
    fs.writeFileSync(outPath, bytes);

    // cleanup uploaded images
    removeFiles(files.map(f => f.path));

    return res.download(outPath, outName);
  } catch (err) {
    console.error("imageToPdf error:", err);
    return res.status(500).json({ error: "imageToPdf failed: " + (err.message || err) });
  }
};
