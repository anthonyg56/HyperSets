"use client"

import Toast from '@/components/reuseables/toast/Toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

/**
 * The button needs to be its own component since it uses the client
 * @returns 
 */
export default function LogoutButton() {
  const router = useRouter()
  const supabaseClient = createClientComponentClient()
  const [toastState, setToast] = useState({
    description: "",
    isOpen: false,
  })
  const logoff = async (e: any) => {
    let { error } = await supabaseClient.auth.signOut()

    if (error) {
      setToast({
        description: "There was an error, please try again",
        isOpen: true
      })
      return
    }

    router.refresh()
  }

  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))

  return (
    <div>
      <button className='button-auto text-[14px] w-full mt-[25px]' onClick={logoff}>Logout</button>
      <Toast
        title='Error'
        description={toastState.description}
        open={toastState.isOpen}
        setOpen={handleToast}
      />
    </div>

  )
}
