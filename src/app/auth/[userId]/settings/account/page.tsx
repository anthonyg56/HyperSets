import supabase from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React, { useContext } from 'react'
import Avatar from './components/avatar';
import SettingsList from './components/SettingsList';

type Props = {
  params: {
    userId: string;
  }
}

export default async function page(props: Props) {
  const { userId } = props.params

  // const { data: { session }, error } = await supabase.auth.getSession()

  // if (error || !session) {
  //   redirect('/auth/login')
  // }

  // const user = session.user
  
  // if (userId !== user.id) redirect(`/auth/${user.id}/settings/account}`)

  return (
    <div className='container pt-[120px] flex flex-col items-center'>
      <Avatar userId={userId} />
      <SettingsList />
      <Link href={`/auth/${userId}/settings`} className='text-sm text-center button-auto w-full mt-[30px]'>Go Back To Settings</Link>
    </div>
  )
}
