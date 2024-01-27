import Title from '@/components/titles/CoreTitle';
import React from 'react'
import Link from 'next/link';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import ChangeNameForm from '../forms/ChangeNameForm';
import { validateRouteUuid, fetchProfileByUserId, createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type Props = {
  userId: string;
  userProp: 'email' | 'name' | 'password';
}

export default async function ChangeName({ userId, userProp }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  validateRouteUuid({
    routeUuid: userId,
    userId: session.user.id
  }, {
    path: 'userProp',
    userProp: userProp,
  })

  const { name } = await fetchProfileByUserId(userId, ['name'])

  return (
    <div className='container pt-[120px] text-center'>
      <Title title='Change Name' subTitle='How should we refer to you?' icon={faIdCard} bottomPadding='pb-[22px]' />
      <ChangeNameForm userId={userId} name={name} />
      <Link href={`/auth/${userId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}
