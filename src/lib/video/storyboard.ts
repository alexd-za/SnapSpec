import type { SnapProject } from '../model/types'

export type SnapSummaryProps = {
  title: string
  summary: string
  keyIdeas: string[]
  takeaway: string
  accent: SnapProject['accent']
}

/** Maps a Snap project to the props Remotion compositions consume. */
export function buildSummaryStoryboard(project: SnapProject): SnapSummaryProps {
  const summary = project.blocks.find((b) => b.type === 'summary')
  const keyPoints = project.blocks.find((b) => b.type === 'key-points')
  const callout = project.blocks.find((b) => b.type === 'callout')
  return {
    title: project.title,
    summary: summary?.type === 'summary' ? summary.summary : 'A SpecSnap explainer.',
    keyIdeas: keyPoints?.type === 'key-points' ? keyPoints.points.slice(0, 3) : [],
    takeaway: callout?.type === 'callout' ? callout.body : 'Made with SpecSnap.',
    accent: project.accent,
  }
}
