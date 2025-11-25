import axios from "axios";
import fs from "fs";

export const extractTextUsingOCR = async (filePath) => {
    try {
        const apiKey = process.env.OCR_SPACE_API_KEY;

        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));
        formData.append("language", "eng");
        formData.append("OCREngine", "2");

        const response = await axios.post(
            "https://api.ocr.space/parse/image",
            formData,
            {
                headers: {
                    apikey: apiKey,
                    ...formData.getHeaders()
                }
            }
        );

        const parsed = response?.data?.ParsedResults?.[0]?.ParsedText || "";
        return parsed;

    } catch (err) {
        console.error("OCR ERROR:", err);
        return "";
    }
};
