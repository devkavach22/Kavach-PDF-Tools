// controllers/pdf/pdfToPpt.js
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * pdfToPpt - Hybrid approach using LibreOffice (soffice) headless conversion
 * - LibreOffice supports PDF -> PPTX conversion to some degree
 * - If LibreOffice not installed, returns informative error
 *
 * Request:
 * - upload single file 'file'
 */

function runLibreConvert(inputPath, outputDir, outExt) {
  return new Promise((resolve, reject) => {
    // prefer 'soffice' or 'libreoffice' executable depending on system
    const cmdCandidates = ["soffice", "libreoffice"];
    let tried = 0;

    const tryExec = (cmd) => {
      // --headless --convert-to <ext> --outdir <dir> <file>
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

export const pdfToPpt = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Upload a PDF in 'file'." });

    const outDir = OUTPUT_DIR;
    const outExt = "pptx"; // LibreOffice convert-to string

    try {
      await runLibreConvert(file.path, outDir, outExt);
    } catch (err) {
      console.error("LibreOffice convert error:", err);
      removeFiles([file.path]);
      return res.status(500).json({
        error: "Conversion failed. Ensure LibreOffice (soffice) is installed and on PATH."
      });
    }

    // LibreOffice will create <basename>.pptx in outDir
    const base = path.parse(file.originalname).name;
    const outName = `${base}.pptx`;
    const outPath = path.join(outDir, outName);

    if (!fs.existsSync(outPath)) {
      // sometimes LibreOffice uses different naming; try to find any recent pptx
      const found = fs.readdirSync(outDir).filter(n => n.endsWith(".pptx")).map(n => path.join(outDir, n));
      if (found.length === 0) {
        removeFiles([file.path]);
        return res.status(500).json({ error: "Conversion finished but output not found." });
      }
      // choose the latest pptx
      found.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
      return res.download(found[0]);
    }

    // cleanup upload
    removeFiles([file.path]);

    return res.download(outPath, outName);
  } catch (err) {
    console.error("pdfToPpt error:", err);
    return res.status(500).json({ error: "pdfToPpt failed: " + (err.message || err) });
  }
};
