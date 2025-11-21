// controllers/pdf/mergePdf.js
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { OUTPUT_DIR } from "../../utils/fileUtils.js";
import { removeFiles } from "../../utils/fileUtils.js";

export const mergePdf = async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: "Upload 2 or more PDFs in field 'files'." });
    if (files.length < 2) return res.status(400).json({ error: "At least 2 PDFs required to merge." });

    const mergedPdf = await PDFDocument.create();

    // Preserve order as uploaded
    for (const f of files) {
      const bytes = fs.readFileSync(f.path);
      const doc = await PDFDocument.load(bytes);
      const copied = await mergedPdf.copyPages(doc, doc.getPageIndices());
      copied.forEach(p => mergedPdf.addPage(p));
    }

    const outName = `merged_${Date.now()}.pdf`;
    const outPath = path.join(OUTPUT_DIR, outName);
    const mergedBytes = await mergedPdf.save();
    fs.writeFileSync(outPath, mergedBytes);

    // cleanup uploads
    removeFiles(files.map(f => f.path));

    return res.download(outPath, outName, (err) => {
      if (err) console.error("mergePdf download error:", err);
    });
  } catch (err) {
    console.error("mergePdf error:", err);
    return res.status(500).json({ error: "Merge failed: " + (err.message || err) });
  }
};
