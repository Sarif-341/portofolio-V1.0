import { useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'

const BTN =
  'rounded-full border border-line px-3 py-1 font-mono text-xs text-paper transition-colors duration-150 hover:border-muted disabled:cursor-not-allowed disabled:text-muted disabled:opacity-50 disabled:hover:border-line'

export default function PhotoSlider({ slides, label }) {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const last = slides.length - 1
  const go = (i) => setIndex(Math.min(Math.max(i, 0), last))

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index + 1)
    }
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="overflow-hidden rounded-lg">
        <ul
          className="m-0 flex list-none p-0"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: reduced
              ? 'none'
              : 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {slides.map((s, i) => (
            <li
              key={s}
              inert={i !== index}
              className="flex aspect-[4/3] w-full shrink-0 items-center justify-center border border-line bg-ink font-mono text-xs text-muted"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          className={BTN}
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Foto sebelumnya"
        >
          prev
        </button>
        <span className="font-mono text-xs text-muted" aria-live="polite">
          {index + 1} / {slides.length}
        </span>
        <button
          type="button"
          className={BTN}
          onClick={() => go(index + 1)}
          disabled={index === last}
          aria-label="Foto berikutnya"
        >
          next
        </button>
      </div>
    </div>
  )
}
