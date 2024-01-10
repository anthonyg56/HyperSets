"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import { Database } from '../../../../../../../types/supabase';

type Props = {
  downloadUrl: string;
  profileId: number | null;
  presetId: number;
}

export default function DownloadButton(props: Props) {
  const { downloadUrl, profileId, presetId } = props
  const supabase = createClientComponentClient<Database>()

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
    <button className='button-auto' onClick={addDownload}>
      <a href={downloadUrl}>Download</a>
    </button>
  </div>
  )
}
