import type { GeneratedPaper } from "@vedaai/shared";

interface PaperHeaderProps {
  paper: GeneratedPaper;
}

export function PaperHeader({ paper }: PaperHeaderProps) {
  return (
    <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
      <h1 className="text-xl font-bold uppercase tracking-wide mb-1">
        {paper.title}
      </h1>
      <p className="text-sm text-gray-600 mb-3">{paper.subject}</p>
      <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
        <span>
          <strong>Total Marks:</strong> {paper.totalMarks}
        </span>
        <span>
          <strong>Duration:</strong> {paper.duration}
        </span>
      </div>
    </div>
  );
}
