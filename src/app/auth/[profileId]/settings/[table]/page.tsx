import Presets from '@/app/presets/components/Presets';
import Title from '@/components/reuseables/Title';
import Link from 'next/link';
import React from 'react'

type Props = {
  params: {
    profileId: string;
    table: "likes" | "presets" | "downloads";
  }
}

export default function page(props: Props) {
  const { table, profileId} = props.params

  console.log(table)
  console.log(profileId)

  const profile_id = Number(profileId)
  return (
    <div className='container pt-[120px]'>
      <Title title={`Your ${table}`} padding="pb-[0px]" />
      <Presets key={'Users Presets Page'} table={table} profile_id={profile_id} />
      <Link href={`/auth/${profileId}/settings`} className='block text-sm text-center button-auto w-full'>Go Back To Settings</Link>
    </div>
  )
}
