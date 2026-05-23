import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load from current working directory
dotenv.config();

// Load from workspace root
const rootEnvPath = path.resolve(process.cwd(), "../../.env");
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  const fallbackEnvPath = path.resolve(__dirname, "../../../.env");
  if (fs.existsSync(fallbackEnvPath)) {
    dotenv.config({ path: fallbackEnvPath });
  }
}

import http from "http";
import app from "./app";
import { connectMongo } from "./lib/mongo";
import { initSocketServer } from "./lib/socket";
import { startGenerationWorker } from "./workers/generationWorker";
import { logger } from "./lib/logger";

const PORT = parseInt(process.env.PORT || "4000", 10);

async function bootstrap(): Promise<void> {
  // 1. Connect to MongoDB
  await connectMongo();

  // 2. Create HTTP server
  const httpServer = http.createServer(app);

  // 3. Initialize Socket.io
  initSocketServer(httpServer);

  // 4. Start BullMQ worker
  startGenerationWorker();

  // 5. Start listening
  httpServer.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Health: http://localhost:${PORT}/api/health`);
  });
}

bootstrap().catch((err) => {
  logger.error("Fatal startup error", { error: err.message });
  process.exit(1);
});
