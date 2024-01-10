import supabase from '@/lib/supabase';
import { redirect } from 'next/navigation';
import React from 'react'
import ChangeEmail from './components/ChangeEmail';
import ChangeName from './components/ChangeName';
import ChangePassword from './components/ChangePassword';

interface Props {
  params: {
    userProp: 'email' | 'name' | 'password';
    userId: string;
  }
}

export default async function Page(props: Props) {
  const { params: { userId, userProp } } = props

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

  if (userId !== session.user.id) redirect(`/auth/${userId}/settings/account/${userProp}}`)

  return (
    <div>
      {
        userProp === "email" ?
          <ChangeEmail userId={userId} session={session} /> :
          userProp === "name" ?
            <ChangeName userId={userId} profileName={profile.name} /> :
            userProp === "password" ?
              <ChangePassword userId={userId} /> :
              redirect(`/auth/${profile.profile_id}/settings/account}`)
      }
    </div>
  )
}
