import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import useReducedMotion from '../hooks/useReducedMotion'

const START_DELAY = 0.3
const STAGGER = 0.045

export default function BlurText({ text, className }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [fontsReady, setFontsReady] = useState(false)

  // Tunggu font siap agar animasi tidak habis saat teks masih berganti font.
  useEffect(() => {
    let alive = true
    const ready = document.fonts?.ready ?? Promise.resolve()
    ready.then(() => alive && setFontsReady(true))
    return () => {
      alive = false
    }
  }, [])

  if (reduced) return <p className={className}>{text}</p>

  const show = inView && fontsReady
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            className="inline-block"
            initial={false}
            animate={
              show
                ? { opacity: 1, filter: 'blur(0px)', y: 0 }
                : { opacity: 0, filter: 'blur(12px)', y: 14 }
            }
            transition={{
              duration: show ? 0.7 : 0,
              delay: show ? START_DELAY + i * STAGGER : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </p>
  )
}
