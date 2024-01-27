"use client"

import React from 'react'
import { useFormState } from 'react-dom'
import { 
  downloadUrlSchema, 
  presetDescriptionSchema, 
  presetNameSchema, 
  youtubeUrlSchema 
} from '@/lib/utils/schemas'
import Input from '../inputs/Core'
import EffectsDropdown from '../dropdowns/Effects'
import { Tables } from '../../../types/supabase'
import HardwareDropdown from '../dropdowns/Hardware'
import PresetCoverPhoto from '../inputs/PresetCoverPhoto'

type Props = {
  edit?: boolean,
  hardware?: string,
  preset?: Tables<'presets'>,
  effects?: Tables<'effects'>[],
}

export default async function CreateAPresetForm({ edit, hardware, preset, effects }: Props) {
  const [formState, formStation] = useFormState(handleSubmit, {
    isSubmitted: false
  })

  async function handleSubmit(formState: { isSubmitted: boolean }, formData: FormData) {
    // Do all things necessary here

    return {
      isSubmitted: true
    }
  }

  return (
    <form action={formStation}>
      <PresetCoverPhoto coverPhoto={preset?.photo_url as string | File | null} />
      <Input
        label='Name*' 
        name='name'
        tooltipText='Cannot be longer than 50 Chars'
        initialValue={edit && preset ? preset.name : undefined} 
        validation={presetNameSchema} 
        elementProps={{
          type: "text",
          placeholder: "Preset name"
        }}
      />
      <Input 
        label='Description*' 
        name='description' 
        tooltipText={['Must be atleast 5 characters', 'Cannot be longer than 140 characters']}
        validation={presetDescriptionSchema}
        initialValue={edit && preset ? preset.description : undefined} 
        elementProps={{
          type: "text",
          placeholder: "Preset name"
        }}
      />
      <Input
        label='Youtube Link' 
        name='youtubeUrl'
        tooltipText={['Format must be a Youtube URL', 'NOTE: Either a Youtube video or cover photo must be added to be submitted']}
        validation={youtubeUrlSchema}
        initialValue={edit && preset ? preset.youtube_url : undefined} 
        elementProps={{
        type: "url",
        placeholder: "ex: https://www.youtube.com/watch?v={video_code}"
      }} />
      <Input
        label='Download Link*'
        name='downloadUrl'
        tooltipText={'Link must be from one of these providers: Dropbox/Google Drive/One Drive'}
        initialValue={edit && preset ? preset.download_url : undefined}
        validation={downloadUrlSchema}
        elementProps={{
          type: "url",
          placeholder: "Dropbox/Google Drive/One Drive"
        }}
      />
      <EffectsDropdown edit={edit} presetId={preset?.preset_id} submitted={formState.isSubmitted} />
      <HardwareDropdown />
    </form>
  )
}
