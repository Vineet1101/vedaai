"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
}

export function FileUploadZone({ onFileSelect }: FileUploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    (f: File) => {
      const allowed = ["application/pdf", "text/plain"];
      if (!allowed.includes(f.type)) {
        alert("Only PDF and TXT files are allowed");
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        alert("File must be under 5MB");
        return;
      }
      setFile(f);
      onFileSelect(f);
    },
    [onFileSelect]
  );

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
  };

  return (
    <div>
      {file ? (
        <div className="flex items-center gap-3 p-3 bg-[var(--color-primary-light)] rounded-[var(--radius-md)]">
          <FileText size={18} className="text-[var(--color-primary)]" />
          <span className="flex-1 text-sm text-[var(--color-text)] truncate">
            {file.name}
          </span>
          <button onClick={removeFile} className="p-1 hover:bg-white/50 rounded">
            <X size={14} className="text-[var(--color-text-muted)]" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-[var(--radius-lg)] cursor-pointer transition-colors",
            dragActive
              ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)]"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          <Upload size={24} className="text-[var(--color-text-muted)]" />
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--color-text)]">
              Upload a reference file
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              PDF or TXT, max 5MB (optional)
            </p>
          </div>
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />
        </label>
      )}
    </div>
  );
}
