import supabase from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React, { useContext } from 'react'
import Avatar from './components/avatar';
import SettingsList from './components/SettingsList';

type Props = {
  params: {
    profileId: string;
  }
}

export default async function page(props: Props) {
  const { profileId } = props.params

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

  if (Number(profileId) !== profile.profile_id) redirect(`/auth/${profile.profile_id}/settings/account}`)

  return (
    <div className='container pt-[120px] flex flex-col items-center'>
      <Avatar />
      <SettingsList profileId={profileId} />
      <Link href={`/auth/${profileId}/settings`} className='text-sm text-center button-auto w-full mt-[30px]'>Go Back To Settings</Link>
    </div>
  )
}
