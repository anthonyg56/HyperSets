"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * The button needs to be its own component since it uses the client
 * @returns 
 */
export default function LogoutButton() {
  const router = useRouter()
  const supabaseClient = createClientComponentClient()
  
  const logoff = async (e: any) => {
    let { error } = await supabaseClient.auth.signOut()

    if (error) {
      alert('There was an error, please try again')
      console.log(error)
      return
    }

    router.refresh()
  }
  
  return (
    <button className='button-auto text-[14px] w-full mt-[25px]' onClick={logoff}>Logout</button>
  )
}
