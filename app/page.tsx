"use client";

import { useState } from "react";
import { GitBranch, AlertCircle } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { ResultsList } from "@/components/results-list";
import { CommitResult, SearchRequest } from "@/lib/types";

type SearchState = "idle" | "loading" | "results" | "error";

export default function Home() {
  const [state, setState] = useState<SearchState>("idle");
  const [results, setResults] = useState<CommitResult[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const [error, setError] = useState("");

  async function handleSearch(request: SearchRequest) {
    setState("loading");
    setLastQuery(request.query);
    setError("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      setResults(data.results);
      setState("results");
    } catch {
      setError("Failed to reach the server. Please check your connection and try again.");
      setState("error");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <GitBranch className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Git Commit Search</h1>
          </div>
          <p className="text-gray-500 text-base">
            Search a GitHub repo&rsquo;s commit history using plain English.
            <br />
            Describe what changed and AI will find the matching commits.
          </p>
        </div>

        {/* Search form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <SearchForm onSearch={handleSearch} isLoading={state === "loading"} />
        </div>

        {/* Error state */}
        {state === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Search failed</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {state === "loading" && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-4 animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-gray-200 rounded-full shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                  </div>
                  <div className="h-5 w-20 bg-gray-100 rounded-full shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {state === "results" && (
          <ResultsList results={results} query={lastQuery} />
        )}
      </div>
    </main>
  );
}
