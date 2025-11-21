// controllers/pdf/splitPdf.js
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { OUTPUT_DIR, zipFiles, removeFiles } from "../../utils/fileUtils.js";

export const splitPdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Upload a PDF in field 'file'." });

    const buffer = fs.readFileSync(file.path);
    const src = await PDFDocument.load(buffer);
    const pageCount = src.getPageCount();
    const outPaths = [];

    for (let i = 0; i < pageCount; i++) {
      const newDoc = await PDFDocument.create();
      const [copied] = await newDoc.copyPages(src, [i]);
      newDoc.addPage(copied);
      const outName = `${path.parse(file.originalname).name}_page_${i + 1}.pdf`;
      const outPath = path.join(OUTPUT_DIR, outName);
      const bytes = await newDoc.save();
      fs.writeFileSync(outPath, bytes);
      outPaths.push(outPath);
    }

    // cleanup upload
    removeFiles([file.path]);

    if (outPaths.length === 1) {
      return res.download(outPaths[0]);
    } else {
      const zipPath = await zipFiles(outPaths, `${path.parse(file.originalname).name}_split_${Date.now()}.zip`);
      // optionally remove individual pages after zipping
      // removeFiles(outPaths);
      return res.download(zipPath);
    }
  } catch (err) {
    console.error("splitPdf error:", err);
    return res.status(500).json({ error: "Split failed: " + (err.message || err) });
  }
};
