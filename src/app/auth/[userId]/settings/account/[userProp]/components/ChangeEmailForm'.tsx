"use client"

import Toast from '@/components/reuseables/toast/Toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

type Props = {
  email: string;
}

export default function ChangeEmailForm(props: Props) {
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [toastState, setToast] = useState({
    description: "",
    isOpen: false,
  })
  const router = useRouter()

  const supabase = createClientComponentClient()
  
  const isValidEmail = () => {
    return email && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  }

  const handleChange = (e: any) => setEmail(e.target.value)

  const handleSubmit = async (e:any) => {
    if (!isValidEmail) {
      setToast({
        isOpen: true,
        description: "Please enter a valid email"
      })
      return
    }

    const { data, error } = await supabase.auth.updateUser({
      email: email
    })

    if (error || !data){
      setToast({
        isOpen: true,
        description: "There was an error, please try again"
      })
      return
    } 
    
    router.push(`/auth/${data.user?.id}/settings/account/email/confirm`)
  }

  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))

  return (
    <form className='text-left' action={handleSubmit}>
      <div className='input-container'>
        <label htmlFor="email" className='label-text'>Email</label>
        <input
          type="email"
          name='email'
          value={email as string}
          onChange={handleChange}
          placeholder={props.email}
          className={`${isValidEmail() ? 'active:border-hyper-green border-hyper-green' : isValidEmail() === false ? "active:border-[2px] border-[2px]" : ""}`}
        />
      </div>

      <button className='button-auto w-full text-sm' type='submit'>Save Changes</button>

      <Toast 
        title='Error'
        description={toastState.description}
        open={toastState.isOpen}
        setOpen={handleToast}
      />
    </form>
  )
}
