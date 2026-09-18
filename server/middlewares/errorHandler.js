import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  console.error("[JobSync Error]", err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message:
          "Your resume file is too large. Please upload a PDF smaller than 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: "There was a problem uploading your file. Please try again.",
    });
  }

  if (err.message === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: "Only PDF files are supported. Please upload a .pdf resume.",
    });
  }

  if (err.message === "NO_FILE_UPLOADED") {
    return res.status(400).json({
      success: false,
      message: "No resume file was uploaded. Please select a PDF and try again.",
    });
  }

  if (err.message === "PDF_PARSE_FAILED") {
    return res.status(422).json({
      success: false,
      message:
        "We couldn't read text from that PDF. It may be scanned/image-based or corrupted.",
    });
  }

  if (err.message === "EMPTY_PDF_TEXT") {
    return res.status(422).json({
      success: false,
      message:
        "No readable text was found in the PDF. Please upload a text-based resume.",
    });
  }

  if (err.message === "GROQ_API_FAILED") {
    return res.status(502).json({
      success: false,
      message:
        "Our AI analysis service is currently unavailable. Please try again in a moment.",
    });
  }

  if (err.message === "INVALID_AI_JSON") {
    return res.status(502).json({
      success: false,
      message:
        "The AI returned an unexpected response. Please try analyzing your resume again.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong on our end. Please try again shortly.",
  });
};

export default errorHandler;