"use client"

import React, { useEffect, useState } from 'react'
import { Database, Tables } from '../../../../../../../types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ErrorAlert from '@/lib/utils/ErrorAlert';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import Toast from '@/components/reuseables/toast/Toast';

const CDNURL = "https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/sign/images/"

type Props = {
  userId: string;
  editMode?: boolean;
}

export default function Avatar(props: Props) {
  const { userId, editMode } = props

  const [profile, setProfile] = useState<Tables<'profile'> | null>(null)
  const [tmpAvatar, setAvatar] = useState<File | undefined>(undefined)
  const [uploadState, setUploadState] = useState({
    loading: false,
    success: undefined,
  })
  const [toastState, setToast] = useState({
    description: "",
    isOpen: false,
  })
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single()

      if (ErrorAlert(error, data, 'Fetching profile error')) return

      setProfile(data)
    }

    fetchProfile()
  }, [])

  const submitAvatar = async () => {
    if (!tmpAvatar) {
      alert('Please upload an avatar')
      return
    }

    setUploadState((prevState) => ({
      ...prevState,

    }))
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(`${userId}/${uuidv4()}`, tmpAvatar)

    const checkFile = ErrorAlert(error, data, "Submit Avatar Error")

    if (checkFile) {
      return
    }

    const avatarUrl = CDNURL + data?.path

    addAvatarToProfileRow(avatarUrl)
    // In the future remove the file on a failed update to profile
  }

  const uploadAvatar = (e: any) => {
    let target;
    target = e.target.files ? e.target.files[0] : undefined;

    setAvatar(target)
  }

  const addAvatarToProfileRow = async (avatarUrl: string) => {
    const { data, error } = await supabase
      .from('profile')
      .update({ avatar: avatarUrl })
      .eq('user_id', userId)
      .select()

    const checkFile = ErrorAlert(error, data, "Submit Avatar Error")

    if (checkFile) {
      return
    }

    router.refresh()
  }

  const avatarSrc = tmpAvatar ? URL.createObjectURL(tmpAvatar) :
    profile && profile.avatar ? profile.avatar :
      "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"

  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))
  return (
    <div className='flex flex-col items-center'>
      <div className='shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-hyper-dark-grey rounded-[1000px] overflow-hidden w-[96px] h[96px] border-hyper-white border-[4px] relative'>
        <img
          src={avatarSrc}
          alt='avatar'
          className='h-full w-full z-10 object-cover object-center'
        />
        {editMode && <label htmlFor="coverPhoto" className='absolute top-[50%] right-0 z-30'>
          <FontAwesomeIcon icon={faFileImage} className='text-black' />
          <input
            type="file"
            id="coverPhoto"
            name='coverPhoto'
            value={''}
            onChange={uploadAvatar}
            placeholder='My Awesome Preset'
            className='hidden !w-[0.1] h-[0.1] opacity-0 absolute -z-10'
          />
        </label>}
      </div>
      <h2 className='title-2xl-upper pt-2'>{profile?.name ? profile.name : profile?.email}</h2>
      <h4 className='sub-text'>Your Account Settings</h4>
      {editMode && tmpAvatar && (
        <button onClick={submitAvatar}>Upload</button>
      )}
      <Toast
        title='Error'
        description={toastState.description}
        open={toastState.isOpen}
        setOpen={handleToast}
      />
    </div>
  )
}
