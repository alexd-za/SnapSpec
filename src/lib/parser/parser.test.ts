import { describe, expect, it } from 'vitest'
import { detectTemplate } from './detectTemplate'
import {
  extractTitle,
  extractSummary,
  buildBlocks,
  generateFlashcards,
  generateQuiz,
} from './buildBlocks'
import { extractDefinitions, extractKeyTerms } from './extractTerms'
import { extractFormulas } from './extractFormulas'
import { extractQuotes } from './extractQuotes'
import { extractTimeline, extractComparison } from './extractTimeline'
import { parseSource } from './parseSource'
import { SAMPLE_INPUTS } from '../model/examples'
import { nowIso } from '../utils/dates'

const STUDY = SAMPLE_INPUTS['study-notes'].text
const MATHS = SAMPLE_INPUTS['maths-explainer'].text
const POEM = SAMPLE_INPUTS['poetry-analysis'].text
const PRODUCT = SAMPLE_INPUTS['product-brief'].text

describe('extractTitle', () => {
  it('uses the first strong line as the title', () => {
    expect(extractTitle(STUDY)).toBe('Photosynthesis')
  })

  it('falls back gracefully for empty input', () => {
    expect(extractTitle('')).toBe('Untitled Snap')
  })

  it('strips markdown heading markers', () => {
    expect(extractTitle('# Cell Biology\n\nNotes here.')).toBe('Cell Biology')
  })
})

describe('detectTemplate', () => {
  it('detects maths content', () => {
    expect(detectTemplate(MATHS)).toBe('maths-explainer')
  })

  it('detects poetry', () => {
    expect(detectTemplate(POEM)).toBe('poetry-analysis')
  })

  it('detects product briefs', () => {
    expect(detectTemplate(PRODUCT)).toBe('product-brief')
  })

  it('detects project showcases', () => {
    expect(detectTemplate(SAMPLE_INPUTS['project-showcase'].text)).toBe('project-showcase')
  })

  it('detects revision cheat sheets', () => {
    expect(detectTemplate(SAMPLE_INPUTS['revision-cheat-sheet'].text)).toBe('revision-cheat-sheet')
  })

  it('defaults to study notes', () => {
    expect(detectTemplate('Some plain prose about history and events in general.')).toBe(
      'study-notes',
    )
  })
})

describe('extractSummary', () => {
  it('builds a summary from the first long paragraph', () => {
    const summary = extractSummary(STUDY)
    expect(summary.length).toBeGreaterThan(40)
    expect(summary).toContain('Photosynthesis')
  })
})

describe('extractDefinitions', () => {
  it('finds colon-style definitions', () => {
    const defs = extractDefinitions(STUDY)
    const terms = defs.map((d) => d.term)
    expect(terms).toContain('Chlorophyll')
    expect(terms).toContain('Stomata')
    expect(defs.find((d) => d.term === 'Glucose')?.definition).toMatch(/sugar/i)
  })

  it('ignores long sentences with colons', () => {
    const defs = extractDefinitions(
      'This is a very long sentence that happens to contain within itself a colon: and then keeps going.',
    )
    expect(defs).toHaveLength(0)
  })
})

describe('extractKeyTerms', () => {
  it('ranks repeated meaningful terms', () => {
    const terms = extractKeyTerms(STUDY)
    expect(terms).toContain('photosynthesis')
    expect(terms).not.toContain('the')
  })
})

describe('extractFormulas', () => {
  it('detects trig formulas', () => {
    const formulas = extractFormulas(MATHS)
    const expressions = formulas.map((f) => f.expression)
    expect(expressions.some((e) => e.includes('sin'))).toBe(true)
    expect(expressions.some((e) => e.includes('a² + b²') || e.includes('a²+b²'))).toBe(true)
  })

  it('labels known formula families', () => {
    const formulas = extractFormulas('sin θ = opposite / hypotenuse')
    expect(formulas[0].label).toMatch(/trig/i)
  })
})

describe('extractQuotes', () => {
  it('extracts quoted lines with explanations', () => {
    const quotes = extractQuotes(POEM)
    expect(quotes.length).toBeGreaterThanOrEqual(2)
    const grass = quotes.find((q) => q.quote.includes('grass forgets'))
    expect(grass).toBeDefined()
    expect(grass?.explanation).toMatch(/indifference/i)
  })
})

describe('extractTimeline', () => {
  it('extracts labelled timeline events', () => {
    const events = extractTimeline(SAMPLE_INPUTS['project-showcase'].text)
    expect(events.length).toBeGreaterThanOrEqual(3)
    expect(events[0].label).toMatch(/week 1/i)
  })

  it('requires at least two events', () => {
    expect(extractTimeline('1990: only one event happened')).toHaveLength(0)
  })
})

describe('extractComparison', () => {
  it('parses pipe tables', () => {
    const table = extractComparison('Plant | Animal\ncell wall | no wall\nchloroplast | none')
    expect(table).not.toBeNull()
    expect(table?.columns).toEqual(['Plant', 'Animal'])
    expect(table?.rows).toHaveLength(2)
  })
})

describe('generateFlashcards / generateQuiz', () => {
  it('creates flashcards from definitions', () => {
    const cards = generateFlashcards(extractDefinitions(STUDY), [], [])
    expect(cards.length).toBeGreaterThanOrEqual(3)
    expect(cards[0].front).toMatch(/what is/i)
  })

  it('creates quiz questions', () => {
    const quiz = generateQuiz(extractDefinitions(STUDY), ['Light reactions occur first'], [])
    expect(quiz.length).toBeGreaterThanOrEqual(3)
    expect(quiz[0].prompt).toMatch(/define/i)
    expect(quiz[0].answer.length).toBeGreaterThan(5)
  })
})

describe('buildBlocks', () => {
  it('builds a complete study page', () => {
    const blocks = buildBlocks(STUDY, 'study-notes')
    const types = blocks.map((b) => b.type)
    expect(types[0]).toBe('heading')
    expect(types).toContain('summary')
    expect(types).toContain('key-points')
    expect(types).toContain('definitions')
    expect(types).toContain('flashcards')
    expect(types).toContain('quiz')
    expect(types).toContain('diagram')
  })

  it('adds an essay outline for poetry', () => {
    const blocks = buildBlocks(POEM, 'poetry-analysis')
    expect(blocks.some((b) => b.type === 'essay-outline')).toBe(true)
    expect(blocks.some((b) => b.type === 'quotes')).toBe(true)
  })

  it('includes formulas for maths', () => {
    const blocks = buildBlocks(MATHS, 'maths-explainer')
    expect(blocks.some((b) => b.type === 'formulas')).toBe(true)
  })
})

describe('parseSource', () => {
  it('auto-detects template when not given', () => {
    const result = parseSource({ type: 'paste', rawText: MATHS, importedAt: nowIso() })
    expect(result.template).toBe('maths-explainer')
    expect(result.blocks.length).toBeGreaterThan(3)
  })

  it('respects an explicit template', () => {
    const result = parseSource(
      { type: 'paste', rawText: STUDY, importedAt: nowIso() },
      'revision-cheat-sheet',
    )
    expect(result.template).toBe('revision-cheat-sheet')
  })
})
