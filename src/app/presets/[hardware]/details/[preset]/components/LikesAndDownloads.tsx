"use client"

import React, { useContext } from 'react'
import { Tables } from '../../../../../../../types/supabase'
import { faDownload, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext, TAuthContext } from '@/lib/utils/contexts/Auth';

type Props = {
  userId: string;
  downloads: Tables<'downloads'>[];
}

export default function LikesAndDownloads(props: Props) {
  const { userId, downloads } = props
  const { profile } = useContext(AuthContext) as TAuthContext

  const isDownload = downloads.findIndex(item => item.profile_id === profile?.profile_id)

  return (
    <div className='flex flex-row gap-3 justify-center pt-3 pb-[5px]'>
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
