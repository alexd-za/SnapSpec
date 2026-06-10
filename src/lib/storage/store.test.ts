import { beforeEach, describe, expect, it } from 'vitest'
import { useSnapStore } from './store'
import { SAMPLE_INPUTS } from '../model/examples'
import { nowIso } from '../utils/dates'

function freshProject() {
  return useSnapStore
    .getState()
    .createProject(
      { type: 'sample', rawText: SAMPLE_INPUTS['study-notes'].text, importedAt: nowIso() },
      'study-notes',
    )
}

describe('snap store', () => {
  beforeEach(() => {
    useSnapStore.getState().resetStorage()
    localStorage.clear()
  })

  it('creates a project from parsed source', () => {
    const project = freshProject()
    expect(project.title).toBe('Photosynthesis')
    expect(project.blocks.length).toBeGreaterThan(4)
    expect(useSnapStore.getState().projects).toHaveLength(1)
  })

  it('persists to localStorage', () => {
    freshProject()
    const raw = localStorage.getItem('specsnap-store')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!).state.projects).toHaveLength(1)
  })

  it('updates a block', () => {
    const project = freshProject()
    const block = project.blocks.find((b) => b.type === 'summary')!
    useSnapStore.getState().updateBlock(project.id, block.id, { summary: 'Edited summary.' })
    const updated = useSnapStore.getState().projects[0].blocks.find((b) => b.id === block.id)
    expect(updated && 'summary' in updated && updated.summary).toBe('Edited summary.')
  })

  it('moves, duplicates, and deletes blocks', () => {
    const project = freshProject()
    const { moveBlock, duplicateBlock, deleteBlock } = useSnapStore.getState()
    const initial = project.blocks.map((b) => b.id)

    moveBlock(project.id, initial[1], 1)
    let blocks = useSnapStore.getState().projects[0].blocks
    expect(blocks[2].id).toBe(initial[1])

    duplicateBlock(project.id, initial[0])
    blocks = useSnapStore.getState().projects[0].blocks
    expect(blocks).toHaveLength(initial.length + 1)
    expect(blocks[1].type).toBe(blocks[0].type)
    expect(blocks[1].id).not.toBe(blocks[0].id)

    deleteBlock(project.id, blocks[1].id)
    expect(useSnapStore.getState().projects[0].blocks).toHaveLength(initial.length)
  })

  it('records exports', () => {
    const project = freshProject()
    useSnapStore.getState().addExport(project.id, 'markdown', 'photosynthesis.md')
    expect(useSnapStore.getState().projects[0].exports[0].format).toBe('markdown')
  })

  it('imports a backup and rejects invalid JSON', () => {
    const project = freshProject()
    const backup = JSON.stringify({ projects: [project], settings: { reducedMotion: true } })
    useSnapStore.getState().resetStorage()
    expect(useSnapStore.getState().importState(backup)).toBe(true)
    expect(useSnapStore.getState().projects).toHaveLength(1)
    expect(useSnapStore.getState().settings.reducedMotion).toBe(true)
    expect(useSnapStore.getState().importState('not json')).toBe(false)
  })
})
