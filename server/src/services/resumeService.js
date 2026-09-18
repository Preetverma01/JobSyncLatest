import fs from "fs";
import { PDFParse } from "pdf-parse";

export const extractResumeText = async (filePath) => {
  let parser;

  try {
    const fileBuffer = fs.readFileSync(filePath);
    parser = new PDFParse({ data: fileBuffer });
    const data = await parser.getText();

    if (!data || !data.text || data.text.trim().length < 20) {
      throw new Error("EMPTY_PDF_TEXT");
    }

    return data.text.trim();
  } catch (error) {
    fs.unlink(filePath, () => {});
    throw error;
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};

export default { extractResumeText };
