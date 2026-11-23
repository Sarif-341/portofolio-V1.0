import { useEffect, useRef } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'

const MAX_DPR = 1.5
const REACH = 170
const PUSH = 14
const CURSOR_LERP = 0.1

// Kedip: meredup perlahan, lalu menyala cepat kembali.
function glimmer(u, dim) {
  const FADE = 0.65
  if (u < FADE) {
    const f = u / FADE
    return 1 - (1 - dim) * f * f * (3 - 2 * f)
  }
  const f = (u - FADE) / (1 - FADE)
  return dim + (1 - dim) * (1 - (1 - f) ** 3)
}

const TINTS = {
  white: [242, 244, 255],
  blue: [175, 205, 255],
  cyan: [140, 205, 255],
  warm: [255, 228, 195],
}
const TINT_POOL = [
  'white', 'white', 'white', 'blue', 'blue', 'blue', 'cyan', 'warm',
]

const SKY = `radial-gradient(55% 40% at 12% 72%, rgba(28,95,135,0.30), transparent 70%),
  radial-gradient(50% 38% at 72% 58%, rgba(30,70,120,0.22), transparent 70%),
  radial-gradient(60% 35% at 40% 35%, rgba(20,45,85,0.20), transparent 70%),
  linear-gradient(to bottom, var(--color-sky), #070d1a)`

function makeSparkle([r, g, b]) {
  const S = 128
  const c = document.createElement('canvas')
  c.width = c.height = S
  const x = c.getContext('2d')
  const m = S / 2
  const rgba = (a) => `rgba(${r},${g},${b},${a})`
  const halo = x.createRadialGradient(m, m, 0, m, m, 20)
  halo.addColorStop(0, rgba(0.55))
  halo.addColorStop(1, rgba(0))
  x.fillStyle = halo
  x.fillRect(0, 0, S, S)
  const ray = (len, th) => {
    const g2 = x.createLinearGradient(m - len, 0, m + len, 0)
    g2.addColorStop(0, rgba(0))
    g2.addColorStop(0.5, rgba(0.95))
    g2.addColorStop(1, rgba(0))
    x.fillStyle = g2
    x.fillRect(m - len, -th / 2, len * 2, th)
  }
  for (const [angle, len, th] of [[0, 62, 1.4], [Math.PI / 2, 62, 1.4], [Math.PI / 4, 34, 1], [-Math.PI / 4, 34, 1]]) {
    x.save()
    x.translate(m, m)
    x.rotate(angle)
    x.translate(-m, 0)
    ray(len, th)
    x.restore()
  }
  return c
}

function makeStars(w, h) {
  const density = Math.min(Math.max((w * h) / (1440 * 900), 0.6), 1.4)
  const tiers = [
    { n: 200, r: [0.3, 0.7], a: [0.3, 0.75], dim: 0.2, sparkle: 0 },
    { n: 45, r: [0.8, 1.3], a: [0.55, 0.9], dim: 0.2, sparkle: 0 },
    { n: 14, r: [0.9, 1.3], a: [0.7, 1], dim: 0.25, sparkle: [24, 34] },
    { n: 6, r: [1.3, 1.9], a: [0.9, 1], dim: 0.3, sparkle: [58, 84] },
  ]
  const stars = []
  for (const t of tiers) {
    const n = Math.round(t.n * density)
    for (let i = 0; i < n; i++) {
      const rnd = (rg) => rg[0] + Math.random() * (rg[1] - rg[0])
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rnd(t.r),
        a: rnd(t.a),
        dim: Math.random() < 0.3 ? 0.65 : t.dim,
        period: 3000 + Math.random() * 6000,
        phase: Math.random(),
        tint: TINT_POOL[Math.floor(Math.random() * TINT_POOL.length)],
        sparkle: t.sparkle ? rnd(t.sparkle) : 0,
        ox: 0,
        oy: 0,
        glow: 0,
      })
    }
  }
  return stars
}

function makeComet(w, h, baseAngle) {
  const angle = baseAngle + (Math.random() - 0.5) * 0.12
  return {
    x: w * (0.2 + Math.random() * 0.85),
    y: h * Math.random() * 0.6,
    dx: -Math.cos(angle),
    dy: Math.sin(angle),
    dist: Math.max(w, h) * (0.3 + Math.random() * 0.2),
    life: 1600 + Math.random() * 900,
    tail: 90 + Math.random() * 80,
    width: 0.8 + Math.random() * 0.6,
    peak: 0.55 + Math.random() * 0.3,
    age: 0,
  }
}

export default function CursorBackdrop({ enabled = true }) {
  const canvasRef = useRef(null)
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!enabled || !root || !canvas) return

    const animated =
      !reduced && !window.matchMedia('(pointer: coarse)').matches
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const sparkles = Object.fromEntries(
      Object.entries(TINTS).map(([k, v]) => [k, makeSparkle(v)]),
    )
    const colors = Object.fromEntries(
      Object.entries(TINTS).map(([k, v]) => [k, `rgb(${v.join(',')})`]),
    )
    let w = 0
    let h = 0
    let stars = []
    let comets = []
    let nextWave = 1500
    let pending = []
    let waveAngle = 0
    let clock = 0
    const target = { x: -9999, y: -9999 }
    const cur = { x: -9999, y: -9999 }
    let raf = 0
    let last = 0
    let visible = true
    let onscreen = true

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const tw = animated
          ? glimmer((clock / s.period + s.phase) % 1, s.dim)
          : 1
        const alpha = Math.min(s.a * tw + s.glow * 0.4, 1)
        const x = s.x + s.ox
        const y = s.y + s.oy
        if (s.sparkle) {
          const size = s.sparkle * (0.5 + 0.5 * tw) * (1 + s.glow * 0.25)
          ctx.globalAlpha = alpha
          ctx.drawImage(sparkles[s.tint], x - size / 2, y - size / 2, size, size)
        }
        ctx.globalAlpha = alpha
        ctx.fillStyle = colors[s.tint]
        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const c of comets) {
        const p = c.age / c.life
        const hx = c.x + c.dx * c.dist * p
        const hy = c.y + c.dy * c.dist * p
        const tx = hx - c.dx * c.tail
        const ty = hy - c.dy * c.tail
        const grad = ctx.createLinearGradient(hx, hy, tx, ty)
        grad.addColorStop(0, 'rgba(225,236,255,1)')
        grad.addColorStop(1, 'rgba(225,236,255,0)')
        ctx.globalAlpha = Math.sin(Math.PI * p) * c.peak
        ctx.strokeStyle = grad
        ctx.lineWidth = c.width
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(hx, hy)
        ctx.lineTo(tx, ty)
        ctx.stroke()
        ctx.fillStyle = '#e1ecff'
        ctx.beginPath()
        ctx.arc(hx, hy, c.width + 0.3, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = makeStars(w, h)
      comets = []
      pending = []
      if (!animated) render()
    }

    const frame = (now) => {
      const dt = Math.min(now - (last || now), 100)
      last = now
      const k = dt / 16.67
      clock += dt

      if (cur.x < -9000) {
        cur.x = target.x
        cur.y = target.y
      } else {
        const l = 1 - Math.pow(1 - CURSOR_LERP, k)
        cur.x += (target.x - cur.x) * l
        cur.y += (target.y - cur.y) * l
      }

      const ease = 1 - Math.pow(0.92, k)
      for (const s of stars) {
        const dx = s.x - cur.x
        const dy = s.y - cur.y
        const d = Math.hypot(dx, dy)
        const f = d < REACH && d > 0 ? (1 - d / REACH) ** 2 : 0
        const tx = f ? (dx / d) * f * PUSH : 0
        const ty = f ? (dy / d) * f * PUSH : 0
        s.ox += (tx - s.ox) * ease
        s.oy += (ty - s.oy) * ease
        s.glow += (f - s.glow) * ease
      }

      for (const c of comets) c.age += dt
      comets = comets.filter((c) => c.age < c.life)
      nextWave -= dt
      if (nextWave <= 0) {
        const n = 2 + Math.floor(Math.random() * 3)
        waveAngle = (16 + Math.random() * 18) * (Math.PI / 180)
        let t = 0
        pending = []
        for (let i = 0; i < n; i++) {
          pending.push(t)
          t += 350 + Math.random() * 600
        }
        nextWave = 6000 + Math.random() * 6000
      }
      pending = pending.map((t) => t - dt)
      for (const t of pending) {
        if (t <= 0) comets.push(makeComet(w, h, waveAngle))
      }
      pending = pending.filter((t) => t > 0)

      render()
      raf = requestAnimationFrame(frame)
    }

    const sync = () => {
      cancelAnimationFrame(raf)
      last = 0
      if (animated && visible && onscreen) raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
    }
    const onVisibility = () => {
      visible = !document.hidden
      sync()
    }

    const io = new IntersectionObserver(([entry]) => {
      onscreen = entry.isIntersecting
      sync()
    })
    io.observe(root)

    resize()
    sync()
    window.addEventListener('resize', resize)
    if (animated) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('visibilitychange', onVisibility)
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled, reduced])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: SKY }}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
