import supabase from '@/lib/supabase'
import { faStar, faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PresetTile from './PresetTile'
import { Enums, Tables } from '../../../../types/supabase'
import { getMaxListeners } from 'events'

type Props = {
  table: 'downloads' | 'presets'; 
  hardware?: Enums<'hardware_type'>;
  limit?: number;
  profile_id?: number;
}

type LADQueryReturnType = {
  presets: {
    preset_id: number;
    name: string;
    photo_url: string | null;
    hardware: "Keyboard" | "Mouse" | "Microphone" | "Headset";
    profile_id: number;
  } | null;
  downloads: {
    count: number;
  }[];
};

type UserPresetsQueryReturnType = {
  preset_id: number;
  name: string;
  photo_url: string | null;
  hardware: "Keyboard" | "Mouse" | "Microphone" | "Headset";
  profile_id: number;
  downloads: {
    count: number;
  }[];
};

interface DefaultQueryReturnType extends Tables<'presets'> {
  downloads: {
    count: number;
  }[];
};

function isUserPresets(lad: LADQueryReturnType | UserPresetsQueryReturnType | DefaultQueryReturnType): lad is UserPresetsQueryReturnType {
  return 'preset_id' in lad
}

// function isDefault (lad: LADQueryReturnType | UserPresetsQueryReturnType | DefaultQueryReturnType): lad is DefaultQueryReturnType {
//   return 'download_url' in lad
// }

function isLAD (lad: LADQueryReturnType | UserPresetsQueryReturnType | DefaultQueryReturnType): lad is LADQueryReturnType {
  return 'presets' in lad
}

export default async function Presets(props: Props) {
  const { hardware, limit, table, profile_id } = props

  const generateSelectClause = () => {
    const likesAndDownloadSelectClause = `presets(preset_id,name,photo_url,hardware,profile_id),downloads(count)`

    const presetsSelectClause = `preset_id,name,photo_url,hardware,profile_id,downloads(count)`

    const allSelectClause = `*,downloads(count)`

    switch (table) {
      case ('downloads'):
        return likesAndDownloadSelectClause
      case ('presets'):
        return presetsSelectClause
      default:
        return allSelectClause
    }
  }

  let query = supabase
    .from(table)
    .select(generateSelectClause())
    
  //if (hardware || profile_id) query = query.match({ hardware: hardware })
  if (hardware) query = query.eq("hardware", hardware)
  if (profile_id) query = query.eq("profile_id", profile_id)
  if (limit) query = query.limit(limit)

  const { data, error } = await query
    .returns<LADQueryReturnType[] | UserPresetsQueryReturnType[] | DefaultQueryReturnType[] | null>()

  if (error || !data) {
    return <div>there was an error</div>
  }

  const presetsList = data.map((item) => {
    if (isLAD(item)) {
      return <PresetTile
        key={item?.presets?.preset_id}
        preset={item.presets as Pick<Tables<'presets'>, 'hardware' | 'name' | 'photo_url' | 'preset_id' | 'profile_id'>}
        downloads={item.downloads}
      />
    } 

    if (isUserPresets(item)) {
      const preset = {
        preset_id: item.preset_id,
        name: item.name,
        photo_url: item.photo_url,
        hardware: item.hardware,
        profile_id: item.profile_id
      }
      return <PresetTile
        key={item?.preset_id}
        preset={preset as Pick<Tables<'presets'>, 'hardware' | 'name' | 'photo_url' | 'preset_id' | 'profile_id'>}
        downloads={item.downloads}
      />
    }
    
    // if (isDefault(item)) {
    //   return <PresetTile
    //     key={item.preset_id}
    //     preset={item as Pick<Tables<'presets'>, 'hardware' | 'name' | 'photo_url' | 'preset_id' | 'profile_id'>}
    //   />
    // }
  })

  return (
    <div className='py-[50px]'>
      {!profile_id && <div className='text-center pb-5'>
        <h2 className='title-2xl-upper'>Featured Presets</h2>
      </div>}

      <div>
        <div className='flex flex-row pb-1'>
          {!profile_id && <div className='flex flex-row gap-1'>
            <FontAwesomeIcon icon={faStar} height={18} width={18} className='text-hyper-dark-grey'/>
            <h4 className='text-hyper-dark-grey text-sm font-medium'>Featured</h4>
          </div>}

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
