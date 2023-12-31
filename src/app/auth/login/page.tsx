import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useState } from 'react'
import LoginForm from './components/form'
import supabase from '@/lib/supabase'
import errorAlert from '@/lib/utils/ErrorAlert'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const { data: { session }, error } = await supabase.auth.getSession()

  const login = async (email: string, password: string) => {
    'use server'
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'someone@email.com',
      password: 'WmbORMtMFJIENUkyvcFN'
    })

    return {
      data, error
    }
  }

  return (
    <div className='auth-container'>
      <div className='text-container pb-8'>
        <h1 className='title-2xl-upper'>Welcome Back</h1>
        <h4 className='sub-text'>Welcome back! Please enter your details.</h4>
      </div>
      <LoginForm session={session} login={login}/>
      <div className='text-center'>
        <div>
          <h5 className='text-hyper-dark-grey text-[12px] font-medium tracking-tight'>Dont have an account? <Link href={'/auth/register'} className='text-hyper-red'>Sign up for free!</Link></h5>
        </div>

        <div className='flex fle-col justify-center pt-[10px]'>
          <FontAwesomeIcon icon={faRotateLeft} width={12} height={12} className='my-auto pr-1'/>
          <Link href='/' className='label-text'>Back to Homepage</Link>
        </div>
      </div>
    </div>
  )
}
