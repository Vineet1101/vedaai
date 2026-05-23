"use client";

import { useEffect } from "react";
import { ArrowLeft, LayoutGrid, Bell, ChevronDown } from "lucide-react";
import { AssignmentCard } from "@/components/dashboard/AssignmentCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function DashboardPage() {
  const { assignments, loading, error, fetchAssignments } =
    useAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  if (error) {
    return (
      <div className="text-center py-20 bg-[#f5f5f5] min-h-full rounded-3xl">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => fetchAssignments()} className="px-4 py-2 bg-gray-200 rounded-md">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f5f5f5] rounded-3xl p-4 flex flex-col gap-6">
      {/* Floating Header */}
      <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-[#8c8e92]" />
          </button>
          <div className="flex items-center gap-2 text-[#8c8e92]">
            <LayoutGrid size={18} />
            <span className="font-medium text-[15px]">Assignment</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={20} className="text-[#8c8e92]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-gray-200">
               <div className="text-lg">🧑‍🏫</div>
            </div>
            <span className="text-[14px] font-medium text-[#2c2c2c]">John Doe</span>
            <ChevronDown size={16} className="text-[#8c8e92]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {loading && assignments.length === 0 ? (
          <div className="w-full max-w-4xl grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-white/50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="w-full max-w-4xl grid gap-4">
            {assignments.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
