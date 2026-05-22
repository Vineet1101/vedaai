import mongoose from "mongoose";
import { logger } from "./logger";

export async function connectMongo(): Promise<void> {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/vedaai";

  try {
    await mongoose.connect(uri);
    logger.info("MongoDB connected", { uri: uri.replace(/\/\/.*@/, "//***@") });
  } catch (err) {
    logger.error("MongoDB connection failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    process.exit(1);
  }
}
