import React from 'react'
import Avatar from './account/components/avatar';
import MyAccountOptions from './components/MyAccountOptions';
import LogoutButton from './components/LogoutButton';
import supabase from '@/lib/supabase';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    userId: string;
  }
}

export default async function page(props: Props) {
  const { userId } = props.params
  const { data: { session }} = await supabase.auth.getSession()

  if (!session) {
    return redirect('/auth/login')
  }
  
  const user = session.user

  if (userId !== user.id) return redirect(`/auth/${user.id}/settings`)

  return (
    <div className='container pt-[120px] flex flex-col items-center'>
      <Avatar userId={user.id} />
      <MyAccountOptions userId={user.id} />
      <LogoutButton />
    </div>
  )
}
