// controllers/pdf/pdfToImage.js
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { OUTPUT_DIR, zipFiles, removeFiles } from "../../utils/fileUtils.js";

/**
 * POST /api/pdf/pdf-to-image
 * upload.single('file') or upload.array('files')
 * Returns PNGs (single image download if one page; zip if many files/pages)
 */

function pdftoppmConvert(inputPath, outPathPrefix) {
  return new Promise((resolve, reject) => {
    // -png -> create png files: outprefix-1.png, outprefix-2.png...
    execFile("pdftoppm", ["-png", inputPath, outPathPrefix], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export const pdfToImage = async (req, res) => {
  try {
    const files = (req.files && req.files.length) ? req.files : (req.file ? [req.file] : []);
    if (!files.length) return res.status(400).json({ error: "Upload PDF file(s) as 'file' or 'files'." });

    const allGenerated = [];

    for (const f of files) {
      const base = `${path.parse(f.originalname).name}_${Date.now()}`;
      const outPrefix = path.join(OUTPUT_DIR, base);
      try {
        await pdftoppmConvert(f.path, outPrefix);
      } catch (err) {
        console.error("pdftoppm error:", err);
        removeFiles([f.path]);
        return res.status(500).json({ error: "pdftoppm failed. Ensure poppler-utils is installed." });
      }

      // collect files created (they will be named base-1.png base-2.png ...)
      const dirFiles = fs.readdirSync(OUTPUT_DIR)
        .filter(n => n.startsWith(base))
        .map(n => path.join(OUTPUT_DIR, n));
      allGenerated.push(...dirFiles);

      // remove uploaded pdf
      removeFiles([f.path]);
    }

    if (allGenerated.length === 0) return res.status(500).json({ error: "No images produced." });

    if (allGenerated.length === 1) {
      return res.download(allGenerated[0]);
    } else {
      const zipPath = await zipFiles(allGenerated, `pdf_images_${Date.now()}.zip`);
      return res.download(zipPath);
    }
  } catch (err) {
    console.error("pdfToImage error:", err);
    return res.status(500).json({ error: "pdfToImage failed: " + (err.message || err) });
  }
};
