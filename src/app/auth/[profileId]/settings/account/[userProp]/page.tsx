import supabase from '@/lib/supabase';
import { redirect } from 'next/navigation';
import React from 'react'
import ChangeEmail from './components/ChangeEmail';
import ChangeName from './components/ChangeName';
import ChangePassword from './components/ChangePassword';

interface Props {
  params: {
    userProp: 'email' | 'name' | 'password';
    profileId: string;
  }
}

export default async function Page(props: Props) {
  const { params: { profileId, userProp } } = props

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

  if (Number(profileId) !== profile.profile_id) redirect(`/auth/${profile.profile_id}/settings/account/${userProp}}`)

  const profileName = {
    first_name: profile.first_name,
    last_name: profile.last_name
  }

  return (
    <div>
      {
        userProp === "email" ?
          <ChangeEmail profileId={profileId} session={session} /> :
          userProp === "name" ?
            <ChangeName profileId={profileId} profileName={profileName} /> :
            userProp === "password" ?
              <ChangePassword profileId={profileId} /> :
              redirect(`/auth/${profile.profile_id}/settings/account}`)
      }
    </div>
  )
}
