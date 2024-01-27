import React from 'react'
import {  createSupabaseServerClient, fetchProfileByUserId  } from '@/lib/supabase/server'
import Title from '@/components/titles/CoreTitle'
import { Enums } from '../../../../types/supabase'
import { redirect } from 'next/navigation'
import CreateAPresetForm from '@/components/forms/CreateAPreset'

export type PresetFormData = {
  name: string;
  description: string;
  youtubeUrl: string;
  hardware: Enums<'hardware_type'> | undefined;
  downloadUrl: string;
  photoUrl?: string | undefined;
}

export default async function page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()

  if (!session) {
    redirect('/presets')
  }

  return (
    <div className='container pt-[120px]'>
      <Title title='Create a Profile' subTitle='Share your creation with everyone!' />
      <CreateAPresetForm />
    </div>
  )
}
