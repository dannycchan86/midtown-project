import { NextRequest, NextResponse } from "next/server";
import { fetchCommits } from "@/lib/github";
import { analyzeCommits } from "@/lib/analyzer";
import { SearchRequest, SearchResponse } from "@/lib/types";

const MAX_QUERY_LENGTH = 500;
const MAX_REPO_URL_LENGTH = 200;

export async function POST(request: NextRequest) {
  let body: SearchRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json<SearchResponse>(
      { results: [], error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { repoUrl, query, startDate, endDate } = body;

  if (!repoUrl || !query || !startDate || !endDate) {
    return NextResponse.json<SearchResponse>(
      {
        results: [],
        error:
          "Missing required fields: repoUrl, query, startDate, and endDate are all required.",
      },
      { status: 400 }
    );
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json<SearchResponse>(
      { results: [], error: `query must be ${MAX_QUERY_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  if (repoUrl.length > MAX_REPO_URL_LENGTH) {
    return NextResponse.json<SearchResponse>(
      { results: [], error: `repoUrl must be ${MAX_REPO_URL_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return NextResponse.json<SearchResponse>(
      { results: [], error: "Dates must be in YYYY-MM-DD format." },
      { status: 400 }
    );
  }

  if (new Date(startDate) > new Date(endDate)) {
    return NextResponse.json<SearchResponse>(
      { results: [], error: "startDate must be before or equal to endDate." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json<SearchResponse>(
      { results: [], error: "Server configuration error: ANTHROPIC_API_KEY is not set." },
      { status: 500 }
    );
  }

  try {
    const commits = await fetchCommits(repoUrl, startDate, endDate);

    if (commits.length === 0) {
      return NextResponse.json<SearchResponse>({ results: [] });
    }

    const results = await analyzeCommits(query, commits);
    return NextResponse.json<SearchResponse>({ results });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    if (
      message.includes("not found") ||
      message.includes("Invalid GitHub repository URL")
    ) {
      return NextResponse.json<SearchResponse>(
        { results: [], error: message },
        { status: 400 }
      );
    }

    if (message.includes("rate limit")) {
      return NextResponse.json<SearchResponse>(
        { results: [], error: message },
        { status: 429 }
      );
    }

    return NextResponse.json<SearchResponse>(
      { results: [], error: message },
      { status: 500 }
    );
  }
}
