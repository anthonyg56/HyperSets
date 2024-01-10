"use client"

import React, { useEffect, useState } from 'react'
import RegisterForm from './components/RegisterForm'
import { redirect } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import RegisterTitle from './components/RegisterTitle'
import Form from './components/RegisterForm'
import Link from 'next/link'

export default async function page() {
  const [isSubmitted, setSubmitted] = useState<boolean>(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (session) {
        redirect(`/auth/${session.user.id}/settings`)
      }
    }

    checkSession()
  }, [])

  return (
    <div className='auth-container'>
      <RegisterTitle isSubmitted={isSubmitted} />
      <RegisterForm setSubmitted={setSubmitted}/>
      {!isSubmitted && <div className='text-center'>
        <h5 className='text-hyper-dark-grey text-[10px] font-medium tracking-tight'>
          Already have an account? 
          <Link href={'/auth/login'} className='text-hyper-red'>
            Login Here!
          </Link>
        </h5>
      </div>}
      {isSubmitted && <button className='button-auto w-full text-xs'>
        <Link href="/auth/login">Login</Link>
      </button>}
    </div>
  )
}
