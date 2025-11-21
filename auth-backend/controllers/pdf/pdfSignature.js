// controllers/pdf/pdfSignature.js
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import sharp from "sharp";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * POST /api/pdf/pdf-signature
 * upload.fields([{name:'file',maxCount:1},{name:'signature',maxCount:1}])
 *
 * Body params:
 *  - pages: "all" or "1,3,5-7"
 *  - position: "bottom-right"|"bottom-left"|"top-right"|"center"|...
 *  - scale: fraction of page width (0.15 default)
 *  - signatureText: text fallback
 *  - fontSize: number
 */

function parsePagesSpec(spec, totalPages) {
  if (!spec || spec === "all") return Array.from({ length: totalPages }, (_, i) => i);
  const pages = new Set();
  for (const part of spec.split(",")) {
    if (part.includes("-")) {
      const [s, e] = part.split("-");
      const start = Math.max(1, parseInt(s));
      const end = Math.min(totalPages, parseInt(e));
      for (let i = start; i <= end; i++) pages.add(i - 1);
    } else {
      const idx = parseInt(part);
      if (!isNaN(idx)) pages.add(idx - 1);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export const pdfSignature = async (req, res) => {
  try {
    const files = req.files || {};
    const pdfFile = (req.file) ? req.file : (files.file ? files.file[0] : null);
    const sigFile = files.signature ? files.signature[0] : null;

    if (!pdfFile) return res.status(400).json({ error: "Upload PDF as 'file'." });

    const {
      pages = "all",
      position = "bottom-right",
      scale = 0.18,
      signatureText = "Signed",
      fontSize = 36,
      rotate = 0
    } = req.body;

    const pdfBytes = fs.readFileSync(pdfFile.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();
    const pageIndices = parsePagesSpec(pages, totalPages);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let sigImageEmbed = null;
    if (sigFile) {
      const imgBuf = fs.readFileSync(sigFile.path);
      const pngBuf = await sharp(imgBuf).png().toBuffer();
      sigImageEmbed = await pdfDoc.embedPng(pngBuf);
    }

    for (const idx of pageIndices) {
      const page = pdfDoc.getPage(idx);
      const { width, height } = page.getSize();

      if (sigImageEmbed) {
        const targetWidth = Math.max(30, width * parseFloat(scale));
        const ratio = sigImageEmbed.height / sigImageEmbed.width;
        const targetHeight = targetWidth * ratio;

        let x, y;
        switch (position) {
          case "top-left":
            x = 20; y = height - targetHeight - 20; break;
          case "top-right":
            x = width - targetWidth - 20; y = height - targetHeight - 20; break;
          case "center":
            x = (width - targetWidth) / 2; y = (height - targetHeight) / 2; break;
          case "bottom-left":
            x = 20; y = 20; break;
          case "bottom-right":
          default:
            x = width - targetWidth - 20; y = 20;
        }

        page.drawImage(sigImageEmbed, {
          x, y, width: targetWidth, height: targetHeight, rotate: degrees(parseFloat(rotate))
        });
      } else {
        // text signature
        const size = parseFloat(fontSize);
        const textWidth = font.widthOfTextAtSize(signatureText, size);
        const textHeight = size;

        let x, y;
        switch (position) {
          case "top-left":
            x = 20; y = height - textHeight - 20; break;
          case "top-right":
            x = width - textWidth - 20; y = height - textHeight - 20; break;
          case "center":
            x = (width - textWidth) / 2; y = (height - textHeight) / 2; break;
          case "bottom-left":
            x = 20; y = 20; break;
          case "bottom-right":
          default:
            x = width - textWidth - 20; y = 20;
        }

        page.drawText(signatureText, { x, y, size, font, color: rgb(0,0,0), rotate: degrees(parseFloat(rotate)) });
      }
    }

    const outName = `${path.parse(pdfFile.originalname).name}_signed_${Date.now()}.pdf`;
    const outPath = path.join(OUTPUT_DIR, outName);
    const outBytes = await pdfDoc.save();
    fs.writeFileSync(outPath, outBytes);

    // cleanup
    const toRemove = [pdfFile.path];
    if (sigFile) toRemove.push(sigFile.path);
    removeFiles(toRemove);

    return res.download(outPath, outName);
  } catch (err) {
    console.error("pdfSignature error:", err);
    return res.status(500).json({ error: "pdfSignature failed: " + (err.message || err) });
  }
};
