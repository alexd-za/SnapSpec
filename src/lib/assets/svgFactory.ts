import { PALETTES } from '../model/palettes'
import type { AccentTheme } from '../model/types'

export type SvgAsset = {
  file: string
  title: string
  desc: string
  svg: string
}

const F = PALETTES.forest

type Frame = { w: number; h: number; bg?: string }

function svgDoc(
  id: string,
  title: string,
  desc: string,
  body: string,
  frame: Frame = { w: 240, h: 240 },
): string {
  const bg = frame.bg ?? F.surface
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${frame.w} ${frame.h}" role="img" aria-labelledby="${id}-t ${id}-d">
<title id="${id}-t">${title}</title>
<desc id="${id}-d">${desc}</desc>
<rect width="${frame.w}" height="${frame.h}" rx="20" fill="${bg}"/>
${body}
</svg>`
}

/** Leaf-vein mark used as the SpecSnap logo motif. */
function leafVein(cx: number, cy: number, scale = 1, color = F.accent): string {
  const s = scale
  return `<g stroke="${color}" stroke-width="${2.5 * s}" stroke-linecap="round" fill="none">
<path d="M ${cx} ${cy + 44 * s} C ${cx - 6 * s} ${cy + 10 * s}, ${cx - 2 * s} ${cy - 20 * s}, ${cx} ${cy - 44 * s}"/>
<path d="M ${cx} ${cy + 18 * s} C ${cx + 14 * s} ${cy + 8 * s}, ${cx + 24 * s} ${cy} , ${cx + 30 * s} ${cy - 12 * s}"/>
<path d="M ${cx} ${cy + 2 * s} C ${cx - 14 * s} ${cy - 8 * s}, ${cx - 22 * s} ${cy - 16 * s}, ${cx - 27 * s} ${cy - 28 * s}"/>
<path d="M ${cx} ${cy - 14 * s} C ${cx + 10 * s} ${cy - 22 * s}, ${cx + 16 * s} ${cy - 30 * s}, ${cx + 19 * s} ${cy - 40 * s}"/>
</g>`
}

function contours(w: number, h: number, color = F.accent, n = 4): string {
  let out = ''
  for (let i = 0; i < n; i++) {
    const y = (h / (n + 1)) * (i + 1)
    out += `<path d="M0 ${y} Q ${w * 0.25} ${y - 14}, ${w * 0.5} ${y} T ${w} ${y}" fill="none" stroke="${color}" stroke-width="1" opacity="${0.12 + i * 0.04}"/>`
  }
  return out
}

function docCard(x: number, y: number, w: number, h: number, accent = F.accent): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${F.bg}" stroke="${F.muted}" stroke-opacity="0.4"/>
<rect x="${x + 14}" y="${y + 16}" width="${w * 0.55}" height="7" rx="3.5" fill="${accent}"/>
<rect x="${x + 14}" y="${y + 32}" width="${w - 28}" height="5" rx="2.5" fill="${F.muted}" opacity="0.5"/>
<rect x="${x + 14}" y="${y + 44}" width="${w - 40}" height="5" rx="2.5" fill="${F.muted}" opacity="0.35"/>`
}

function badge(label: string, color: string): string {
  return `<rect x="70" y="158" width="100" height="30" rx="15" fill="${color}" opacity="0.15" stroke="${color}" stroke-opacity="0.6"/>
<text x="120" y="178" text-anchor="middle" font-family="monospace" font-size="14" fill="${color}">${label}</text>`
}

function themeSwatch(theme: AccentTheme): string {
  const p = PALETTES[theme]
  return `<rect x="28" y="28" width="184" height="184" rx="16" fill="${p.bg}"/>
<rect x="44" y="44" width="152" height="74" rx="10" fill="${p.surface}"/>
<rect x="56" y="58" width="84" height="9" rx="4.5" fill="${p.text}"/>
<rect x="56" y="76" width="118" height="6" rx="3" fill="${p.muted}"/>
<rect x="56" y="90" width="100" height="6" rx="3" fill="${p.muted}" opacity="0.7"/>
<circle cx="64" cy="150" r="14" fill="${p.accent}"/>
<rect x="90" y="142" width="106" height="7" rx="3.5" fill="${p.text}" opacity="0.85"/>
<rect x="90" y="156" width="80" height="6" rx="3" fill="${p.muted}"/>
${leafVein(180, 176, 0.5, p.accent)}`
}

function blockIcon(inner: string, label: string): string {
  return `${contours(240, 240, F.accent, 3)}
<rect x="40" y="40" width="160" height="120" rx="14" fill="${F.bg}" stroke="${F.muted}" stroke-opacity="0.35"/>
${inner}
${badge(label, F.accent)}`
}

const A = F.accent
const M = F.muted
const T = F.text

export function buildAllAssets(): SvgAsset[] {
  const assets: SvgAsset[] = []
  const add = (file: string, title: string, desc: string, body: string, frame?: Frame) => {
    const id = file.replace(/\.svg$/, '').replace(/[^a-z0-9-]/gi, '')
    assets.push({ file, title, desc, svg: svgDoc(id, title, desc, body, frame) })
  }

  add(
    '01-specsnap-logo.svg',
    'SpecSnap logo',
    'A leaf-vein mark growing inside a rounded square, the SpecSnap logo.',
    `<circle cx="120" cy="120" r="78" fill="${F.bg}"/>
<circle cx="120" cy="120" r="78" fill="none" stroke="${A}" stroke-opacity="0.4"/>
${leafVein(120, 120, 1.3)}
<circle cx="120" cy="168" r="4" fill="${A}"/>`,
  )

  const themeDescs: Record<AccentTheme, string> = {
    forest: 'Deep charcoal green theme with fern accent.',
    mist: 'Off-white mist theme with river blue accent.',
    sunlit: 'Warm parchment theme with honey amber accent.',
    river: 'Deep blue slate theme with glacial cyan accent.',
    bloom: 'Dark plum theme with wildflower violet accent.',
  }
  ;(['forest', 'mist', 'sunlit', 'river', 'bloom'] as AccentTheme[]).forEach((theme, i) => {
    add(
      `0${i + 2}-${theme}-theme.svg`,
      `${PALETTES[theme].name} theme preview`,
      themeDescs[theme],
      themeSwatch(theme),
    )
  })

  const templates: [string, string, string, string][] = [
    ['07-study-template.svg', 'Study Notes template', 'A study page with summary and key points.', 'STUDY'],
    ['08-poetry-template.svg', 'Poetry Analysis template', 'A poem page with stanzas and annotations.', 'POETRY'],
    ['09-maths-template.svg', 'Maths Explainer template', 'A maths page with formula cards.', 'MATHS'],
    ['10-product-template.svg', 'Product Brief template', 'A product one-pager with problem and solution.', 'PRODUCT'],
    ['11-showcase-template.svg', 'Project Showcase template', 'A showcase page with gallery tiles.', 'SHOWCASE'],
    ['12-cheatsheet-template.svg', 'Revision Cheat Sheet template', 'A dense printable revision sheet.', 'CHEATS'],
  ]
  for (const [file, title, desc, label] of templates) {
    add(
      file,
      title,
      desc,
      `${contours(240, 240, A, 3)}
${docCard(50, 38, 140, 70)}
${docCard(50, 118, 64, 50)}
${docCard(126, 118, 64, 50)}
${badge(label, A)}`,
    )
  }

  const blocks: [string, string, string, string, string][] = [
    [
      '13-heading-block.svg',
      'Heading block',
      'A heading block with eyebrow and title lines.',
      `<rect x="56" y="62" width="52" height="7" rx="3.5" fill="${A}"/><rect x="56" y="80" width="120" height="14" rx="7" fill="${T}"/><rect x="56" y="106" width="96" height="8" rx="4" fill="${M}" opacity="0.6"/>`,
      'HEADING',
    ],
    [
      '14-summary-block.svg',
      'Summary block',
      'A summary paragraph block.',
      `<rect x="56" y="60" width="128" height="7" rx="3.5" fill="${M}" opacity="0.7"/><rect x="56" y="76" width="128" height="7" rx="3.5" fill="${M}" opacity="0.55"/><rect x="56" y="92" width="100" height="7" rx="3.5" fill="${M}" opacity="0.4"/><rect x="56" y="116" width="40" height="7" rx="3.5" fill="${A}"/>`,
      'SUMMARY',
    ],
    [
      '15-keypoints-block.svg',
      'Key points block',
      'A bulleted key points block.',
      `<circle cx="62" cy="68" r="4" fill="${A}"/><rect x="76" y="64" width="100" height="7" rx="3.5" fill="${T}" opacity="0.85"/><circle cx="62" cy="96" r="4" fill="${A}"/><rect x="76" y="92" width="84" height="7" rx="3.5" fill="${T}" opacity="0.7"/><circle cx="62" cy="124" r="4" fill="${A}"/><rect x="76" y="120" width="92" height="7" rx="3.5" fill="${T}" opacity="0.55"/>`,
      'POINTS',
    ],
    [
      '16-definition-block.svg',
      'Definitions block',
      'A term and definition list block.',
      `<rect x="56" y="62" width="56" height="8" rx="4" fill="${A}"/><rect x="56" y="78" width="124" height="6" rx="3" fill="${M}" opacity="0.5"/><rect x="56" y="102" width="44" height="8" rx="4" fill="${A}"/><rect x="56" y="118" width="110" height="6" rx="3" fill="${M}" opacity="0.5"/>`,
      'DEFINE',
    ],
    [
      '17-formula-block.svg',
      'Formula block',
      'A formula card with an equation.',
      `<rect x="56" y="64" width="128" height="44" rx="8" fill="${F.surface}" stroke="${A}" stroke-opacity="0.5"/><text x="120" y="92" text-anchor="middle" font-family="monospace" font-size="16" fill="${A}">a²+b²=c²</text><rect x="56" y="120" width="96" height="6" rx="3" fill="${M}" opacity="0.5"/>`,
      'FORMULA',
    ],
    [
      '18-quote-block.svg',
      'Quote block',
      'A quotation block with attribution line.',
      `<text x="58" y="96" font-family="Georgia, serif" font-size="44" fill="${A}">“</text><rect x="88" y="70" width="92" height="7" rx="3.5" fill="${T}" opacity="0.8"/><rect x="88" y="86" width="80" height="7" rx="3.5" fill="${T}" opacity="0.65"/><rect x="88" y="110" width="56" height="6" rx="3" fill="${M}" opacity="0.5"/>`,
      'QUOTE',
    ],
    [
      '19-comparison-block.svg',
      'Comparison block',
      'A two-column comparison table block.',
      `<rect x="56" y="60" width="58" height="9" rx="4.5" fill="${A}"/><rect x="124" y="60" width="58" height="9" rx="4.5" fill="${A}" opacity="0.6"/><rect x="56" y="80" width="58" height="6" rx="3" fill="${M}" opacity="0.5"/><rect x="124" y="80" width="58" height="6" rx="3" fill="${M}" opacity="0.5"/><rect x="56" y="96" width="58" height="6" rx="3" fill="${M}" opacity="0.4"/><rect x="124" y="96" width="58" height="6" rx="3" fill="${M}" opacity="0.4"/><rect x="56" y="112" width="58" height="6" rx="3" fill="${M}" opacity="0.3"/><rect x="124" y="112" width="58" height="6" rx="3" fill="${M}" opacity="0.3"/>`,
      'COMPARE',
    ],
    [
      '20-timeline-block.svg',
      'Timeline block',
      'A vertical timeline block with event nodes.',
      `<line x1="70" y1="58" x2="70" y2="140" stroke="${A}" stroke-width="2"/><circle cx="70" cy="66" r="5" fill="${A}"/><circle cx="70" cy="100" r="5" fill="${A}" opacity="0.7"/><circle cx="70" cy="134" r="5" fill="${A}" opacity="0.5"/><rect x="86" y="62" width="84" height="7" rx="3.5" fill="${T}" opacity="0.8"/><rect x="86" y="96" width="72" height="7" rx="3.5" fill="${T}" opacity="0.6"/><rect x="86" y="130" width="92" height="7" rx="3.5" fill="${T}" opacity="0.45"/>`,
      'TIMELINE',
    ],
    [
      '21-diagram-block.svg',
      'Diagram block',
      'A concept map diagram block with branch connections.',
      `<circle cx="120" cy="100" r="16" fill="${A}"/><circle cx="72" cy="70" r="10" fill="${F.surface}" stroke="${A}"/><circle cx="170" cy="74" r="10" fill="${F.surface}" stroke="${A}"/><circle cx="84" cy="134" r="10" fill="${F.surface}" stroke="${A}"/><circle cx="164" cy="130" r="10" fill="${F.surface}" stroke="${A}"/><path d="M108 92 Q 90 78 82 76 M132 92 Q 152 80 160 78 M110 110 Q 96 124 92 128 M132 110 Q 150 122 156 126" stroke="${A}" fill="none" stroke-opacity="0.6"/>`,
      'DIAGRAM',
    ],
    [
      '22-flashcard-block.svg',
      'Flashcards block',
      'A stack of flip cards.',
      `<rect x="66" y="74" width="116" height="64" rx="10" fill="${F.surface}" stroke="${M}" stroke-opacity="0.4" transform="rotate(-4 124 106)"/><rect x="62" y="64" width="116" height="64" rx="10" fill="${F.bg}" stroke="${A}" stroke-opacity="0.7"/><rect x="78" y="84" width="70" height="8" rx="4" fill="${A}"/><rect x="78" y="102" width="84" height="6" rx="3" fill="${M}" opacity="0.5"/>`,
      'CARDS',
    ],
    [
      '23-quiz-block.svg',
      'Quiz block',
      'A quiz block with question and hidden answer.',
      `<text x="60" y="92" font-family="Georgia, serif" font-size="34" fill="${A}">?</text><rect x="86" y="68" width="94" height="8" rx="4" fill="${T}" opacity="0.8"/><rect x="86" y="86" width="76" height="7" rx="3.5" fill="${M}" opacity="0.5"/><rect x="86" y="110" width="64" height="18" rx="9" fill="${A}" opacity="0.2" stroke="${A}" stroke-opacity="0.6"/>`,
      'QUIZ',
    ],
    [
      '24-essay-outline-block.svg',
      'Essay outline block',
      'An essay outline block with thesis and arguments.',
      `<rect x="56" y="60" width="110" height="9" rx="4.5" fill="${A}"/><rect x="68" y="82" width="100" height="6" rx="3" fill="${M}" opacity="0.6"/><rect x="68" y="96" width="88" height="6" rx="3" fill="${M}" opacity="0.5"/><rect x="68" y="110" width="94" height="6" rx="3" fill="${M}" opacity="0.4"/><rect x="56" y="128" width="76" height="7" rx="3.5" fill="${T}" opacity="0.7"/>`,
      'ESSAY',
    ],
    [
      '25-callout-block.svg',
      'Callout block',
      'A highlighted callout note block.',
      `<rect x="54" y="64" width="132" height="64" rx="10" fill="${A}" opacity="0.12" stroke="${A}" stroke-opacity="0.7"/><circle cx="74" cy="86" r="7" fill="${A}"/><rect x="90" y="80" width="74" height="8" rx="4" fill="${T}" opacity="0.8"/><rect x="68" y="102" width="104" height="6" rx="3" fill="${M}" opacity="0.55"/>`,
      'CALLOUT',
    ],
  ]
  for (const [file, title, desc, inner, label] of blocks) {
    add(file, title, desc, blockIcon(inner, label))
  }

  const exportsList: [string, string, string][] = [
    ['26-export-html.svg', 'HTML export', 'HTML'],
    ['27-export-markdown.svg', 'Markdown export', 'MD'],
    ['28-export-json.svg', 'JSON export', 'JSON'],
    ['29-export-svg.svg', 'SVG export', 'SVG'],
    ['30-export-svgz.svg', 'SVGZ export', 'SVGZ'],
    ['31-export-png.svg', 'PNG export', 'PNG'],
    ['32-export-video.svg', 'Video export', 'VIDEO'],
  ]
  for (const [file, title, label] of exportsList) {
    add(
      file,
      title,
      `${title} badge: a document with a leaf-vein corner and the ${label} format label.`,
      `${contours(240, 240, A, 2)}
<path d="M84 48 h56 l28 28 v100 a10 10 0 0 1 -10 10 h-74 a10 10 0 0 1 -10 -10 v-118 a10 10 0 0 1 10 -10 z" fill="${F.bg}" stroke="${M}" stroke-opacity="0.4"/>
<path d="M140 48 v28 h28" fill="none" stroke="${A}" stroke-opacity="0.7"/>
${leafVein(150, 160, 0.4)}
<rect x="86" y="100" width="68" height="26" rx="13" fill="${A}"/>
<text x="120" y="118" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="${F.bg}">${label}</text>`,
    )
  }

  add(
    '33-empty-gallery.svg',
    'Empty gallery',
    'An empty clearing with a single seedling, shown when the gallery has no Snaps.',
    `${contours(240, 240, A, 5)}
<ellipse cx="120" cy="170" rx="64" ry="10" fill="${A}" opacity="0.15"/>
<path d="M120 170 C 118 140, 118 130, 120 112" stroke="${A}" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M120 130 C 108 124, 100 114, 98 102 C 112 104, 120 114, 120 130 Z" fill="${A}" opacity="0.85"/>
<path d="M120 122 C 132 116, 140 106, 142 94 C 128 96, 120 106, 120 122 Z" fill="${A}"/>
<text x="120" y="206" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="${M}">Plant your first Snap</text>`,
  )

  add(
    '34-file-import.svg',
    'File import',
    'A document dropping into an open import tray with a leaf accent.',
    `${docCard(76, 40, 88, 64)}
<path d="M120 116 v44 M104 146 l16 16 16 -16" stroke="${A}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M64 176 v14 a8 8 0 0 0 8 8 h96 a8 8 0 0 0 8 -8 v-14" stroke="${M}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  )

  add(
    '35-local-first.svg',
    'Local-first badge',
    'A house-shaped shield with a leaf inside, signalling all data stays on the device.',
    `<path d="M120 44 L188 92 v66 a14 14 0 0 1 -14 14 H66 a14 14 0 0 1 -14 -14 V92 Z" fill="${F.bg}" stroke="${A}" stroke-opacity="0.7" stroke-width="2"/>
${leafVein(120, 124, 0.7)}
<text x="120" y="204" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" letter-spacing="2" fill="${M}">LOCAL-FIRST</text>`,
  )

  add(
    '36-editor-layout.svg',
    'Editor layout',
    'The three-pane SpecSnap editor: block list, live preview, inspector.',
    `<rect x="28" y="36" width="44" height="168" rx="8" fill="${F.bg}" stroke="${M}" stroke-opacity="0.35"/>
<rect x="80" y="36" width="92" height="168" rx="8" fill="${F.bg}" stroke="${A}" stroke-opacity="0.55"/>
<rect x="180" y="36" width="32" height="168" rx="8" fill="${F.bg}" stroke="${M}" stroke-opacity="0.35"/>
<rect x="36" y="48" width="28" height="8" rx="4" fill="${A}"/>
<rect x="36" y="64" width="28" height="8" rx="4" fill="${M}" opacity="0.5"/>
<rect x="36" y="80" width="28" height="8" rx="4" fill="${M}" opacity="0.4"/>
<rect x="92" y="52" width="56" height="10" rx="5" fill="${T}" opacity="0.85"/>
<rect x="92" y="72" width="68" height="6" rx="3" fill="${M}" opacity="0.5"/>
<rect x="92" y="86" width="60" height="6" rx="3" fill="${M}" opacity="0.4"/>
<circle cx="196" cy="56" r="6" fill="${A}"/>
<rect x="188" y="72" width="16" height="6" rx="3" fill="${M}" opacity="0.5"/>`,
  )

  add(
    '37-poster-frame.svg',
    'Poster frame',
    'A portrait poster frame with title and key lines, used for poster exports.',
    `<rect x="70" y="32" width="100" height="176" rx="10" fill="${F.bg}" stroke="${M}" stroke-opacity="0.4"/>
<rect x="82" y="48" width="40" height="6" rx="3" fill="${A}"/>
<rect x="82" y="62" width="72" height="10" rx="5" fill="${T}" opacity="0.85"/>
<circle cx="88" cy="96" r="3" fill="${A}"/><rect x="98" y="93" width="56" height="6" rx="3" fill="${M}" opacity="0.55"/>
<circle cx="88" cy="116" r="3" fill="${A}"/><rect x="98" y="113" width="48" height="6" rx="3" fill="${M}" opacity="0.45"/>
<circle cx="88" cy="136" r="3" fill="${A}"/><rect x="98" y="133" width="52" height="6" rx="3" fill="${M}" opacity="0.4"/>
${leafVein(146, 180, 0.35)}`,
  )

  add(
    '38-leaf-vein-divider.svg',
    'Leaf-vein divider',
    'A horizontal divider drawn like the midrib and veins of a leaf.',
    `<path d="M20 60 H 220" stroke="${A}" stroke-width="1.5" opacity="0.6"/>
<path d="M70 60 q 8 -12 18 -16 M70 60 q 8 12 18 16 M120 60 q 8 -12 18 -16 M120 60 q 8 12 18 16 M170 60 q 8 -12 18 -16 M170 60 q 8 12 18 16" stroke="${A}" stroke-width="1.2" fill="none" opacity="0.45"/>
<circle cx="20" cy="60" r="3" fill="${A}"/><circle cx="220" cy="60" r="3" fill="${A}"/>`,
    { w: 240, h: 120 },
  )

  add(
    '39-topographic-grid.svg',
    'Topographic grid',
    'Layered topographic contour lines fused with a faint grid, a background motif.',
    `${contours(240, 240, A, 7)}
<g stroke="${M}" stroke-width="0.5" opacity="0.15">
<path d="M60 0 V240 M120 0 V240 M180 0 V240 M0 60 H240 M0 120 H240 M0 180 H240"/>
</g>
<circle cx="120" cy="120" r="3" fill="${A}" opacity="0.6"/>`,
  )

  add(
    '40-loading-seed.svg',
    'Loading seed',
    'A seed sprouting between soil lines, used for loading states.',
    `${contours(240, 240, A, 3)}
<ellipse cx="120" cy="160" rx="50" ry="8" fill="${A}" opacity="0.15"/>
<ellipse cx="120" cy="150" rx="12" ry="16" fill="${A}" opacity="0.85"/>
<path d="M120 136 C 120 118, 128 108, 140 102" stroke="${A}" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M140 102 C 132 96, 130 88, 132 78 C 142 82, 146 92, 140 102 Z" fill="${A}"/>
<text x="120" y="200" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" letter-spacing="2" fill="${M}">GROWING</text>`,
  )

  return assets
}
