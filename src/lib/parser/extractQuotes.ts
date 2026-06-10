import { nonEmptyLines } from './textUtils'

export type ParsedQuote = { quote: string; explanation?: string }

export function extractQuotes(text: string): ParsedQuote[] {
  const quotes: ParsedQuote[] = []
  const seen = new Set<string>()

  const patterns = [/"([^"]{6,240})"/g, /“([^”]{6,240})”/g, /'([^']{12,240})'/g]
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const quote = match[1].trim()
      if (seen.has(quote.toLowerCase())) continue
      seen.add(quote.toLowerCase())
      // Explanation: text after the quote on the same line, if present.
      const line = nonEmptyLines(text).find((l) => l.includes(match[1]))
      const after = line?.split(match[1])[1]?.replace(/^["”']\s*[-–—:]?\s*/, '').trim()
      quotes.push({
        quote,
        explanation: after && after.length > 12 ? after : undefined,
      })
    }
  }
  return quotes.slice(0, 8)
}
