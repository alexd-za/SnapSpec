# SpecSnap — Product Requirements

## One-liner

Turn messy notes into beautiful living explainers — locally.

## Problem

Students and makers accumulate messy notes (class notes, poems, maths working, product ideas) that are hard to revise from or share. Existing tools either require accounts and cloud sync, or are generic editors that don't structure content.

## Solution

A local-first web app that deterministically parses pasted text into a structured, editable explainer page with study artefacts (flashcards, quizzes, concept maps) and rich exports.

## Users

- Students revising for exams (study notes, maths, poetry, cheat sheets).
- Makers writing product briefs and project showcases.
- Anyone who wants a beautiful one-page explainer without a cloud tool.

## Non-goals

- No AI API integration (deterministic parsing only).
- No accounts, cloud storage, sync, or telemetry.
- No collaborative editing.

## Core requirements (all shipped)

1. Six templates: study-notes, poetry-analysis, maths-explainer, product-brief, project-showcase, revision-cheat-sheet.
2. Parser rules: first strong line → title; `Term: definition` → definitions; `=`/trig/function notation → formulas; quoted lines → quotes; lists → key points; dated lines → timeline; pipe tables → comparisons; long paragraphs → summary; poem-shaped text → poetry suggestion; product/showcase keywords → brief/showcase; maths symbols → maths template.
3. Editor: block list with reorder/duplicate/delete, live preview, per-type inspector, accent switching, unsaved indicator, export drawer.
4. Exports: Markdown, standalone HTML, JSON, SVG (poster + concept map), SVGZ, PNG poster, revision pack, video storyboard.
5. 40 SVG + 40 SVGZ generated assets with manifest and validation.
6. Five 30s Remotion compositions with render script.
7. Skippable intro, skeleton loaders everywhere, reduced-motion support (OS + in-app).
8. Local persistence with backup/import/reset.

## Success criteria

The acceptance list in the project brief: app runs, intro skippable, skeletons, polished home, palettes, create/parse/edit/store/export all work, assets validated, compositions compile, tests exist, README honest. Verified via `/snap-ship`.
