// controllers/pdf/wordToPdf.js
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * POST /api/pdf/word-to-pdf
 * upload.single('file')  (docx/doc)
 * returns .pdf
 */

function runLibreConvert(inputPath, outputDir, outExt) {
  return new Promise((resolve, reject) => {
    const candidates = ["soffice", "libreoffice"];
    let idx = 0;
    const tryExec = () => {
      const cmd = candidates[idx];
      const args = ["--headless", "--convert-to", outExt, "--outdir", outputDir, inputPath];
      execFile(cmd, args, (err) => {
        if (!err) return resolve();
        idx++;
        if (idx >= candidates.length) return reject(err);
        tryExec();
      });
    };
    tryExec();
  });
}

export const wordToPdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Upload Word (doc/docx) as 'file'." });

    const outExt = "pdf";
    try {
      await runLibreConvert(file.path, OUTPUT_DIR, outExt);
    } catch (err) {
      removeFiles([file.path]);
      console.error("LibreOffice convert error:", err);
      return res.status(500).json({ error: "Conversion failed. Ensure LibreOffice is installed." });
    }

    const base = path.parse(file.originalname).name;
    let outPath = path.join(OUTPUT_DIR, `${base}.pdf`);
    if (!fs.existsSync(outPath)) {
      const found = fs.readdirSync(OUTPUT_DIR).filter(n => n.endsWith(".pdf")).map(n => path.join(OUTPUT_DIR, n));
      if (found.length === 0) {
        removeFiles([file.path]);
        return res.status(500).json({ error: "Conversion finished but output not found." });
      }
      found.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
      outPath = found[0];
    }

    const outName = path.basename(outPath);
    removeFiles([file.path]);
    return res.download(outPath, outName);
  } catch (err) {
    console.error("wordToPdf error:", err);
    return res.status(500).json({ error: "wordToPdf failed: " + (err.message || err) });
  }
};
