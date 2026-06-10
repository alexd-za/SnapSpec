import type { SnapBlock, SnapProject } from '../model/types'
import { PALETTES } from '../model/palettes'
import { diagramToSvg } from './svg'

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function blockToHtml(block: SnapBlock, accent: SnapProject['accent']): string {
  const h = (title?: string, fallback = '') =>
    title || fallback ? `<h2>${esc(title ?? fallback)}</h2>` : ''
  switch (block.type) {
    case 'heading':
      return `<header class="hero">${
        block.eyebrow ? `<p class="eyebrow">${esc(block.eyebrow)}</p>` : ''
      }<h1>${esc(block.heading)}</h1>${
        block.subheading ? `<p class="sub">${esc(block.subheading)}</p>` : ''
      }</header>`
    case 'summary':
      return `<section class="panel">${h(block.title, 'Summary')}<p>${esc(block.summary)}</p></section>`
    case 'key-points':
      return `<section class="panel">${h(block.title, 'Key points')}<ul>${block.points
        .map((p) => `<li>${esc(p)}</li>`)
        .join('')}</ul></section>`
    case 'definitions':
      return `<section class="panel">${h(block.title, 'Definitions')}<dl>${block.terms
        .map((t) => `<dt>${esc(t.term)}</dt><dd>${esc(t.definition)}</dd>`)
        .join('')}</dl></section>`
    case 'formulas':
      return `<section class="panel">${h(block.title, 'Formulas')}${block.formulas
        .map(
          (f) =>
            `<div class="formula"><strong>${esc(f.label)}</strong><code>${esc(
              f.expression,
            )}</code><p>${esc(f.explanation)}</p></div>`,
        )
        .join('')}</section>`
    case 'quotes':
      return `<section class="panel">${h(block.title, 'Quotes')}${block.quotes
        .map(
          (q) =>
            `<blockquote>${esc(q.quote)}${
              q.explanation ? `<footer>${esc(q.explanation)}</footer>` : ''
            }</blockquote>`,
        )
        .join('')}</section>`
    case 'comparison':
      return `<section class="panel">${h(block.title, 'Comparison')}<table><thead><tr>${block.columns
        .map((c) => `<th>${esc(c)}</th>`)
        .join('')}</tr></thead><tbody>${block.rows
        .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
        .join('')}</tbody></table></section>`
    case 'timeline':
      return `<section class="panel">${h(block.title, 'Timeline')}<ol class="timeline">${block.events
        .map((e) => `<li><strong>${esc(e.label)}</strong><span>${esc(e.detail)}</span></li>`)
        .join('')}</ol></section>`
    case 'diagram':
      return `<section class="panel">${h(block.title, 'Diagram')}<div class="diagram">${diagramToSvg(
        block,
        accent,
      )}</div></section>`
    case 'flashcards':
      return `<section class="panel">${h(block.title, 'Flashcards')}<div class="cards">${block.cards
        .map(
          (c) =>
            `<div class="card"><p class="front">${esc(c.front)}</p><p class="back">${esc(
              c.back,
            )}</p></div>`,
        )
        .join('')}</div></section>`
    case 'quiz':
      return `<section class="panel">${h(block.title, 'Quiz')}<ol>${block.questions
        .map(
          (q) =>
            `<li><p>${esc(q.prompt)}</p><details><summary>Show answer</summary><p>${esc(
              q.answer,
            )}</p>${q.memo ? `<p class="memo">${esc(q.memo)}</p>` : ''}</details></li>`,
        )
        .join('')}</ol></section>`
    case 'essay-outline':
      return `<section class="panel">${h(block.title, 'Essay outline')}<p><strong>Thesis:</strong> ${esc(
        block.thesis,
      )}</p><ol>${block.arguments.map((a) => `<li>${esc(a)}</li>`).join('')}</ol>${
        block.evidenceSlots.length
          ? `<ul>${block.evidenceSlots.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>`
          : ''
      }<p><strong>Conclusion:</strong> ${esc(block.conclusionAngle)}</p></section>`
    case 'callout':
      return `<aside class="callout callout-${block.tone}"><strong>${esc(
        block.title ?? 'Note',
      )}</strong><p>${esc(block.body)}</p></aside>`
    case 'export-card':
      return ''
    default:
      return ''
  }
}

/** Standalone HTML page: inline CSS, nature palette, no React, mobile-readable. */
export function exportHtml(project: SnapProject): string {
  const palette = PALETTES[project.accent]
  const body = project.blocks.map((b) => blockToHtml(b, project.accent)).filter(Boolean).join('\n')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(project.title)} — SpecSnap</title>
<style>
  :root{--bg:${palette.bg};--surface:${palette.surface};--text:${palette.text};--muted:${palette.muted};--accent:${palette.accent}}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font:16px/1.65 Georgia,'Times New Roman',serif;padding:24px}
  main{max-width:760px;margin:0 auto;display:grid;gap:20px}
  .hero{padding:36px 0 8px}
  .eyebrow{color:var(--accent);text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-family:system-ui,sans-serif;margin:0 0 8px}
  h1{font-size:clamp(28px,5vw,44px);line-height:1.15;margin:0 0 10px}
  .sub{color:var(--muted);font-size:18px;margin:0}
  h2{font-family:system-ui,sans-serif;font-size:14px;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin:0 0 14px;border-bottom:1px solid color-mix(in srgb,var(--accent) 30%,transparent);padding-bottom:8px}
  .panel{background:var(--surface);border:1px solid color-mix(in srgb,var(--muted) 25%,transparent);border-radius:16px;padding:22px 24px}
  ul,ol{margin:0;padding-left:22px}li{margin:6px 0}
  dt{font-weight:700;color:var(--accent)}dd{margin:2px 0 12px}
  .formula{margin:0 0 16px}
  code{display:block;background:color-mix(in srgb,var(--bg) 70%,var(--surface));border-radius:10px;padding:12px 16px;margin:8px 0;font-size:17px;overflow-x:auto}
  blockquote{border-left:3px solid var(--accent);margin:0 0 16px;padding:6px 0 6px 18px;font-style:italic}
  blockquote footer{font-style:normal;color:var(--muted);font-size:14px;margin-top:6px}
  table{width:100%;border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid color-mix(in srgb,var(--muted) 30%,transparent)}
  th{color:var(--accent)}
  .timeline{list-style:none;padding:0}.timeline li{padding:8px 0 8px 18px;border-left:2px solid var(--accent)}
  .timeline strong{display:block;color:var(--accent);font-family:system-ui,sans-serif;font-size:13px}
  .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
  .card{background:color-mix(in srgb,var(--bg) 60%,var(--surface));border:1px solid color-mix(in srgb,var(--muted) 25%,transparent);border-radius:12px;padding:14px}
  .card .front{font-weight:700;margin:0 0 8px}.card .back{color:var(--muted);margin:0;font-size:14px}
  details{margin-top:6px}summary{cursor:pointer;color:var(--accent);font-family:system-ui,sans-serif;font-size:14px}
  .memo{color:var(--muted);font-size:14px}
  .callout{border-radius:14px;border:1px solid var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--surface));padding:16px 20px}
  .callout strong{display:block;color:var(--accent);font-family:system-ui,sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
  .callout p{margin:0}
  .diagram svg{width:100%;height:auto}
  footer.page{color:var(--muted);font-size:12px;font-family:system-ui,sans-serif;text-align:center;padding:16px 0}
  @media print{body{background:#fff;color:#222}.panel{border-color:#ddd}}
</style>
</head>
<body>
<main>
${body}
<footer class="page">Made with SpecSnap · local-first · ${esc(new Date().toDateString())}</footer>
</main>
</body>
</html>`
}
