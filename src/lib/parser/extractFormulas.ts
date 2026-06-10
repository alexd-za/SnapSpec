import { nonEmptyLines, stripListMarker } from './textUtils'

export type ParsedFormula = { label: string; expression: string; explanation: string }

const FORMULA_HINT =
  /(?:=|≈|≤|≥|sin|cos|tan|√|π|∫|∑|\^|²|³|d[yx]\/d[xy]|f\s*\(\s*x\s*\))/

const KNOWN_FORMULAS: { match: RegExp; label: string; explanation: string }[] = [
  { match: /sin|cos|tan/i, label: 'Trigonometric ratio', explanation: 'Relates angles to side ratios in a right-angled triangle.' },
  { match: /a²\s*\+\s*b²|a\^2\s*\+\s*b\^2|pythag/i, label: 'Pythagoras', explanation: 'Relates the hypotenuse to the two shorter sides.' },
  { match: /f\s*\(\s*x\s*\)/i, label: 'Function notation', explanation: 'Describes output values of a function for an input x.' },
  { match: /d[yx]\/d[xy]|derivative/i, label: 'Derivative', explanation: 'Measures the rate of change of a function.' },
  { match: /x\s*=\s*\(?-b/i, label: 'Quadratic formula', explanation: 'Solves ax² + bx + c = 0 for x.' },
  { match: /area|perimeter|volume/i, label: 'Mensuration', explanation: 'Computes a geometric measure from dimensions.' },
]

function labelFor(expression: string, fallbackIndex: number): { label: string; explanation: string } {
  for (const known of KNOWN_FORMULAS) {
    if (known.match.test(expression)) return { label: known.label, explanation: known.explanation }
  }
  return { label: `Formula ${fallbackIndex + 1}`, explanation: 'Identified from your notes — edit to add context.' }
}

export function extractFormulas(text: string): ParsedFormula[] {
  const formulas: ParsedFormula[] = []
  const seen = new Set<string>()
  for (const raw of nonEmptyLines(text)) {
    const line = stripListMarker(raw)
    if (!FORMULA_HINT.test(line)) continue
    if (line.length > 120 || line.split(/\s+/).length > 16) continue
    // Prose sentences with one "=" are usually definitions, not formulas.
    if (!/[=^²³√π∫]/.test(line) && !/(?:sin|cos|tan)\s*[(θ0-9a-z]/i.test(line)) continue

    const labelled = line.match(/^([A-Za-z][A-Za-z ()'-]{2,40}?)\s*[:]\s*(.+)$/)
    const expression = (labelled ? labelled[2] : line).trim()
    if (seen.has(expression)) continue
    seen.add(expression)

    const auto = labelFor(expression, formulas.length)
    formulas.push({
      label: labelled ? labelled[1].trim() : auto.label,
      expression,
      explanation: auto.explanation,
    })
  }
  return formulas
}
