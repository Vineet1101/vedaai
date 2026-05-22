import "dotenv/config";
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
