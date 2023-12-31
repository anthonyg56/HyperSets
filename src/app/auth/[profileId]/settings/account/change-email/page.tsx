import Title from '@/components/reuseables/Title';
import Link from 'next/link';
import React from 'react'
import Form from './components/Form';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import supabase from '@/lib/supabase';
import { redirect } from 'next/navigation';
import ErrorAlert from '@/lib/utils/ErrorAlert';

type Props = {
  params: {
    profileId: string;
  }
}

export default async function page(props: Props) {
  const { params: { profileId },  } = props

  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    redirect('/auth/login')
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', session.user.id)
    .limit(1)
    .single()

  if (profileError || !profile) redirect('/')

  if (Number(profileId) !== profile.profile_id) redirect(`/auth/${profile.profile_id}/settings/account/change-email}`)

  const updateEmail = async (email: string) => {
    const { data, error } = await supabase.auth.updateUser({
      email: email,
    })

    return { data, error }
  }

  return (
    <div className='container pt-[120px] text-center'>
      <Title title='Change Email' sub='New Email? Enter and we will confirm it' icon={faAt} padding='pb-[22px]' />
      <Form email={session.user.email ? session.user.email : "Connect an Email" } updateEmail={updateEmail} />
      <Link href={`/auth/${profileId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
