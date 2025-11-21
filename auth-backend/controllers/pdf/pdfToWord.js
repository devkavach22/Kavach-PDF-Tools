// controllers/pdf/pdfToWord.js
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * POST /api/pdf/pdf-to-word
 * upload.single('file')
 * returns .docx
 */

function runLibreConvert(inputPath, outputDir, outExt) {
  return new Promise((resolve, reject) => {
    const candidates = ["soffice", "libreoffice"];
    let tryIndex = 0;

    const tryExec = () => {
      const cmd = candidates[tryIndex];
      const args = ["--headless", "--convert-to", outExt, "--outdir", outputDir, inputPath];
      execFile(cmd, args, (err, stdout, stderr) => {
        if (!err) return resolve({ cmd, stdout });
        tryIndex++;
        if (tryIndex >= candidates.length) return reject(err);
        tryExec();
      });
    };

    tryExec();
  });
}

export const pdfToWord = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Upload PDF as 'file'." });

    const outExt = "docx";
    try {
      await runLibreConvert(file.path, OUTPUT_DIR, outExt);
    } catch (err) {
      removeFiles([file.path]);
      console.error("LibreOffice convert error:", err);
      return res.status(500).json({ error: "Conversion failed. Ensure LibreOffice is installed." });
    }

    const base = path.parse(file.originalname).name;
    // LibreOffice usually writes `${base}.docx` in OUTPUT_DIR
    let outPath = path.join(OUTPUT_DIR, `${base}.docx`);
    if (!fs.existsSync(outPath)) {
      // try to find most recent docx in OUTPUT_DIR
      const candidates = fs.readdirSync(OUTPUT_DIR)
        .filter(n => n.endsWith(".docx"))
        .map(n => path.join(OUTPUT_DIR, n));
      if (candidates.length === 0) {
        removeFiles([file.path]);
        return res.status(500).json({ error: "Conversion finished but output not found." });
      }
      candidates.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
      outPath = candidates[0];
    }

    const outName = path.basename(outPath);
    removeFiles([file.path]);
    return res.download(outPath, outName);
  } catch (err) {
    console.error("pdfToWord error:", err);
    return res.status(500).json({ error: "pdfToWord failed: " + (err.message || err) });
  }
};
