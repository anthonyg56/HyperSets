"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import React from 'react'

type Props = {
  setToastOpen: (open: boolean, message?: string) => void
}

export default function GoogleButton(props: Props) {
  const { setToastOpen } = props
  const supabase = createClientComponentClient()

  const handleSignInWithgoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error || !data.url) {
      setToastOpen(true, "There was an error, please try again")
      return
    }
  }

  return (
    <button onClick={(e: any) => handleSignInWithgoogle()} className='flex flex-row justify-center items-center mt-[11px] mb-[15px] border-[##C4C4C4] rounded-xl py-[7px] border-[2px] text-sm font-medium tracking-wide'>
      <img className="pr-1" src="/Assets/gmail.png" alt="sign in with good" height={30} width={30} /> Sign In With Google
    </button>
  )
}
