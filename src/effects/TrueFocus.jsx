import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import useReducedMotion from '../hooks/useReducedMotion'

const INTERVAL = 2200
const PAD = 10
const EASE = [0.16, 1, 0.3, 1]

const CORNER = 'absolute size-3 border-accent'

export default function TrueFocus({ text, className }) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  const rootRef = useRef(null)
  const wordRefs = useRef([])
  const inView = useInView(rootRef)
  const [auto, setAuto] = useState(0)
  const [hovered, setHovered] = useState(null)
  const [rect, setRect] = useState(null)
  const active = hovered ?? auto

  useEffect(() => {
    if (reduced || !inView || hovered !== null) return
    const id = setInterval(() => {
      if (!document.hidden) setAuto((a) => (a + 1) % words.length)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [reduced, inView, hovered, words.length])

  useLayoutEffect(() => {
    if (reduced) return
    const measure = () => {
      const el = wordRefs.current[active]
      if (!el) return
      setRect({
        x: el.offsetLeft - PAD,
        y: el.offsetTop - PAD / 2,
        w: el.offsetWidth + PAD * 2,
        h: el.offsetHeight + PAD,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [active, reduced])

  if (reduced) return <h1 className={className}>{text}</h1>

  return (
    <h1 ref={rootRef} className={`relative ${className}`}>
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            ref={(el) => (wordRefs.current[i] = el)}
            className="inline-block"
            animate={{ filter: i === active ? 'blur(0px)' : 'blur(4px)' }}
            transition={{ duration: 0.4, ease: EASE }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
      {rect && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0"
          initial={false}
          animate={{ x: rect.x, y: rect.y, width: rect.w, height: rect.h }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <span className={`${CORNER} left-0 top-0 border-l-2 border-t-2`} />
          <span className={`${CORNER} right-0 top-0 border-r-2 border-t-2`} />
          <span className={`${CORNER} bottom-0 left-0 border-b-2 border-l-2`} />
          <span className={`${CORNER} bottom-0 right-0 border-b-2 border-r-2`} />
        </motion.span>
      )}
    </h1>
  )
}
