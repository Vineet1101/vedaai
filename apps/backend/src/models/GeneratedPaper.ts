import { Schema, model, type Document } from "mongoose";

const QuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["MCQ", "ShortAnswer", "LongAnswer", "TrueFalse", "FillInTheBlanks"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    marks: { type: Number, required: true },
    options: [String],
    answer: String,
    explanation: String,
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false }
);

const GeneratedPaperSchema = new Schema({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  title: String,
  subject: String,
  totalMarks: Number,
  duration: String,
  sections: { type: [SectionSchema], required: true },
  rawPrompt: String,
  generatedAt: { type: Date, default: Date.now },
});

export interface IGeneratedPaper extends Document {
  assignmentId: Schema.Types.ObjectId;
  title: string;
  subject: string;
  totalMarks: number;
  duration: string;
  sections: {
    id: string;
    title: string;
    instruction: string;
    questions: {
      id: string;
      text: string;
      type: string;
      difficulty: string;
      marks: number;
      options?: string[];
      answer?: string;
      explanation?: string;
    }[];
  }[];
  rawPrompt?: string;
  generatedAt: Date;
}

export const GeneratedPaper = model<IGeneratedPaper>(
  "GeneratedPaper",
  GeneratedPaperSchema
);
