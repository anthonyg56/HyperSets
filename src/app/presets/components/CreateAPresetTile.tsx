"use client"
import Toast from '@/components/reuseables/toast/Toast';
import { Session } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

type Props = {
  session: Session | null;
}

export default function CreateAPresetTile(props: Props) {
  const { session } = props
  const [toastOpen, setOpen] = useState(false)
  const router = useRouter()

  const route = (e: any) => {
    session ?
      router.push('/presets/new') :
    setOpen(true)
  }

  return (
    <div className='text-center w-full h-full z-50' onClick={route}>
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

      <Toast 
        title='Warning'
        description='You must be logged in to create a preset'
        action={{
          text: "Login",
          fn: (e: any) => {
            router.push('/auth/login')
          }
        }}
        open={toastOpen}
        setOpen={setOpen}
      />
    </div>
  )
}
