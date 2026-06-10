import type { SnapBlock, SnapSource, SnapTemplate } from '../model/types'
import { detectTemplate } from './detectTemplate'
import { buildBlocks, extractTitle } from './buildBlocks'

export type ParseResult = {
  title: string
  template: SnapTemplate
  blocks: SnapBlock[]
}

/**
 * Deterministic local parsing — no network, no AI API.
 * Turns messy raw text into structured Snap blocks.
 */
export function parseSource(source: SnapSource, template?: SnapTemplate): ParseResult {
  const text = source.rawText.trim()
  const resolvedTemplate = template ?? detectTemplate(text)
  return {
    title: extractTitle(text),
    template: resolvedTemplate,
    blocks: buildBlocks(text, resolvedTemplate),
  }
}
