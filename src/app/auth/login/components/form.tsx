"use client"

import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import React, { useState } from 'react'
import Toast from '@/components/reuseables/toast/Toast';
import GoogleButton from './GoogleButton';

type Props = {
  session: Session | null;
}

export default function LoginForm(props: Props) {
  const { session } = props
  const [userState, setState] = useState({
    email: "",
    password: "",
    rememberUser: false
  })
  const [toastState, setToast] = useState({
    open: false,
    description: "There was an error, please try again", // Will change if a user trys to sign in but there is no account
    login: false
  })
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  if (session) router.push(`/auth/${session.user.id}/settings`)
  
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
      // ErrorAlert(error,data,'Sign in Error') <- For Dev
      setToast((prevState) => ({
        ...prevState,
        open: true,
        description: "Invalid login credentials"
      }))
      return
    } 
    
    router.refresh()
  }

  const setToastOpen = (open: boolean, message?: string) => {
    setToast((prevState) => ({
      ...prevState,
      open
    }))
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
        <GoogleButton setToastOpen={setToastOpen}/>
      </div>

      <Toast 
        description={toastState.description}
        title='Error'
        open={toastState.open}
        setOpen={setToastOpen}
        action={toastState.login ? {
          text: "Login",
          fn: (e: any) => router.push('/auth/login')
        } : undefined}
      />
    </form>
  )
}
