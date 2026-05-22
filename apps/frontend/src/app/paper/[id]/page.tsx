"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { usePaperStore } from "@/store/paperStore";
import { PaperHeader } from "@/components/paper/PaperHeader";
import { SectionBlock } from "@/components/paper/SectionBlock";
import { ActionBar } from "@/components/paper/ActionBar";

export default function PaperPage() {
  const params = useParams();
  const id = params.id as string;
  const { paper, loading, error, showAnswerKey, fetchPaper } = usePaperStore();

  useEffect(() => {
    if (id) fetchPaper(id);
  }, [id, fetchPaper]);

  if (loading || !paper) {
    return (
      <div className="max-w-[800px] mx-auto">
        <div className="bg-white shadow-lg rounded-[var(--radius-lg)] p-12">
          <div className="h-8 w-64 mx-auto skeleton mb-4" />
          <div className="h-4 w-48 mx-auto skeleton mb-8" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 w-32 skeleton" />
                <div className="h-3 w-full skeleton" />
                <div className="h-3 w-5/6 skeleton" />
                <div className="h-3 w-4/6 skeleton" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold mb-2">
          Couldn&apos;t load this paper
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">{error}</p>
        <button
          onClick={() => fetchPaper(id)}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto">
      <ActionBar assignmentId={id} />

      {/* Paper Container */}
      <div className="paper-container bg-white shadow-lg rounded-[var(--radius-lg)] px-12 py-10">
        <PaperHeader paper={paper} />

        {/* Student Info Section */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name: </span>
              <span className="border-b border-gray-300 inline-block w-32" />
            </div>
            <div>
              <span className="text-gray-500">Roll No: </span>
              <span className="border-b border-gray-300 inline-block w-24" />
            </div>
            <div>
              <span className="text-gray-500">Section: </span>
              <span className="border-b border-gray-300 inline-block w-20" />
            </div>
          </div>
        </div>

        {/* Sections */}
        {paper.sections.map((section, i) => (
          <SectionBlock
            key={section.id}
            section={section}
            sectionIndex={i}
            showAnswers={showAnswerKey}
          />
        ))}
      </div>
    </div>
  );
}
