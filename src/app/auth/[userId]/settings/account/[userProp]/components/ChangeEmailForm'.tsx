"use client"

import ErrorAlert from '@/lib/utils/ErrorAlert';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

type Props = {
  email: string;
}

export default function ChangeEmailForm(props: Props) {
  const [email, setEmail] = useState<string>('')
  
  const router = useRouter()

  useEffect(() => {
    setEmail(props.email ? props.email : '')
  }, [])

  const supabase = createClientComponentClient()
  
  const isValidEmail = () => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  }

  const handleChange = (e: any) => setEmail(e.value)

  const handleSubmit = async (e:any) => {
    if (email.length === 0 || !isValidEmail) {
      alert('Please enter a valid email')
      return
    }

    const { data, error } = await supabase.auth.updateUser({
      email: email
    })

    if (ErrorAlert(error,data,'Change Email Eror')) return

    console.log(`change email res: \n ${data}`)
    
    router.push(`/auth/${data.user?.id}/settings/email/confirm`)
  }

  return (
    <form className='text-left' action={handleSubmit}>
      <div className='input-container'>
        <label htmlFor="email" className='label-text'>Email</label>
        <input
          type="text"
          name='email'
          value={email}
          onChange={handleChange}
          placeholder={props.email}
        />
      </div>

      <button className='button-auto w-full text-sm' type='submit'>Save Changes</button>
    </form>
  )
}
