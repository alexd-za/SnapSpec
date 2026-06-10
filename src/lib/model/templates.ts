import type { SnapTemplate } from './types'

export type TemplateMeta = {
  id: SnapTemplate
  name: string
  tagline: string
  description: string
  motif: string
  produces: string[]
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'study-notes',
    name: 'Study Notes',
    tagline: 'From scattered notes to a study page.',
    description: 'Summary, key points, definitions, concept map, flashcards, and a quick quiz.',
    motif: 'leaf',
    produces: ['Summary', 'Key points', 'Definitions', 'Concept map', 'Flashcards', 'Quiz'],
  },
  {
    id: 'poetry-analysis',
    name: 'Poetry Analysis',
    tagline: 'Theme, tone, technique, thesis.',
    description: 'Overview, themes, diction, imagery, quote analysis, and an essay outline.',
    motif: 'river',
    produces: ['Overview', 'Themes & tone', 'Techniques', 'Quote analysis', 'Essay outline'],
  },
  {
    id: 'maths-explainer',
    name: 'Maths Explainer',
    tagline: 'Formulas, steps, and worked examples.',
    description: 'Formula cards, worked examples, common mistakes, and practice questions.',
    motif: 'rings',
    produces: ['Formula cards', 'Worked examples', 'Common mistakes', 'Practice questions'],
  },
  {
    id: 'product-brief',
    name: 'Product Brief',
    tagline: 'From idea to crisp one-pager.',
    description: 'Problem, target user, solution, features, roadmap, risks, and launch teaser.',
    motif: 'branch',
    produces: ['Problem', 'Solution', 'Features', 'User flow', 'Roadmap', 'Risks'],
  },
  {
    id: 'project-showcase',
    name: 'Project Showcase',
    tagline: 'Show the work, beautifully.',
    description: 'Overview, goal, process, features, tech stack, timeline, and results.',
    motif: 'clearing',
    produces: ['Overview', 'Process', 'Tech stack', 'Timeline', 'Results'],
  },
  {
    id: 'revision-cheat-sheet',
    name: 'Revision Cheat Sheet',
    tagline: 'One dense, printable page.',
    description: 'Dense summary, definitions, formulas, key facts, and a “do not forget” section.',
    motif: 'moss',
    produces: ['Dense summary', 'Definitions', 'Formulas', 'Key facts', 'Quick quiz'],
  },
]

export function templateMeta(id: SnapTemplate): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
