import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AccentTheme,
  SnapBlock,
  SnapExport,
  SnapProject,
  SnapSource,
  SnapTemplate,
} from '../model/types'
import { parseSource } from '../parser/parseSource'
import { createId } from '../utils/ids'
import { slugify } from '../utils/slug'
import { nowIso } from '../utils/dates'
import { DEFAULT_ACCENT } from '../model/palettes'

export type SnapSettings = {
  defaultTemplate: SnapTemplate
  defaultAccent: AccentTheme
  reducedMotion: boolean
  introSeen: boolean
}

type SnapState = {
  projects: SnapProject[]
  settings: SnapSettings
  createProject: (source: SnapSource, template?: SnapTemplate, accent?: AccentTheme) => SnapProject
  updateProject: (id: string, patch: Partial<SnapProject>) => void
  deleteProject: (id: string) => void
  updateBlock: (projectId: string, blockId: string, patch: Partial<SnapBlock>) => void
  moveBlock: (projectId: string, blockId: string, direction: -1 | 1) => void
  duplicateBlock: (projectId: string, blockId: string) => void
  deleteBlock: (projectId: string, blockId: string) => void
  addExport: (projectId: string, format: SnapExport['format'], path?: string) => SnapExport
  setSettings: (patch: Partial<SnapSettings>) => void
  resetStorage: () => void
  importState: (json: string) => boolean
}

const DEFAULT_SETTINGS: SnapSettings = {
  defaultTemplate: 'study-notes',
  defaultAccent: DEFAULT_ACCENT,
  reducedMotion: false,
  introSeen: false,
}

export const useSnapStore = create<SnapState>()(
  persist(
    (set, get) => ({
      projects: [],
      settings: DEFAULT_SETTINGS,

      createProject: (source, template, accent) => {
        const parsed = parseSource(source, template)
        const project: SnapProject = {
          id: createId('snap'),
          title: parsed.title,
          slug: slugify(parsed.title),
          template: parsed.template,
          accent: accent ?? get().settings.defaultAccent,
          source,
          blocks: parsed.blocks,
          exports: [],
          createdAt: nowIso(),
          updatedAt: nowIso(),
        }
        set((s) => ({ projects: [project, ...s.projects] }))
        return project
      },

      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: nowIso() } : p,
          ),
        })),

      deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      updateBlock: (projectId, blockId, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  updatedAt: nowIso(),
                  blocks: p.blocks.map((b) =>
                    b.id === blockId ? ({ ...b, ...patch } as SnapBlock) : b,
                  ),
                }
              : p,
          ),
        })),

      moveBlock: (projectId, blockId, direction) =>
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== projectId) return p
            const index = p.blocks.findIndex((b) => b.id === blockId)
            const target = index + direction
            if (index < 0 || target < 0 || target >= p.blocks.length) return p
            const blocks = [...p.blocks]
            ;[blocks[index], blocks[target]] = [blocks[target], blocks[index]]
            return { ...p, blocks, updatedAt: nowIso() }
          }),
        })),

      duplicateBlock: (projectId, blockId) =>
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== projectId) return p
            const index = p.blocks.findIndex((b) => b.id === blockId)
            if (index < 0) return p
            const copy = { ...structuredClone(p.blocks[index]), id: createId('block') }
            const blocks = [...p.blocks]
            blocks.splice(index + 1, 0, copy)
            return { ...p, blocks, updatedAt: nowIso() }
          }),
        })),

      deleteBlock: (projectId, blockId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId), updatedAt: nowIso() }
              : p,
          ),
        })),

      addExport: (projectId, format, path) => {
        const record: SnapExport = {
          id: createId('export'),
          projectId,
          format,
          path,
          createdAt: nowIso(),
        }
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, exports: [record, ...p.exports], updatedAt: nowIso() }
              : p,
          ),
        }))
        return record
      },

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      resetStorage: () => set({ projects: [], settings: DEFAULT_SETTINGS }),

      importState: (json) => {
        try {
          const parsed = JSON.parse(json)
          if (!Array.isArray(parsed.projects)) return false
          set({
            projects: parsed.projects,
            settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
          })
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: 'specsnap-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
