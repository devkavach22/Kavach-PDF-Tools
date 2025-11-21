// controllers/pdf/unlockPdf.js
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * unlockPdf - decrypt using qpdf
 * Request:
 *  - upload file 'file'
 *  - body.password => the user/owner password
 *
 * qpdf usage:
 *  qpdf --password=PASSWORD --decrypt input.pdf output.pdf
 */

function runQpdfDecrypt(inputPath, outputPath, password) {
  return new Promise((resolve, reject) => {
    const qpdf = "qpdf";
    const args = [`--password=${password}`, "--decrypt", inputPath, outputPath];
    execFile(qpdf, args, (err) => {
      if (err) return reject(err);
      resolve(outputPath);
    });
  });
}

export const unlockPdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Upload an encrypted PDF in 'file'." });

    const password = req.body.password;
    if (!password) {
      removeFiles([file.path]);
      return res.status(400).json({ error: "Provide 'password' in request body." });
    }

    const outName = `${path.parse(file.originalname).name}_unlocked_${Date.now()}.pdf`;
    const outPath = path.join(OUTPUT_DIR, outName);

    try {
      await runQpdfDecrypt(file.path, outPath, password);
      removeFiles([file.path]);
      return res.download(outPath, outName);
    } catch (err) {
      console.warn("qpdf decrypt failed:", err.message);
      removeFiles([file.path]);
      return res.status(500).json({ error: "Unlock failed; ensure qpdf is installed and password is correct." });
    }
  } catch (err) {
    console.error("unlockPdf error:", err);
    return res.status(500).json({ error: "unlockPdf failed: " + (err.message || err) });
  }
};
