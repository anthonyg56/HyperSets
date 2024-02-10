"use client"

import React, { useContext } from 'react'

import { baseURL } from '@/lib/constants'
// import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout'
import { createSupbaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'

type Props = {
  page: "Sign Up" | "Sign In",
  classNames?: ClassValue,
}

export default function GoogleButton({ page, classNames }: Props) {
  // const { updateToast } = useContext(LayoutContext) as TLayoutContext
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
    <Button
      onClick={signInWithGoogle} 
      className={cn(classNames)}
      variant='outline'
    >
      <img className="pr-1" src="/gmail.png" alt="sign in with good" height={30} width={30} /> {page} With Google
    </Button>
  )
}