import fs from "fs";

// pdfjs-dist ships an ESM legacy build that works well in Node without a DOM.
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * Extracts raw text from a PDF file on disk.
 * @param {string} filePath - Absolute path to the uploaded PDF.
 * @returns {Promise<string>} Extracted, cleaned text.
 */
export async function extractTextFromPDF(filePath) {
  let data;
  try {
    data = new Uint8Array(fs.readFileSync(filePath));
  } catch (err) {
    throw new Error("PDF_PARSE_FAILED");
  }

  try {
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdfDocument = await loadingTask.promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    const cleaned = fullText.replace(/\s+/g, " ").trim();

    if (!cleaned || cleaned.length < 20) {
      throw new Error("EMPTY_PDF_TEXT");
    }

    return cleaned;
  } catch (err) {
    if (err.message === "EMPTY_PDF_TEXT") {
      throw err;
    }
    throw new Error("PDF_PARSE_FAILED");
  } finally {
    // Clean up the uploaded file after extraction (success or failure)
    fs.unlink(filePath, () => {});
  }
}

export default extractTextFromPDF;
