import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../routes/Home'
import { NewSnap } from '../routes/NewSnap'
import { Editor } from '../routes/Editor'
import { Gallery } from '../routes/Gallery'
import { Exports } from '../routes/Exports'
import { Settings } from '../routes/Settings'
import { IntroSequence } from '../components/motion/IntroSequence'
import { SkeletonBlock, SkeletonCard } from '../components/ui/Skeletons'
import { AccentSwitcher } from '../components/editor/AccentSwitcher'
import { useSnapStore } from '../lib/storage/store'
import { SAMPLE_INPUTS } from '../lib/model/examples'
import { nowIso } from '../lib/utils/dates'

function seedProject() {
  return useSnapStore
    .getState()
    .createProject(
      { type: 'sample', rawText: SAMPLE_INPUTS['study-notes'].text, importedAt: nowIso() },
      'study-notes',
    )
}

beforeEach(() => {
  useSnapStore.getState().resetStorage()
  localStorage.clear()
})

describe('IntroSequence', () => {
  it('can be skipped and stores the seen flag', async () => {
    const user = userEvent.setup()
    render(<IntroSequence />)
    expect(screen.getByRole('dialog', { name: /intro/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /skip intro/i }))
    expect(useSnapStore.getState().settings.introSeen).toBe(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not render once seen', () => {
    useSnapStore.getState().setSettings({ introSeen: true })
    render(<IntroSequence />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Skeleton loaders', () => {
  it('render with accessible loading labels', () => {
    render(
      <>
        <SkeletonBlock />
        <SkeletonCard />
      </>,
    )
    expect(screen.getByRole('status', { name: /loading content/i })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: /loading card/i })).toBeInTheDocument()
  })
})

describe('Home', () => {
  it('renders hero, CTA, and templates', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/messy notes/i)
    expect(screen.getByRole('link', { name: /create snap/i })).toHaveAttribute('href', '/new')
    expect(screen.getAllByText(/study notes/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/local-first · no accounts/i)).toBeInTheDocument()
  })
})

describe('NewSnap', () => {
  it('selects templates and validates empty input', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NewSnap />
      </MemoryRouter>,
    )
    const poetry = screen.getByRole('radio', { name: /poetry analysis/i })
    await user.click(poetry)
    expect(poetry).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('button', { name: /generate page/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/paste at least/i)
  })

  it('creates a Snap from a sample', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/new']}>
        <Routes>
          <Route path="/new" element={<NewSnap />} />
          <Route path="/editor/:id" element={<div>editor-route</div>} />
        </Routes>
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: /load sample/i }))
    await user.click(screen.getByRole('button', { name: /generate page/i }))
    await waitFor(() => expect(screen.getByText('editor-route')).toBeInTheDocument(), {
      timeout: 3000,
    })
    expect(useSnapStore.getState().projects).toHaveLength(1)
  })
})

describe('Editor', () => {
  it('renders blocks after the skeleton and supports editing', async () => {
    const project = seedProject()
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={[`/editor/${project.id}`]}>
        <Routes>
          <Route path="/editor/:id" element={<Editor />} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByTestId('editor')).toBeInTheDocument(), {
      timeout: 3000,
    })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Photosynthesis')

    // Select the summary block from the sidebar and edit it.
    const blockNav = screen.getByRole('navigation', { name: /blocks/i })
    await user.click(within(blockNav).getByText(/at a glance/i))
    const textarea = await screen.findByRole('textbox', { name: 'Summary' })
    await user.clear(textarea)
    await user.type(textarea, 'A fresh edited summary.')
    const stored = useSnapStore.getState().projects[0].blocks.find((b) => b.type === 'summary')
    expect(stored && 'summary' in stored && stored.summary).toBe('A fresh edited summary.')
  })

  it('switches accent palette', async () => {
    const project = seedProject()
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={[`/editor/${project.id}`]}>
        <Routes>
          <Route path="/editor/:id" element={<Editor />} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByTestId('editor')).toBeInTheDocument(), {
      timeout: 3000,
    })
    await user.click(screen.getByRole('radio', { name: /river palette/i }))
    expect(useSnapStore.getState().projects[0].accent).toBe('river')
    expect(document.documentElement.dataset.accent).toBe('river')
  })
})

describe('AccentSwitcher', () => {
  it('exposes a radiogroup with five palettes', () => {
    render(<AccentSwitcher value="forest" onChange={() => {}} />)
    expect(screen.getByRole('radiogroup', { name: /accent palette/i })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(5)
  })
})

describe('Gallery', () => {
  it('shows an empty state, then saved Snaps', async () => {
    render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText(/nothing planted yet/i)).toBeInTheDocument(), {
      timeout: 3000,
    })
  })

  it('lists saved Snaps', async () => {
    seedProject()
    render(
      <MemoryRouter>
        <Gallery />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText('Photosynthesis')).toBeInTheDocument(), {
      timeout: 3000,
    })
    expect(screen.getByText(/blocks ·/i)).toBeInTheDocument()
  })
})

describe('Exports page', () => {
  it('renders history empty state and video compositions', async () => {
    render(
      <MemoryRouter>
        <Exports />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.getByText(/no exports yet/i)).toBeInTheDocument(), {
      timeout: 3000,
    })
    expect(screen.getByText('SnapSummary')).toBeInTheDocument()
    expect(screen.getByText('ConceptMapBloom')).toBeInTheDocument()
  })
})

describe('Settings', () => {
  it('renders and toggles reduced motion', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('checkbox', { name: /reduce motion/i }))
    expect(useSnapStore.getState().settings.reducedMotion).toBe(true)
    // Re-query: toggling motion remounts the Reveal wrapper around the panel.
    await user.click(screen.getByRole('checkbox', { name: /reduce motion/i }))
    expect(useSnapStore.getState().settings.reducedMotion).toBe(false)
  })

  it('changes default template', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>,
    )
    await user.selectOptions(screen.getByRole('combobox', { name: /default template/i }), 'maths-explainer')
    expect(useSnapStore.getState().settings.defaultTemplate).toBe('maths-explainer')
  })
})
