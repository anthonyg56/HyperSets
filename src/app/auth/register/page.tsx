import React from 'react'
import RegisterForm from './components/RegisterForm'
import supabase from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default async function page() {
  const { data: { session }} = await supabase.auth.getSession()

  return (
    <div className='auth-container'>
      <RegisterForm  session={session}/>
    </div>
  )
}
