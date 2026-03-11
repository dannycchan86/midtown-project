# Git Commit Search

Search a GitHub repository's commit history using plain English. Describe what changed and AI finds the matching commits.

## Features

- **Natural language search** — describe what changed (e.g. "where did the button color change?")
- **Date range filtering** — narrow results to a specific time window
- **AI-powered ranking** — Claude ranks commits by relevance with explanations
- **Diff viewer** — expand any result to see the relevant code changes, with file names and syntax coloring
- Supports any public GitHub repository

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- An [Anthropic API key](https://console.anthropic.com/) for Claude
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (optional, but recommended to avoid rate limits)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dannycchan86/midtown-project.git
   cd midtown-project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and fill in your keys:

   ```
   # Required: Claude API key for AI-powered semantic search
   ANTHROPIC_API_KEY=sk-ant-...

   # Optional but recommended: GitHub token increases rate limit from 60 to 5000 requests/hour
   # Create one at https://github.com/settings/tokens (no scopes needed for public repos)
   GITHUB_TOKEN=github_pat_...
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Paste a GitHub repository URL (e.g. `https://github.com/facebook/react`)
2. Describe what you're looking for in plain English
3. Select a date range to search within
4. Click **Search commits** and wait for results
5. Click **Show diff** on any result to see the relevant code changes

## Notes

- **Public repos only** — private repositories are not supported without additional authentication
- **100-commit cap** — searches are limited to 100 commits per query to keep response times reasonable. Narrow your date range if you're not finding what you need.
- **API costs** — each search makes one Claude API call. The cost is minimal but not zero.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router) — frontend + API routes
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [@octokit/rest](https://github.com/octokit/rest.js) — GitHub API client
- [@anthropic-ai/sdk](https://github.com/anthropic/anthropic-sdk-typescript) — Claude API

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
```
