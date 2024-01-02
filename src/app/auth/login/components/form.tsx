"use client"

import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link'
import React, { useState } from 'react'
import ErrorAlert from '@/lib/utils/ErrorAlert';

type Props = {
  session: Session | null;
}

export default function LoginForm(props: Props) {
  const [userState, setState] = useState({
    email: "",
    password: "",
    rememberUser: false
  })
  
  const { session } = props

  const router = useRouter()

  const supabase = createClientComponentClient()
  
  if (session) redirect(`/auth/${session.user.id}/settings`)
  
  const handleChange = (e: any) => {
    const { name, value } = e.target

    setState((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleChecked = (e: any) => {
    setState((prev: any) => ({
      ...prev,
      rememberUser: !userState.rememberUser
    }))
  }

  const handleSubmit = async (e: any) => {
    const {data, error} = await supabase.auth.signInWithPassword({
      email: userState.email,
      password: userState.password 
    })

    if (error || !data) {
      ErrorAlert(error,data,'Sign in Error')
      return
    } 
    
    router.refresh()
  }

  return (
    <form action={handleSubmit}>
      <div className='input-container'>
        <label htmlFor="email" className='label-text'>Email</label>
        <input
          type="text" 
          name='email' 
          value={userState.email} 
          onChange={handleChange} 
          placeholder='Email@mail.com'
        />
      </div>

      <div className='input-container'>
        <label htmlFor="password" className='label-text'>Password</label>
        <input
          type="password" 
          name='password' 
          value={userState.password} 
          onChange={handleChange} 
          placeholder='********'
        />
      </div>

      <div className='flex flex-row'>
        <div className='flex flex-row items-center'>
          <input type="checkbox" name='remember' onChange={handleChecked} className='translate-y-[-2px]'/>
          <label htmlFor="remember" className='pl-1 sub-text-xs'>Remember Me</label>
        </div>

        <div className='ml-auto flex flex-row items-center'>
          <Link href={'/auth/forgot'} className='sub-text-xs'>Forgot Password</Link>
        </div>
      </div>

      <div className='flex flex-col'>
        <button className='button-auto text-sm'>Sign In</button>
        <button className='flex flex-row justify-center items-center mt-[11px] mb-[15px] border-[##C4C4C4] rounded-xl py-[7px] border-[2px] text-sm font-medium tracking-wide'>
          <img className="pr-1" src="/Assets/gmail.png" alt="sign in with good" height={30} width={30} /> Sign In With Google
        </button>
      </div>
    </form>
  )
}
