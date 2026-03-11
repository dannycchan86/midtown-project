import { NextRequest, NextResponse } from "next/server";
import { SearchRequest, SearchResponse } from "@/lib/types";
import { MOCK_RESULTS } from "@/lib/mock-data";

// TODO: Replace with real implementation in Task 2
export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();

    if (!body.repoUrl || !body.query || !body.startDate || !body.endDate) {
      return NextResponse.json<SearchResponse>(
        { results: [], error: "Missing required fields: repoUrl, query, startDate, endDate" },
        { status: 400 }
      );
    }

    // Mock delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json<SearchResponse>({ results: MOCK_RESULTS });
  } catch {
    return NextResponse.json<SearchResponse>(
      { results: [], error: "Internal server error" },
      { status: 500 }
    );
  }
}
