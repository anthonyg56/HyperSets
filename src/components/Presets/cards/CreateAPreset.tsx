"use client"

import React, { useContext } from 'react'
import { useRouter } from 'next/navigation';
import { LayoutContext, TLayoutContext } from '@/lib/contexts/Layout';
import { UserSessionConext, UserSessionContext } from '@/lib/contexts/UserSession';
import { baseURL } from '@/lib/utils/constants';
import { createSupbaseClient } from '@/lib/supabase/client';

export default function CreateAPresetCard() {
  const { updateToast, isOpen } = useContext(LayoutContext) as TLayoutContext
  const { session } = useContext(UserSessionContext) as UserSessionConext
  const supabase = createSupbaseClient()
  const router = useRouter()

  function handleClick(e: any) {
    
    if (!session) {
      console.log('handling click')
      updateToast({
        title: "Warning",
        isOpen: true,
        description: "You must be signed in to create a preset.",
        action: {
          text: "Login",
          fn: (e: any) => router.push('/auth/login')
        }
      })
      console.log(isOpen)
      return
    } else if (!session.user.email_confirmed_at) {
      updateToast({
        title: "Error",
        isOpen: true,
        description: "Your account must be confirmed before creating a preset. Click resend to get a new confirmation email.",
        action: {
          text: "Resend",
          fn: (e: any) => resend(session.user.email as string)
        }
      })
      return
    }
    router.push('/presets/new')
  }

  async function resend(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${baseURL}/auth/confirm`
      }
    })

    if (error) {
      updateToast({
        title: "Error",
        isOpen: true,
        description: "There was an error sending the email. Click resend to try again.",
        action: {
          text: "Resend",
          fn: (e: any) => resend(session.user.email as string)
        }
      })
      return
    }

    updateToast({
      title: "Success",
      isOpen: true,
      description: "Confirmation email sent ✅",
    })
  }

  return (
    <div className='text-center w-full h-full z-50' onClick={handleClick}>
      <div className='flex-col h-full bg-hyper-dark-white w-full flex relative z-[-5] mb-5 rounded-md overflow-hidden'>
        <img
          src="/Assets/hardware/new-preset-gradient.png"
          alt="Headset gradient"
          width={0}
          height={290}
          className='shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full h-full object-cover object-center absolute z-[-5]'
        />
        <img
          src="/Assets/hardware/new.png"
          alt="HyperX Cloud Alpha II"
          width={0}
          className='w-full h-full object-contain object-center'
        />
        <h4 className='mt-auto mx-auto text-hyper-white tracking-tight mb-2 font-medium text-[-16px]'>Create A Presets</h4>
      </div>
    </div>
  )
}
