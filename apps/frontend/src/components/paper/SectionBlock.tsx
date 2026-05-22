import type { Section } from "@vedaai/shared";
import { Badge } from "@/components/ui/Badge";

interface SectionBlockProps {
  section: Section;
  sectionIndex: number;
  showAnswers: boolean;
}

const difficultyVariant = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
} as const;

export function SectionBlock({
  section,
  showAnswers,
}: SectionBlockProps) {
  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-base font-bold uppercase">
          {section.title}
        </h2>
        <p className="text-xs text-gray-500 italic mt-0.5">
          {section.instruction}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {section.questions.map((q, qi) => (
          <div key={q.id} className="flex gap-3">
            {/* Question number */}
            <span className="text-sm font-medium text-gray-500 min-w-[24px] pt-0.5">
              {qi + 1}.
            </span>

            <div className="flex-1">
              {/* Question text + metadata */}
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm leading-relaxed flex-1">{q.text}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={difficultyVariant[q.difficulty]}>
                    {q.difficulty}
                  </Badge>
                  <span className="text-xs font-medium text-gray-500">
                    [{q.marks}]
                  </span>
                </div>
              </div>

              {/* MCQ Options */}
              {q.options && q.options.length > 0 && (
                <div className="mt-2 ml-1 space-y-1">
                  {q.options.map((opt, oi) => (
                    <p key={oi} className="text-sm text-gray-600">
                      {opt}
                    </p>
                  ))}
                </div>
              )}

              {/* Answer Key (toggled) */}
              {showAnswers && q.answer && (
                <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-md">
                  <p className="text-xs font-medium text-emerald-700">
                    Answer: {q.answer}
                  </p>
                  {q.explanation && (
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {q.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
