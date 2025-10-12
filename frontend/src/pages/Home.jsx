import Hero from '../components/Hero'
import Features from '../components/Features'
import Sponsor from '../components/Sponsor'
import Bento from '../components/Bento'
import CTAsection from '../components/CTAsection'

export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />  
      <Sponsor />  
      <Bento />
      <Features />
      <CTAsection />
    </div>
  )
}
