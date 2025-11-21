// controllers/pdf/protectPdf.js
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * protectPdf - encrypt using qpdf for robust encryption
 * Request:
 *  - upload single file 'file'
 *  - body:
 *     - password: required
 *     - ownerPassword: optional (if omitted, same as password)
 *
 * qpdf command:
 *  qpdf --encrypt user-password owner-password 256 -- input.pdf output.pdf
 */

function runQpdfEncrypt(inputPath, outputPath, userPass, ownerPass) {
  return new Promise((resolve, reject) => {
    const qpdf = "qpdf";
    const args = ["--encrypt", userPass, ownerPass, "256", "--", inputPath, outputPath];
    execFile(qpdf, args, (err) => {
      if (err) return reject(err);
      resolve(outputPath);
    });
  });
}

export const protectPdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Upload a PDF in 'file'." });

    const password = req.body.password || req.body.userPassword;
    let ownerPassword = req.body.ownerPassword || password;

    if (!password) {
      removeFiles([file.path]);
      return res.status(400).json({ error: "Provide 'password' in request body." });
    }

    const outName = `${path.parse(file.originalname).name}_protected_${Date.now()}.pdf`;
    const outPath = path.join(OUTPUT_DIR, outName);

    try {
      await runQpdfEncrypt(file.path, outPath, password, ownerPassword);
      removeFiles([file.path]);
      return res.download(outPath, outName);
    } catch (err) {
      console.warn("qpdf encrypt failed:", err.message);
      // fallback attempt: return 400 with informative message
      removeFiles([file.path]);
      return res.status(500).json({ error: "Protection failed; ensure qpdf is installed on server." });
    }
  } catch (err) {
    console.error("protectPdf error:", err);
    return res.status(500).json({ error: "protectPdf failed: " + (err.message || err) });
  }
};
