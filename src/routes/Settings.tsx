import { useRef, useState } from 'react'
import { Download, RotateCcw, Trash2, Upload } from 'lucide-react'
import { useSnapStore } from '../lib/storage/store'
import { TEMPLATES } from '../lib/model/templates'
import type { SnapTemplate } from '../lib/model/types'
import { downloadStorageBackup } from '../lib/storage/persistence'
import { AccentSwitcher } from '../components/editor/AccentSwitcher'
import { MossPanel } from '../components/nature/MossPanel'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/motion/Reveal'

function Row({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-mist">{desc}</p>
      </div>
      {children}
    </div>
  )
}

export function Settings() {
  const { settings, setSettings, resetStorage, importState, projects } = useSnapStore()
  const [confirmReset, setConfirmReset] = useState(false)
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="mx-auto max-w-2xl" data-testid="settings">
      <Reveal>
        <h1 className="font-serif text-3xl tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-mist">
          All preferences live on this device. There are no cloud settings.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wider text-mist">
          Appearance
        </h2>
        <MossPanel className="divide-y divide-mist/10">
          <Row title="Theme palette" desc="The accent used across the app and as the default for new Snaps.">
            <AccentSwitcher
              value={settings.defaultAccent}
              onChange={(defaultAccent) => setSettings({ defaultAccent })}
            />
          </Row>
          <Row title="Reduced motion" desc="Disable animations app-wide. The OS-level preference is always respected too.">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => setSettings({ reducedMotion: e.target.checked })}
                className="h-4 w-4 accent-(--sn-accent)"
                aria-label="Reduce motion"
              />
              <span className="text-sm">{settings.reducedMotion ? 'On' : 'Off'}</span>
            </label>
          </Row>
        </MossPanel>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wider text-mist">
          Defaults
        </h2>
        <MossPanel className="divide-y divide-mist/10">
          <Row title="Default template" desc="Pre-selected when you open New Snap.">
            <select
              value={settings.defaultTemplate}
              onChange={(e) => setSettings({ defaultTemplate: e.target.value as SnapTemplate })}
              className="rounded-lg border border-mist/25 bg-bg/60 px-3 py-2 text-sm"
              aria-label="Default template"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Row>
          <Row title="Intro animation" desc="Replay the leaf-vein intro on the next visit to Home.">
            <Button variant="outline" size="sm" onClick={() => setSettings({ introSeen: false })}>
              <RotateCcw size={14} aria-hidden /> Replay intro
            </Button>
          </Row>
        </MossPanel>
      </Reveal>

      <Reveal delay={0.15}>
        <h2 className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wider text-mist">
          Storage
        </h2>
        <MossPanel className="divide-y divide-mist/10">
          <Row
            title="Export storage"
            desc={`Download all ${projects.length} Snaps and settings as a JSON backup.`}
          >
            <Button variant="outline" size="sm" onClick={downloadStorageBackup}>
              <Download size={14} aria-hidden /> Backup
            </Button>
          </Row>
          <Row title="Import backup" desc="Restore Snaps from a SpecSnap backup JSON. Replaces current data.">
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload size={14} aria-hidden /> Import
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              aria-label="Import backup file"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const ok = importState(await file.text())
                setImportMsg(ok ? 'Backup imported.' : 'That file is not a valid SpecSnap backup.')
                e.target.value = ''
              }}
            />
          </Row>
          <Row title="Reset storage" desc="Delete every Snap and preference from this device.">
            {confirmReset ? (
              <span className="flex items-center gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    resetStorage()
                    setConfirmReset(false)
                  }}
                >
                  Yes, erase everything
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </span>
            ) : (
              <Button variant="danger" size="sm" onClick={() => setConfirmReset(true)}>
                <Trash2 size={14} aria-hidden /> Reset
              </Button>
            )}
          </Row>
        </MossPanel>
        {importMsg && (
          <p role="status" className="mt-3 text-xs text-accent">
            {importMsg}
          </p>
        )}
      </Reveal>
    </div>
  )
}
