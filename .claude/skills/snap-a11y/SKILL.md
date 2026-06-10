---
name: snap-a11y
description: Accessibility and usability pass over SpecSnap — keyboard nav, focus rings, contrast, aria, semantics, mobile, reduced motion, forms, errors.
allowed-tools: Read, Grep, Glob, Edit, Bash(pnpm test:*), mcp__specsnap-quality__*
---

# /snap-a11y

Trigger: accessibility review or fixes.

## Procedure

1. Run the quality MCP first: `check_accessibility`, `check_animation_reduced_motion`, `check_responsive_layout`.
2. Keyboard: every action reachable by Tab; the global `:focus-visible` ring must stay visible on all five palettes.
3. Semantics: real `<button>`/`<a>`; icon-only controls need `aria-label`; decorative SVGs `aria-hidden`; informative images get alt text.
4. Live regions: saving indicator, export bloom, and intro phrases use `aria-live="polite"`/`role="status"`.
5. Contrast: body text ≥ 4.5:1 against `bg` and `surface` in all five palettes (sunlit is the risk case).
6. Forms: visible or sr-only labels, `role="alert"` on validation errors.
7. Reduced motion: OS preference AND in-app toggle both honoured (useMotionPref + CSS guards).

## Checklist

- [ ] Tab order sane on Home → New → Editor → Gallery → Exports → Settings
- [ ] No icon button without a name
- [ ] Dialogs have role/aria-modal and a close affordance
- [ ] Quality MCP checks healthy
- [ ] UI tests green

## Output format

Issues found (file:line), fixes applied, remaining risks.
