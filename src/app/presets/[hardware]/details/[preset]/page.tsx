import Title from '@/components/reuseables/Title'
import supabase from '@/lib/supabase'
import { QueryData } from '@supabase/supabase-js'
import React from 'react'
import Effects from './components/Effects'
import { Enums } from '../../../../../../types/supabase'
import Hardware from './components/Hardware'
import LikesAndDownloads from './components/LikesAndDownloads'
import YoutubePlayer from './components/YoutubePlayer'
import DownloadButton from './components/DownloadButton'

type Props = {
  params: {
    hardware: string,
    preset: string
  }
}

export default async function page(props: Props) {
  const { preset: presetId } = props.params

  const { data: { user } } = await supabase.auth.getUser()

  const presetQuery = supabase
    .from('presets')
    .select('*,effects(*),downloads(*)')
    .eq('preset_id', presetId)
    .eq('downloads.preset_id', presetId)
    .eq('effects.preset_id', presetId)
    .limit(1)
    .single()

  type Presets = QueryData<typeof presetQuery>

  const { data, error } = await presetQuery

  if (error) throw error

  const preset: Presets = data

  const {
    name,
    description,
    created_on,
    download_url,
    downloads,
    hardware,
    last_updated_on,
    photo_url,
    preset_id,
    profile_id,
    youtube_url,
    effects,
  } = preset

  let effectsData: { effect: Enums<'effect_type'>, count: number }[] = []

  // Generate an array of effects and how many are used since its too complex for supabase..
  effects.forEach(item => {
    const effectPushed = effectsData.findIndex((item2) => item2.effect === item.effect && item2.effect !== null)

    if (effectsData.length === 0 || effectPushed === -1) {
      effectsData.push({ effect: item.effect as Enums<'effect_type'>, count: 1 })
      return
    }

    effectsData[effectPushed].count = effectsData[effectPushed].count + 1
    return
  })

  let profileId = null

  if (user) {
    const { data } = await supabase
      .from('profile')
      .select('profile_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()
    
    if (data)
      profileId = data.profile_id
  }

  return (
    <div className='pt-[60px]' >
      <div>
        <img src={photo_url !== null && photo_url.length ? photo_url : "https://www.msi-viking.com/sca-dev-2023-1-0/img/no_image_available.jpeg"} alt={'Preset cover photo'} />
      </div>

      <div className={`container pb-[50px] ${youtube_url && youtube_url.length > 0 ? 'translate-y-[-100px]' : 'pt-[25px]'}`}>
        <YoutubePlayer youtubeUrl={youtube_url} />
        <Title title={name} sub={description} padding={'pb-[25px]'} />
        <Effects effects={effectsData} title={true} />
        <Hardware hardware={hardware} />
        <LikesAndDownloads downloads={downloads} userId={user?.id as string} />

        <DownloadButton downloadUrl={download_url} presetId={preset_id} profileId={profileId}/>
      </div>
    </div>
  )
}
