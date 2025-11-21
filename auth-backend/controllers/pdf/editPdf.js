// controllers/pdf/editPdf.js
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import sharp from "sharp";
import { OUTPUT_DIR, removeFiles } from "../../utils/fileUtils.js";

/**
 * POST /api/pdf/edit-pdf
 * upload.fields([{name:'file',maxCount:1},{name:'image',maxCount:5}])
 * Body (form-data or JSON):
 *  - action: "addText"|"addImage"|"removePages"|"addBlankPage"
 *  - params: JSON string or fields describing params
 *
 * See earlier editPdf implementation for examples.
 */

function parsePagesSpec(spec, totalPages) {
  if (!spec) return [];
  const pages = new Set();
  for (const part of (spec + "").split(",")) {
    if (!part) continue;
    if (part.includes("-")) {
      const [s,e] = part.split("-");
      const start = Math.max(1, parseInt(s));
      const end = Math.min(totalPages, parseInt(e));
      for (let i = start; i <= end; i++) pages.add(i-1);
    } else {
      const idx = parseInt(part);
      if (!isNaN(idx)) pages.add(idx-1);
    }
  }
  return Array.from(pages).sort((a,b)=>a-b);
}

export const editPdf = async (req, res) => {
  try {
    const files = req.files || {};
    const pdfFile = (req.file) ? req.file : (files.file ? files.file[0] : null);
    if (!pdfFile) return res.status(400).json({ error: "Upload PDF as 'file'." });

    // action can be in body.action or body
    const action = (req.body.action || "").toString();
    let params = req.body.params || {};
    if (typeof params === "string") {
      try { params = JSON.parse(params); } catch (_) { /* keep raw */ }
    }

    const bytes = fs.readFileSync(pdfFile.path);
    if (action === "removePages") {
      // remove pages create new doc
      const src = await PDFDocument.load(bytes);
      const total = src.getPageCount();
      const toRemove = parsePagesSpec(params.pages || "", total);
      if (toRemove.length === 0) {
        removeFiles([pdfFile.path]);
        return res.status(400).json({ error: "No pages specified to remove" });
      }
      const keep = [];
      for (let i = 0; i < total; i++) if (!toRemove.includes(i)) keep.push(i);
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(src, keep);
      copied.forEach(p => newDoc.addPage(p));
      const outBytes = await newDoc.save();
      const outName = `${path.parse(pdfFile.originalname).name}_edited_${Date.now()}.pdf`;
      const outPath = path.join(OUTPUT_DIR, outName);
      fs.writeFileSync(outPath, outBytes);
      removeFiles([pdfFile.path]);
      return res.download(outPath, outName);
    }

    // For other actions we edit in-place
    const pdfDoc = await PDFDocument.load(bytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    if (action === "addText") {
      const pageIndex = Math.max(0, (parseInt(params.page || 1) - 1));
      const page = pdfDoc.getPage(pageIndex);
      const x = parseFloat(params.x || 50), y = parseFloat(params.y || 50);
      const text = params.text || "";
      const fontSize = parseFloat(params.fontSize || 24);
      const colorHex = (params.color || "#000000").replace("#", "");
      const r = parseInt(colorHex.substring(0,2),16)/255;
      const g = parseInt(colorHex.substring(2,4),16)/255;
      const b = parseInt(colorHex.substring(4,6),16)/255;
      page.drawText(String(text), { x, y, size: fontSize, font, color: rgb(r,g,b), rotate: degrees(parseFloat(params.rotate || 0)) });
    } else if (action === "addImage") {
      // image must be uploaded in 'image' field (first image used)
      const imageFile = (files.image && files.image[0]) || null;
      if (!imageFile) {
        removeFiles([pdfFile.path]);
        return res.status(400).json({ error: "Upload image in field 'image' to add." });
      }
      const imgBuf = fs.readFileSync(imageFile.path);
      const pngBuf = await sharp(imgBuf).png().toBuffer();
      const embedded = await pdfDoc.embedPng(pngBuf);
      const pageIndex = Math.max(0, (parseInt(params.page || 1) - 1));
      const page = pdfDoc.getPage(pageIndex);
      const x = parseFloat(params.x || 50), y = parseFloat(params.y || 50);
      const width = parseFloat(params.width || embedded.width), height = parseFloat(params.height || embedded.height);
      page.drawImage(embedded, { x, y, width, height, rotate: degrees(parseFloat(params.rotate || 0)) });
      removeFiles([imageFile.path]);
    } else if (action === "addBlankPage") {
      const w = parseFloat(params.width || 612), h = parseFloat(params.height || 792);
      pdfDoc.addPage([w, h]);
    } else {
      removeFiles([pdfFile.path]);
      return res.status(400).json({ error: "Unknown action. Use addText/addImage/removePages/addBlankPage." });
    }

    const outName = `${path.parse(pdfFile.originalname).name}_edited_${Date.now()}.pdf`;
    const outPath = path.join(OUTPUT_DIR, outName);
    const outBytes = await pdfDoc.save();
    fs.writeFileSync(outPath, outBytes);
    removeFiles([pdfFile.path]);

    return res.download(outPath, outName);
  } catch (err) {
    console.error("editPdf error:", err);
    return res.status(500).json({ error: "editPdf failed: " + (err.message || err) });
  }
};
