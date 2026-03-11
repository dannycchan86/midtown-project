"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, GitCommit } from "lucide-react";
import { CommitResult, Confidence } from "@/lib/types";
import { DiffView } from "./diff-view";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  high: "bg-green-100 text-green-800 border border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  low: "bg-gray-100 text-gray-600 border border-gray-200",
};

const CONFIDENCE_LABELS: Record<Confidence, string> = {
  high: "High match",
  medium: "Possible match",
  low: "Low match",
};

interface CommitCardProps {
  commit: CommitResult;
}

export function CommitCard({ commit }: CommitCardProps) {
  const [expanded, setExpanded] = useState(false);

  const shortSha = commit.sha.slice(0, 7);
  const formattedDate = format(new Date(commit.date), "MMM d, yyyy");

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <GitCommit className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{commit.message}</p>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {shortSha}
                </code>
                <span>by {commit.author}</span>
                <span>·</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
              CONFIDENCE_STYLES[commit.confidence]
            )}
          >
            {CONFIDENCE_LABELS[commit.confidence]}
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          {commit.explanation}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide diff
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show diff
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 pt-3">
          <DiffView diff={commit.diffExcerpt} />
        </div>
      )}
    </div>
  );
}
