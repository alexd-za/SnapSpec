import { useState } from 'react'
import type { FlashcardsBlock } from '../../lib/model/types'

/** Tap-to-flip flashcards with a 3D flip (reduced-motion safe via CSS overrides). */
export function FlashcardDeck({ block }: { block: FlashcardsBlock }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())

  function toggle(i: number) {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {block.cards.map((card, i) => {
        const isFlipped = flipped.has(i)
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flip-scene min-h-28 cursor-pointer text-left"
            aria-pressed={isFlipped}
            aria-label={isFlipped ? `Answer: ${card.back}` : `Question: ${card.front}. Activate to flip.`}
          >
            <div className={`flip-inner relative h-full min-h-28 ${isFlipped ? 'flipped' : ''}`}>
              <div className="flip-face absolute inset-0 flex flex-col justify-between rounded-xl bg-ink/6 p-4">
                <p className="text-sm font-medium">{card.front}</p>
                <p className="text-[11px] uppercase tracking-wider text-mist">tap to flip</p>
              </div>
              <div className="flip-face flip-back absolute inset-0 flex flex-col justify-between rounded-xl bg-accent/15 shadow-[inset_0_0_0_1.5px_var(--sn-accent)] p-4">
                <p className="text-sm">{card.back}</p>
                <p className="text-[11px] uppercase tracking-wider text-accent">answer</p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
