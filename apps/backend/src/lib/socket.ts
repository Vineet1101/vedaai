import { Server as SocketServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { logger } from "./logger";

let io: SocketServer | null = null;

export function initSocketServer(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info("Client connected", { socketId: socket.id });

    socket.on("subscribe", ({ jobId }: { jobId: string }) => {
      socket.join(`job:${jobId}`);
      logger.debug("Subscribed to job", { socketId: socket.id, jobId });
    });

    socket.on("unsubscribe", ({ jobId }: { jobId: string }) => {
      socket.leave(`job:${jobId}`);
    });

    socket.on("disconnect", () => {
      logger.debug("Client disconnected", { socketId: socket.id });
    });
  });

  logger.info("Socket.io server initialized");
  return io;
}

export function getSocketServer(): SocketServer {
  if (!io) {
    throw new Error("Socket.io server not initialized");
  }
  return io;
}
