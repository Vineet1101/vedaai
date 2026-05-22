import { Worker } from "bullmq";
import { redis } from "../lib/redis";
import { logger } from "../lib/logger";
import { Assignment } from "../models/Assignment";
import { GeneratedPaper } from "../models/GeneratedPaper";
import { buildPrompt, callLLM, parseLLMResponse } from "../services/llm.service";
import { emitJobUpdate } from "../services/socket.service";

export function startGenerationWorker(): void {
  const worker = new Worker(
    "assignment-generation",
    async (job) => {
      const { assignmentId, ...data } = job.data;
      logger.info("Processing job", { jobId: job.id, assignmentId });

      // Step 1: Update status → processing
      await Assignment.findByIdAndUpdate(assignmentId, { status: "processing" });
      emitJobUpdate(job.id!, {
        jobId: job.id!,
        status: "processing",
        progress: 20,
        assignmentId,
      });

      // Step 2: Build prompt
      const prompt = buildPrompt(data);
      emitJobUpdate(job.id!, {
        jobId: job.id!,
        status: "generating",
        progress: 40,
        assignmentId,
      });
      logger.info("Prompt built, calling LLM", { assignmentId });

      // Step 3: Call LLM
      const rawResponse = await callLLM(prompt);
      logger.info("LLM response received", {
        assignmentId,
        chars: rawResponse.length,
      });
      emitJobUpdate(job.id!, {
        jobId: job.id!,
        status: "parsing",
        progress: 70,
        assignmentId,
      });

      // Step 4: Parse + validate response
      const paper = parseLLMResponse(rawResponse);
      logger.info("Paper parsed successfully", {
        assignmentId,
        sections: paper.sections.length,
      });

      // Step 5: Save to MongoDB
      const savedPaper = await GeneratedPaper.create({
        assignmentId,
        ...paper,
        rawPrompt: prompt,
        generatedAt: new Date(),
      });

      // Step 6: Update assignment
      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "complete",
        paperId: savedPaper._id,
      });

      // Step 7: Cache in Redis
      await redis.setex(
        `paper:${assignmentId}`,
        3600,
        JSON.stringify(savedPaper)
      );

      // Step 8: Emit complete
      emitJobUpdate(job.id!, {
        jobId: job.id!,
        status: "complete",
        progress: 100,
        assignmentId,
      });

      logger.info("Job completed", { jobId: job.id, assignmentId });
    },
    { connection: redis, concurrency: 2 }
  );

  worker.on("failed", async (job, err) => {
    if (!job) return;
    logger.error("Job failed", {
      jobId: job.id,
      assignmentId: job.data.assignmentId,
      error: err.message,
    });

    await Assignment.findByIdAndUpdate(job.data.assignmentId, {
      status: "error",
      errorMessage: err.message,
    });

    emitJobUpdate(job.id!, {
      jobId: job.id!,
      status: "error",
      progress: 0,
      assignmentId: job.data.assignmentId,
      message: err.message,
    });
  });

  worker.on("completed", (job) => {
    logger.info("Worker: job completed", { jobId: job.id });
  });

  logger.info("Generation worker started", { concurrency: 2 });
}
