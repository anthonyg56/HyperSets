import { supabase } from '@/lib/supabase'
import { faStar, faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PresetTile from './PresetTile'
import { Enums, Tables } from '../../../../types/supabase'

interface Props {
  table: 'likes' | 'downloads' | 'presets'; 
  hardware?: Enums<'hardware_type'>;
  limit?: number;
  user_id?: string;
}

export default async function Presets(props: Props) {
  const { hardware, limit, table, user_id } = props

  const fetchPresets = async () => {
    let presetsList, query, data, error
    switch (table) {
      case ('likes'):
        query = supabase
          .from('likes')
          .select(`presets(preset_id,name,photo_url,hardware,profile_id)`);

        if (hardware) query = query.eq("presets.hardware", hardware)
        if (user_id) query = query.eq("presets.profile_id", user_id)
        if (limit) query = query.limit(limit)

        data = (await query).data
        error = (await query).error

        if (error || !data) {
          return <div>there was an error</div>
        }

        presetsList = data.map(({ presets: preset }) => <PresetTile
          key={preset?.preset_id}
          preset={preset as Pick<Tables<'presets'>, 'hardware' | 'name' | 'photo_url' | 'preset_id' | 'profile_id'>}
        />)

        return presetsList;
      case ('downloads'):
        query = supabase
          .from('downloads')
          .select(`presets(preset_id,name,photo_url,hardware,profile_id)`);

        if (hardware && query) query = query.eq("presets.hardware", hardware)
        if (user_id) query = query.eq("presets.profile_id", user_id)
        if (limit) query = query.limit(limit)

        data = (await query).data
        error = (await query).error
        
        if (error || !data) {
          return <div>there was an error</div>
        }

        presetsList = data.map(({ presets: preset }) => <PresetTile
          key={preset?.preset_id}
          preset={preset as Pick<Tables<'presets'>, 'hardware' | 'name' | 'photo_url' | 'preset_id' | 'profile_id'>}
        />)

        return presetsList;
      case ('presets'):
        query = supabase
          .from('presets')
          .select(`preset_id,name,photo_url,hardware,profile_id`)

        if (hardware && query) query = query.eq("hardware", hardware)
        if (user_id) query = query.eq("profile_id", user_id)
        if (limit) query = query.limit(limit)

        data = (await query).data
        error = (await query).error
        
        if (error || !data) {
          return <div>there was an error</div>
        }

        presetsList = data.map((preset) => <PresetTile
          key={preset?.preset_id}
          preset={preset as Pick<Tables<'presets'>, 'hardware' | 'name' | 'photo_url' | 'preset_id' | 'profile_id'>}
        />)

        return presetsList;
      default:
        query = supabase
          .from(table)
          .select(`*`)

          data = (await query).data
          error = (await query).error
          
          if (error || !data) {
            return <div>there was an error</div>
          }
  
          presetsList = data.map((preset) => <PresetTile
            key={preset}
            preset={preset}
          />)
  
          return presetsList;
    }
  }

  const presetsList = await fetchPresets()

  return (
    <div className='py-[50px]'>
      <div className='text-center pb-5'>
        <h2 className='title-2xl-upper'>Featured Presets</h2>
      </div>

      <div>
        <div className='flex flex-row pb-1'>
          <div className='flex flex-row gap-1'>
            <FontAwesomeIcon icon={faStar} height={18} width={18} className='text-hyper-dark-grey'/>
            <h4 className='text-hyper-dark-grey text-sm font-medium'>Featured</h4>
          </div>

          <div className='flex flex-row gap-1 ml-auto'>
            <h4 className='text-hyper-dark-grey text-sm font-medium'>Most Downloads</h4>
            <FontAwesomeIcon icon={faFilter} height={18} width={18} className='text-hyper-dark-grey' />
          </div>
        </div>

        <div className='flex flex-col md:flex-row'>
          {presetsList}
        </div>
      </div>
    </div>
  )
}
