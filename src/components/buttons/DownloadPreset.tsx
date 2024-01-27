"use client"

import React from 'react'
import { createSupbaseClient } from '@/lib/supabase/client';

type Props = {
  downloadUrl: string;
  profileId: number | null;
  presetId: number;
}

export default function DownloadButton({ downloadUrl, profileId, presetId }: Props) {
  const supabase = createSupbaseClient()
  const addDownload = async (e: any) => {
    await supabase
      .from('downloads')
      .insert(
        { 
          profile_id: profileId,
          preset_id: presetId,
        }
      )
  }

  return (
    <div className='text-center'>
      <button className='button-auto w-full' onClick={addDownload}>
        <a href={downloadUrl}>Download</a>
      </button>
    </div>
  )
}
