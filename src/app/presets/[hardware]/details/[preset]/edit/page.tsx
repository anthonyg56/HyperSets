import React from 'react'
import { validatePresetIdRoute } from '@/lib/utils/schemas'
import { createSupabaseServerClient, fetchPresetsFormData,  } from '@/lib/supabase/server'
import CreateAPresetForm from '@/components/forms/CreateAPreset'
import Title from '@/components/titles/CoreTitle'
import { redirect } from 'next/navigation'

type Props = {
  params: {
    preset: string;
    hardware: string;
  }
}

export default async function page({params: { preset, hardware}}: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()

  if (!session) {
    redirect('/presets')
  }

  const presetId = Number(preset)

  // Strictly for validating the data passed in the url
  validatePresetIdRoute(session.user.id, presetId, hardware)

  const formData = await fetchPresetsFormData(session.user.id, presetId, hardware)

  return (
    <div className='container pt-[120px]'>
      <Title title='Edit Preset' subTitle='Share your creation with everyone!' />
      <CreateAPresetForm edit={true} hardware={hardware} effects={formData.effects} preset={formData.preset} />
    </div>
  )
}
