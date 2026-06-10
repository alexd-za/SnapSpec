import type { SnapTemplate } from '../model/types'
import { nonEmptyLines, splitParagraphs } from './textUtils'

const MATHS_PATTERNS = [
  /\b(?:sin|cos|tan|cosec|sec|cot)\s*[(θxa-z]/i,
  /\bf\s*\(\s*x\s*\)/i,
  /[a-z0-9)\]]\s*=\s*[-a-z0-9(]/i,
  /\b(?:d[yx]\/d[xy]|∫|∑|√|π|theta|hypotenuse|quadratic|derivative|gradient|parabola)\b/i,
  /\^2|x²|x\^|²|³/,
]

const PRODUCT_KEYWORDS =
  /\b(?:problem|target users?|user persona|pain point|solution|features?|mvp|roadmap|launch|value prop(?:osition)?|monetis|monetiz|market|competitors?|alternatives?)\b/i

const SHOWCASE_KEYWORDS =
  /\b(?:tech stack|built with|github|deployed|portfolio|showcase|screenshots?|demo|repository|case study)\b/i

const REVISION_KEYWORDS =
  /\b(?:cheat sheet|revision|exam tomorrow|cram|quick reference|memori[sz]e|do not forget|don'?t forget|test on|key facts)\b/i

const POETRY_KEYWORDS =
  /\b(?:poem|poet|stanza|sonnet|imagery|metaphor|simile|rhyme|enjambment|alliteration|speaker|diction|tone|verse)\b/i

export function looksLikePoem(text: string): boolean {
  const lines = nonEmptyLines(text)
  if (lines.length < 6) return false
  const shortUnpunctuated = lines.filter(
    (l) => l.length < 60 && !/[.:;]$/.test(l) && !/^\s*(?:[-*•]|\d+[.)])/.test(l),
  )
  return shortUnpunctuated.length / lines.length > 0.7
}

export function mathsScore(text: string): number {
  return MATHS_PATTERNS.reduce((score, re) => {
    const matches = text.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))
    return score + (matches ? matches.length : 0)
  }, 0)
}

export function detectTemplate(text: string): SnapTemplate {
  const t = text.trim()
  if (!t) return 'study-notes'

  if (REVISION_KEYWORDS.test(t)) return 'revision-cheat-sheet'

  const maths = mathsScore(t)
  if (maths >= 3) return 'maths-explainer'

  if (POETRY_KEYWORDS.test(t) || looksLikePoem(t)) return 'poetry-analysis'

  const productHits = t.match(new RegExp(PRODUCT_KEYWORDS.source, 'gi'))?.length ?? 0
  const showcaseHits = t.match(new RegExp(SHOWCASE_KEYWORDS.source, 'gi'))?.length ?? 0
  if (showcaseHits >= 2 && showcaseHits >= productHits) return 'project-showcase'
  if (productHits >= 2) return 'product-brief'

  if (maths >= 1 && splitParagraphs(t).length <= 3) return 'maths-explainer'

  return 'study-notes'
}
