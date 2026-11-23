const LINK =
  'text-paper underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-accent'

export default function Footer() {
  return (
    <footer
      id="contact"
      className="mx-auto w-full max-w-6xl scroll-mt-4 border-t border-line px-6 py-16"
    >
      <h2 className="text-3xl font-medium tracking-tight">Contact</h2>
      <p className="mt-4 max-w-xl text-muted">
        Ingin ngobrol atau berkolaborasi? Hubungi lewat{' '}
        <a href="https://www.instagram.com/hey.syarif/" target="_blank" rel="noopener noreferrer" className={LINK}>
          Instagram<span className="sr-only"> (tab baru)</span>
        </a>{' '}
        atau lihat kode di{' '}
        <a href="https://github.com/Sarif-341" target="_blank" rel="noopener noreferrer" className={LINK}>
          GitHub<span className="sr-only"> (tab baru)</span>
        </a>
        .
      </p>
      <p className="mt-16 font-mono text-xs text-muted">
        © 2026 Sarif Hidayat
      </p>
    </footer>
  )
}
