"use client"

import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout'
import { createSupbaseClient, } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

type Props = {
  presetId: number,
  presetProfileId: number,
  userProfileId: number,
}

export default function DeleteButton({ presetId, presetProfileId, userProfileId }: Props) {
  const { updateToast} = useContext(LayoutContext) as TLayoutContext
  const supabase = createSupbaseClient()
  const router = useRouter()

  function handleClick(e: any) {
    e.preventDefault()

    updateToast({
      isOpen: true,
      title: "Warning",
      description: "Are you sure you want to delete this preset?",
      action: {
        text: "Delete",
        fn: deletePreset
      }
    })
  }

  function handleToast(isOpen: boolean){
    updateToast({
      title: 'Error',
      description: 'There was an error, please try again',
      isOpen: isOpen
    })
  } 

  async function deletePreset(e: any) {
    const { error } = await supabase
      .from('presets')
      .delete()
      .eq('preset_id', presetId)

    if (error) {
      handleToast(true)
    }

    router.push('/presets')
  }
  
  return (
    <div className='w-[50%]'>
      <button onClick={handleClick} className='items-center border-[##C4C4C4] rounded-xl py-[10px] border-[2px] text-sm font-medium tracking-wide w-full'>
        Delete
      </button>
    </div>

  )
}
