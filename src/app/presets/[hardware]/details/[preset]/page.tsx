import Title from '@/components/titles/CoreTitle'
import { QueryData } from '@supabase/supabase-js'
import React from 'react'
import Effects from '../../../../../components/Presets/Effects'
import { Enums } from '../../../../../../types/supabase'
import Hardware from '../../../../../components/Presets/Hardware'
import LikesAndDownloads from '../../../../../components/Presets/LikesAndDownloads'
import YoutubePlayer from '../../../../../components/Presets/YoutubePlayer'
import DownloadButton from '../../../../../components/buttons/DownloadPreset'
import DeleteButton from '../../../../../components/dropdowns/DeletePreset'
import EditButton from '../../../../../components/buttons/EditPreset'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type Props = {
  params: {
    hardware: string,
    preset: string
  }
}

export default async function page({ params: { preset: presetId }}: Props) {
  const supabase = await createSupabaseServerClient()
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
    profile_id: preset_profile_id,
    youtube_url,
    effects,
  } = preset

  let profileId: number | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profile')
      .select('profile_id,user_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()
    
    if (profile) {
      profileId = profile.profile_id
    }
  }

  return (
    <div className='pt-[60px]' >
      <div>
        <img src={photo_url !== null && photo_url.length ? photo_url : "https://www.msi-viking.com/sca-dev-2023-1-0/img/no_image_available.jpeg"} alt={'Preset cover photo'} />
      </div>

      <div className={`container pb-[50px]`}>
        <Title title={name} subTitle={description} bottomPadding={'pb-[25px] pt-[25px]'} />
        <YoutubePlayer youtubeUrl={youtube_url} />
        <Effects effects={effects} title={true} />
        <Hardware hardware={hardware} />
        <LikesAndDownloads downloads={downloads} userId={user?.id as string} />

        <DownloadButton downloadUrl={download_url} presetId={preset_id} profileId={profileId}/>
        {user && profileId && profileId === preset_profile_id && <div className='flex flex-row w-full gap-2 pt-[25px]'>
        <DeleteButton presetId={preset_id} presetProfileId={preset_profile_id} userProfileId={profileId as number} />
        <EditButton presetId={preset_id} hardware={hardware} />
      </div>}
      </div>


    </div>
  )
}
