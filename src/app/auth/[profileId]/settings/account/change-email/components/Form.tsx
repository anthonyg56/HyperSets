"use client"

import ErrorAlert from '@/lib/utils/ErrorAlert';
import { User } from '@supabase/auth-helpers-nextjs';
import { AuthError } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type Props = {
  email: string;
  updateEmail: (email: string) => Promise<{
    data: {
        user: User;
    } | {
        user: null;
    };
    error: AuthError | null;
  }>
}

export default function (props: Props) {
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    setEmail(props.email ? props.email : '')
  }, [])

  const isValidEmail = () => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  }

  const handleChange = (e: any) => setEmail(e.value)

  const handleSubmit = async (e:any) => {
    if (email.length === 0 || !isValidEmail) {
      alert('Please enter a valid email')
      return
    }

    const { data, error } = await props.updateEmail(email)

    if (ErrorAlert(error,data)) return

    alert('Email updated successfully')
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
