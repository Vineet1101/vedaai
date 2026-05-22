import { Queue } from "bullmq";
import { redis } from "../lib/redis";

export const generationQueue = new Queue("assignment-generation", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});
