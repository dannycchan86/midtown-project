export type Confidence = "high" | "medium" | "low";

export interface CommitResult {
  sha: string;
  message: string;
  author: string;
  date: string;
  confidence: Confidence;
  explanation: string;
  diffExcerpt: string;
}

export interface SearchRequest {
  repoUrl: string;
  query: string;
  startDate: string;
  endDate: string;
}

export interface SearchResponse {
  results: CommitResult[];
  error?: string;
}

/** Internal type used by the GitHub fetcher before AI analysis */
export interface RawCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  diff: string;
}
