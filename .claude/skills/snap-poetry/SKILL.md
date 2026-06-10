---
name: snap-poetry
description: Create or improve poetry-analysis Snaps — themes, tone, diction, imagery, structure, quote analysis, thesis, paragraph outline.
allowed-tools: Read, Grep, Edit, Write, Bash(pnpm test:*), mcp__specsnap-parser__*
---

# /snap-poetry

Trigger: poetry-analysis template work.

Purpose: turn a poem + rough notes into an exam-ready analysis page.

## Procedure

1. The poetry path runs through `detectTemplate` (poem-shaped lines / poetry keywords) and `buildBlocks` with `poetry-analysis`, which adds quotes + `generateEssayOutline`.
2. Analysis coverage to preserve or extend: theme, tone, mood, diction, imagery, structure, speaker, human condition, poet's intention, techniques, quote analysis, comparative links, thesis, paragraph outline.
3. Quote blocks must pair every quote with an effect explanation when the source provides one (`quote :: explanation` inline annotations).
4. Essay outlines follow technique → effect → meaning; the thesis names the subject and the human concern.
5. Test against `SAMPLE_INPUTS['poetry-analysis']` (The Quiet Field).

## Checklist

- [ ] Poem detection unaffected for non-poems (no false positives on lists)
- [ ] Quotes keep their explanations
- [ ] Essay outline has thesis, 3 arguments, evidence slots, conclusion angle
- [ ] Tests green

## Output format

Blocks produced for the sample poem and any detection-rule changes.
