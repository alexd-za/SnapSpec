import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Film } from 'lucide-react'
import { useSnapStore } from '../lib/storage/store'
import type { SnapExport, SnapProject } from '../lib/model/types'
import { performExport } from '../lib/exports/runExport'
import { downloadFile } from '../lib/storage/persistence'
import { formatDateTime } from '../lib/utils/dates'
import { AssetManifestPanel } from '../components/exports/AssetManifestPanel'
import { ExportSuccessBloom } from '../components/motion/ExportSuccessBloom'
import { SkeletonBlock } from '../components/ui/Skeletons'
import { MossPanel } from '../components/nature/MossPanel'
import { Reveal } from '../components/motion/Reveal'

const FORMAT_ICONS: Record<SnapExport['format'], string> = {
  html: '/generated/svg/26-export-html.svg',
  markdown: '/generated/svg/27-export-markdown.svg',
  json: '/generated/svg/28-export-json.svg',
  svg: '/generated/svg/29-export-svg.svg',
  svgz: '/generated/svg/30-export-svgz.svg',
  png: '/generated/svg/31-export-png.svg',
  video: '/generated/svg/32-export-video.svg',
}

const VIDEO_COMPOSITIONS = [
  { id: 'SnapSummary', size: '1920×1080', desc: '30s summary: title, key ideas, takeaway.' },
  { id: 'PoetryAnalysisReel', size: '1080×1080', desc: 'Theme, tone, techniques, thesis.' },
  { id: 'MathsFormulaReel', size: '1080×1080', desc: 'Formula, worked example, common mistake.' },
  { id: 'ProductBriefTeaser', size: '1920×1080', desc: 'Problem, solution, features, launch line.' },
  { id: 'ConceptMapBloom', size: '1920×1080', desc: 'Concept map growing like branches.' },
]

export function Exports() {
  const projects = useSnapStore((s) => s.projects)
  const addExport = useSnapStore((s) => s.addExport)
  const [loading, setLoading] = useState(true)
  const [bloom, setBloom] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  const records = useMemo(
    () =>
      projects
        .flatMap((p) => p.exports.map((e) => ({ record: e, project: p })))
        .sort((a, b) => b.record.createdAt.localeCompare(a.record.createdAt)),
    [projects],
  )

  async function reExport(project: SnapProject, format: SnapExport['format']) {
    const files = await performExport(project, format)
    for (const f of files) downloadFile(f.fileName, f.blob)
    addExport(project.id, format, files[0]?.fileName)
    setBloom(`${format.toUpperCase()} re-exported`)
    setTimeout(() => setBloom(null), 2400)
  }

  return (
    <div data-testid="exports">
      <Reveal>
        <h1 className="font-serif text-3xl tracking-tight">Exports</h1>
        <p className="annotation mt-1 text-base">the press room — everything you've pressed, plus the plates</p>
      </Reveal>

      <section className="mt-7" aria-labelledby="history-heading">
        <h2 id="history-heading" className="annotation mb-3 text-lg">export history</h2>
        {loading ? (
          <SkeletonBlock lines={4} />
        ) : records.length === 0 ? (
          <MossPanel className="p-8 text-center">
            <p className="font-serif text-lg">No exports yet</p>
            <p className="mt-1.5 text-sm text-mist">
              Open a Snap in the{' '}
              <Link to="/gallery" className="text-accent hover:underline">
                Gallery
              </Link>{' '}
              and hit Export — files land straight on your device.
            </p>
          </MossPanel>
        ) : (
          <MossPanel className="divide-y divide-mist/10">
            {records.map(({ record, project }) => (
              <div key={record.id} className="flex items-center gap-3 px-4 py-3">
                <img src={FORMAT_ICONS[record.format]} alt="" className="h-9 w-9 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{record.path ?? project.slug}</p>
                  <p className="text-xs text-mist">
                    {project.title} · {formatDateTime(record.createdAt)}
                  </p>
                </div>
                <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[10px] uppercase text-accent">
                  {record.format}
                </span>
                <span className="hidden text-[11px] text-accent sm:inline">done</span>
                <button
                  onClick={() => reExport(project, record.format)}
                  aria-label={`Re-export ${record.format} for ${project.title}`}
                  title="Re-export"
                  className="cursor-pointer rounded-lg p-2 text-mist transition-colors hover:bg-mist/10 hover:text-accent"
                >
                  <RefreshCw size={14} aria-hidden />
                </button>
              </div>
            ))}
          </MossPanel>
        )}
      </section>

      <section className="mt-8" aria-labelledby="assets-heading">
        <h2 id="assets-heading" className="annotation mb-3 text-lg">asset manifest — the 40 generated plates, svg &amp; svgz</h2>
        <AssetManifestPanel />
      </section>

      <section className="mt-8" aria-labelledby="video-heading">
        <h2 id="video-heading" className="annotation mb-3 text-lg">video compositions, set with remotion</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEO_COMPOSITIONS.map((c) => (
            <MossPanel key={c.id} className="p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Film size={15} className="text-accent" aria-hidden />
                {c.id}
              </p>
              <p className="mt-1 text-xs text-mist">{c.desc}</p>
              <p className="mt-2 font-mono text-[11px] text-mist">
                {c.size} · 30s · render: <span className="text-accent">pnpm video:render</span>
              </p>
            </MossPanel>
          ))}
        </div>
        <p className="mt-3 text-xs text-mist">
          Compositions live in <code>remotion/compositions/</code>. Rendering requires a local
          Chromium — see VIDEO_MANIFEST.md.
        </p>
      </section>

      <ExportSuccessBloom show={bloom !== null} label={bloom ?? ''} />
    </div>
  )
}
