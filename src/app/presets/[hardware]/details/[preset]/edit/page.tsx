import Title from '@/components/reuseables/Title'
import React from 'react'
import supabase from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Enums } from '../../../../../../../types/supabase'
import Form from '@/app/presets/new/components/Form'
import EditForm from './components/EditForm'

type PresetFormData = {
  name: string;
  description: string;
  youtubeUrl: string;
  hardware: Enums<'hardware_type'> | undefined;
  downloadUrl: string;
  photoUrl?: string | undefined;
}

type Props = {
  params: {
    preset: string;
    hardware: string;
  }
}

export default async function page(props: Props) {
  const {data: {session}, error} = await supabase.auth.getSession()
  
  if (error || !session) {
    redirect('/auth/login')
  }

  const presetId = Number(props.params.preset)

  const { data: profile } = await supabase
    .from("profile")
    .select('profile_id')
    .eq('user_id', session.user.id)
    .limit(1)
    .single()

  const { data: preset } = await supabase
    .from("presets")
    .select('*')
    .eq('preset_id', presetId)
    .limit(1)
    .single()

  const { data: effects } = await supabase
    .from("effects")
    .select('*')
    .eq('preset_id', presetId)

  if (!effects) {
    redirect('/presets')
  } else if (!preset) {
    redirect(`/presets/${props.params.hardware}`)
  } else if (!profile || profile.profile_id !== preset.profile_id){
    redirect(`/presets/${props.params.hardware}/details/${presetId}`)
  } 

  let tmpEffects: Enums<'effect_type'>[] = []

  effects.forEach(item => item.effect !== null && tmpEffects.push(item.effect))


  return (
    <div className='container pt-[120px]'>
      <Title title='Edit Preset' sub='Share your creation with everyone!' />
      <EditForm hardware={props.params.hardware} effects={tmpEffects} preset={preset} />
    </div>
  )
}
