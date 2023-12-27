import HeroSection from '@/app/components/hero'
import UpgradeSetup from '@/app/components/upgradeSetup'
import Presets from '@/app/presets/components/Presets'
import Options from '@/app/components/Options'
import About from './components/About'

export default function Home() {
  return (
    <div className='pt-[60px]'>
      <HeroSection />
      <div className='container'>
        <UpgradeSetup />
        <Presets table='presets' />
        <Options />  
        <About />
      </div>
    </div>
  )
}
