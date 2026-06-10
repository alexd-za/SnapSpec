import type { SnapProject, SnapExport } from '../model/types'
import { exportHtml } from './html'
import { exportMarkdown } from './markdown'
import { exportJson } from './json'
import { diagramToSvg, projectDiagram, projectToPosterSvg } from './svg'
import { buildRevisionPack } from './revisionPack'
import { gzipSvgInBrowser } from '../assets/svgz'

export type ExportFormat = SnapExport['format'] | 'revision-pack'

export type ExportFile = { fileName: string; blob: Blob }

function posterOrDiagramSvg(project: SnapProject): string {
  const diagram = projectDiagram(project)
  return diagram ? diagramToSvg(diagram, project.accent) : projectToPosterSvg(project)
}

/** Renders the poster SVG to a PNG blob via canvas. Browser-only. */
async function svgToPngBlob(svg: string, width = 800, height = 1000): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    const img = new Image()
    img.decoding = 'async'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Could not rasterise SVG'))
      img.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = width * 2
    canvas.height = height * 2
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encoding failed'))), 'image/png'),
    )
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Produces the export file(s) for a format. Pure of store concerns. */
export async function performExport(
  project: SnapProject,
  format: ExportFormat,
): Promise<ExportFile[]> {
  const base = project.slug
  switch (format) {
    case 'markdown':
      return [
        {
          fileName: `${base}.md`,
          blob: new Blob([exportMarkdown(project)], { type: 'text/markdown' }),
        },
      ]
    case 'html':
      return [
        { fileName: `${base}.html`, blob: new Blob([exportHtml(project)], { type: 'text/html' }) },
      ]
    case 'json':
      return [
        {
          fileName: `${base}.json`,
          blob: new Blob([exportJson(project)], { type: 'application/json' }),
        },
      ]
    case 'svg':
      return [
        {
          fileName: `${base}-poster.svg`,
          blob: new Blob([projectToPosterSvg(project)], { type: 'image/svg+xml' }),
        },
        ...(projectDiagram(project)
          ? [
              {
                fileName: `${base}-concept-map.svg`,
                blob: new Blob([posterOrDiagramSvg(project)], { type: 'image/svg+xml' }),
              },
            ]
          : []),
      ]
    case 'svgz': {
      const gz = await gzipSvgInBrowser(projectToPosterSvg(project))
      return [{ fileName: `${base}-poster.svgz`, blob: gz }]
    }
    case 'png': {
      const png = await svgToPngBlob(projectToPosterSvg(project))
      return [{ fileName: `${base}-poster.png`, blob: png }]
    }
    case 'video':
      return [
        {
          fileName: `${base}-video-storyboard.json`,
          blob: new Blob(
            [
              JSON.stringify(
                {
                  note: 'Render with Remotion: pnpm video:render — see VIDEO_MANIFEST.md',
                  composition: 'SnapSummary',
                  project: { id: project.id, title: project.title, template: project.template },
                },
                null,
                2,
              ),
            ],
            { type: 'application/json' },
          ),
        },
      ]
    case 'revision-pack':
      return buildRevisionPack(project).map((f) => ({
        fileName: f.path.replace(/\//g, '__'),
        blob: new Blob([f.content], { type: 'text/plain' }),
      }))
  }
}
