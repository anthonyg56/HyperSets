import { supabase } from '@/lib/supabase'
import { faStar, faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PresetTile from './PresetTile'
import { Enums, Tables } from '../../../../types/supabase'

interface Props {
  table: 'likes' | 'downloads' | 'presets'; 
  hardware?: Enums<'hardware_type'>
  limit?: number;
  user_id?: string;
}

export default async function Presets(props: Props) {
  const { hardware, limit, table, user_id } = props

  const selectQuery = () => {
    let str;
    switch (table) {
      case ('likes'):
        str = `
          preset_id (
            preset_id,
            name,
            photo_url,
            hardware
          )
        `;
        break;
      case ('downloads'):
        str = `
          preset_id (
            preset_id,
            name,
            photo_url,
            hardware
          )
        `;
        break;
      case ('presets'):
        str = 'preset_id,name,photo_url,hardware'
        break;
      default:
        break;
    }
    return str;
  }

  const fetchPresets = async () => {
    const selectStr = selectQuery()
    let query = supabase
      .from(table)
      .select(selectStr)
    
    if (hardware) query = query.eq("hardware", hardware)
    if (user_id) query = query.eq("profile_id", user_id)
    if (limit) query = query.limit(limit)

    return await query
  }

  const { data, error } = await fetchPresets()

  if (error || !data) return <div>there was an error</div>

  console.log(data)
  // const presetsList = data.map(item => <PresetTile
  //   key={item}
  //   preset={item}
  // />)

  return (
    <div className='py-[50px]'>
      <div className='text-center pb-5'>
        <h2 className='title-2xl-upper'>Featured Presets</h2>
      </div>

      <div>
        <div className='flex flex-row'>
          <div className='flex flex-row gap-1'>
            <FontAwesomeIcon icon={faStar} height={18} width={18} />
            <h4 className='text-hyper-dark-grey text-sm font-normal'>Featured</h4>
          </div>

          <div className='flex flex-row gap-1 ml-auto'>
            <h4 className='text-hyper-dark-grey text-sm font-normal'>Most Downloads</h4>
            <FontAwesomeIcon icon={faFilter} height={18} width={18} />
          </div>
        </div>

        {/* <div className='flex flex-col md:flex-row'>
          {presetsList}
        </div> */}
      </div>
    </div>
  )
}
