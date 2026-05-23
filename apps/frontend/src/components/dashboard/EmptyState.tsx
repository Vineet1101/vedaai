import Link from "next/link";
import { Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center max-w-md mx-auto">
      {/* Illustration */}
      <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#f0f0f0] rounded-full opacity-50"></div>
        
        {/* Document Icon */}
        <div className="relative z-10 w-20 h-28 bg-white shadow-sm rounded-lg border border-gray-100 p-3 flex flex-col gap-3 -ml-6">
           <div className="w-12 h-1.5 bg-[#2c2c2c] rounded-full"></div>
           <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
           <div className="w-14 h-1 bg-gray-200 rounded-full"></div>
           <div className="w-10 h-1 bg-gray-200 rounded-full mt-2"></div>
        </div>

        {/* Magnifying Glass */}
        <div className="absolute z-20 top-16 right-8">
           <div className="w-20 h-20 rounded-full border-[6px] border-[#d4d1e8] bg-white/40 backdrop-blur-sm flex items-center justify-center relative">
              <div className="text-red-500 font-bold text-4xl leading-none">×</div>
              <div className="absolute top-[68px] -right-[14px] w-6 h-12 bg-[#d4d1e8] rounded-full -rotate-45 origin-top-left"></div>
           </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-4 text-2xl -rotate-12">✏️</div>
        <div className="absolute bottom-6 left-12 text-[#2c7a7b] text-xl">✨</div>
        <div className="absolute top-8 right-0 bg-white shadow-sm border border-gray-100 rounded-md p-1.5 flex gap-1">
           <div className="w-2 h-2 rounded-full bg-gray-300"></div>
           <div className="w-4 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>

      <h2 className="text-[18px] font-semibold text-[#2c2c2c] mb-3">
        No assignments yet
      </h2>
      <p className="text-[13px] text-[#8c8e92] mb-8 leading-relaxed">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>
      
      <Link href="/create">
        <button id="btn-create-assignment" className="flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-black text-white text-[14px] font-medium rounded-full transition-colors">
          <Plus size={16} strokeWidth={2.5} />
          Create Your First Assignment
        </button>
      </Link>
    </div>
  );
}
