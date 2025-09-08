import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Sponsor from '../components/Sponsor'
import Bento from '../components/Bento'
import Footer from '../components/Footer'
import CTAsection from '../components/CTAsection'

export default function HomePage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />  
      <Sponsor />  
      <Bento />
      <Features />
      <CTAsection />
      <Footer/>
    </div>
  )
}
