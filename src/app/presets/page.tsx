import CreateAPresetTile from '../../components/Presets/cards/CreateAPreset'
import { hardware } from '@/lib/utils/data'
import HardwareCard from '../../components/Presets/cards/Hardware'

export default async function page() {
  const cardList = hardware.map((item) => <HardwareCard 
    url={`/presets/${item.table}`}
    photo={item.photo}
    gradient={item.gradient}
    name={item.name}
  />)
  
  return (
    <div className='container pt-[120px]'>
      <div className='text-container pb-[50px]'>
        <h2 className='title-2xl-upper'>Custom Presets</h2>
        <h4 className='sub-text'>Lorem ipsum, or lipsum as it is sometimes known</h4>
      </div>
      {cardList}
      <CreateAPresetTile />
    </div>
  )
}
