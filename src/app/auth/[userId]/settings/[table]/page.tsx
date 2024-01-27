import React from 'react'
import Link from 'next/link';

import { createSupabaseServerClient, fetchProfileByUserId, validateRouteUuid, } from '@/lib/supabase/server';

import Presets from '@/components/Presets/PresetsList';
import Title from '@/components/titles/CoreTitle';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    userId: string;
    table: "presets" | "downloads";
  }
}

export default async function page(props: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }} = await supabase.auth.getSession()
  const { table, userId } = props.params
  
  if (!session) {
    redirect('/auth/login')
  }
  
  validateRouteUuid({ 
    routeUuid: userId,
    userId: session.user.id 
  }, { 
    path: 'table',
    table: table,
  })
  const profile = await fetchProfileByUserId(userId, ['profile_id'])
  
  return (
    <div className='container pt-[120px]'>
      <Title title={`Your ${table}`} bottomPadding="pb-[0px]" />
      <Presets key={'Users Presets Page'} table={table} profile_id={profile?.profile_id} />
      <Link href={`/auth/${userId}/settings`} className='block text-sm text-center button-auto w-full'>Go Back To Settings</Link>
    </div>
  )
}
