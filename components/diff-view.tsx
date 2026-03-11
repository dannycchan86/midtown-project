"use client";

import { cn } from "@/lib/utils";
import { FileCode } from "lucide-react";

interface DiffViewProps {
  diff: string;
  className?: string;
}

interface DiffFile {
  filename: string;
  lines: string[];
}

function parseDiff(diff: string): DiffFile[] {
  if (!diff.trim()) return [];

  const files: DiffFile[] = [];
  let current: DiffFile | null = null;

  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git ")) {
      if (current) files.push(current);
      const match = line.match(/diff --git a\/.+ b\/(.+)$/);
      current = { filename: match ? match[1] : "", lines: [] };
    } else if (
      line.startsWith("index ") ||
      line.startsWith("new file") ||
      line.startsWith("deleted file")
    ) {
      // skip git metadata lines
    } else if (current) {
      current.lines.push(line);
    }
  }

  if (current && current.lines.length > 0) files.push(current);

  // If no diff --git headers, treat entire diff as single block
  if (files.length === 0 && diff.trim()) {
    files.push({ filename: "", lines: diff.split("\n") });
  }

  return files;
}

function getLineStyle(line: string): string {
  if (line.startsWith("+") && !line.startsWith("+++"))
    return "bg-green-950 text-green-300";
  if (line.startsWith("-") && !line.startsWith("---"))
    return "bg-red-950 text-red-300";
  if (
    line.startsWith("@@") ||
    line.startsWith("---") ||
    line.startsWith("+++")
  )
    return "text-blue-400 bg-blue-950/30";
  return "text-gray-300";
}

function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function DiffView({ diff, className }: DiffViewProps) {
  if (!diff.trim()) {
    return (
      <div
        className={cn(
          "rounded-md bg-gray-950 p-4 text-sm text-gray-500 font-mono",
          className
        )}
      >
        No diff available
      </div>
    );
  }

  const files = parseDiff(diff);

  return (
    <div
      className={cn("rounded-md bg-gray-950 overflow-hidden font-mono text-sm", className)}
    >
      {files.map((file, fi) => (
        <div key={fi}>
          {file.filename && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700 text-gray-300 text-xs">
              <FileCode className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span className="font-medium truncate">{file.filename}</span>
              {getFileExtension(file.filename) && (
                <span className="ml-auto shrink-0 text-gray-500 uppercase">
                  {getFileExtension(file.filename)}
                </span>
              )}
            </div>
          )}
          <pre className="p-4 leading-relaxed overflow-x-auto">
            {file.lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "px-2 -mx-2 rounded whitespace-pre",
                  getLineStyle(line)
                )}
              >
                {line || " "}
              </div>
            ))}
          </pre>
          {fi < files.length - 1 && <div className="border-t border-gray-700" />}
        </div>
      ))}
    </div>
  );
}
