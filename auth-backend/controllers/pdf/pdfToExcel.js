// controllers/pdf/pdfToExcel.js
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * pdfToExcel - Hybrid approach via LibreOffice convert-to xlsx
 * - Note: LibreOffice results vary depending on PDF content. For table-heavy PDFs, Tabula/Camelot would be better.
 *
 * Request:
 * - upload single file 'file'
 */

function runLibreConvert(inputPath, outputDir, outExt) {
  return new Promise((resolve, reject) => {
    const cmdCandidates = ["soffice", "libreoffice"];
    let tried = 0;

    const tryExec = (cmd) => {
      const args = ["--headless", "--convert-to", outExt, "--outdir", outputDir, inputPath];
      execFile(cmd, args, (err, stdout, stderr) => {
        if (!err) return resolve({ cmd, stdout });
        tried++;
        if (tried >= cmdCandidates.length) return reject(err);
        tryExec(cmdCandidates[tried]);
      });
    };

    tryExec(cmdCandidates[0]);
  });
}

export const pdfToExcel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Upload a PDF in 'file'." });

    const outDir = OUTPUT_DIR;
    const outExt = "xlsx";

    try {
      await runLibreConvert(file.path, outDir, outExt);
    } catch (err) {
      console.error("LibreOffice convert error:", err);
      removeFiles([file.path]);
      return res.status(500).json({
        error: "Conversion failed. Try installing LibreOffice or use a specialized table extractor (Tabula)."
      });
    }

    const base = path.parse(file.originalname).name;
    const outName = `${base}.xlsx`;
    const outPath = path.join(outDir, outName);

    if (!fs.existsSync(outPath)) {
      // find recent xlsx
      const found = fs.readdirSync(outDir).filter(n => n.endsWith(".xlsx")).map(n => path.join(outDir, n));
      if (found.length === 0) {
        removeFiles([file.path]);
        return res.status(500).json({ error: "Conversion finished but output not found." });
      }
      found.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
      return res.download(found[0]);
    }

    removeFiles([file.path]);
    return res.download(outPath, outName);
  } catch (err) {
    console.error("pdfToExcel error:", err);
    return res.status(500).json({ error: "pdfToExcel failed: " + (err.message || err) });
  }
};
