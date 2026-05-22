"use client";

import type { QuestionTypeConfig } from "@vedaai/shared";
import { StepperInput } from "@/components/ui/StepperInput";

const QUESTION_TYPES: { type: QuestionTypeConfig["type"]; label: string }[] = [
  { type: "MCQ", label: "Multiple Choice" },
  { type: "ShortAnswer", label: "Short Answer" },
  { type: "LongAnswer", label: "Long Answer" },
  { type: "TrueFalse", label: "True / False" },
  { type: "FillInTheBlanks", label: "Fill in the Blanks" },
];

interface QuestionMatrixProps {
  value: QuestionTypeConfig[];
  onChange: (value: QuestionTypeConfig[]) => void;
}

export function QuestionMatrix({ value, onChange }: QuestionMatrixProps) {
  const getConfig = (type: QuestionTypeConfig["type"]) =>
    value.find((v) => v.type === type) || { type, count: 0, marksEach: 1 };

  const updateConfig = (
    type: QuestionTypeConfig["type"],
    field: "count" | "marksEach",
    newVal: number
  ) => {
    const existing = value.filter((v) => v.type !== type);
    const current = getConfig(type);
    existing.push({ ...current, [field]: newVal });
    onChange(existing.filter((v) => v.count > 0));
  };

  const totalQuestions = value.reduce((sum, v) => sum + v.count, 0);
  const totalMarks = value.reduce((sum, v) => sum + v.count * v.marksEach, 0);

  return (
    <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-[var(--color-border)]">
            <th className="text-left px-4 py-3 font-medium text-[var(--color-text-muted)]">
              Question Type
            </th>
            <th className="text-center px-4 py-3 font-medium text-[var(--color-text-muted)]">
              Count
            </th>
            <th className="text-center px-4 py-3 font-medium text-[var(--color-text-muted)]">
              Marks Each
            </th>
            <th className="text-center px-4 py-3 font-medium text-[var(--color-text-muted)]">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {QUESTION_TYPES.map(({ type, label }) => {
            const config = getConfig(type);
            return (
              <tr
                key={type}
                className="border-b border-[var(--color-border)] last:border-0"
              >
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                  {label}
                </td>
                <td className="px-4 py-3 text-center">
                  <StepperInput
                    id={`matrix-${type}-count`}
                    value={config.count}
                    onChange={(v) => updateConfig(type, "count", v)}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <StepperInput
                    id={`matrix-${type}-marks`}
                    value={config.marksEach}
                    onChange={(v) => updateConfig(type, "marksEach", v)}
                    min={1}
                    max={20}
                  />
                </td>
                <td className="px-4 py-3 text-center font-medium text-[var(--color-text-muted)]">
                  {config.count * config.marksEach}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50 font-semibold text-sm">
            <td className="px-4 py-3">Total</td>
            <td className="px-4 py-3 text-center">{totalQuestions} Qs</td>
            <td className="px-4 py-3 text-center" />
            <td className="px-4 py-3 text-center">{totalMarks} marks</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
