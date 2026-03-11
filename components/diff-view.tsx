"use client";

import { cn } from "@/lib/utils";

interface DiffViewProps {
  diff: string;
  className?: string;
}

export function DiffView({ diff, className }: DiffViewProps) {
  const lines = diff.split("\n");

  return (
    <div
      className={cn(
        "rounded-md bg-gray-950 overflow-x-auto font-mono text-sm",
        className
      )}
    >
      <pre className="p-4 leading-relaxed">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn("px-2 -mx-2 rounded", {
              "bg-green-950 text-green-300": line.startsWith("+"),
              "bg-red-950 text-red-300": line.startsWith("-"),
              "text-gray-400": line.startsWith("@"),
              "text-gray-300": !line.startsWith("+") && !line.startsWith("-") && !line.startsWith("@"),
            })}
          >
            {line || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}
