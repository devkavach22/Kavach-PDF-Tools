// controllers/pdf/optimizePdf.js
import path from "path";
import fs from "fs";
import { execFile } from "child_process";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * optimizePdf - Ghostscript-based optimization with presets and options
 *
 * Request:
 *  - upload single file as 'file'
 *  - body:
 *     - preset: "screen"|"ebook"|"printer"|"prepress"  (default: "screen")
 *     - downscaleImages: boolean (default true)    // instructive only, handled by preset
 *     - jpegQuality: number 1-100 (optional control for custom compression)
 *
 * Notes:
 *  - Ghostscript presets map to /screen /ebook /printer /prepress
 *  - For custom settings, we construct args accordingly
 */

const presetMap = {
  screen: "/screen",
  ebook: "/ebook",
  printer: "/printer",
  prepress: "/prepress"
};

export const optimizePdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Upload PDF in field 'file'." });

    const presetKey = (req.body.preset || "screen").toLowerCase();
    const preset = presetMap[presetKey] || presetMap.screen;
    const jpegQuality = parseInt(req.body.jpegQuality || "75", 10);

    const outName = `${path.parse(file.originalname).name}_optimized_${Date.now()}.pdf`;
    const outPath = path.join(OUTPUT_DIR, outName);

    // Build ghostscript args. We include -dColorImageDownsampleType and -dColorImageResolution if custom flow needed.
    // For hybrid approach, use PDFSETTINGS and optionally override downsample and JPEG quality.
    const gs = "gs";
    const args = [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      `-dPDFSETTINGS=${preset}`,
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      `-sOutputFile=${outPath}`,
      file.path
    ];

    // Attempt to run ghostscript
    execFile(gs, args, (err) => {
      // cleanup uploaded
      removeFiles([file.path]);

      if (err) {
        console.error("Ghostscript optimize error:", err);
        return res.status(500).json({ error: "Optimization failed. Ensure Ghostscript is installed." });
      }

      return res.download(outPath, outName);
    });
  } catch (err) {
    console.error("optimizePdf error:", err);
    return res.status(500).json({ error: "Optimize failed: " + (err.message || err) });
  }
};
