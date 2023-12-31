import React from 'react'
import RegisterForm from './components/RegisterForm'
import supabase from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default async function page() {
  const {data: {session}, error} = await supabase.auth.getSession()

  const register = async (email: string, password: string) => {
    "use server"
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    return { data, error }
  }

  return (
    <div className='auth-container'>
      <RegisterForm register={register} session={session}/>
    </div>
  )
}
