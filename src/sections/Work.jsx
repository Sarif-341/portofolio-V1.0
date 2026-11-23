import CurvedCarousel from '../effects/CurvedCarousel'

const PROJECTS = [
  { title: 'Wedding Invitation with Anime Vibes', tag: 'Proyek' },
  { title: 'Cheerful Wedding Invitation', tag: 'Proyek' },
  { title: 'Eksperimen berikutnya', tag: 'Segera hadir' },
  { title: 'Proyek berikutnya', tag: 'Segera hadir' },
]

export default function Work() {
  return (
    <section
      id="work"
      className="mx-auto w-full max-w-6xl scroll-mt-4 px-6 py-20"
    >
      <h2 className="mb-10 text-3xl font-medium tracking-tight">Work</h2>
      <CurvedCarousel items={PROJECTS} label="Showcase project" />
    </section>
  )
}
