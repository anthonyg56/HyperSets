import React from 'react'
import { redirect } from 'next/navigation';
import { createSupabaseServerClient, validateRouteUuid } from '@/lib/supabase/server';
import ChangeName from '../../../../../../components/views/ChangeName';
import ChangeEmail from '../../../../../../components/views/ChangeEmail';
import ChangePassword from '../../../../../../components/views/ChangePassword';

interface Props {
  params: {
    userProp: 'email' | 'name' | 'password';
    userId: string;
  }
}

export default async function Page(props: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()
  const { params: { userId, userProp } } = props

  if (!session) {
    redirect('/auth/login')
  }

  validateRouteUuid({ 
    routeUuid: userId,
    userId: session.user.id 
  }, { 
    path: 'account',
    userProp: userProp,
  })

  return (
    <>
      {
        userProp === "email" ?
          <ChangeEmail userId={userId} userProp={userProp} /> :
          userProp === "name" ?
            <ChangeName userId={userId} userProp={userProp} /> :
            userProp === "password" ?
              <ChangePassword userId={userId} /> :
              redirect(`/auth/${userId}/settings/account}`)
      }
    </>
  )
}
