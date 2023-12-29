import Title from '@/components/reuseables/Title'
import { faAt, faIdCard } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import Form from './components/Form'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Props = {
  params: {
    profileId: string;
  }
}

export default async function (props: Props) {
  const { params: { profileId } } = props

  const {data: profileName, error} = await supabase
    .from('profile')
    .select('first_name,last_name')
    .eq("profile_id", profileId)
    .limit(1)
    .single()

  if (error) return (
    <div>
      No Profile Available, Redirecting
    </div>
  )

  return (
    <div className='container pt-[120px] text-center'>
      <Title title='Change Name' sub='How should we refer to you?' icon={faIdCard} padding='pb-[22px]' />
      <Form profileName={profileName} />
      <Link href={`/auth/${profileId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
