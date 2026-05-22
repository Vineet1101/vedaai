import { io, Socket } from "socket.io-client";
import type { JobUpdateEvent } from "@vedaai/shared";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
        "http://localhost:4000",
      {
        transports: ["websocket"],
        autoConnect: true,
      }
    );
  }
  return socket;
};

export const subscribeToJob = (
  jobId: string,
  onUpdate: (event: JobUpdateEvent) => void
) => {
  const s = getSocket();
  s.emit("subscribe", { jobId });
  s.on("job:update", onUpdate);

  return () => {
    s.emit("unsubscribe", { jobId });
    s.off("job:update", onUpdate);
  };
};
