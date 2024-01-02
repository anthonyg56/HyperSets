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

  const { data } = await supabase
    .from("profile")
    .select('profile_id')
    .eq('user_id', session.user.id)
    .limit(1)
    .single()

  return (
    <div className='container pt-[120px]'>
      <Title title='Create a Profile' sub='Share your creation with everyone!' />
      <Form profileId={data?.profile_id as number} user={session.user}/>
    </div>
  )
}
