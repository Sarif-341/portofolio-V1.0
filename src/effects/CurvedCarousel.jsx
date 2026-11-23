import { useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'

const ANGLE = 38
const DEPTH = 160
const SCALE_DROP = 0.1
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

function itemStyle(offset, reduced) {
  const abs = Math.abs(offset)
  const x = `translateX(calc(var(--step) * ${offset}))`
  const transform = reduced
    ? x
    : `${x} translateZ(${-abs * DEPTH}px) rotateY(${-offset * ANGLE}deg) scale(${1 - abs * SCALE_DROP})`
  return {
    transform,
    opacity: abs > 2 ? 0 : 1 - abs * 0.3,
    zIndex: 10 - abs,
    pointerEvents: abs > 2 ? 'none' : 'auto',
    transition: reduced
      ? 'opacity 150ms linear'
      : `transform 500ms ${EASE}, opacity 300ms ${EASE}`,
  }
}

export default function CurvedCarousel({ items, label }) {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const last = items.length - 1
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
      className="[--step:42vw] md:[--step:290px]"
    >
      <div
        className="relative mx-auto h-[340px] w-full overflow-hidden md:h-[400px]"
        style={{ perspective: '1200px' }}
      >
        <ul
          className="pointer-events-none absolute inset-0 m-0 list-none p-0"
          style={{ transformStyle: reduced ? 'flat' : 'preserve-3d' }}
        >
          {items.map((item, i) => {
            const offset = i - index
            const isActive = offset === 0
            const Card = isActive ? 'article' : 'button'
            return (
              <li
                key={item.title}
                inert={Math.abs(offset) > 2}
                className="absolute left-1/2 top-1/2 -ml-[min(35vw,150px)] -mt-[130px] w-[min(70vw,300px)] md:-mt-[160px]"
                style={itemStyle(offset, reduced)}
              >
                <Card
                  {...(isActive
                    ? {}
                    : {
                        type: 'button',
                        onClick: () => go(i),
                        'aria-label': `Tampilkan ${item.title}`,
                      })}
                  className={`flex h-[260px] w-full flex-col justify-end rounded-xl border border-line bg-surface p-6 text-left md:h-[320px] ${
                    isActive ? '' : 'cursor-pointer'
                  }`}
                >
                  <p className="font-mono text-xs text-muted">{item.tag}</p>
                  <h3 className="mt-2 text-xl font-medium leading-snug">
                    {item.title}
                  </h3>
                </Card>
              </li>
            )
          })}
        </ul>
      </div>

      <p className="sr-only" aria-live="polite">
        {index + 1} dari {items.length}: {items[index].title}
      </p>
    </div>
  )
}
