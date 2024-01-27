"use client"

import React, { useContext } from 'react'

import { baseURL } from '@/lib/utils/constants'
import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout'
import { createSupbaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  page: "Sign Up" | "Sign In",
}

export default function SignInWithGoogleButton({ page }: Props) {
  const { updateToast } = useContext(LayoutContext) as TLayoutContext
  const supabase = createSupbaseClient()
  const router = useRouter()

  async function signInWithGoogle(e: any) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseURL}/auth/confirm/callback`
      } 
    })
  
    // if (error) {
    //   updateToast({
    //     title: 'Error',
    //     description: 'There was an error, please try again',
    //     isOpen: true,
    //   })
    //   return
    // }
  
    // updateToast({
    //   title: 'Success',
    //   description: 'Welcome back',
    //   isOpen: true,
    // })
    // router.refresh()
  }

  return (
    <button onClick={signInWithGoogle} className='flex flex-row justify-center items-center mt-[11px] mb-[15px] border-[##C4C4C4] rounded-xl py-[7px] border-[2px] text-sm font-medium tracking-wide'>
      <img className="pr-1" src="/Assets/gmail.png" alt="sign in with good" height={30} width={30} /> {page} With Google
    </button>
  )
}
