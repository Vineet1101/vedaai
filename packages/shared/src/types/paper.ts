import type { QuestionType, Difficulty } from "./assignment";

// ========================
// Generated Paper Types
// ========================

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  options?: string[]; // MCQ only
  answer?: string; // correct answer for answer key
  explanation?: string; // optional explanation
}

export interface Section {
  id: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  title: string;
  subject: string;
  totalMarks: number;
  duration: string;
  sections: Section[];
  rawPrompt?: string;
  generatedAt: string;
}
