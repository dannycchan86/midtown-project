import { CommitResult } from "@/lib/types";
import { CommitCard } from "./commit-card";
import { SearchX } from "lucide-react";

interface ResultsListProps {
  results: CommitResult[];
  query: string;
}

export function ResultsList({ results, query }: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <SearchX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No matching commits found</h3>
        <p className="mt-1 text-sm text-gray-500">
          No commits matched &ldquo;{query}&rdquo; in the selected date range. Try broadening your
          date range or rephrasing your query.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Found {results.length} matching commit{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
      </p>
      <div className="space-y-3">
        {results.map((commit) => (
          <CommitCard key={commit.sha} commit={commit} />
        ))}
      </div>
    </div>
  );
}
