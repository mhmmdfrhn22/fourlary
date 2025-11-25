import Hero from '../../components/home_component/Hero'
import Features from '../../components/home_component/Features'
import Sponsor from '../../components/home_component/Sponsor'
import Bento from '../../components/home_component/Bento'
import CTAsection from '../../components/home_component/CTAsection'

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
