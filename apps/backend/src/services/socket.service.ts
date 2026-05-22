import { getSocketServer } from "../lib/socket";
import type { JobUpdateEvent } from "@vedaai/shared";

export const emitJobUpdate = (jobId: string, event: JobUpdateEvent): void => {
  try {
    const io = getSocketServer();
    io.to(`job:${jobId}`).emit("job:update", event);
  } catch {
    // Socket might not be initialized during tests
  }
};
