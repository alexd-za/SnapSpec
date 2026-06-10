export function splitLines(text: string): string[] {
  return text.replace(/\r\n/g, '\n').split('\n')
}

export function nonEmptyLines(text: string): string[] {
  return splitLines(text)
    .map((l) => l.trim())
    .filter(Boolean)
}

export function splitParagraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function stripListMarker(line: string): string {
  return line.replace(/^\s*(?:[-*•–]|\d{1,2}[.)])\s+/, '').trim()
}

export function isListItem(line: string): boolean {
  return /^\s*(?:[-*•–]|\d{1,2}[.)])\s+/.test(line)
}

export function isHeadingLike(line: string): boolean {
  const t = line.trim()
  if (!t || t.length > 80) return false
  if (/^#{1,6}\s/.test(t)) return true
  if (isListItem(t)) return false
  if (/[.?!,;]$/.test(t)) return false
  return t.split(/\s+/).length <= 10
}

export function sentenceSplit(text: string): string[] {
  return text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function titleCase(text: string): string {
  return text
    .split(' ')
    .map((w, i) => (i === 0 || w.length > 3 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ')
}

export function clamp(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max)}…`
}
