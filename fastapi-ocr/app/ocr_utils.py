import os
import io
import fitz               # PyMuPDF
import easyocr
from PIL import Image
from docx import Document

# Load EasyOCR reader once (improves speed)
READER = easyocr.Reader(['en'], gpu=False)


# -------------------------------------------------------------
# Convert image bytes → text
# -------------------------------------------------------------
def ocr_image(image_bytes: bytes) -> str:
    import numpy as np
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    arr = np.array(img)

    results = READER.readtext(arr, detail=0)
    return "\n".join(results).strip()


# -------------------------------------------------------------
# Convert PDF → images → EasyOCR text
# -------------------------------------------------------------
def ocr_pdf(pdf_bytes: bytes) -> str:
    text_pages = []

    # Load PDF from memory (NO poppler required)
    pdf = fitz.open(stream=pdf_bytes, filetype="pdf")

    for page_index in range(len(pdf)):
        page = pdf.load_page(page_index)

        # Convert page → high-quality image
        pix = page.get_pixmap(dpi=300)
        img_bytes = pix.tobytes("png")

        # OCR the page
        page_text = ocr_image(img_bytes)
        text_pages.append(f"--- PAGE {page_index+1} ---\n{page_text}")

    return "\n\n".join(text_pages).strip()


# -------------------------------------------------------------
# Extract DOCX text
# -------------------------------------------------------------
def extract_docx(docx_bytes: bytes) -> str:
    try:
        file_like = io.BytesIO(docx_bytes)
        doc = Document(file_like)

        lines = []
        for para in doc.paragraphs:
            if para.text.strip():
                lines.append(para.text.strip())

        return "\n".join(lines)
    except:
        return ""


# -------------------------------------------------------------
# Universal extractor for ANY file type
# -------------------------------------------------------------
def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()

    # ---- IMAGE FILES ----
    if ext in [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".webp"]:
        return ocr_image(file_bytes)

    # ---- PDF ----
    if ext == ".pdf":
        return ocr_pdf(file_bytes)

    # ---- DOCX ----
    if ext == ".docx":
        return extract_docx(file_bytes)

    # ---- SIMPLE TEXT ----
    if ext in [".txt", ".csv", ".json", ".md", ".log",".xlsx"]:
        return file_bytes.decode("utf-8", errors="ignore")

    # ---- DOC (old format) ----
    if ext == ".doc":
        # Convert DOC → DOCX fallback through python-docx cannot open DOC.
        # So we treat DOC as scanned image container.
        # Try PDF conversion first:
        return "DOC format not directly supported. Convert to DOCX or PDF."

    # ---- ANY OTHER FILE (fallback OCR) ----
    try:
        return ocr_image(file_bytes)
    except:
        return ""
