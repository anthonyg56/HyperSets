"use client"
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout'
import { createSupbaseClient } from '@/lib/supabase/client'

/**
 * The button needs to be its own component since it uses the client to send a toast
 * @returns 
 */
export default function LogoutButton() {
  const { updateToast } = useContext(LayoutContext) as TLayoutContext
  const supabase = createSupbaseClient()
  const router = useRouter()
  
  const logoff = async (e: any) => {
    let { error } = await supabase.auth.signOut()

    if (error) {
      updateToast({
        title: "Error",
        description: "There was an error, please try again",
        isOpen: true
      })
      return
    }

    router.refresh()
  }

  return (
    <div>
      <button className='button-auto text-[14px] w-full mt-[25px]' onClick={logoff}>Logout</button>
    </div>

  )
}
