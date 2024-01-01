import React from 'react'
import { Tables } from '../../../../types/supabase'
import Link from 'next/link'
// import supabase from '@/lib/supabase'

interface Props {
  preset: Tables<'presets'> | Pick<Tables<'presets'>, 'hardware' | 'name' | 'photo_url' | 'preset_id' | 'profile_id'>;
  downloads: {
    count: number;
  }[];
}

export default async function PresetTile(props: Props) {
  const {
    name,
    hardware,
    photo_url,
    preset_id,
    profile_id,
  } = props.preset

  console.log(photo_url)

  const { count } = props.downloads[0]
  return (
    <Link href={`/presets/${hardware}/details/${preset_id}`} className={`w-full h-[212px] bg-cover bg-center rounded-md overflow-hidden relative`}>
      <img src={photo_url ? photo_url : "https://ngesxn.weebly.com/uploads/1/3/3/8/133864058/901306702.png"} alt="" className='w-full h-full object-cover object-center absolute z-[-10]'/>
      <div className='flex flex-row h-full w-full pb-2 px-[10px] gap-x-2'>
        <div className='preset-prop'>
          <h4>{name.charAt(0).toUpperCase() + name.slice(1)}</h4> {/** Capitalize First Letter */}
        </div>
        <div className='preset-prop'>
          <h4>{hardware}</h4>
        </div>

        <div className='preset-download'>
          <Link href={`/preset/${preset_id}`}>{count} downloads</Link>
        </div>
      </div>
    </Link>
  )
}
