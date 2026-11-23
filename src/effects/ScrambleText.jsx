import { useEffect, useRef, useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'

const CHARS = 'abcdefghijklmnopqrstuvwxyz'
const DURATION = 400
const TICK = 45

// Teks asli tetap di DOM (menentukan lebar & dibaca screen reader);
// teks acak hanya lapisan visual absolut di atasnya. Gunakan font monospace
// agar lebar karakter acak = karakter asli.
export default function ScrambleText({ text, trigger }) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(null)
  const raf = useRef(0)

  useEffect(() => {
    cancelAnimationFrame(raf.current)
    if (!trigger || reduced) return
    const start = performance.now()
    let last = 0
    const step = (now) => {
      const t = Math.min((now - start) / DURATION, 1)
      if (t >= 1) {
        setDisplay(null)
        return
      }
      if (now - last >= TICK) {
        last = now
        const done = Math.floor(t * text.length)
        setDisplay(
          text
            .split('')
            .map((c, i) =>
              i < done || c === ' '
                ? c
                : CHARS[Math.floor(Math.random() * CHARS.length)],
            )
            .join(''),
        )
      }
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf.current)
      setDisplay(null)
    }
  }, [trigger, reduced, text])

  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className={display ? 'invisible' : undefined}>{text}</span>
      {display && (
        <span aria-hidden="true" className="absolute inset-0">
          {display}
        </span>
      )}
    </span>
  )
}
