"use client"

import { faUser, faAngleRight, faAt, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Tables } from '../../../../../../../types/supabase'
import ErrorAlert from '@/lib/utils/ErrorAlert'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import capitalizeEachWord, { capitalizeFirstLetter } from '@/lib/utils/Capitalize'
import Toast from '@/components/reuseables/toast/Toast'

type Props = {
  userId: string;
}
export default function SettingsList(props: Props) {
  const { userId } = props

  const [profile, setProfile] = useState<Tables<'profile'> | undefined>(undefined)
  const [toastState, setToast] = useState({
    description: "",
    isOpen: false,
  })
  
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single()
      
      if (ErrorAlert(error,data,'Fetching profile error')) {
        setToast({
          description: "There was an error, please try again",
          isOpen: true
        })
        return
      } 

      setProfile(data)
    }

    fetchProfile()
  }, [])

  const emailCapitalized = capitalizeFirstLetter(profile?.email as string)

  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))

  return (
    <div className='flex flex-col gap-y-3 w-full pt-[25px]'>
      <Link className='flex flex-row' href={`/auth/${userId}/settings/account/name`}>
        <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center '>
          <FontAwesomeIcon icon={faUser} width={16} height={16} className='text-hyper-white' />
        </div>

        <div className='flex flex-row w-full ml-3 pb-2 border-b-2 border-hyper-grey'>
          <h4 className='sub-text my-auto font-medium'>Name</h4>
          <p className='ml-auto my-auto sub-text-xs-grey'>
            {profile?.name ? capitalizeEachWord(profile.name) : 'Create a Name'}
          </p>
          <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-1 my-auto text-hyper-grey' />
        </div>
      </Link>

      <Link className='flex flex-row' href={`/auth/${userId}/settings/account/email`}>
        <div className='rounded-[100px] bg-hyper-dark-grey w-[30px] h-[28px] flex justify-center items-center'>
          <FontAwesomeIcon icon={faAt} width={16} height={16} className='text-hyper-white' />
        </div>

        <div className='flex flex-row w-full ml-3 pb-2 border-b-2 border-hyper-grey'>
          <h4 className='sub-text my-auto font-medium'>Email</h4>
          <h2 className='ml-auto my-auto sub-text-xs-grey'>{emailCapitalized}</h2>
          <FontAwesomeIcon icon={faAngleRight} width={16} height={16} className='ml-1 my-auto text-hyper-grey' />
        </div>
      </Link>

      <Link className='flex flex-row' href={`/auth/${userId}/settings/account/password`}>
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
        <Toast
        title='Error'
        description={toastState.description}
        open={toastState.isOpen}
        setOpen={handleToast}
      />
    </div>
  )
}
