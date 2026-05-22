import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error("Unhandled error", {
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details: err.flatten().fieldErrors,
    });
    return;
  }

  if (err.message === "Only PDF and TXT files are allowed") {
    res.status(400).json({ success: false, error: err.message });
    return;
  }

  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};
