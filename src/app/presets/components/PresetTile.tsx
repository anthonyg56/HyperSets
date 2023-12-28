import React from 'react'
import { Tables } from '../../../../types/supabase'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Props {
  preset: Tables<'presets'> | Pick<Tables<'presets'>, 'hardware' | 'name' | 'photo_url' | 'preset_id' | 'profile_id'>
}

export default async function PresetTile(props: Props) {
  const {
    name,
    hardware,
    photo_url: photo,
    preset_id,
    profile_id
  } = props.preset

  const { data: effects, error } = await supabase
  .from('effects')
  .select("*")
  .eq('preset_id', preset_id)


  return (
    <Link href={`/presets/${hardware}/details/${preset_id}`} className={`bg-[url("https://ngesxn.weebly.com/uploads/1/3/3/8/133864058/901306702.png")] w-[350px] h-[212px] bg-cover bg-center rounded-md`}>
      <div className='flex flex-row h-full w-full pb-2 px-[10px] gap-x-2'>
        <div className='preset-prop'>
          <h4>{name.charAt(0).toUpperCase() + name.slice(1)}</h4> {/** Capitalize First Letter */}
        </div>
        <div className='preset-prop'>
          <h4>{hardware}</h4>
        </div>

        <div className='preset-download'>
          <Link href={`/preset/${preset_id}`}>download</Link>
        </div>
      </div>
    </Link>
  )
}
