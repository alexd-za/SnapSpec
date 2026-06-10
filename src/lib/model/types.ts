export type SnapProject = {
  id: string
  title: string
  slug: string
  template: SnapTemplate
  accent: AccentTheme
  source: SnapSource
  blocks: SnapBlock[]
  exports: SnapExport[]
  createdAt: string
  updatedAt: string
}

export type SnapTemplate =
  | 'study-notes'
  | 'poetry-analysis'
  | 'maths-explainer'
  | 'product-brief'
  | 'project-showcase'
  | 'revision-cheat-sheet'

export type AccentTheme = 'forest' | 'mist' | 'sunlit' | 'river' | 'bloom'

export type SnapSource = {
  type: 'paste' | 'txt' | 'markdown' | 'pdf' | 'sample'
  rawText: string
  fileName?: string
  importedAt: string
}

export type SnapBlock =
  | HeadingBlock
  | SummaryBlock
  | KeyPointsBlock
  | DefinitionBlock
  | FormulaBlock
  | QuoteBlock
  | ComparisonBlock
  | TimelineBlock
  | DiagramBlock
  | FlashcardsBlock
  | QuizBlock
  | EssayOutlineBlock
  | CalloutBlock
  | ExportCardBlock

export type SnapBlockType = SnapBlock['type']

export type BaseBlock = {
  id: string
  type: string
  title?: string
  locked?: boolean
}

export type HeadingBlock = BaseBlock & {
  type: 'heading'
  eyebrow?: string
  heading: string
  subheading?: string
}

export type SummaryBlock = BaseBlock & {
  type: 'summary'
  summary: string
}

export type KeyPointsBlock = BaseBlock & {
  type: 'key-points'
  points: string[]
}

export type DefinitionBlock = BaseBlock & {
  type: 'definitions'
  terms: {
    term: string
    definition: string
  }[]
}

export type FormulaBlock = BaseBlock & {
  type: 'formulas'
  formulas: {
    label: string
    expression: string
    explanation: string
  }[]
}

export type QuoteBlock = BaseBlock & {
  type: 'quotes'
  quotes: {
    quote: string
    explanation?: string
  }[]
}

export type ComparisonBlock = BaseBlock & {
  type: 'comparison'
  columns: string[]
  rows: string[][]
}

export type TimelineBlock = BaseBlock & {
  type: 'timeline'
  events: {
    label: string
    detail: string
  }[]
}

export type DiagramBlock = BaseBlock & {
  type: 'diagram'
  nodes: {
    id: string
    label: string
    x: number
    y: number
  }[]
  edges: {
    source: string
    target: string
    label?: string
  }[]
}

export type FlashcardsBlock = BaseBlock & {
  type: 'flashcards'
  cards: {
    front: string
    back: string
  }[]
}

export type QuizBlock = BaseBlock & {
  type: 'quiz'
  questions: {
    prompt: string
    answer: string
    memo?: string
  }[]
}

export type EssayOutlineBlock = BaseBlock & {
  type: 'essay-outline'
  thesis: string
  arguments: string[]
  evidenceSlots: string[]
  conclusionAngle: string
}

export type CalloutBlock = BaseBlock & {
  type: 'callout'
  tone: 'info' | 'warning' | 'success' | 'exam' | 'idea'
  body: string
}

export type ExportCardBlock = BaseBlock & {
  type: 'export-card'
  formats: string[]
}

export type SnapExport = {
  id: string
  projectId: string
  format: 'html' | 'markdown' | 'json' | 'svg' | 'svgz' | 'png' | 'video'
  path?: string
  createdAt: string
}
