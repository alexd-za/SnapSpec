import type { SnapTemplate } from './types'

export const SAMPLE_INPUTS: Record<SnapTemplate, { name: string; text: string }> = {
  'study-notes': {
    name: 'Photosynthesis notes',
    text: `Photosynthesis

Photosynthesis is the process plants use to convert light energy into chemical energy stored in glucose. It happens mainly in the leaves, inside chloroplasts, and it is the foundation of almost every food chain on Earth. Plants take in carbon dioxide and water, and with light energy they produce glucose and oxygen.

Chlorophyll: the green pigment in chloroplasts that absorbs light energy
Chloroplast: the organelle where photosynthesis takes place
Stomata: small pores on the leaf surface that let gases in and out
Glucose: the sugar produced, used for respiration and stored as starch

- Light-dependent reactions happen in the thylakoid membranes
- The Calvin cycle fixes carbon dioxide into glucose
- Oxygen is released as a by-product of splitting water
- Rate increases with light intensity up to a saturation point
- Temperature and CO2 concentration are limiting factors

"The leaf is a factory powered by sunlight" - keep this image in mind for the exam.`,
  },
  'poetry-analysis': {
    name: 'Poem: The Quiet Field',
    text: `The Quiet Field

The fence leans into morning mist
and the grass forgets our names.
Light spills slow across the stones
where my father stacked his days.

I carry what the field still keeps,
a weight no scale can hold.
The gate swings wide on rusted song,
the path runs on, grown cold.

Theme: memory and inheritance
Tone: elegiac, tender
The speaker returns to a family field after loss.
"the grass forgets our names" - nature's indifference to human memory
"a weight no scale can hold" - grief made physical through paradox
Imagery of light and rust contrasts renewal with decay.
The enjambment lets each line spill into the next like the light it describes.`,
  },
  'maths-explainer': {
    name: 'Trig ratios revision',
    text: `Trigonometric Ratios

The three basic trig ratios relate the angles of a right-angled triangle to the ratios of its sides. Remember SOH CAH TOA.

sin θ = opposite / hypotenuse
cos θ = adjacent / hypotenuse
tan θ = opposite / adjacent
a² + b² = c²

Worked example: A ladder leans against a wall at 65° and reaches 4 m up. Find the ladder length.
1. Identify: opposite = 4, angle = 65°, want hypotenuse
2. Use sin 65° = 4 / h
3. Rearrange: h = 4 / sin 65°
4. h ≈ 4.41 m

Hypotenuse: the longest side, opposite the right angle
Adjacent: the side next to the chosen angle

- Always check the calculator is in degree mode
- The hypotenuse is never in the tan ratio
- Draw and label the triangle before choosing a ratio`,
  },
  'product-brief': {
    name: 'Idea: PlantPal',
    text: `PlantPal — never kill a houseplant again

Problem: People love houseplants but forget watering schedules, overwater, or miss early signs of stress. Existing apps are bloated, push subscriptions, and need accounts.

Target users: urban renters aged 20-40 with 3-15 plants and busy schedules.

Current alternatives: paper notes, generic reminder apps, heavyweight plant databases.

Solution: a local-first plant care companion that builds a watering rhythm per plant from simple check-ins.

Features:
- per-plant care rhythm with smart nudges
- photo journal to track growth
- offline-first, no account needed
- seasonal adjustment of watering intervals
- shareable plant care card

Value proposition: the calm, private plant app that fits in your pocket and never nags.

Roadmap:
Q1: core rhythm engine and journal
Q2: seasonal model and care cards
Q3: household sharing

Risks: hardware sensors competitors, retention after initial setup.`,
  },
  'project-showcase': {
    name: 'Project: TrailMapper',
    text: `TrailMapper — interactive hiking trail visualiser

Overview: TrailMapper is a web app that turns GPX files into beautiful interactive trail maps with elevation profiles.

Goal: make sharing hike routes as easy as sharing a photo.

Process:
1. Prototyped the elevation chart with sample GPX data
2. Built the map renderer with vector tiles
3. Added gradient colouring by steepness
4. Polished sharing cards and dark mode

Features:
- drag-and-drop GPX import
- elevation profile with hover sync
- steepness gradient colouring
- one-click share card export

Tech stack: TypeScript, React, MapLibre, D3, Vite.

Timeline:
Week 1: parsing and data model
Week 2: map and elevation view
Week 3: share cards and polish

Result: 40 trails mapped in the first month by the local hiking club, share cards used in the club newsletter.`,
  },
  'revision-cheat-sheet': {
    name: 'Biology exam cheat sheet',
    text: `Cell Biology Cheat Sheet — exam revision

Key facts to memorise before the test.

Mitochondria: powerhouse of the cell, site of aerobic respiration
Ribosome: site of protein synthesis
Nucleus: contains DNA, controls the cell
Cell membrane: controls what enters and leaves
Osmosis: diffusion of water across a partially permeable membrane

- Respiration equation: glucose + oxygen = carbon dioxide + water + energy
- Plant cells have walls, chloroplasts, and a large vacuole; animal cells do not
- Diffusion moves particles from high to low concentration
- Active transport needs energy and moves against the gradient

Do not forget: enzymes denature above 40°C — the active site changes shape.

Quick check: Can you label a plant cell, define osmosis, and write the respiration equation from memory?`,
  },
}
