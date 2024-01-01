import Presets from '@/app/presets/components/Presets';
import Title from '@/components/reuseables/Title';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params: {
    userId: string;
    table: "presets" | "downloads";
  }
}

export default async function page(props: Props) {
  const { table, userId } = props.params

  const {data: { session }, error } = await supabase.auth.getSession()

  if (!session) redirect('/auth/login')

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', session.user.id)
    .limit(1)
    .single()
  
  if (profileError || !profile) redirect('/')

  if (userId !== session.user.id) redirect(`/auth/${session.user.id}/settings/${table}`)
  
  return (
    <div className='container pt-[120px]'>
      <Title title={`Your ${table}`} padding="pb-[0px]" />
      <Presets key={'Users Presets Page'} table={table} profile_id={profile.profile_id} />
      <Link href={`/auth/${userId}/settings`} className='block text-sm text-center button-auto w-full'>Go Back To Settings</Link>
    </div>
  )
}
