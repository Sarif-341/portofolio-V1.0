import { useState } from 'react'
import CardStack from '../effects/CardStack'
import PhotoSlider from '../components/PhotoSlider'

const SLIDES = ['Foto 1', 'Foto 2', 'Foto 3', 'Foto 4']

function Card({ visual, title, sub }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-surface p-5">
      {visual}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{sub}</p>
    </article>
  )
}

function Visual({ children }) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-line bg-ink">
      {children}
    </div>
  )
}

const ITEMS = [
  {
    key: 'photography',
    label: 'Photography',
    content: (
      <Card
        visual={<PhotoSlider slides={SLIDES} label="Hasil foto" />}
        title="Photography"
        sub="Foto-foto segera ditambahkan."
      />
    ),
  },
  {
    key: 'gaming',
    label: 'Gaming',
    content: (
      <Card
        visual={
          <Visual>
            <svg viewBox="0 0 200 150" className="w-2/3 text-accent" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M30 40 L100 120 L170 40" />
              <path d="M30 70 L100 150 L170 70" opacity="0.4" />
            </svg>
          </Visual>
        }
        title="Gaming"
        sub="Valorant di waktu senggang."
      />
    ),
  },
  {
    key: 'exploring',
    label: 'Exploring the World',
    content: (
      <Card
        visual={
          <Visual>
            <svg viewBox="0 0 120 120" className="w-1/2 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="60" cy="60" r="50" />
              <ellipse cx="60" cy="60" rx="22" ry="50" opacity="0.6" />
              <path d="M10 60h100M18 35h84M18 85h84" opacity="0.6" />
            </svg>
          </Visual>
        }
        title="Exploring the World"
        sub="Selalu ingin melihat tempat baru."
      />
    ),
  },
]

export default function Hobbies() {
  const [order, setOrder] = useState([0, 1, 2])
  const select = (i) => setOrder((o) => [i, ...o.filter((x) => x !== i)])

  return (
    <section
      id="hobbies"
      className="mx-auto grid w-full max-w-6xl scroll-mt-4 items-center gap-8 px-6 py-14 md:grid-cols-2"
    >
      <div>
        <h2 className="text-xl font-medium tracking-tight">Di luar layar</h2>
        <nav aria-label="Pilih hobi" className="mt-4 flex flex-col items-start gap-2">
          {ITEMS.map((item, i) => (
            <button
              key={item.key}
              type="button"
              onClick={() => select(i)}
              aria-pressed={order[0] === i}
              className={`font-mono text-sm transition-colors duration-150 hover:text-paper ${
                order[0] === i ? 'text-paper' : 'text-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="w-full max-w-xs md:justify-self-end">
        <CardStack items={ITEMS} order={order} onSelect={select} />
        <p className="sr-only" aria-live="polite">
          Menampilkan {ITEMS[order[0]].label}
        </p>
      </div>
    </section>
  )
}
