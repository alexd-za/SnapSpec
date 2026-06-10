import { useMemo, useState, useEffect } from 'react'
import type { SnapTemplate } from '../../lib/model/types'
import { SAMPLE_INPUTS } from '../../lib/model/examples'
import { buildBlocks } from '../../lib/parser/buildBlocks'
import { BlockRenderer } from '../blocks/BlockRenderer'
import { CascadeItem } from '../motion/Reveal'
import { SkeletonBlock } from '../ui/Skeletons'
import { MossPanel } from '../nature/MossPanel'

/** Live miniature of a generated sample Snap — the homepage demo. */
export function SnapPreview({
  template,
  maxBlocks = 4,
}: {
  template: SnapTemplate
  maxBlocks?: number
}) {
  const [ready, setReady] = useState(false)

  const blocks = useMemo(
    () => buildBlocks(SAMPLE_INPUTS[template].text, template).slice(0, maxBlocks),
    [template, maxBlocks],
  )

  useEffect(() => {
    setReady(false)
    const t = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(t)
  }, [template])

  return (
    <MossPanel className="max-h-[460px] overflow-hidden p-6">
      {!ready ? (
        <div className="space-y-4">
          <SkeletonBlock lines={2} />
          <SkeletonBlock lines={4} />
        </div>
      ) : (
        <div className="space-y-6">
          {blocks.map((block, i) => (
            <CascadeItem key={block.id} index={i}>
              <BlockRenderer block={block} headingAs="h2" />
            </CascadeItem>
          ))}
        </div>
      )}
    </MossPanel>
  )
}
