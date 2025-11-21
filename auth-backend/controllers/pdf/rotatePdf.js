// controllers/pdf/rotatePdf.js
import fs from "fs";
import path from "path";
import { PDFDocument, degrees } from "pdf-lib";
import { OUTPUT_DIR, removeFiles, zipFiles } from "../../utils/fileUtils.js";

/**
 * POST /api/pdf/rotate-pdf
 * upload.single('file') or upload.array('files')
 * body:
 *  - angle: 90|180|270 (default 90)
 *  - pages: "all" or "1,3,5-7"
 *
 * If multiple files uploaded, returns ZIP of rotated PDFs.
 */

function parsePages(spec, total) {
  if (!spec || spec === "all") return null; // null => all pages
  const set = new Set();
  for (const part of spec.split(",")) {
    if (part.includes("-")) {
      const [s,e] = part.split("-");
      const start = Math.max(1, parseInt(s));
      const end = Math.min(total, parseInt(e));
      for (let i = start; i <= end; i++) set.add(i-1);
    } else {
      const idx = parseInt(part);
      if (!isNaN(idx)) set.add(idx-1);
    }
  }
  return Array.from(set).sort((a,b)=>a-b);
}

export const rotatePdf = async (req, res) => {
  try {
    const files = req.files && req.files.length ? req.files : (req.file ? [req.file] : []);
    if (!files.length) return res.status(400).json({ error: "Upload PDF(s) as 'file' or 'files'." });

    const angle = parseInt(req.body.angle || "90", 10);
    const pagesSpec = req.body.pages || "all";
    const resultPaths = [];

    for (const f of files) {
      const bytes = fs.readFileSync(f.path);
      const doc = await PDFDocument.load(bytes);
      const total = doc.getPageCount();
      const pagesToRotate = parsePages(pagesSpec, total); // null => rotate all
      const pagesIdx = pagesToRotate === null ? Array.from({length: total}, (_,i)=>i) : pagesToRotate;

      for (const idx of pagesIdx) {
        const page = doc.getPage(idx);
        // compute new rotation: pdf-lib uses setRotation with degrees()
        page.setRotation(degrees(angle));
      }

      const outName = `${path.parse(f.originalname).name}_rotated_${Date.now()}.pdf`;
      const outPath = path.join(OUTPUT_DIR, outName);
      const outBytes = await doc.save();
      fs.writeFileSync(outPath, outBytes);
      resultPaths.push(outPath);

      removeFiles([f.path]);
    }

    if (resultPaths.length === 1) return res.download(resultPaths[0]);
    const zipPath = await zipFiles(resultPaths, `rotated_${Date.now()}.zip`);
    return res.download(zipPath);
  } catch (err) {
    console.error("rotatePdf error:", err);
    return res.status(500).json({ error: "rotatePdf failed: " + (err.message || err) });
  }
};
