---
name: snap-maths
description: Create or improve maths-explainer Snaps — formula detection, worked examples, step blocks, common mistakes, practice questions.
allowed-tools: Read, Grep, Edit, Write, Bash(pnpm test:*), mcp__specsnap-parser__*
---

# /snap-maths

Trigger: maths-explainer template work.

Purpose: formulas, steps, and worked examples that survive an exam.

## Procedure

1. Formula detection lives in `src/lib/parser/extractFormulas.ts`. Priority domains: trigonometry, functions, algebra, basic calculus, geometry — extend `KNOWN_FORMULAS` for new families.
2. Numbered lines after a "Worked example" line become step blocks (key points today); keep steps one bounded action each.
3. Common-mistake content renders as a `callout` with tone `warning`; practice questions and answer keys ride the `quiz` block (answer hidden by default).
4. Flashcards auto-derive from formulas ("State the formula: …").
5. Test fixture: `SAMPLE_INPUTS['maths-explainer']` (trig ratios + ladder example).

## Checklist

- [ ] sin/cos/tan, f(x), a²+b²=c², dy/dx all still detected
- [ ] Formula labels human-readable, explanations accurate
- [ ] Quiz answers hidden until revealed
- [ ] Tests green, `mathsScore` thresholds unchanged unless tested

## Output format

Formulas detected for the fixture, new families added, test results.
