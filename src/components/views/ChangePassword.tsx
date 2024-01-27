import Title from '@/components/titles/CoreTitle';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React from 'react'
import ChangePasswordForm from '../forms/ChangePasswordForm';
import { createSupabaseServerClient, validateRouteUuid } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type Props = {
  userId: string;
}

export default async function ChangePassword({ userId }: Props) {
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
    userProp: 'password',
  })


  return (
    <div className='container pt-[120px] text-center'>
      <Title title='Password reset' subTitle='Your new password must be different to previously used passwords. ' icon={faLock} bottomPadding='pb-[22px]' />
      <ChangePasswordForm />
      <Link href={`/auth/${userId}/settings/account/`} className='block pt-[11px] sub-medium text-center' >Back to Account Settings</Link>
    </div>
  )
}