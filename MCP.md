# MCP setup

## Core servers (free/open-source only)

Run from the project root:

```bash
claude mcp add --transport stdio filesystem -- npx -y @modelcontextprotocol/server-filesystem "$PWD"
claude mcp add --transport stdio memory -- npx -y @modelcontextprotocol/server-memory
claude mcp add --transport stdio sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
claude mcp add --transport stdio time -- uvx mcp-server-time
claude mcp add --transport stdio fetch -- uvx mcp-server-fetch
claude mcp add --transport stdio git -- uvx mcp-server-git --repository "$PWD"
claude mcp add --transport stdio playwright -- npx -y @playwright/mcp@latest
claude mcp add --transport stdio context7 -- npx -y @upstash/context7-mcp   # optional, library docs
claude mcp list
```

Note: the `time` server is Python — `uvx mcp-server-time`, not npx (the npm package name in some guides doesn't exist). If `uvx` is unavailable, skip `time`, `fetch`, and `git` and use shell commands; document the gap.

## Local project servers

Build once, then register:

```bash
pnpm mcp:build

claude mcp add --transport stdio specsnap-parser -- node mcp/specsnap-parser/dist/server.js
claude mcp add --transport stdio specsnap-assets -- node mcp/specsnap-assets/dist/server.js
claude mcp add --transport stdio specsnap-export -- node mcp/specsnap-export/dist/server.js
claude mcp add --transport stdio specsnap-video -- node mcp/specsnap-video/dist/server.js
claude mcp add --transport stdio specsnap-quality -- node mcp/specsnap-quality/dist/server.js
claude mcp list
```

All thirteen connect in this environment (verified with `claude mcp list`).

## Tools per server

**specsnap-parser** (read-only): `detect_template`, `parse_source`, `extract_title`, `extract_terms`, `extract_formulas`, `extract_quotes`, `extract_timeline`, `extract_comparisons`, `generate_flashcards`, `generate_quiz`, `generate_essay_outline`, `parser_health_report`.

**specsnap-assets** (writes only `public/generated/`): `generate_svg`, `generate_concept_map_svg`, `generate_poster_svg`, `compress_svgz`, `validate_svg`, `generate_asset_manifest`, `asset_health_report`.

**specsnap-export** (writes only `exports/`): `export_markdown`, `export_html`, `export_json`, `export_svg`, `export_svgz`, `export_revision_pack`, `export_static_site`, `export_health_report`.

**specsnap-video** (executes only `scripts/render-video.ts`): `list_compositions`, `render_preview_frame`, `render_video`, `generate_video_manifest`, `video_health_report`.

**specsnap-quality** (read-only): `check_accessibility`, `check_readability`, `check_responsive_layout`, `check_broken_routes`, `check_skeleton_states`, `check_animation_reduced_motion`, `check_ship_status`.

## Safety rules

- Filesystem MCP gets `$PWD` only; never the home directory.
- Local servers jail every path through `safePath()` (project root only), make no network calls, and execute no shell except the whitelisted render script (`execFileSync`, fixed argv).
- No paid MCPs, no cloud-storage MCPs, no token-based MCPs, no login automation.
