import type {
  CalloutBlock,
  DiagramBlock,
  EssayOutlineBlock,
  FlashcardsBlock,
  QuizBlock,
  SnapBlock,
  SnapTemplate,
} from '../model/types'
import { createId } from '../utils/ids'
import { extractDefinitions, extractKeyTerms, type TermDefinition } from './extractTerms'
import { extractFormulas, type ParsedFormula } from './extractFormulas'
import { extractQuotes } from './extractQuotes'
import { extractComparison, extractTimeline } from './extractTimeline'
import {
  clamp,
  isHeadingLike,
  isListItem,
  nonEmptyLines,
  sentenceSplit,
  splitParagraphs,
  stripListMarker,
  titleCase,
} from './textUtils'

export function extractTitle(text: string): string {
  const lines = nonEmptyLines(text)
  if (lines.length === 0) return 'Untitled Snap'
  const heading = lines.find((l) => isHeadingLike(l))
  const raw = (heading ?? lines[0]).replace(/^#{1,6}\s*/, '').trim()
  return clamp(titleCase(raw.replace(/[.:]$/, '')), 72)
}

export function extractSummary(text: string): string {
  const paragraphs = splitParagraphs(text).filter(
    (p) => p.length > 80 && !nonEmptyLines(p).every(isListItem),
  )
  if (paragraphs.length > 0) {
    const sentences = sentenceSplit(paragraphs[0])
    return clamp(sentences.slice(0, 3).join(' '), 420)
  }
  const lines = nonEmptyLines(text).map(stripListMarker)
  return clamp(lines.slice(1, 4).join('. '), 360) || 'A snapshot of your notes, structured.'
}

export function extractKeyPoints(text: string, limit = 7): string[] {
  const listItems = nonEmptyLines(text)
    .filter(isListItem)
    .map(stripListMarker)
    .filter((l) => l.length > 4 && !/[:—]\s/.test(l.slice(0, 40)))
  if (listItems.length >= 3) return listItems.slice(0, limit)

  // Fall back to strong sentences across paragraphs.
  const sentences = splitParagraphs(text)
    .flatMap((p) => sentenceSplit(p))
    .filter((s) => s.length > 40 && s.length < 200)
  const unique = [...new Set([...listItems, ...sentences])]
  return unique.slice(0, limit).map((s) => clamp(s, 160))
}

export function generateFlashcards(
  definitions: TermDefinition[],
  formulas: ParsedFormula[],
  keyPoints: string[],
): FlashcardsBlock['cards'] {
  const cards: FlashcardsBlock['cards'] = []
  for (const d of definitions.slice(0, 6)) {
    cards.push({ front: `What is ${d.term}?`, back: d.definition })
  }
  for (const f of formulas.slice(0, 4)) {
    cards.push({ front: `State the formula: ${f.label}`, back: f.expression })
  }
  if (cards.length < 4) {
    for (const point of keyPoints.slice(0, 5 - cards.length)) {
      const words = point.split(' ')
      if (words.length < 5) continue
      const blanked = [...words]
      const target = Math.min(2, blanked.length - 1)
      const hidden = blanked[target]
      blanked[target] = '_____'
      cards.push({ front: `Fill the gap: ${blanked.join(' ')}`, back: hidden })
    }
  }
  return cards
}

export function generateQuiz(
  definitions: TermDefinition[],
  keyPoints: string[],
  formulas: ParsedFormula[],
): QuizBlock['questions'] {
  const questions: QuizBlock['questions'] = []
  for (const d of definitions.slice(0, 4)) {
    questions.push({
      prompt: `Define: ${d.term}`,
      answer: d.definition,
      memo: `Look for the core idea — “${clamp(d.definition, 60)}”`,
    })
  }
  for (const f of formulas.slice(0, 2)) {
    questions.push({
      prompt: `Write down the ${f.label.toLowerCase()}.`,
      answer: f.expression,
      memo: f.explanation,
    })
  }
  if (questions.length < 3) {
    for (const point of keyPoints.slice(0, 3 - questions.length)) {
      questions.push({
        prompt: `Explain in your own words: “${clamp(point, 80)}”`,
        answer: point,
      })
    }
  }
  return questions
}

export function generateEssayOutline(title: string, themes: string[], quotes: string[]): EssayOutlineBlock {
  const subject = title.replace(/^(?:analysis of|notes on)\s*/i, '')
  return {
    id: createId('block'),
    type: 'essay-outline',
    title: 'Essay outline',
    thesis: `In ${subject}, the writer uses deliberate craft to illuminate ${
      themes[0] ?? 'the central theme'
    }, inviting the reader to reconsider ${themes[1] ?? 'their own experience'}.`,
    arguments: [
      `The opening establishes ${themes[0] ?? 'the central concern'} through structure and diction.`,
      `Imagery deepens the emotional core of the piece.`,
      `The closing movement reframes ${themes[1] ?? themes[0] ?? 'the subject'} and lands the writer's intention.`,
    ],
    evidenceSlots: quotes.slice(0, 3).map((q) => `Quote: “${clamp(q, 80)}”`),
    conclusionAngle: 'Tie the techniques back to the human condition the piece explores.',
  }
}

export function generateConceptMap(title: string, terms: string[]): DiagramBlock {
  const center = { id: 'core', label: clamp(title, 28), x: 300, y: 170 }
  const radius = 130
  const nodes = [
    center,
    ...terms.slice(0, 6).map((term, i, arr) => {
      const angle = (Math.PI * 2 * i) / Math.max(arr.length, 3) - Math.PI / 2
      return {
        id: `n${i}`,
        label: titleCase(term),
        x: Math.round(300 + Math.cos(angle) * (radius + (i % 2) * 40)),
        y: Math.round(170 + Math.sin(angle) * (radius - 40 + (i % 2) * 30)),
      }
    }),
  ]
  return {
    id: createId('block'),
    type: 'diagram',
    title: 'Concept map',
    nodes,
    edges: nodes.slice(1).map((n) => ({ source: 'core', target: n.id })),
  }
}

type WithoutId<T> = T extends SnapBlock ? Omit<T, 'id'> : never

function block<T extends SnapBlock>(b: WithoutId<T>): T {
  return { ...b, id: createId('block') } as unknown as T
}

function calloutFor(template: SnapTemplate): CalloutBlock {
  const map: Record<SnapTemplate, { tone: CalloutBlock['tone']; title: string; body: string }> = {
    'study-notes': {
      tone: 'exam',
      title: 'Exam trigger',
      body: 'Cover the key points, recite them aloud, then check. Spaced repetition beats rereading.',
    },
    'poetry-analysis': {
      tone: 'idea',
      title: 'Reading lens',
      body: 'Always link technique → effect → meaning. Never name a device without saying what it does.',
    },
    'maths-explainer': {
      tone: 'warning',
      title: 'Common mistake',
      body: 'Check units, signs, and whether the calculator is in degrees or radians before finalising.',
    },
    'product-brief': {
      tone: 'idea',
      title: 'Positioning note',
      body: 'Lead with the problem, not the feature list. People buy outcomes.',
    },
    'project-showcase': {
      tone: 'success',
      title: 'Showcase tip',
      body: 'Show the before/after. Concrete results beat adjectives.',
    },
    'revision-cheat-sheet': {
      tone: 'exam',
      title: 'Do not forget',
      body: 'Skim this sheet once the night before and once the morning of. Keep it to one page.',
    },
  }
  const c = map[template]
  return block<CalloutBlock>({ type: 'callout', tone: c.tone, title: c.title, body: c.body })
}

export function buildBlocks(text: string, template: SnapTemplate): SnapBlock[] {
  const title = extractTitle(text)
  const summary = extractSummary(text)
  const keyPoints = extractKeyPoints(text)
  const definitions = extractDefinitions(text)
  const formulas = extractFormulas(text)
  const quotes = extractQuotes(text)
  const timeline = extractTimeline(text)
  const comparison = extractComparison(text)
  const keyTerms = extractKeyTerms(text)

  const blocks: SnapBlock[] = []

  const eyebrows: Record<SnapTemplate, string> = {
    'study-notes': 'Study notes',
    'poetry-analysis': 'Poetry analysis',
    'maths-explainer': 'Maths explainer',
    'product-brief': 'Product brief',
    'project-showcase': 'Project showcase',
    'revision-cheat-sheet': 'Revision cheat sheet',
  }

  blocks.push(
    block({
      type: 'heading',
      eyebrow: eyebrows[template],
      heading: title,
      subheading: clamp(summary, 120),
    }),
  )

  blocks.push(block({ type: 'summary', title: 'At a glance', summary }))

  if (keyPoints.length > 0) {
    blocks.push(block({ type: 'key-points', title: 'Key points', points: keyPoints }))
  }

  if (definitions.length > 0) {
    blocks.push(block({ type: 'definitions', title: 'Definitions', terms: definitions }))
  }

  if (formulas.length > 0) {
    blocks.push(block({ type: 'formulas', title: 'Formulas', formulas }))
  }

  if (quotes.length > 0) {
    blocks.push(block({ type: 'quotes', title: 'Quotes & analysis', quotes }))
  }

  if (comparison) {
    blocks.push(block({ type: 'comparison', title: 'Comparison', ...comparison }))
  }

  if (timeline.length > 0) {
    blocks.push(block({ type: 'timeline', title: 'Timeline', events: timeline }))
  }

  if (keyTerms.length >= 3) {
    blocks.push(generateConceptMap(title, keyTerms))
  }

  const flashcards = generateFlashcards(definitions, formulas, keyPoints)
  if (flashcards.length > 0 && template !== 'product-brief' && template !== 'project-showcase') {
    blocks.push(block({ type: 'flashcards', title: 'Flashcards', cards: flashcards }))
  }

  const quiz = generateQuiz(definitions, keyPoints, formulas)
  if (quiz.length > 0 && (template === 'study-notes' || template === 'maths-explainer' || template === 'revision-cheat-sheet')) {
    blocks.push(block({ type: 'quiz', title: 'Quick quiz', questions: quiz }))
  }

  if (template === 'poetry-analysis') {
    blocks.push(
      generateEssayOutline(
        title,
        keyTerms.slice(0, 3),
        quotes.map((q) => q.quote),
      ),
    )
  }

  blocks.push(calloutFor(template))

  blocks.push(
    block({
      type: 'export-card',
      title: 'Export this Snap',
      formats: ['html', 'markdown', 'json', 'svg', 'svgz'],
    }),
  )

  return blocks
}
