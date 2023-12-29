import { supabase } from '@/lib/supabase';
import { faUser, faAngleRight, faSliders, faDownload, faAt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react'

type Props = {
  params: {
    profileId: string;
  }
}

export default async function page(props: Props) {
  const { profileId } = props.params

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('profile_id', profileId)
    .limit(1)
    .single()

  if (error || !data) return (
    <div>No profile was found</div>
  )

  return (
    <div className='container pt-[120px] flex flex-col items-center'>
      <div className='flex flex-col items-center'>
        <div className='shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-hyper-dark-grey rounded-[1000px] overflow-hidden w-[96px] h[96px] border-hyper-white border-[4px]'>
          <img
            src={data.avatar ? data.avatar : "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"}
            alt='avatar'
            className='h-full w-full z-10 object-cover object-center'
          />
        </div>
          <h2 className='title-2xl-upper pt-2'>{data.first_name} {data.last_name}</h2>
          <h4 className='sub-text'>Your Account Settings</h4>
      </div>

      <div className='flex flex-col gap-y-3 w-full pt-[25px]'>
        <Link className='flex flex-row' href={`/auth/${profileId}/settings/account/change-name`}>
          <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center '>
            <FontAwesomeIcon icon={faUser} width={16} height={16} className='text-hyper-white' />
          </div>

          <div className='flex flex-row w-full ml-3 pb-2 border-b-2 border-hyper-grey'>
            <h4 className='sub-text my-auto font-medium'>Name</h4>
            <p className='ml-auto my-auto sub-text-xs-grey'>{data.first_name} {data.last_name}</p>
            <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-1 my-auto text-hyper-grey' />
          </div>
        </Link>

        <Link className='flex flex-row' href={`/auth/${profileId}/settings/account/change-email`}>
          <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center'>
            <FontAwesomeIcon icon={faAt} width={16} height={16} className='text-hyper-white' />
          </div>

          <div className='flex flex-row w-full ml-3 pb-2 border-b-2 border-hyper-grey'>
            <h4 className='sub-text my-auto font-medium'>Email</h4>
            <h2 className='ml-auto my-auto sub-text-xs-grey'>{data.email}</h2>
            <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-1 my-auto text-hyper-grey' />
          </div>
        </Link>

        <Link className='flex flex-row' href={`/auth/${profileId}/settings/account/change-password`}>
          <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center'>
            <FontAwesomeIcon width={16} height={16} icon={faDownload} className='text-hyper-white' />
          </div>

          <div className='flex flex-row w-full ml-3 pb-1 '>
            <h4 className='sub-text my-auto font-medium'>Password</h4>
            <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-auto my-auto text-hyper-grey' />
          </div>
        </Link>
        {/* <Link href={`/auth/${profileId}/settings/likes`}>
        <div>

        </div>
        <h4>Pssword</h4>
      </Link> */}
      </div>

      <Link href={`/auth/${profileId}/settings`} className='text-sm text-center button-auto w-full mt-[30px]'>Go Back To Settings</Link>
    </div>
  )
}
