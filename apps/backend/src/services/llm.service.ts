import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { GeneratedPaperSchema } from "@vedaai/shared";
import { logger } from "../lib/logger";
import type { QuestionTypeConfig, DifficultyDistribution } from "@vedaai/shared";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

interface PromptData {
  subject: string;
  topic: string;
  description?: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
  additionalInstructions?: string;
  fileContent?: string;
}

export function buildPrompt(data: PromptData): string {
  const questionBreakdown = data.questionTypes
    .filter((qt) => qt.count > 0)
    .map((qt) => `- ${qt.type}: ${qt.count} questions × ${qt.marksEach} marks each`)
    .join("\n");

  return `You are an expert educator and exam paper designer.
Generate a structured question paper based on these details:

Subject: ${data.subject}
Topic: ${data.topic}
Description: ${data.description || "N/A"}
Total Questions: ${data.totalQuestions}
Total Marks: ${data.totalMarks}

Question Types Breakdown:
${questionBreakdown}

Difficulty Distribution: ${data.difficultyDistribution.easy}% Easy, ${data.difficultyDistribution.medium}% Medium, ${data.difficultyDistribution.hard}% Hard
Additional Instructions: ${data.additionalInstructions || "None"}
${data.fileContent ? `\nReference Material:\n${data.fileContent}` : ""}

CRITICAL: Respond with ONLY a raw JSON object. No markdown, no backticks, no explanation.

Schema:
{
  "title": "string",
  "subject": "string",
  "totalMarks": number,
  "duration": "string (e.g. '2 hours')",
  "sections": [
    {
      "id": "A",
      "title": "Section A — Multiple Choice Questions",
      "instruction": "string (e.g. 'Choose the correct option')",
      "questions": [
        {
          "id": "Q1",
          "text": "string",
          "type": "MCQ|ShortAnswer|LongAnswer|TrueFalse|FillInTheBlanks",
          "difficulty": "Easy|Medium|Hard",
          "marks": number,
          "options": ["a) ...", "b) ...", "c) ...", "d) ..."],
          "answer": "string (the correct answer)",
          "explanation": "string (brief explanation)"
        }
      ]
    }
  ]
}

Rules:
1. Create one section per question type. E.g. MCQ → Section A, ShortAnswer → Section B, etc.
2. Each section must contain exactly the number of questions specified for that type.
3. Difficulty must match: ${data.difficultyDistribution.easy}% Easy, ${data.difficultyDistribution.medium}% Medium, ${data.difficultyDistribution.hard}% Hard (round to nearest question).
4. Sum of all question marks MUST equal exactly ${data.totalMarks}.
5. Total questions across all sections MUST equal exactly ${data.totalQuestions}.
6. Only include "options" field for MCQ questions.
7. ALWAYS include "answer" and "explanation" for EVERY question.
8. Questions must be specific, clear, and curriculum-appropriate for ${data.subject}.
9. Output ONLY valid JSON — will be parsed with JSON.parse().`;
}

export async function callLLM(prompt: string): Promise<string> {
  const provider = process.env.LLM_PROVIDER || "anthropic";

  if (provider === "gemini") {
    logger.info("Calling Gemini API...");
    const geminiSchema = zodToJsonSchema(GeneratedPaperSchema as any);
    
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: geminiSchema as any,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("No text response from Gemini");
    }

    return response.text;
  }

  // Default fallback to Anthropic
  logger.info("Calling Anthropic API...");
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 4096,
    temperature: 0.7,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from LLM");
  }

  return textBlock.text;
}

export function parseLLMResponse(raw: string) {
  // Try direct JSON parse
  try {
    const parsed = JSON.parse(raw);
    return GeneratedPaperSchema.parse(parsed);
  } catch {
    logger.warn("Direct JSON parse failed, trying regex extraction");
  }

  // Try extracting JSON from markdown/text wrapper
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return GeneratedPaperSchema.parse(parsed);
    } catch {
      logger.warn("Regex JSON extraction also failed");
    }
  }

  throw new Error("Failed to parse LLM response as valid JSON");
}
