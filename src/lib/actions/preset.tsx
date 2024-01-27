"use server"

// import { supabaseServer as supabase } from "../supabase/server"

export async function submitPreset(formData: unknown) {
  // const { data, error } = await supabase
  // .from('presets')
  // .insert([{
  //   name: formData.name,
  //   description: formData.description,
  //   download_url: formData.downloadUrl,
  //   hardware: formData.hardware as Enums<'hardware_type'>,
  //   profile_id: profileId as number,
  //   youtube_url: formData.youtubeUrl,
  //   photo_url: formData.photoUrl
  // }])
  // .select()
  // .limit(1)
  // .single()
}

export async function updatePreset(formData: unknown) {
//   const { data: presetData, error: presetError } = await supabase
//   .from('presets')
//   .update(tmpData)
//   .eq('reset_id', preset.preset_id)
//   .select()
//   .limit(1)
//   .single()
// }
}

export async function submitCoverPhoto(formData: unknown) {
  // const { data, error } = await supabase
  // .storage
  // .from('images')
  // .upload(`${user_id}/${uuidv4()}`, coverPhoto, {
  //   cacheControl: '3600',
  //   upsert: false
  // })
}

export async function updateCoverPhoto(formData: unknown) {

}