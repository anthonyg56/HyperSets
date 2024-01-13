"use client"

import Toast from '@/components/reuseables/toast/Toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {
  presetId: number,
  presetProfileId: number,
  userProfileId: number,
}

export default function DeleteButton(props: Props) {
  const { presetId, presetProfileId, userProfileId } = props
  const [toastState, setToast] = useState<{
    isOpen: boolean,
    action: boolean,
    description: string,
    title: "Error" | "Warning",
  }>({
    isOpen: false,
    description: "",
    title: "Warning",
    action: false,
  })
  const supabase = createClientComponentClient()
  const router = useRouter()

  function handleClick(e: any) {
    e.preventDefault()

    setToast((prevState) => ({
      isOpen: true,
      title: "Warning",
      description: "Are you sure you want to delete this preset?",
      action: true
    }))
  }

  function handleToast(isOpen: boolean){
    setToast((prevState) => ({
      ...prevState,
      isOpen: isOpen
    }))
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
      <Toast
        title={toastState.title}
        description={toastState.description}
        open={toastState.isOpen}
        setOpen={handleToast}
        action={toastState.action ? {
          text: "Delete",
          fn: deletePreset
        } : undefined}
      />
    </div>

  )
}
