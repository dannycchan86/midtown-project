import { CommitResult } from "./types";

export const MOCK_RESULTS: CommitResult[] = [
  {
    sha: "a1b2c3d4e5f6",
    message: "Update typography styles and increase base font size",
    author: "jane.doe",
    date: "2026-02-15T10:30:00Z",
    confidence: "high",
    explanation:
      "This commit modifies font-size values in styles/typography.css from 14px to 16px across multiple components, directly matching your query about font size changes.",
    diffExcerpt:
      "- font-size: 14px;\n+ font-size: 16px;\n\n- .body-text {\n-   font-size: 0.875rem;\n+ .body-text {\n+   font-size: 1rem;",
  },
  {
    sha: "b2c3d4e5f6a1",
    message: "Refactor button component design system",
    author: "bob.smith",
    date: "2026-02-10T14:20:00Z",
    confidence: "medium",
    explanation:
      "This commit modifies button styles including font-size changes as part of a broader design system refactor. Relevant but less focused on the specific typography change you described.",
    diffExcerpt:
      "  .btn {\n-   font-size: 0.9rem;\n+   font-size: 1rem;\n    padding: 0.5rem 1rem;\n    border-radius: 4px;\n  }",
  },
  {
    sha: "c3d4e5f6a1b2",
    message: "Fix responsive layout issues on mobile",
    author: "alice.wang",
    date: "2026-01-28T09:15:00Z",
    confidence: "low",
    explanation:
      "Contains minor font-size adjustments in media queries as part of mobile layout fixes. Tangentially related to your query.",
    diffExcerpt:
      "@media (max-width: 768px) {\n-   font-size: 16px;\n+   font-size: 14px;\n  }",
  },
];
