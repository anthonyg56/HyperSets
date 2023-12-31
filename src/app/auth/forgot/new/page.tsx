import supabase from '@/lib/supabase'
import React from 'react'
import View from './components/View'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { data: { session }, error } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/auth/forgot`)
  }
  
  const resetPassword = async (password: string) => {
    "use server"

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    })

    return { data, error }
  }
   
  return <View resetPassword={resetPassword} />
}
