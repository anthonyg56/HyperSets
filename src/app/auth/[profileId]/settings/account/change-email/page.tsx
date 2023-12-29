import Title from '@/components/reuseables/Title';
import Link from 'next/link';
import React from 'react'
import Form from './components/Form';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/lib/supabase';

type Props = {
  params: {
    profileId: string;
  }
}

export default async function page(props: Props) {
  const { params: { profileId },  } = props

  const {data: profileEmail, error} = await supabase
  .from('profile')
  .select('email')
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
      <Title title='Change Email' sub='New Email? Enter and we will confirm it' icon={faAt} padding='pb-[22px]' />
      <Form profileEmail={profileEmail}/>
      <Link href={`/auth/${profileId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
