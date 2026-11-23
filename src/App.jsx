import CursorBackdrop from './effects/CursorBackdrop'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Work from './sections/Work'
import Hobbies from './sections/Hobbies'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <CursorBackdrop />
      <Navbar />
      <main>
        <Hero />
        <Work />
        <Hobbies />
      </main>
      <Footer />
    </>
  )
}
