import { nonEmptyLines, stripListMarker } from './textUtils'

export type TermDefinition = { term: string; definition: string }

/** Short "Term: definition" lines become definitions. */
export function extractDefinitions(text: string): TermDefinition[] {
  const seen = new Set<string>()
  const defs: TermDefinition[] = []
  for (const raw of nonEmptyLines(text)) {
    const line = stripListMarker(raw)
    const match = line.match(/^([A-Za-z][A-Za-z0-9 ''()\-/]{1,48}?)\s*[:—]\s+(.{8,})$/)
    if (!match) continue
    const term = match[1].trim()
    const definition = match[2].trim()
    if (term.split(/\s+/).length > 6) continue
    if (/^(?:https?|note|example|step \d|answer|q\d)/i.test(term)) continue
    const key = term.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    defs.push({ term, definition })
  }
  return defs
}

const STOP_WORDS = new Set(
  `the a an and or but if then with from into onto for of in on at by to is are was were be been being it its this that these those as not no can will would should could about over under between very more most much many when where which who whom what why how their there they them we you your i he she his her also just like than such each other some any all both few own same so too s t don now`.split(
    ' ',
  ),
)

/** Repeated meaningful words become key concepts, ranked by frequency. */
export function extractKeyTerms(text: string, limit = 8): string[] {
  const counts = new Map<string, number>()
  const words = text.toLowerCase().match(/[a-z][a-z'’-]{3,}/g) ?? []
  for (const word of words) {
    const w = word.replace(/['’]s$/, '')
    if (STOP_WORDS.has(w)) continue
    counts.set(w, (counts.get(w) ?? 0) + 1)
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w)
}
