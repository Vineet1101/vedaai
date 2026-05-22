import { Schema, model, type Document } from "mongoose";

const QuestionTypeConfigSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["MCQ", "ShortAnswer", "LongAnswer", "TrueFalse", "FillInTheBlanks"],
      required: true,
    },
    count: { type: Number, required: true, min: 0 },
    marksEach: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema(
  {
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    questionTypes: { type: [QuestionTypeConfigSchema], required: true },
    totalQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    difficultyDistribution: {
      easy: { type: Number, required: true },
      medium: { type: Number, required: true },
      hard: { type: Number, required: true },
    },
    additionalInstructions: String,
    fileContent: String,
    status: {
      type: String,
      enum: ["pending", "processing", "complete", "error"],
      default: "pending",
    },
    paperId: { type: Schema.Types.ObjectId, ref: "GeneratedPaper" },
    jobId: String,
    errorMessage: String,
  },
  { timestamps: true }
);

export interface IAssignment extends Document {
  subject: string;
  topic: string;
  description?: string;
  dueDate: Date;
  questionTypes: { type: string; count: number; marksEach: number }[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: { easy: number; medium: number; hard: number };
  additionalInstructions?: string;
  fileContent?: string;
  status: "pending" | "processing" | "complete" | "error";
  paperId?: Schema.Types.ObjectId;
  jobId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Assignment = model<IAssignment>("Assignment", AssignmentSchema);
