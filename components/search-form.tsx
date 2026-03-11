"use client";

import { useState, FormEvent } from "react";
import { Search, Github, Calendar, Loader2, AlertCircle } from "lucide-react";
import { SearchRequest } from "@/lib/types";
import { parseRepoUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSearch: (request: SearchRequest) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repoError, setRepoError] = useState("");

  function validateRepo(url: string): boolean {
    if (!url) {
      setRepoError("Please enter a GitHub repository URL");
      return false;
    }
    const parsed = parseRepoUrl(url);
    if (!parsed) {
      setRepoError("Please enter a valid GitHub URL (e.g. https://github.com/owner/repo)");
      return false;
    }
    setRepoError("");
    return true;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateRepo(repoUrl)) return;
    if (!query.trim()) return;
    if (!startDate || !endDate) return;

    onSearch({ repoUrl, query: query.trim(), startDate, endDate });
  }

  const isFormValid =
    repoUrl.trim() &&
    query.trim() &&
    startDate &&
    endDate &&
    !repoError &&
    new Date(startDate) <= new Date(endDate);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Repo URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          GitHub Repository
        </label>
        <div className="relative">
          <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => {
              setRepoUrl(e.target.value);
              if (repoError) validateRepo(e.target.value);
            }}
            onBlur={() => repoUrl && validateRepo(repoUrl)}
            placeholder="https://github.com/owner/repository"
            className={cn(
              "w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm bg-white outline-none transition-colors",
              "placeholder:text-gray-400",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              repoError
                ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                : "border-gray-300"
            )}
          />
        </div>
        {repoError && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {repoError}
          </p>
        )}
      </div>

      {/* Natural language query */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          What are you looking for?
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. where did the button color change?"
            className={cn(
              "w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white outline-none transition-colors",
              "placeholder:text-gray-400",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            )}
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          Describe what changed in plain English — AI will find the matching commits.
        </p>
      </div>

      {/* Date range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            Date range
          </span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              className={cn(
                "w-full px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-colors",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                startDate && endDate && new Date(startDate) > new Date(endDate)
                  ? "border-red-300"
                  : "border-gray-300"
              )}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className={cn(
                "w-full px-3 py-2.5 rounded-lg border text-sm bg-white outline-none transition-colors",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                startDate && endDate && new Date(startDate) > new Date(endDate)
                  ? "border-red-300"
                  : "border-gray-300"
              )}
            />
          </div>
        </div>
        {startDate && endDate && new Date(startDate) > new Date(endDate) && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Start date must be before end date
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg",
          "text-sm font-medium text-white transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          isFormValid && !isLoading
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-blue-300 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching commits…
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Search commits
          </>
        )}
      </button>
    </form>
  );
}
