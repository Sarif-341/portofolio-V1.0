import { useState } from 'react'
import { flushSync } from 'react-dom'
import { ArrowUpRight } from 'lucide-react'
import useReducedMotion from '../hooks/useReducedMotion'

const ANGLE = 38
const DEPTH = 160
const SCALE_DROP = 0.1
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const BTN =
  'rounded-full border border-line px-3 py-1 font-mono text-xs text-paper transition-colors duration-150 hover:border-muted aria-disabled:cursor-not-allowed aria-disabled:text-muted aria-disabled:opacity-50 aria-disabled:hover:border-line'

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
    const step = { ArrowLeft: -1, ArrowRight: 1 }[e.key]
    if (!step) return
    e.preventDefault()
    // A focused card is swapped out when it leaves the center, which would drop focus.
    if (e.target.closest('li')) e.currentTarget.focus()
    go(index + step)
  }

  const select = (e, i) => {
    const li = e.currentTarget.parentElement
    flushSync(() => go(i))
    // preventScroll: the card is still off-center and would scroll the clipped stage.
    li.firstElementChild.focus({ preventScroll: true })
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
            const isLink = isActive && Boolean(item.href)
            const Card = !isActive ? 'button' : isLink ? 'a' : 'article'
            return (
              <li
                key={item.title}
                inert={Math.abs(offset) > 2}
                className="absolute left-1/2 top-1/2 -ml-[min(35vw,150px)] -mt-[130px] w-[min(70vw,300px)] md:-mt-[160px]"
                style={itemStyle(offset, reduced)}
              >
                <Card
                  {...(isActive
                    ? { tabIndex: isLink ? undefined : -1 }
                    : {
                        type: 'button',
                        onClick: (e) => select(e, i),
                        'aria-label': `Tampilkan ${item.title}`,
                      })}
                  {...(isLink
                    ? {
                        href: item.href,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      }
                    : {})}
                  className={`group flex h-[260px] w-full flex-col justify-end overflow-hidden rounded-xl border border-line bg-surface text-left md:h-[320px] ${
                    isActive ? '' : 'cursor-pointer'
                  }`}
                >
                  {item.image && (
                    <div className="min-h-0 w-full flex-1 overflow-hidden">
                      <img
                        src={item.image.src}
                        srcSet={item.image.srcSet}
                        sizes="(min-width: 768px) 340px, 80vw"
                        width={item.image.width}
                        height={item.image.height}
                        alt=""
                        loading="lazy"
                        className={`h-full w-full object-cover ${item.image.position} ${
                          isLink
                            ? 'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out-expo motion-safe:group-hover:scale-[1.02]'
                            : ''
                        }`}
                      />
                    </div>
                  )}
                  <div className="w-full p-6">
                    <p className="font-mono text-xs text-muted">{item.tag}</p>
                    <h3 className="mt-2 text-xl font-medium leading-snug">
                      {item.title}
                      {isLink && (
                        <>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="ml-1 inline size-5 align-text-bottom text-accent"
                          />
                          <span className="sr-only"> (buka di tab baru)</span>
                        </>
                      )}
                    </h3>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      </div>

      {/* aria-disabled, not disabled: a disabled button drops keyboard focus at either end. */}
      <div className="flex justify-between">
        <button
          type="button"
          className={BTN}
          onClick={() => go(index - 1)}
          aria-disabled={index === 0}
          aria-label="Proyek sebelumnya"
        >
          prev
        </button>
        <button
          type="button"
          className={BTN}
          onClick={() => go(index + 1)}
          aria-disabled={index === last}
          aria-label="Proyek berikutnya"
        >
          next
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {index + 1} dari {items.length}: {items[index].title}
      </p>
    </div>
  )
}
