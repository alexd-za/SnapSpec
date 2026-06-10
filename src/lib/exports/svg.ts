import type { AccentTheme, DiagramBlock, SnapProject } from '../model/types'
import { PALETTES } from '../model/palettes'

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Render a concept-map diagram block as accessible standalone SVG. */
export function diagramToSvg(block: DiagramBlock, accent: AccentTheme): string {
  const p = PALETTES[accent]
  const nodeById = new Map(block.nodes.map((n) => [n.id, n]))
  const edges = block.edges
    .map((e) => {
      const a = nodeById.get(e.source)
      const b = nodeById.get(e.target)
      if (!a || !b) return ''
      const mx = (a.x + b.x) / 2
      const my = (a.y + b.y) / 2 - 18
      return `<path d="M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}" fill="none" stroke="${p.accent}" stroke-width="1.5" opacity="0.55"/>`
    })
    .join('')
  const nodes = block.nodes
    .map((n, i) => {
      const isCore = i === 0
      const w = Math.max(64, n.label.length * 7.5 + 24)
      return `<g>
  <rect x="${n.x - w / 2}" y="${n.y - 16}" width="${w}" height="32" rx="16" fill="${
    isCore ? p.accent : p.surface
  }" stroke="${p.accent}" stroke-width="${isCore ? 0 : 1}"/>
  <text x="${n.x}" y="${n.y + 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="${
    isCore ? p.bg : p.text
  }">${esc(n.label)}</text>
</g>`
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" role="img" aria-labelledby="cm-title cm-desc">
<title id="cm-title">${esc(block.title ?? 'Concept map')}</title>
<desc id="cm-desc">Concept map with ${block.nodes.length} nodes connected like branches.</desc>
<rect width="600" height="340" rx="16" fill="${p.bg}"/>
${edges}
${nodes}
</svg>`
}

/** Poster-style SVG summary of a project, for sharing and exports. */
export function projectToPosterSvg(project: SnapProject): string {
  const p = PALETTES[project.accent]
  const summary = project.blocks.find((b) => b.type === 'summary')
  const keyPoints = project.blocks.find((b) => b.type === 'key-points')
  const points = keyPoints?.type === 'key-points' ? keyPoints.points.slice(0, 4) : []
  const wrap = (text: string, width: number): string[] => {
    const words = text.split(' ')
    const lines: string[] = []
    let line = ''
    for (const w of words) {
      if ((line + ' ' + w).trim().length > width) {
        lines.push(line.trim())
        line = w
      } else {
        line += ' ' + w
      }
    }
    if (line.trim()) lines.push(line.trim())
    return lines.slice(0, 3)
  }
  const summaryLines =
    summary?.type === 'summary' ? wrap(summary.summary, 64) : ['A SpecSnap explainer.']
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-labelledby="poster-title poster-desc">
<title id="poster-title">${esc(project.title)}</title>
<desc id="poster-desc">Poster summary of the SpecSnap explainer “${esc(project.title)}”.</desc>
<rect width="800" height="1000" fill="${p.bg}"/>
<path d="M0 120 Q 200 90 400 120 T 800 120" fill="none" stroke="${p.accent}" stroke-width="1" opacity="0.25"/>
<path d="M0 880 Q 200 850 400 880 T 800 880" fill="none" stroke="${p.accent}" stroke-width="1" opacity="0.25"/>
<text x="60" y="100" font-family="system-ui, sans-serif" font-size="14" letter-spacing="4" fill="${p.accent}">${esc(
    project.template.toUpperCase().replace(/-/g, ' '),
  )}</text>
<text x="60" y="170" font-family="Georgia, serif" font-size="44" fill="${p.text}">${esc(
    project.title.length > 30 ? project.title.slice(0, 30) + '…' : project.title,
  )}</text>
${summaryLines
  .map(
    (l, i) =>
      `<text x="60" y="${230 + i * 28}" font-family="Georgia, serif" font-size="18" fill="${p.muted}">${esc(l)}</text>`,
  )
  .join('\n')}
${points
  .map(
    (pt, i) => `<g>
<circle cx="72" cy="${380 + i * 70}" r="5" fill="${p.accent}"/>
<text x="96" y="${386 + i * 70}" font-family="system-ui, sans-serif" font-size="17" fill="${p.text}">${esc(
      pt.length > 60 ? pt.slice(0, 60) + '…' : pt,
    )}</text>
<rect x="60" y="${404 + i * 70}" width="680" height="1" fill="${p.muted}" opacity="0.2"/>
</g>`,
  )
  .join('\n')}
<text x="60" y="950" font-family="system-ui, sans-serif" font-size="13" fill="${p.muted}">Made with SpecSnap · local-first explainers</text>
<circle cx="720" cy="944" r="14" fill="none" stroke="${p.accent}" stroke-width="1.5"/>
<path d="M720 936 v16 M714 942 q6 -4 12 0" stroke="${p.accent}" stroke-width="1.5" fill="none"/>
</svg>`
}

export function projectDiagram(project: SnapProject): DiagramBlock | undefined {
  return project.blocks.find((b): b is DiagramBlock => b.type === 'diagram')
}
