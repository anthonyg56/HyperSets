import Title from '@/components/reuseables/Title'
import React from 'react'
import Form from './components/Form'
import supabase from '@/lib/supabase'
import { Enums } from '../../../../types/supabase'
import { v4 as uuidv4 } from 'uuid'
import { redirect } from 'next/navigation'

export type PresetFormData = {
  name: string;
  description: string;
  youtubeUrl: string;
  hardware: Enums<'hardware_type'> | undefined;
  downloadUrl: string;
  photoUrl?: string | undefined;
}

export default async function page() {
  const {data: {session}, error} = await supabase.auth.getSession()

  if (error || !session) {
    redirect('/auth/login')
  }

  const submitCoverPhoto = async (coverPhoto: File, user_id: string) => {
    "use server"
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(`${user_id}/${uuidv4()}`, coverPhoto, {
        cacheControl: '3600',
        upsert: false
      })
    
    console.log(`1) Submit Cover Photo Response: \n\n Data: ${data} \n Error: \n ${error}`)

    return {
      data, error
    }
  }

  const submitPreset = async (formData: PresetFormData, profileId: number | undefined) => {
    "use server"
    const { data, error } = await supabase
      .from('presets')
      .insert([{
        name: formData.name,
        description: formData.description,
        download_url: formData.downloadUrl,
        hardware: formData.hardware as Enums<'hardware_type'>,
        profile_id: profileId as number,
        youtube_url: formData.youtubeUrl,
        photo_url: formData.photoUrl
      }])
      .select()
    
    console.log(`2) Submit Preset Response: \n\n Data: ${data} \n Error: \n ${error}`)

    if (!data)
      return {
        data,
        error
      }

    return {
      data: {
        preset_id: data[0].preset_id,
        name: data[0].name,
      },
      error
    }
  }

  const submitEffects = async (effects: { preset_id: number, effect: Enums<'effect_type'> }[]) => {
    "use server"
    const { data, error } = await supabase
      .from('effects')
      .insert(effects)
    
    console.log(`3) Submit Effect Response: \n\n Data: ${data} \n Error: \n ${error}`)
    return { data, error }
  }

  return (
    <div className='container pt-[120px]'>
      <Title title='Create a Profile' sub='Share your creation with everyone!' />
      <Form submitEffects={submitEffects} submitPreset={submitPreset} submitCoverPhoto={submitCoverPhoto} />
    </div>
  )
}
