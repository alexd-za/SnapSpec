---
name: snap-parser
description: Convert messy content into Snap blocks; extend or debug the deterministic local parser.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(pnpm test:*), mcp__specsnap-parser__*
---

# /snap-parser

Trigger: parser behaviour, new block extraction, template detection issues.

Purpose: deterministic local parsing that feels intelligent. No AI APIs, no network.

## Procedure

1. Parser lives in `src/lib/parser/`. Entry: `parseSource.ts` → `detectTemplate.ts` → `buildBlocks.ts` → extractors.
2. Rules (keep them true): first strong line → title; `Term: definition` lines → definitions; `=`/trig/function notation → formulas; quoted lines → quotes; numbered/bulleted lists → key points; repeated dates → timeline; pipe tables → comparisons; long paragraphs → summary; poem-shaped lines → poetry suggestion; product language → product brief; maths symbols → maths template.
3. Every extractor is pure and unit-tested. Add a test in `src/lib/parser/parser.test.ts` for any rule change, using `SAMPLE_INPUTS` fixtures.
4. Verify with the MCP: `parser_health_report` must stay healthy and template detection must match all six samples.

## Checklist

- [ ] Extractor pure, no side effects, no network
- [ ] Test added/updated for the new rule
- [ ] All six sample inputs still detect their own template
- [ ] `pnpm test` green

## Output format

Rule changed, extractor touched, tests added, health-report result.
