# Agents

12 specialist subagents in `.claude/agents/`. Delegate domain work to them rather than doing everything in one context.

| Agent                     | Owns                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `frontend-architect`      | React architecture, routing, Zustand store, localStorage, a11y wiring.               |
| `visual-director`         | Nature visual system: palettes, typography, layout, polish, responsive.              |
| `motion-designer`         | Intro, skeletons, transitions, block reveals, reduced-motion guarantees.             |
| `content-structure-agent` | Parser logic, block generation, templates, flashcards, quizzes, summaries.           |
| `poetry-specialist`       | Poetry template, quote analysis, essay outlines, technique extraction.               |
| `maths-specialist`        | Formula detection, worked examples, mistake blocks, practice questions.              |
| `svgz-engineer`           | SVG generation, SVGZ compression, manifest, validation.                              |
| `video-director`          | Remotion compositions, frames, render scripts, video manifest.                       |
| `mcp-engineer`            | Local MCP servers, tool schemas, project-root safety, MCP docs.                      |
| `test-engineer`           | Vitest, Playwright, build validation, regression tests.                              |
| `security-reviewer`       | Local-first boundaries, safe file access, dependency review, hook safety. Read-only. |
| `release-manager`         | README, PRD, demo script, roadmap, final build report.                               |
