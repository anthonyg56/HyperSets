import React from 'react'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAngleRight, faSliders, faDownload } from '@fortawesome/free-solid-svg-icons';

import Avatar from '@/components/misc/avatar';
import LogoutButton from '@/components/buttons/LogoutButton';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient, validateRouteUuid } from '@/lib/supabase/server';

type Props = {
  params: {
    userId: string;
  }
}

export default async function page(props: Props) {
  const supabase = await createSupabaseServerClient()
  console.log(props)
  const { data: { session }} = await supabase.auth.getSession()
  const { userId } = props.params

  if (!session) {
    redirect('/auth/login')
  }

  validateRouteUuid({ 
    routeUuid: userId,
    userId: session.user.id 
  }, { 
    path: 'settings'
  })

  return (
    <div className='container pt-[120px] flex flex-col items-center'>
      <Avatar userId={userId} />
      <div className='flex flex-col gap-y-4 w-[95%] pt-[25px]'>
        <Link className='flex flex-row' href={`/auth/${userId}/settings/account`}>
          <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center '>
            <FontAwesomeIcon icon={faUser} width={16} height={16} className='text-hyper-white' />
          </div>

          <div className='flex flex-row w-full'>
            <h4 className='title-sm my-auto ml-2'>Account Settings</h4>
            <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-auto my-auto text-hyper-dark-grey' />
          </div>
        </Link>

        <Link className='flex flex-row' href={`/auth/${userId}/settings/presets`}>
          <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center'>
            <FontAwesomeIcon icon={faSliders} width={16} height={16} className='text-hyper-white' />
          </div>

          <div className='flex flex-row w-full'>
            <h4 className='title-sm my-auto ml-2'>Your Presets</h4>
            <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-auto my-auto text-hyper-dark-grey' />
          </div>
        </Link>

        <Link className='flex flex-row' href={`/auth/${userId}/settings/downloads`}>
          <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center'>
            <FontAwesomeIcon width={16} height={16} icon={faDownload} className='text-hyper-white' />
          </div>

          <div className='flex flex-row w-full'>
            <h4 className='title-sm my-auto ml-2'>Downloads</h4>
            <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-auto my-auto text-hyper-dark-grey' />
          </div>
        </Link>
      </div>
      <LogoutButton />
    </div>
  )
}
