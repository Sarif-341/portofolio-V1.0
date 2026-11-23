import TrueFocus from '../effects/TrueFocus'
import BlurText from '../effects/BlurText'

export default function Hero() {
  return (
    <section
      id="about"
      className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-center px-6 py-20"
    >
      <TrueFocus
        text="Sarif Hidayat"
        className="text-5xl font-medium tracking-tight md:text-7xl"
      />
      <BlurText
        text="Exploring AI as a Tools to build awesome website, personal assistance or automation for specific result-oriented tasks"
        className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
      />
    </section>
  )
}
