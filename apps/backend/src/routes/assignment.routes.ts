import { Router, type Request, type Response, type NextFunction } from "express";
import { CreateAssignmentSchema } from "@vedaai/shared";
import { Assignment } from "../models/Assignment";
import { GeneratedPaper } from "../models/GeneratedPaper";
import { generationQueue } from "../queues/generationQueue";
import { redis } from "../lib/redis";
import { logger } from "../lib/logger";
import { validate } from "../middleware/validate";
import { upload, extractFileContent } from "../middleware/upload";

const router = Router();

// ──────────────────────────────────────────────
// GET /api/assignments — List all assignments
// ──────────────────────────────────────────────
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [assignments, total] = await Promise.all([
      Assignment.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Assignment.countDocuments(),
    ]);

    res.json({
      success: true,
      data: assignments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// GET /api/assignments/:id — Get single assignment
// ──────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }
    res.json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
});

// ──────────────────────────────────────────────
// POST /api/assignments — Create + start generation
// ──────────────────────────────────────────────
router.post(
  "/",
  upload,
  extractFileContent,
  validate(CreateAssignmentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignment = await Assignment.create(req.body);

      const job = await generationQueue.add("generate", {
        assignmentId: assignment._id.toString(),
        subject: assignment.subject,
        topic: assignment.topic,
        description: assignment.description,
        questionTypes: assignment.questionTypes,
        totalQuestions: assignment.totalQuestions,
        totalMarks: assignment.totalMarks,
        difficultyDistribution: assignment.difficultyDistribution,
        additionalInstructions: assignment.additionalInstructions,
        fileContent: assignment.fileContent,
      });

      await Assignment.findByIdAndUpdate(assignment._id, {
        jobId: job.id,
        status: "processing",
      });

      // Invalidate list cache
      await redis.del("assignments:list");

      logger.info("Assignment created + job queued", {
        id: assignment._id,
        jobId: job.id,
      });

      res.status(201).json({
        success: true,
        data: {
          assignmentId: assignment._id,
          jobId: job.id,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ──────────────────────────────────────────────
// GET /api/assignments/:id/paper — Get generated paper
// ──────────────────────────────────────────────
router.get(
  "/:id/paper",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Try cache first
      const cached = await redis.get(`paper:${req.params.id}`);
      if (cached) {
        res.json({ success: true, data: JSON.parse(cached), source: "cache" });
        return;
      }

      const paper = await GeneratedPaper.findOne({
        assignmentId: req.params.id,
      })
        .sort({ generatedAt: -1 })
        .lean();

      if (!paper) {
        res.status(404).json({ success: false, error: "Paper not found" });
        return;
      }

      // Populate cache
      await redis.setex(
        `paper:${req.params.id}`,
        3600,
        JSON.stringify(paper)
      );

      res.json({ success: true, data: paper });
    } catch (err) {
      next(err);
    }
  }
);

// ──────────────────────────────────────────────
// POST /api/assignments/:id/regenerate — Re-generate
// ──────────────────────────────────────────────
router.post(
  "/:id/regenerate",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignment = await Assignment.findById(req.params.id);
      if (!assignment) {
        res.status(404).json({ success: false, error: "Assignment not found" });
        return;
      }

      assignment.status = "processing";
      assignment.errorMessage = undefined;
      await assignment.save();

      // Invalidate paper cache
      await redis.del(`paper:${req.params.id}`);

      const job = await generationQueue.add("generate", {
        assignmentId: assignment._id.toString(),
        subject: assignment.subject,
        topic: assignment.topic,
        description: assignment.description,
        questionTypes: assignment.questionTypes,
        totalQuestions: assignment.totalQuestions,
        totalMarks: assignment.totalMarks,
        difficultyDistribution: assignment.difficultyDistribution,
        additionalInstructions: assignment.additionalInstructions,
        fileContent: assignment.fileContent,
      });

      await Assignment.findByIdAndUpdate(assignment._id, { jobId: job.id });

      logger.info("Regeneration triggered", {
        id: assignment._id,
        jobId: job.id,
      });

      res.json({
        success: true,
        data: { assignmentId: assignment._id, jobId: job.id },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ──────────────────────────────────────────────
// DELETE /api/assignments/:id — Delete assignment
// ──────────────────────────────────────────────
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignment = await Assignment.findByIdAndDelete(req.params.id);
      if (!assignment) {
        res.status(404).json({ success: false, error: "Assignment not found" });
        return;
      }

      // Clean up paper + cache
      await GeneratedPaper.deleteMany({ assignmentId: req.params.id });
      await redis.del(`paper:${req.params.id}`);
      await redis.del("assignments:list");

      logger.info("Assignment deleted", { id: req.params.id });

      res.json({ success: true, data: { deleted: req.params.id } });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
