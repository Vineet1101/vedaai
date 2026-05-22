import multer from "multer";
import pdfParse from "pdf-parse";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = ["application/pdf", "text/plain"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and TXT files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("file");

/**
 * Extract text from uploaded file and attach to req.body.fileContent
 */
export const extractFileContent = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      next();
      return;
    }

    let text = "";

    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(req.file.buffer);
      text = pdfData.text;
    } else if (req.file.mimetype === "text/plain") {
      text = req.file.buffer.toString("utf-8");
    }

    // Truncate to 3000 chars for LLM context window
    req.body.fileContent = text.slice(0, 3000);
    logger.info("File text extracted", {
      type: req.file.mimetype,
      chars: text.length,
      truncated: text.length > 3000,
    });

    next();
  } catch (err) {
    next(err);
  }
};
