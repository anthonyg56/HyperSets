import { faUser, faAngleRight, faSliders, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

type Props = {
  userId: string;
}
export default function MyAccountOptions(props: Props) {
  const { userId } = props
  
  return (
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
      {/* <Link href={`/auth/${profileId}/settings/likes`}>
      <div>

      </div>
      <h4>Pssword</h4>
    </Link> */}
    </div>
  )
}
