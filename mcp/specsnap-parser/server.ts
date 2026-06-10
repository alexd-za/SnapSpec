/**
 * specsnap-parser — local stdio MCP server.
 * Parses messy text into structured Snap data using the same deterministic
 * parser the web app ships. No network, no file writes.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { detectTemplate } from '../../src/lib/parser/detectTemplate'
import {
  buildBlocks,
  extractTitle,
  extractSummary,
  extractKeyPoints,
  generateFlashcards,
  generateQuiz,
  generateEssayOutline,
} from '../../src/lib/parser/buildBlocks'
import { extractDefinitions, extractKeyTerms } from '../../src/lib/parser/extractTerms'
import { extractFormulas } from '../../src/lib/parser/extractFormulas'
import { extractQuotes } from '../../src/lib/parser/extractQuotes'
import { extractTimeline, extractComparison } from '../../src/lib/parser/extractTimeline'
import { SAMPLE_INPUTS } from '../../src/lib/model/examples'
import { ok } from '../shared/safety'

const TEMPLATES = [
  'study-notes',
  'poetry-analysis',
  'maths-explainer',
  'product-brief',
  'project-showcase',
  'revision-cheat-sheet',
] as const

const text = z.string().min(1).describe('Raw messy source text')

const server = new McpServer({ name: 'specsnap-parser', version: '1.0.0' })

server.tool('detect_template', 'Detect the best Snap template for raw text', { text }, async ({ text }) =>
  ok({ template: detectTemplate(text) }),
)

server.tool(
  'parse_source',
  'Parse raw text into a full structured block list',
  { text, template: z.enum(TEMPLATES).optional() },
  async ({ text, template }) => {
    const resolved = template ?? detectTemplate(text)
    return ok({ title: extractTitle(text), template: resolved, blocks: buildBlocks(text, resolved) })
  },
)

server.tool('extract_title', 'Extract the title from raw text', { text }, async ({ text }) =>
  ok({ title: extractTitle(text), summary: extractSummary(text) }),
)

server.tool('extract_terms', 'Extract definitions and ranked key terms', { text }, async ({ text }) =>
  ok({ definitions: extractDefinitions(text), keyTerms: extractKeyTerms(text) }),
)

server.tool('extract_formulas', 'Extract maths formulas with labels', { text }, async ({ text }) =>
  ok({ formulas: extractFormulas(text) }),
)

server.tool('extract_quotes', 'Extract quotations with inline explanations', { text }, async ({ text }) =>
  ok({ quotes: extractQuotes(text) }),
)

server.tool('extract_timeline', 'Extract dated/staged timeline events', { text }, async ({ text }) =>
  ok({ events: extractTimeline(text) }),
)

server.tool('extract_comparisons', 'Extract comparison tables (pipe syntax)', { text }, async ({ text }) =>
  ok({ comparison: extractComparison(text) }),
)

server.tool('generate_flashcards', 'Generate flashcards from raw text', { text }, async ({ text }) =>
  ok({
    cards: generateFlashcards(extractDefinitions(text), extractFormulas(text), extractKeyPoints(text)),
  }),
)

server.tool('generate_quiz', 'Generate quiz questions from raw text', { text }, async ({ text }) =>
  ok({
    questions: generateQuiz(extractDefinitions(text), extractKeyPoints(text), extractFormulas(text)),
  }),
)

server.tool(
  'generate_essay_outline',
  'Generate an essay outline (thesis, arguments, evidence)',
  { text, title: z.string().optional() },
  async ({ text, title }) =>
    ok(
      generateEssayOutline(
        title ?? extractTitle(text),
        extractKeyTerms(text).slice(0, 3),
        extractQuotes(text).map((q) => q.quote),
      ),
    ),
)

server.tool('parser_health_report', 'Self-test the parser against bundled samples', {}, async () => {
  const results = Object.entries(SAMPLE_INPUTS).map(([template, sample]) => {
    const detected = detectTemplate(sample.text)
    const blocks = buildBlocks(sample.text, detected)
    return {
      sample: sample.name,
      expected: template,
      detected,
      match: detected === template,
      blockCount: blocks.length,
      blockTypes: [...new Set(blocks.map((b) => b.type))],
    }
  })
  return ok({ healthy: results.every((r) => r.blockCount >= 4), results })
})

await server.connect(new StdioServerTransport())
