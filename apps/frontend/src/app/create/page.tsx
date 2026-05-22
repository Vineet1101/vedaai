"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAssignmentSchema } from "@vedaai/shared";
import type { QuestionTypeConfig } from "@vedaai/shared";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { QuestionMatrix } from "@/components/assignment/QuestionMatrix";
import { FileUploadZone } from "@/components/assignment/FileUploadZone";
import { JobProgress } from "@/components/assignment/JobProgress";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function CreatePage() {
  const { createAssignment, currentJobId } = useAssignmentStore();

  const [questionTypes, setQuestionTypes] = useState<QuestionTypeConfig[]>([
    { type: "MCQ", count: 5, marksEach: 1 },
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalQuestions = questionTypes.reduce((s, q) => s + q.count, 0);
  const totalMarks = questionTypes.reduce(
    (s, q) => s + q.count * q.marksEach,
    0
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      CreateAssignmentSchema.omit({
        questionTypes: true,
        totalQuestions: true,
        totalMarks: true,
      })
    ),
    defaultValues: {
      subject: "",
      topic: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      additionalInstructions: "",
      difficultyDistribution: { easy: 30, medium: 40, hard: 30 },
    },
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    if (totalQuestions === 0) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("subject", data.subject as string);
    formData.append("topic", data.topic as string);
    if (data.description)
      formData.append("description", data.description as string);
    formData.append("dueDate", data.dueDate as string);
    formData.append("questionTypes", JSON.stringify(questionTypes));
    formData.append("totalQuestions", String(totalQuestions));
    formData.append("totalMarks", String(totalMarks));
    formData.append(
      "difficultyDistribution",
      JSON.stringify(data.difficultyDistribution)
    );
    if (data.additionalInstructions)
      formData.append(
        "additionalInstructions",
        data.additionalInstructions as string
      );
    if (file) formData.append("file", file);

    try {
      const result = await createAssignment(formData);
      setAssignmentId(result.assignmentId);
    } catch {
      setSubmitting(false);
    }
  };

  // Show progress panel after submission
  if (currentJobId && assignmentId) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Generating Assessment</h1>
        <JobProgress jobId={currentJobId} assignmentId={assignmentId} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Create Assignment
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Configure your AI-generated assessment
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Subject + Topic */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Subject"
            placeholder="e.g. Physics"
            error={errors.subject?.message}
            {...register("subject")}
          />
          <Input
            label="Topic"
            placeholder="e.g. Laws of Motion"
            error={errors.topic?.message}
            {...register("topic")}
          />
        </div>

        {/* Description */}
        <Textarea
          label="Description (optional)"
          placeholder="Brief description of the assessment"
          error={errors.description?.message}
          {...register("description")}
        />

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          {...register("dueDate")}
        />

        {/* File Upload */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5 block">
            Reference Material (optional)
          </label>
          <FileUploadZone onFileSelect={setFile} />
        </div>

        {/* Question Matrix */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5 block">
            Question Configuration
          </label>
          <QuestionMatrix value={questionTypes} onChange={setQuestionTypes} />
          {totalQuestions === 0 && (
            <p className="text-xs text-[var(--color-danger)] mt-1">
              Add at least one question
            </p>
          )}
        </div>

        {/* Difficulty Distribution */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5 block">
            Difficulty Distribution
          </label>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Easy %"
              type="number"
              {...register("difficultyDistribution.easy", {
                valueAsNumber: true,
              })}
            />
            <Input
              label="Medium %"
              type="number"
              {...register("difficultyDistribution.medium", {
                valueAsNumber: true,
              })}
            />
            <Input
              label="Hard %"
              type="number"
              {...register("difficultyDistribution.hard", {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>

        {/* Additional Instructions */}
        <Textarea
          label="Additional Instructions (optional)"
          placeholder="Any specific instructions for the AI..."
          {...register("additionalInstructions")}
        />

        {/* Submit */}
        <Button
          id="btn-generate"
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting || totalQuestions === 0}
        >
          <Sparkles size={18} />
          {submitting ? "Creating..." : "Generate Assessment"}
        </Button>
      </form>
    </div>
  );
}
