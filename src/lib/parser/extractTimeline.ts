import { nonEmptyLines, stripListMarker } from './textUtils'

export type TimelineEvent = { label: string; detail: string }

const DATE_LINE =
  /^((?:\d{3,4}s?)|(?:\d{1,2}\s+)?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?(?:\s+\d{1,4})?|Week \d+|Day \d+|Phase \d+|Q[1-4](?:\s+\d{4})?|Month \d+)\s*[:\-–—]\s*(.+)$/i

export function extractTimeline(text: string): TimelineEvent[] {
  const events: TimelineEvent[] = []
  for (const raw of nonEmptyLines(text)) {
    const line = stripListMarker(raw)
    const match = line.match(DATE_LINE)
    if (!match) continue
    events.push({ label: match[1].trim(), detail: match[2].trim() })
  }
  return events.length >= 2 ? events.slice(0, 12) : []
}

export type ComparisonTable = { columns: string[]; rows: string[][] }

/** Markdown-style pipe tables, or "A vs B" structures. */
export function extractComparison(text: string): ComparisonTable | null {
  const lines = nonEmptyLines(text).filter((l) => l.includes('|'))
  const tableLines = lines.filter((l) => l.split('|').filter((c) => c.trim()).length >= 2)
  if (tableLines.length >= 2) {
    const parse = (l: string) =>
      l
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean)
    const columns = parse(tableLines[0])
    const rows = tableLines
      .slice(1)
      .filter((l) => !/^[\s|:-]+$/.test(l))
      .map(parse)
      .filter((r) => r.length >= 2)
      .map((r) => r.slice(0, columns.length))
    if (rows.length >= 1) return { columns, rows }
  }
  return null
}
