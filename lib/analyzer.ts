import Anthropic from "@anthropic-ai/sdk";
import { RawCommit, CommitResult } from "./types";

const client = new Anthropic();

export async function analyzeCommits(
  query: string,
  commits: RawCommit[]
): Promise<CommitResult[]> {
  if (commits.length === 0) return [];

  const commitSummaries = commits
    .map(
      (c, i) =>
        `[${i}] SHA: ${c.sha.slice(0, 8)}
Message: ${c.message.split("\n")[0]}
Author: ${c.author}
Date: ${c.date}
Diff:
${c.diff || "(no diff available)"}`
    )
    .join("\n\n---\n\n");

  const prompt = `You are helping a developer search through git commits to find changes relevant to their query.

User's query: "${query}"

Here are the commits to analyze:

${commitSummaries}

For each commit that is relevant to the query, return a JSON array of results. Only include commits that have meaningful relevance to the query. If no commits match, return an empty array.

Each result must have:
- "index": the commit's index number from above (integer)
- "confidence": "high", "medium", or "low"
- "explanation": 1-2 sentences explaining why this commit matches
- "diffExcerpt": the most relevant lines from the diff (max 200 chars), or empty string if no diff

Return ONLY a valid JSON array, no other text. Example:
[{"index":0,"confidence":"high","explanation":"This commit changes font-size from 14px to 16px.","diffExcerpt":"- font-size: 14px;\\n+ font-size: 16px;"}]`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  let parsed: Array<{
    index: number;
    confidence: "high" | "medium" | "low";
    explanation: string;
    diffExcerpt: string;
  }>;

  try {
    const jsonText = responseText
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }

  return parsed
    .filter((r) => r.index >= 0 && r.index < commits.length)
    .map((r) => {
      const commit = commits[r.index];
      return {
        sha: commit.sha,
        message: commit.message.split("\n")[0],
        author: commit.author,
        date: commit.date,
        confidence: r.confidence,
        explanation: r.explanation,
        diffExcerpt: r.diffExcerpt,
      } satisfies CommitResult;
    })
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.confidence] - order[b.confidence];
    });
}
