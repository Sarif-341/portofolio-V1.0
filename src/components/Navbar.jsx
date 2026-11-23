import { useState } from 'react'
import ScrambleText from '../effects/ScrambleText'

const LINKS = [
  { label: 'work', href: '#work' },
  { label: 'about', href: '#about' },
  { label: 'hobbies', href: '#hobbies' },
  { label: 'contact', href: '#contact' },
]

function NavLink({ label, href }) {
  const [active, setActive] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="font-mono text-sm text-muted transition-colors duration-150 hover:text-paper focus-visible:text-paper"
    >
      <ScrambleText text={label} trigger={active} />
    </a>
  )
}

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function GitHub() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.9.83.09-.64.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

const ICON_LINK =
  'text-muted transition-colors duration-150 hover:text-paper focus-visible:text-paper'

export default function Navbar() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 py-6">
      <a href="#" className="font-mono text-sm text-paper">
        sarif hidayat
      </a>
      <nav aria-label="Utama" className="flex items-center gap-4 sm:gap-8">
        {LINKS.map((l) => (
          <NavLink key={l.href} {...l} />
        ))}
        <span className="h-4 w-px bg-line" aria-hidden="true" />
        <a href="https://www.instagram.com/hey.syarif/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (tab baru)" className={ICON_LINK}>
          <Instagram />
        </a>
        <a href="https://github.com/Sarif-341" target="_blank" rel="noopener noreferrer" aria-label="GitHub (tab baru)" className={ICON_LINK}>
          <GitHub />
        </a>
      </nav>
    </header>
  )
}
