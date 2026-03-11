import { Octokit } from "@octokit/rest";
import { RawCommit } from "./types";

const MAX_COMMITS = 100;

function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  const match = repoUrl.match(
    /github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/.*)?$/
  );
  if (!match) {
    throw new Error(
      "Invalid GitHub repository URL. Expected format: https://github.com/owner/repo"
    );
  }
  return { owner: match[1], repo: match[2] };
}

export async function fetchCommits(
  repoUrl: string,
  startDate: string,
  endDate: string
): Promise<RawCommit[]> {
  const { owner, repo } = parseRepoUrl(repoUrl);

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN || undefined,
  });

  // Validate repo exists
  try {
    await octokit.repos.get({ owner, repo });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 404) {
      throw new Error(`Repository not found: ${owner}/${repo}`);
    }
    if (status === 403) {
      throw new Error("GitHub API rate limit exceeded. Try again later.");
    }
    throw new Error("Failed to access repository. Check the URL and try again.");
  }

  const commits: RawCommit[] = [];
  let page = 1;

  while (commits.length < MAX_COMMITS) {
    let response;
    try {
      response = await octokit.repos.listCommits({
        owner,
        repo,
        since: new Date(startDate).toISOString(),
        until: new Date(endDate + "T23:59:59Z").toISOString(),
        per_page: 100,
        page,
      });
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      if (status === 403) {
        throw new Error("GitHub API rate limit exceeded. Try again later.");
      }
      throw new Error("Failed to fetch commits from GitHub.");
    }

    if (response.data.length === 0) break;

    const batch = response.data.slice(0, MAX_COMMITS - commits.length);

    // Process diff fetches in batches of 10 to avoid GitHub secondary rate limits
    const DIFF_BATCH_SIZE = 10;
    for (let i = 0; i < batch.length; i += DIFF_BATCH_SIZE) {
      const chunk = batch.slice(i, i + DIFF_BATCH_SIZE);
      const chunkResults = await Promise.all(
        chunk.map(async (c) => {
          let diff = "";
          try {
            const commitDetail = await octokit.repos.getCommit({
              owner,
              repo,
              ref: c.sha,
              mediaType: { format: "diff" },
            });
            diff = (commitDetail.data as unknown as string) ?? "";
            // Truncate very large diffs to keep Claude prompt manageable
            if (diff.length > 8000) {
              diff = diff.slice(0, 8000) + "\n... (diff truncated)";
            }
          } catch {
            // If diff fetch fails, continue with empty diff
          }

          return {
            sha: c.sha,
            message: c.commit.message,
            author: c.commit.author?.name ?? c.author?.login ?? "unknown",
            date: c.commit.author?.date ?? "",
            diff,
          } satisfies RawCommit;
        })
      );
      commits.push(...chunkResults);
    }

    if (response.data.length < 100) break;
    page++;
  }

  return commits;
}
