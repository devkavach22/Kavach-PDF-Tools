// controllers/pdf/watermarkPdf.js
import fs from "fs";
import path from "path";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * Request:
 * - Upload: single file (field name: "file")
 * - Body JSON params (all optional except 'text'):
 *    - text (string)                // required
 *    - pages (string)              // "all" or "1,3,5-7"
 *    - fontSize (number)           // default: 48
 *    - color (string)              // hex e.g. "#000000" default: "#000000"
 *    - opacity (0-1)               // default: 0.15
 *    - rotation (number degrees)   // default: -45
 *    - position (string)           // "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" (default: "center")
 *    - margin (number)             // px margin from edges when using corners (default: 20)
 *
 * Returns:
 * - downloads watermarked PDF
 */

function hexToRgb(hex) {
  // support #RRGGBB or RRGGBB
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return { r, g, b };
}

function parsePagesSpec(spec, totalPages) {
  // spec: "all" or "1,3,5-7"
  if (!spec || spec === "all") {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  const pages = new Set();
  const parts = spec.split(",");
  for (const p of parts) {
    if (p.includes("-")) {
      const [startStr, endStr] = p.split("-");
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      for (let i = start; i <= end; i++) pages.add(i - 1);
    } else {
      const idx = parseInt(p, 10);
      if (!isNaN(idx) && idx >= 1 && idx <= totalPages) pages.add(idx - 1);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export const watermarkPdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Upload a PDF in field 'file'." });

    const {
      text,
      pages = "all",
      fontSize = 48,
      color = "#000000",
      opacity = 0.15,
      rotation = -45,
      position = "center",
      margin = 20
    } = req.body;

    if (!text || text.toString().trim() === "") {
      // cleanup
      removeFiles([file.path]);
      return res.status(400).json({ error: "Provide 'text' in request body for watermark." });
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // choose font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const totalPages = pdfDoc.getPageCount();
    const pageIndices = parsePagesSpec(pages, totalPages);

    // compute color
    const { r, g, b } = hexToRgb(color);

    for (const idx of pageIndices) {
      const page = pdfDoc.getPage(idx);
      const { width, height } = page.getSize();

      // measure text
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = fontSize;

      // determine placement
      let x, y;
      switch (position) {
        case "top-left":
          x = margin;
          y = height - margin - textHeight;
          break;
        case "top-right":
          x = width - margin - textWidth;
          y = height - margin - textHeight;
          break;
        case "bottom-left":
          x = margin;
          y = margin;
          break;
        case "bottom-right":
          x = width - margin - textWidth;
          y = margin;
          break;
        case "center":
        default:
          x = (width - textWidth) / 2;
          y = (height - textHeight) / 2;
      }

      page.drawText(text, {
        x,
        y,
        size: parseFloat(fontSize),
        font,
        color: rgb(r, g, b),
        rotate: degrees(parseFloat(rotation)),
        opacity: parseFloat(opacity)
      });
    }

    const outName = `${path.parse(file.originalname).name}_watermarked_${Date.now()}.pdf`;
    const outPath = path.join(OUTPUT_DIR, outName);
    const outBytes = await pdfDoc.save();
    fs.writeFileSync(outPath, outBytes);

    // cleanup uploaded file
    removeFiles([file.path]);

    return res.download(outPath, outName, (err) => {
      if (err) console.error("Download err:", err);
    });
  } catch (err) {
    console.error("watermarkPdf error:", err);
    return res.status(500).json({ error: "Watermark failed: " + (err.message || err) });
  }
};
