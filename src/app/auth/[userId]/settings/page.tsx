import supabase from '@/lib/supabase';
import { redirect } from 'next/navigation';
import React from 'react'
import Avatar from './account/components/avatar';
import MyAccountOptions from './components/MyAccountOptions';

type Props = {
  params: {
    userId: string;
  }
}

export default async function page(props: Props) {
  const { userId } = props.params

  const { data: { session }, error: authError } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const user = session.user
  
  if (userId !== user.id) redirect(`/auth/${user.id}/settings`)

  return (
    <div className='container pt-[120px] flex flex-col items-center'>
      <Avatar userId={user.id} />
      <MyAccountOptions userId={user.id} />
      <button className='button-auto text-[14px] w-full mt-[25px]'>Logout</button>
    </div>
  )
}
