import nusaFrameLarge from '../assets/nusa-frame-agency-920.webp'
import nusaFrameSmall from '../assets/nusa-frame-agency-480.webp'
import weddingLarge from '../assets/wedding-invitation-920.webp'
import weddingSmall from '../assets/wedding-invitation-480.webp'
import CurvedCarousel from '../effects/CurvedCarousel'

const PROJECTS = [
  {
    title: 'Nusa Frame Agency',
    tag: 'Proyek',
    href: 'https://nusaframeagency-two.vercel.app/',
    image: {
      src: nusaFrameSmall,
      srcSet: `${nusaFrameSmall} 480w, ${nusaFrameLarge} 920w`,
      width: 920,
      height: 575,
      position: 'object-left-top',
    },
  },
  {
    title: 'Cheerful Wedding Invitation',
    tag: 'Proyek',
    href: 'https://wedding-invitation-beta-green-45.vercel.app/',
    image: {
      src: weddingSmall,
      srcSet: `${weddingSmall} 480w, ${weddingLarge} 920w`,
      width: 920,
      height: 920,
      position: 'object-top',
    },
  },
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
