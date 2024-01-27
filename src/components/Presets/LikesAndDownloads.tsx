"use client"

import React, { useEffect, useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tables } from '../../../types/supabase';
import { createSupbaseClient } from '@/lib/supabase/client';

type Props = {
  userId: string;
  downloads: Tables<'downloads'>[];
}

export default function LikesAndDownloads({ userId, downloads }: Props) {
  const [profileId, setProfileId] = useState<number | undefined>(undefined)
  const supabase = createSupbaseClient()
  
  useEffect(() => {
    const getProfile = async () => {
      const { data: profile, error } = await supabase
        .from('profile')
        .select('profile_id')
        .eq('user_id', userId)
        .limit(1)
        .single()

      if (error || !profile) {
        return
      }

      setProfileId(profile.profile_id)
    }

    getProfile
  }, [])

  const isDownload = downloads.findIndex(item => item.profile_id === profileId)

  return (
    <div className='flex flex-row gap-3 justify-center pt-4 pb-[5px]'>
      {/* <div className='flex flex-row items-center gap-1'>
        <FontAwesomeIcon icon={faHeart} className={`w-[20px] h-[20px] ${isLiked === -1 ? 'text-hyper-dark-grey' : 'text-hyper-red' }`} />
        <h4>{likes.length} likes</h4>
      </div> */}

      <div className='flex flex-row items-center gap-1'>
        <FontAwesomeIcon icon={faDownload} className={`w-[20px] h-[20px] ${isDownload === -1 ? 'text-hyper-dark-grey' : 'text-hyper-red' }`} />
        <h4>{downloads.length} downloads</h4>
      </div>
    </div>
  )
}
